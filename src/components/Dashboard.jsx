import React, { useMemo } from 'react';
import { TrendingUp, ShoppingBag, Users, DollarSign, ArrowUpRight } from 'lucide-react';
import {
  revenueData, ordersData, categoryData,
  recentOrders, topProducts, kpiData,
  monthLabels, monthLabelsAr, formatEGP
} from '../data/dashboardData';
import { useLanguage } from '../data/i18n.jsx';


// ─── SVG Line Chart ───────────────────────────────────────────────
function LineChart({ data, labels }) {
  const { isAr } = useLanguage();
  const W = 600, H = 200, padX = 48, padY = 16;
  const plotW = W - padX * 2;
  const plotH = H - padY * 2;

  const min = Math.min(...data) * 0.9;
  const max = Math.max(...data) * 1.05;
  const toX = (i) => padX + (i / (data.length - 1)) * plotW;
  const toY = (v) => padY + plotH - ((v - min) / (max - min)) * plotH;

  const linePath = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)},${toY(v)}`).join(' ');
  const areaPath = `${linePath} L ${toX(data.length - 1)},${H - padY} L ${padX},${H - padY} Z`;

  const displayLabels = isAr ? monthLabelsAr : monthLabels;

  return (
    <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E31E24" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#E31E24" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const y = padY + plotH * (1 - t);
        const v = min + (max - min) * t;
        return (
          <g key={i}>
            <line x1={padX} y1={y} x2={W - padX} y2={y} className="chart-grid-line" strokeDasharray="4 4" />
            <text x={padX - 6} y={y + 4} className="chart-axis-label" textAnchor="end">
              {v >= 1000 ? `${Math.round(v / 1000)}K` : Math.round(v)}
            </text>
          </g>
        );
      })}

      {/* Area fill */}
      <path d={areaPath} className="chart-area" />

      {/* Line */}
      <path d={linePath} className="chart-line" />

      {/* Dots */}
      {data.map((v, i) => (
        <circle key={i} cx={toX(i)} cy={toY(v)} r={4} className="chart-dot">
          <title>{formatEGP(v)}</title>
        </circle>
      ))}

      {/* X-axis labels */}
      {displayLabels.map((label, i) => (
        <text
          key={i}
          x={toX(i)}
          y={H - 2}
          className="chart-axis-label"
          textAnchor="middle"
        >
          {label}
        </text>
      ))}
    </svg>
  );
}

// ─── Donut Chart ─────────────────────────────────────────────────
function DonutChart({ data }) {
  const { isAr } = useLanguage();
  const R = 70, r = 45, cx = 90, cy = 90;
  let startAngle = -Math.PI / 2;

  const segments = data.map(item => {
    const angle = (item.value / 100) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(startAngle);
    const y1 = cy + R * Math.sin(startAngle);
    const endAngle = startAngle + angle;
    const x2 = cx + R * Math.cos(endAngle);
    const y2 = cy + R * Math.sin(endAngle);
    const xi1 = cx + r * Math.cos(startAngle);
    const yi1 = cy + r * Math.sin(startAngle);
    const xi2 = cx + r * Math.cos(endAngle);
    const yi2 = cy + r * Math.sin(endAngle);
    const large = angle > Math.PI ? 1 : 0;
    const d = `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${r} ${r} 0 ${large} 0 ${xi1} ${yi1} Z`;
    startAngle = endAngle;
    return { ...item, d };
  });

  return (
    <div className="donut-chart">
      <svg viewBox="0 0 180 180" style={{ width: '160px', alignSelf: 'center' }}>
        {segments.map((seg, i) => (
          <path key={i} d={seg.d} fill={seg.color} stroke="var(--bg-2)" strokeWidth="2">
            <title>{isAr ? seg.nameAr : seg.name}: {seg.value}%</title>
          </path>
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--text)" fontSize="14" fontWeight="800">
          EGP
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="var(--text-2)" fontSize="10">
          Sales
        </text>
      </svg>

      <div className="donut-legend">
        {data.map((item, i) => (
          <div key={i} className="donut-legend-item">
            <div className="donut-legend-dot" style={{ background: item.color }} />
            <span className="donut-legend-name">{isAr ? item.nameAr : item.name}</span>
            <span className="donut-legend-pct">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────
export default function Dashboard() {
  const { t, isAr } = useLanguage();

  const kpis = [
    {
      labelKey: 'dash.revenue',
      value: isAr ? `${(kpiData.totalRevenue / 1000).toFixed(0)}K ج.م` : `${(kpiData.totalRevenue / 1000).toFixed(0)}K EGP`,
      growth: kpiData.revenueGrowth,
      Icon: DollarSign,
    },
    {
      labelKey: 'dash.orders',
      value: kpiData.ordersToday,
      growth: `+${kpiData.ordersGrowth}`,
      Icon: ShoppingBag,
    },
    {
      labelKey: 'dash.sold',
      value: kpiData.itemsSold.toLocaleString(),
      growth: `+${kpiData.soldGrowth}`,
      Icon: TrendingUp,
    },
    {
      labelKey: 'dash.customers',
      value: kpiData.customers.toLocaleString(),
      growth: kpiData.customersGrowth,
      Icon: Users,
    },
  ];

  const statusLabel = (status) => {
    const map = { completed: t('dash.completed'), pending: t('dash.pending'), processing: t('dash.processing') };
    return map[status] || status;
  };

  return (
    <div className="dashboard-page" style={{ marginTop: 'var(--header-h)' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div className="eyebrow">{t('dash.eyebrow')}</div>
        <h2 className="display-md">{t('dash.title')}</h2>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpis.map((kpi, i) => (
          <div key={i} className="kpi-card animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="kpi-icon"><kpi.Icon size={22} /></div>
            <div className="kpi-label">{t(kpi.labelKey)}</div>
            <div className="kpi-value">{kpi.value}</div>
            <div className="kpi-growth">
              <ArrowUpRight size={12} style={{ display: 'inline', marginRight: '3px' }} />
              {kpi.growth} {isAr ? 'هذا الشهر' : 'this month'}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="dash-grid">
        {/* Line Chart */}
        <div className="dash-card">
          <div className="dash-card-title">{t('dash.trend')}</div>
          <LineChart data={revenueData} labels={monthLabels} />
        </div>

        {/* Donut Chart */}
        <div className="dash-card">
          <div className="dash-card-title">{t('dash.categories')}</div>
          <DonutChart data={categoryData} />
        </div>
      </div>

      {/* Recent Orders + Top Products */}
      <div className="dash-grid" style={{ marginBottom: 0 }}>
        {/* Recent Orders */}
        <div className="dash-card" style={{ overflowX: 'auto' }}>
          <div className="dash-card-title">{t('dash.recentOrders')}</div>
          <table className="orders-table">
            <thead>
              <tr>
                <th>{t('dash.orderNum')}</th>
                <th>{t('dash.product')}</th>
                <th>{t('dash.date')}</th>
                <th>{t('dash.status')}</th>
                <th>{t('dash.amount')}</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 700, color: 'var(--red)', fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
                    {order.id}
                  </td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {order.product}
                  </td>
                  <td style={{ color: 'var(--text-2)' }}>{order.date}</td>
                  <td>
                    <span className={`order-status ${order.status}`}>
                      {statusLabel(order.status)}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {isAr ? `${order.amount.toLocaleString()} ج.م` : `${order.amount.toLocaleString()} EGP`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Products */}
        <div className="dash-card">
          <div className="dash-card-title">{t('dash.topProducts')}</div>
          <div>
            {topProducts.map((prod, i) => (
              <div key={i} className="top-product-row">
                <div className="top-product-rank">{i + 1}</div>
                <div className="top-product-info">
                  <div className="top-product-name">{isAr ? prod.nameAr : prod.name}</div>
                  <div className="top-product-revenue">
                    {isAr ? `${prod.revenue.toLocaleString()} ج.م` : `${prod.revenue.toLocaleString()} EGP`}
                  </div>
                </div>
                <div>
                  <div className="top-product-sold">{prod.sold} {isAr ? 'مبيع' : 'sold'}</div>
                  <div className={`trend-${prod.trend}`}>
                    {prod.trend === 'up' ? '↑' : '→'} {prod.trend === 'up' ? (isAr ? 'صاعد' : 'rising') : (isAr ? 'ثابت' : 'stable')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
