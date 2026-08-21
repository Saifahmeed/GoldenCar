import http from 'node:http';
import crypto from 'node:crypto';

const port = Number(process.env.PORT || 8787);
const username = process.env.OWNER_USERNAME || 'golden_admin';
const password = process.env.OWNER_PASSWORD || 'Golden@2026';
const passwordSalt = process.env.OWNER_PASSWORD_SALT || 'golden-car-auth-v1';
const passwordHash = crypto.scryptSync(password, passwordSalt, 64).toString('hex');
const sessions = new Map();
const attempts = new Map();
const sessionLifetime = 1000 * 60 * 60 * 8;

// Payment integrations state & helpers
const orders = new Map();
const paymobSecretKey = process.env.PAYMOB_SECRET_KEY || '';
const paymobPublicKey = process.env.PAYMOB_PUBLIC_KEY || '';
const paymobHmacSecret = process.env.PAYMOB_HMAC_SECRET || 'golden_car_paymob_secret_key_2026';
const paymobIntegrationIds = (process.env.PAYMOB_INTEGRATION_IDS || '')
  .split(',')
  .map(Number)
  .filter(Boolean);

function processWebhookPayload(payload, hmac) {
  const transaction = payload && payload.obj;
  if (!transaction) return { success: false, error: 'Invalid payload structure' };
  
  const orderId = transaction.order && transaction.order.merchant_order_id;
  const order = orders.get(orderId);
  if (!order) return { success: false, error: 'Order not found' };

  // Calculate HMAC locally to verify integrity
  const amountCents = transaction.amount_cents;
  const createdAt = transaction.created_at;
  const currency = transaction.currency;
  const errorOccured = transaction.error_occured ? 'true' : 'false';
  const hasParentTransaction = 'false';
  const transactionId = transaction.id;
  const integrationId = transaction.integration_id;
  const is3dSecure = 'false';
  const isAuth = 'false';
  const isCapture = 'false';
  const isRefunded = 'false';
  const isStandalonePayment = 'true';
  const transactionProcessedCallbackAndResponse = 'true';
  const pending = transaction.pending ? 'true' : 'false';
  const pan = transaction.source_data.pan;
  const subType = transaction.source_data.sub_type;
  const type = transaction.source_data.type;
  const successStr = transaction.success ? 'true' : 'false';

  const hmacString = 
    amountCents +
    createdAt +
    currency +
    errorOccured +
    hasParentTransaction +
    transactionId +
    integrationId +
    is3dSecure +
    isAuth +
    isCapture +
    isRefunded +
    isStandalonePayment +
    transactionProcessedCallbackAndResponse +
    pending +
    pan +
    subType +
    type +
    successStr;

  const calculatedHmac = crypto
    .createHmac('sha512', paymobHmacSecret)
    .update(hmacString)
    .digest('hex');

  if (calculatedHmac !== hmac) {
    return { success: false, error: 'HMAC validation failed' };
  }

  if (transaction.success) {
    order.status = 'paid';
    order.paidAt = Date.now();
    orders.set(orderId, order);
    return { success: true };
  }

  return { success: false, error: 'Transaction failed' };
}

function sendJson(response, status, payload, headers = {}) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
  response.end(JSON.stringify(payload));
}

function parseCookies(request) {
  return Object.fromEntries((request.headers.cookie || '').split(';').filter(Boolean).map(cookie => {
    const index = cookie.indexOf('=');
    return [cookie.slice(0, index).trim(), decodeURIComponent(cookie.slice(index + 1).trim())];
  }));
}

function isAuthorized(request) {
  const token = parseCookies(request).gc_session;
  const session = token && sessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (token) sessions.delete(token);
    return false;
  }
  session.expiresAt = Date.now() + sessionLifetime;
  return true;
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', chunk => {
      body += chunk;
      if (body.length > 10_000) request.destroy();
    });
    request.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); } catch { reject(new Error('Invalid JSON')); }
    });
    request.on('error', reject);
  });
}

function isRateLimited(ip) {
  const record = attempts.get(ip);
  return record && record.resetAt > Date.now() && record.failures >= 5;
}

function registerFailure(ip) {
  const current = attempts.get(ip);
  const record = current && current.resetAt > Date.now()
    ? current
    : { failures: 0, resetAt: Date.now() + 15 * 60 * 1000 };
  record.failures += 1;
  attempts.set(ip, record);
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const ip = request.socket.remoteAddress || 'unknown';
  response.setHeader('Cache-Control', 'no-store');

  if (url.pathname === '/api/auth/login' && request.method === 'POST') {
    if (isRateLimited(ip)) return sendJson(response, 429, { error: 'Too many attempts' });
    try {
      const body = await readBody(request);
      const submittedHash = crypto.scryptSync(String(body.password || ''), passwordSalt, 64).toString('hex');
      const validUser = String(body.username || '') === username;
      const validPassword = crypto.timingSafeEqual(Buffer.from(submittedHash, 'hex'), Buffer.from(passwordHash, 'hex'));
      if (!validUser || !validPassword) {
        registerFailure(ip);
        return sendJson(response, 401, { error: 'Invalid credentials' });
      }
      attempts.delete(ip);
      const token = crypto.randomBytes(32).toString('hex');
      sessions.set(token, { expiresAt: Date.now() + sessionLifetime });
      return sendJson(response, 200, { authenticated: true }, {
        'Set-Cookie': `gc_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${sessionLifetime / 1000}`,
      });
    } catch {
      return sendJson(response, 400, { error: 'Invalid request' });
    }
  }

  if (url.pathname === '/api/auth/me' && request.method === 'GET') {
    return sendJson(response, 200, { authenticated: isAuthorized(request) });
  }

  if (url.pathname === '/api/auth/logout' && request.method === 'POST') {
    const token = parseCookies(request).gc_session;
    if (token) sessions.delete(token);
    return sendJson(response, 200, { authenticated: false }, { 'Set-Cookie': 'gc_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0' });
  }

  // --- Payment Gateways (Paymob / Vodafone Cash / InstaPay Sandbox Integration) ---
  
  if (url.pathname === '/api/payments/create-intent' && request.method === 'POST') {
    try {
      const body = await readBody(request);
      const { amount, paymentMethod, payOption, depositPercent, cartItems, customerInfo } = body;
      
      if (!amount || !paymentMethod || !payOption) {
        return sendJson(response, 400, { error: 'Missing required payment details' });
      }

      const orderId = `GD-${Math.floor(Math.random() * 90000) + 10000}`;
      const orderData = {
        orderId,
        amount: Number(amount),
        status: 'pending',
        paymentMethod,
        payOption,
        depositPercent: Number(depositPercent || 100),
        cartItems,
        customerInfo,
        createdAt: Date.now()
      };
      orders.set(orderId, orderData);

      // If real Paymob credentials are set, call the real Paymob Intention API
      if (paymobSecretKey) {
        try {
          const names = (customerInfo.fullName || 'Customer User').trim().split(/\s+/);
          const firstName = names[0] || 'Customer';
          const lastName = names.slice(1).join(' ') || 'User';

          // Format phone number to E.164 format (+201xxxxxxxxx) for Egypt
          let rawPhone = (customerInfo.phone || '').trim().replace(/\D/g, '');
          if (rawPhone.startsWith('0')) {
            rawPhone = '20' + rawPhone.slice(1);
          }
          if (!rawPhone.startsWith('2')) {
            rawPhone = '20' + rawPhone;
          }
          const formattedPhone = '+' + rawPhone;

          const paymobPayload = {
            amount: Math.round(Number(amount) * 100), // convert to cents
            currency: 'EGP',
            payment_methods: paymobIntegrationIds,
            customer: {
              first_name: firstName,
              last_name: lastName,
              email: customerInfo.email || 'customer@goldencar.com'
            },
            billing_data: {
              first_name: firstName,
              last_name: lastName,
              email: customerInfo.email || 'customer@goldencar.com',
              phone_number: formattedPhone,
              apartment: 'NA',
              floor: 'NA',
              street: customerInfo.address || 'NA',
              building: 'NA',
              city: 'Cairo',
              country: 'EG'
            },
            extras: {
              merchant_order_id: orderId
            }
          };

          const paymobResponse = await fetch('https://accept.paymob.com/api/v1/intention', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${paymobSecretKey}`
            },
            body: JSON.stringify(paymobPayload)
          });

          const paymobData = await paymobResponse.json();

          if (paymobResponse.ok && paymobData.client_secret) {
            orderData.clientSecret = paymobData.client_secret;
            orderData.paymobOrderId = paymobData.id;
            orders.set(orderId, orderData);

            // Redirect URL for the Unified Checkout
            const redirectUrl = `https://accept.paymob.com/unifiedcheckout/?token=${paymobData.client_secret}`;
            return sendJson(response, 200, { success: true, orderId, redirectUrl, isReal: true });
          } else {
            console.error('Paymob Intention API Error:', paymobData);
            return sendJson(response, 200, { success: true, orderId, simulationMode: true, apiError: paymobData });
          }
        } catch (apiError) {
          console.error('Paymob Connection Failed:', apiError);
          return sendJson(response, 200, { success: true, orderId, simulationMode: true, networkError: apiError.message });
        }
      }

      return sendJson(response, 200, { success: true, orderId, simulationMode: true });
    } catch (e) {
      return sendJson(response, 400, { error: 'Invalid request' });
    }
  }

  if (url.pathname.startsWith('/api/payments/status/') && request.method === 'GET') {
    const orderId = url.pathname.split('/').pop();
    const order = orders.get(orderId);
    if (!order) {
      return sendJson(response, 404, { error: 'Order not found' });
    }
    return sendJson(response, 200, { 
      orderId: order.orderId,
      status: order.status,
      paymentMethod: order.paymentMethod,
      amount: order.amount,
      paidAt: order.paidAt
    });
  }

  if (url.pathname === '/api/payments/simulate-webhook-trigger' && request.method === 'POST') {
    try {
      const body = await readBody(request);
      const { orderId, success } = body;
      const order = orders.get(orderId);
      
      if (!order) {
        return sendJson(response, 404, { error: 'Order not found' });
      }

      // Simulate a Paymob Webhook transaction payload
      const transactionId = Math.floor(Math.random() * 9000000) + 1000000;
      const amountCents = Math.round(order.amount * 100);
      const createdAt = new Date().toISOString();
      const currency = 'EGP';
      const errorOccured = success ? 'false' : 'true';
      const hasParentTransaction = 'false';
      const integrationId = 12345;
      const is3dSecure = 'false';
      const isAuth = 'false';
      const isCapture = 'false';
      const isRefunded = 'false';
      const isStandalonePayment = 'true';
      const transactionProcessedCallbackAndResponse = 'true';
      const pending = 'false';
      const pan = order.paymentMethod === 'vf_cash' ? '01012345678' : 'instapay_address';
      const subType = order.paymentMethod === 'vf_cash' ? 'wallet' : 'ipn';
      const type = order.paymentMethod === 'vf_cash' ? 'wallet' : 'ipn';
      const successStr = success ? 'true' : 'false';

      // Concatenate fields in Paymob V1 HMAC order
      const hmacString = 
        amountCents +
        createdAt +
        currency +
        errorOccured +
        hasParentTransaction +
        transactionId +
        integrationId +
        is3dSecure +
        isAuth +
        isCapture +
        isRefunded +
        isStandalonePayment +
        transactionProcessedCallbackAndResponse +
        pending +
        pan +
        subType +
        type +
        successStr;

      // Calculate HMAC using the server secret
      const hmac = crypto
        .createHmac('sha512', paymobHmacSecret)
        .update(hmacString)
        .digest('hex');

      // Construct payload for internal webhook processing
      const webhookPayload = {
        obj: {
          id: transactionId,
          pending: false,
          success: success,
          amount_cents: amountCents,
          currency: currency,
          error_occured: success ? false : true,
          is_standalone_payment: true,
          is_refunded: false,
          is_3d_secure: false,
          is_auth: false,
          is_capture: false,
          created_at: createdAt,
          integration_id: integrationId,
          order: {
            merchant_order_id: orderId
          },
          source_data: {
            type: type,
            sub_type: subType,
            pan: pan
          }
        }
      };

      const result = processWebhookPayload(webhookPayload, hmac);
      
      if (result.success) {
        return sendJson(response, 200, { success: true, message: 'Webhook simulated and verified successfully' });
      } else {
        return sendJson(response, 400, { success: false, error: result.error });
      }
    } catch (e) {
      return sendJson(response, 500, { error: 'Failed to simulate webhook', details: e.message });
    }
  }

  if (url.pathname === '/api/payments/webhook' && request.method === 'POST') {
    try {
      const body = await readBody(request);
      const hmac = url.searchParams.get('hmac') || request.headers['x-callback-signature'];
      
      const result = processWebhookPayload(body, hmac);
      if (result.success) {
        return sendJson(response, 200, { success: true });
      } else {
        return sendJson(response, 400, { error: result.error });
      }
    } catch (e) {
      return sendJson(response, 500, { error: 'Internal error' });
    }
  }

  sendJson(response, 404, { error: 'Not found' });
});

server.listen(port, () => console.log(`Auth server listening on http://localhost:${port}`));
