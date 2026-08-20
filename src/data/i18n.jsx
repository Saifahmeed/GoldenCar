// i18n.jsx — Golden Car Stores bilingual EN/AR translations
import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.offers': 'Special Offers',
    'nav.contact': 'Get in Touch',
    'nav.catalog': 'Catalog',
    'nav.about': 'About Us',
    'nav.support': 'Support',
    'nav.dashboard': 'Dashboard',
    'nav.admin': 'Admin',
    'nav.selectVehicle': 'Select Vehicle',
    'nav.myGarage': 'My Garage',
    'nav.cart': 'Cart',
    'owner.login': 'Secure Login',

    // Hero
    'hero.badge': 'GOLDEN Automotive • Est. 1990 Cairo',
    'hero.headline1': 'PREMIUM',
    'hero.headline2': 'AUTOMOTIVE',
    'hero.headline3': 'ACCESSORIES.',
    'hero.tagline': "Everything your car needs — under one roof",
    'hero.taglineAr': 'كل حاجة عربيتك محتاجاها — تحت سقف واحد',
    'hero.desc': 'Three and a half decades crafting the finest automotive accessories. Lighting. Interior. Exterior. Electronics. Hand-picked, expertly installed, trusted by thousands.',
    'hero.cta.shop': 'Shop Collection',
    'hero.cta.build': 'View Categories',
    'hero.selectVehicle': 'Select Your Vehicle',
    'hero.selectVehicle.sub': 'Check parts compatibility for your car',
    'hero.addGarage': 'Add to Garage',
    'hero.stat.views': 'Total Views',
    'hero.stat.products': 'Products',
    'hero.stat.installs': 'Installations',
    'hero.stat.years': 'Years',

    // Trust Banner
    'trust.quality': 'Premium Quality',
    'trust.quality.sub': 'Hand-picked automotive brands',
    'trust.install': 'Expert Installation',
    'trust.install.sub': '35+ years of craftsmanship',
    'trust.tiktok': 'TikTok Famous',
    'trust.tiktok.sub': 'Trusted by thousands across Egypt',

    // Vehicle Selector
    'ymm.make': 'Select Make',
    'ymm.model': 'Select Model',
    'ymm.year': 'Select Year',
    'ymm.engine': 'Select Engine',

    // Categories
    'cat.title': 'Everything Your Car Needs',
    'cat.eyebrow': 'Shop By Category',
    'cat.desc': 'Six categories of premium automotive accessories, each handpicked from decades of experience.',
    'cat.all': 'All Accessories',
    'cat.lighting': 'Premium Lighting',
    'cat.screens': 'Android Screens',
    'cat.seats': 'Seats & Covers',
    'cat.floormats': 'Luxury Floor Mats',
    'cat.exterior': 'Exterior Styling',

    // Brands Section
    'brands.title': 'The Best In The Market',
    'brands.eyebrow': 'Trusted Brands',
    'brands.desc': 'Every brand we carry has been hand-picked over decades of experience. Original products, real warranty, and the names professionals trust.',
    'brands.lens': 'Lenses & Laser',
    'brands.led': 'LED Lights',
    'brands.screens': 'Android Screens',
    'brands.count': 'Brands',
    'brands.cta': 'Ask About Any Brand on WhatsApp',

    // Catalog
    'catalog.title': 'Explore Premium Accessories',
    'catalog.eyebrow': 'GOLDEN Inventory',
    'catalog.searchPlaceholder': 'Search keywords, SKU...',
    'catalog.searchTitle': 'Search Catalog',
    'catalog.brandsFilter': 'Brands',
    'catalog.maxPrice': 'Max Price',
    'catalog.categoryFilter': 'Category',
    'catalog.compatibleOnly': 'Show compatible parts only',
    'catalog.resetFilters': 'Reset Filters',
    'catalog.showing': 'Showing',
    'catalog.of': 'of',
    'catalog.parts': 'premium accessories',
    'catalog.noResults': 'No matching parts found',
    'catalog.noResults.sub': 'Try clearing filters or selecting another vehicle.',
    'catalog.vehicleActive': 'Vehicle Active',

    // Product Card
    'product.addCart': 'Add to Cart',
    'product.viewDetails': 'View Details',
    'product.inStock': 'In Stock',
    'product.reviews': 'reviews',
    'product.compatible': 'Compatible',
    'product.notCompatible': 'Check Fitment',
    'product.specs': 'Specs',
    'product.close': 'Close',

    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.empty.sub': 'Browse our catalog to find premium accessories.',
    'cart.total': 'Total',
    'cart.checkout': 'Proceed to WhatsApp Order',
    'cart.clear': 'Clear Cart',
    'cart.items': 'items',
    'cart.remove': 'Remove',
    'cart.qty': 'Qty',

    // Garage
    'garage.title': 'My Garage',
    'garage.addVehicle': 'Add Vehicle',
    'garage.empty': 'Your garage is empty',
    'garage.empty.sub': 'Add your vehicle to check parts compatibility.',
    'garage.active': 'Active',
    'garage.setActive': 'Set Active',
    'garage.delete': 'Remove',
    'garage.adding': 'Adding Vehicle',
    'garage.addBtn': 'Add to Garage',

    // Workshop
    'ws.title': 'In The Workshop',
    'ws.eyebrow': 'Workshop Status',
    'ws.live': 'WORKSHOP LIVE',
    'ws.carNumber': 'CAR NUMBER',
    'ws.progress': 'Current Installation Progress',
    'ws.inProgress': 'In Progress',
    'ws.queue': "Today's Queue",
    'ws.completed': 'Completed Today',
    'ws.avgTime': 'Avg Install Time',
    'ws.book': 'Book Your Slot',

    // About
    'about.title': 'Built Around Your Car',
    'about.eyebrow': 'The Golden Car Story',
    'about.desc': 'Since 1990, Golden Car has helped drivers across Cairo upgrade, protect, and enjoy their cars. From premium lighting and smart screens to expert installation, every detail is chosen with real automotive experience.',
    'about.story': 'One roof. Everything your car needs.',
    'about.story.desc': 'We bring trusted brands, honest advice, and careful workmanship together in one workshop. Our team matches every upgrade to your car and your way of driving.',
    'about.years': 'Years of experience',
    'about.cars': 'Cars upgraded',
    'about.brands': 'Trusted brands',
    'about.cta': 'Talk to our team',

    // Offers
    'offers.title': 'Special Offers',
    'offers.eyebrow': 'Limited Time Upgrades',
    'offers.desc': 'Upgrade your car with workshop-selected packages and installation support from the Golden team.',
    'offers.package1': 'Lighting Upgrade Package',
    'offers.package1.desc': 'Premium LED projector lenses with professional fitment.',
    'offers.package2': 'Smart Screen Package',
    'offers.package2.desc': 'A connected Android cockpit with clean dashboard integration.',
    'offers.package3': 'Performance Styling Package',
    'offers.package3.desc': 'Sharper exterior details and performance-focused workshop upgrades.',
    'offers.cta': 'Ask about today\'s offers',

    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.eyebrow': 'Got Questions?',

    // Contact
    'contact.title': 'Visit Us In Cairo',
    'contact.eyebrow': 'Contact & Location',
    'contact.location': 'Golden Car Stores, Tawfiqia, Cairo, Egypt',
    'contact.phone': '+20 111 192 6799',
    'contact.email': 'Hussein.sayed.hassn91@gmail.com',
    'contact.hours': 'Sat–Thu: 10:00 AM – 10:00 PM',
    'contact.whatsapp': 'WhatsApp',
    'contact.call': 'Call Now',

    // Warranty
    'warranty.title': 'Lifetime Performance Warranty',
    'warranty.eyebrow': 'GOLDEN Guarantee',
    'warranty.desc': 'Every premium part we carry is backed by our full replacement guarantee. Original products, real warranty.',
    'warranty.track': 'Original Products',
    'warranty.track.desc': 'All items are 100% authentic from trusted international brands with original packaging.',
    'warranty.fit': 'Expert Fitment',
    'warranty.fit.desc': 'Each accessory is matched to your specific vehicle model and installed by experienced professionals.',
    'warranty.return': 'Easy Returns',
    'warranty.return.desc': "Not satisfied? We'll help you exchange or replace your item. Customer satisfaction is our priority.",
    'warranty.claim': 'Need to file a warranty claim?',
    'warranty.claim.sub': 'Our team is available 6 days a week. Contact us via WhatsApp for fastest response.',
    'warranty.cta': 'Contact Support',

    // Support
    'support.title': 'Technical Support',
    'support.eyebrow': 'GOLDEN Support Hub',
    'support.desc': 'Have installation questions? Need help choosing the right LED lenses or Android screen? Connect with our specialists.',
    'support.faq': 'FAQ',
    'support.direct': 'Direct Store Contact',
    'support.ticket': 'Submit a Tech Request',
    'support.ticket.desc': "Fill out your issue details and we'll get back to you quickly.",
    'support.vehicle': 'Active Vehicle',
    'support.part': 'Part / SKU under inquiry',
    'support.issue': 'Issue / Inquiry Description',
    'support.submit': 'Submit Request',
    'support.submitted': 'Request Submitted!',
    'support.submitted.desc': 'Support ticket has been logged. Our team will review your inquiry shortly.',
    'support.another': 'Submit Another',

    // Dashboard
    'dash.title': 'Sales Dashboard',
    'dash.eyebrow': 'Admin Analytics',
    'dash.revenue': 'Total Revenue',
    'dash.orders': 'Orders Today',
    'dash.sold': 'Items Sold',
    'dash.customers': 'Customers',
    'dash.trend': 'Revenue Trend (12 Months)',
    'dash.categories': 'Sales by Category',
    'dash.recentOrders': 'Recent Orders',
    'dash.topProducts': 'Top Selling Products',
    'dash.orderNum': 'Order #',
    'dash.product': 'Product',
    'dash.date': 'Date',
    'dash.status': 'Status',
    'dash.amount': 'Amount',
    'dash.completed': 'Completed',
    'dash.pending': 'Pending',
    'dash.processing': 'Processing',

    // Admin
    'admin.title': 'Product Management',
    'admin.eyebrow': 'Admin Panel',
    'admin.addProduct': 'Add New Product',
    'admin.editProduct': 'Edit Product',
    'admin.productList': 'All Products',
    'admin.name': 'Product Name',
    'admin.brand': 'Brand',
    'admin.category': 'Category',
    'admin.price': 'Price (EGP)',
    'admin.discount': 'Discount (%)',
    'admin.sku': 'SKU Code',
    'admin.description': 'Description',
    'admin.image': 'Product Image',
    'admin.save': 'Save Product',
    'admin.cancel': 'Cancel',
    'admin.edit': 'Edit',
    'admin.delete': 'Delete',
    'admin.deleteConfirm': 'Are you sure you want to delete this product?',
    'admin.saved': 'Product saved successfully!',
    'admin.deleted': 'Product deleted.',
    'admin.noProducts': 'No custom products yet.',
    'admin.customBadge': 'Custom',
    'admin.editedBadge': 'Edited',
    'admin.staticBadge': 'Static',

    // Footer
    'footer.desc': "Cairo's premier destination for premium automotive accessories and custom tuning since 1990.",
    'footer.shop': 'Shop Catalog',
    'footer.warranty': 'Warranty & Fitment',
    'footer.contact': 'GOLDEN Cairo Outlet',
    'footer.rights': '© 2026 Golden Car Stores. All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Use',

    // Common
    'common.loading': 'Loading...',
    'common.egp': 'EGP',
    'common.viewAll': 'View All',
    'common.learnMore': 'Learn More',
    'common.close': 'Close',
    'common.or': 'or',
    'common.search': 'Search',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.products': 'المنتجات',
    'nav.offers': 'العروض الخاصة',
    'nav.contact': 'تواصل مع فريقنا',
    'nav.catalog': 'المنتجات',
    'nav.about': 'من نحن',
    'nav.support': 'الدعم',
    'nav.dashboard': 'لوحة التحكم',
    'nav.admin': 'الإدارة',
    'nav.selectVehicle': 'اختر سيارتك',
    'nav.myGarage': 'جراجي',
    'nav.cart': 'السلة',
    'owner.login': 'دخول آمن',

    // Hero
    'hero.badge': 'جولدن للسيارات • منذ ١٩٩٠ القاهرة',
    'hero.headline1': 'إكسسوارات',
    'hero.headline2': 'سيارات',
    'hero.headline3': 'فاخرة.',
    'hero.tagline': 'كل حاجة عربيتك محتاجاها — تحت سقف واحد',
    'hero.taglineAr': 'كل حاجة عربيتك محتاجاها — تحت سقف واحد',
    'hero.desc': 'أكثر من ٣٥ سنة في تجهيز أفضل إكسسوارات السيارات. إضاءة وإلكترونيات ومقاعد وتعديلات خارجية — بأيدي محترفين.',
    'hero.cta.shop': 'تسوق الآن',
    'hero.cta.build': 'استعرض الفئات',
    'hero.selectVehicle': 'اختر سيارتك',
    'hero.selectVehicle.sub': 'تحقق من توافق القطع مع سيارتك',
    'hero.addGarage': 'أضف للجراج',
    'hero.stat.views': 'مشاهدة',
    'hero.stat.products': 'منتج',
    'hero.stat.installs': 'تركيب',
    'hero.stat.years': 'سنة',

    // Trust Banner
    'trust.quality': 'جودة عالية',
    'trust.quality.sub': 'ماركات عالمية مختارة بعناية',
    'trust.install': 'تركيب احترافي',
    'trust.install.sub': 'أكثر من ٣٥ سنة خبرة',
    'trust.tiktok': 'مشهورون على تيك توك',
    'trust.tiktok.sub': 'ثقة الآلاف في مصر',

    // Vehicle Selector
    'ymm.make': 'اختر الماركة',
    'ymm.model': 'اختر الموديل',
    'ymm.year': 'اختر السنة',
    'ymm.engine': 'اختر المحرك',

    // Categories
    'cat.title': 'كل ما تحتاجه سيارتك',
    'cat.eyebrow': 'تسوق حسب الفئة',
    'cat.desc': 'ست فئات من إكسسوارات السيارات الفاخرة، كل واحدة مختارة من عقود من الخبرة.',
    'cat.all': 'كل المنتجات',
    'cat.lighting': 'إضاءة فاخرة',
    'cat.screens': 'شاشات أندرويد',
    'cat.seats': 'كراسي وكفرات',
    'cat.floormats': 'فرش فاخرة',
    'cat.exterior': 'إكسسوارات خارجية',

    // Brands Section
    'brands.title': 'الأفضل في السوق',
    'brands.eyebrow': 'ماركات نثق بها',
    'brands.desc': 'كل ماركة بنبيعها اختارت بدقة على مدار عقود. منتجات أصلية وضمان حقيقي.',
    'brands.lens': 'عدسات وليزر',
    'brands.led': 'إضاءة LED',
    'brands.screens': 'شاشات أندرويد',
    'brands.count': 'ماركات',
    'brands.cta': 'اسأل عن أي ماركة على واتساب',

    // Catalog
    'catalog.title': 'اكتشف الإكسسوارات الفاخرة',
    'catalog.eyebrow': 'مخزن جولدن',
    'catalog.searchPlaceholder': 'ابحث بالاسم أو الكود...',
    'catalog.searchTitle': 'بحث في المنتجات',
    'catalog.brandsFilter': 'الماركات',
    'catalog.maxPrice': 'أقصى سعر',
    'catalog.categoryFilter': 'التصنيف',
    'catalog.compatibleOnly': 'اعرض القطع المتوافقة فقط',
    'catalog.resetFilters': 'مسح الفلاتر',
    'catalog.showing': 'عرض',
    'catalog.of': 'من',
    'catalog.parts': 'منتج',
    'catalog.noResults': 'لا توجد نتائج',
    'catalog.noResults.sub': 'جرب مسح الفلاتر أو تغيير السيارة.',
    'catalog.vehicleActive': 'السيارة محددة',

    // Product Card
    'product.addCart': 'أضف للسلة',
    'product.viewDetails': 'عرض التفاصيل',
    'product.inStock': 'متوفر',
    'product.reviews': 'تقييم',
    'product.compatible': 'متوافق',
    'product.notCompatible': 'تحقق من التوافق',
    'product.specs': 'المواصفات',
    'product.close': 'إغلاق',

    // Cart
    'cart.title': 'سلة التسوق',
    'cart.empty': 'السلة فارغة',
    'cart.empty.sub': 'تصفح المنتجات وأضف ما يعجبك.',
    'cart.total': 'الإجمالي',
    'cart.checkout': 'اطلب عبر واتساب',
    'cart.clear': 'تفريغ السلة',
    'cart.items': 'منتجات',
    'cart.remove': 'حذف',
    'cart.qty': 'الكمية',

    // Garage
    'garage.title': 'جراجي',
    'garage.addVehicle': 'إضافة سيارة',
    'garage.empty': 'الجراج فارغ',
    'garage.empty.sub': 'أضف سيارتك لتحقق من توافق القطع.',
    'garage.active': 'نشطة',
    'garage.setActive': 'تفعيل',
    'garage.delete': 'حذف',
    'garage.adding': 'إضافة سيارة',
    'garage.addBtn': 'أضف للجراج',

    // Workshop
    'ws.title': 'في الورشة',
    'ws.eyebrow': 'حالة الورشة',
    'ws.live': 'الورشة شغالة',
    'ws.carNumber': 'رقم السيارة',
    'ws.progress': 'تقدم التركيب الحالي',
    'ws.inProgress': 'قيد التركيب',
    'ws.queue': 'طابور اليوم',
    'ws.completed': 'مكتمل اليوم',
    'ws.avgTime': 'متوسط وقت التركيب',
    'ws.book': 'احجز موعدك',

    // About
    'about.title': 'كل حاجة عربيتك محتاجاها',
    'about.eyebrow': 'حكاية جولدن كار',
    'about.desc': 'منذ ١٩٩٠، جولدن كار بتساعد أصحاب العربيات في القاهرة يطوروا ويحافظوا على عربياتهم. من الإضاءة الفاخرة والشاشات الذكية لحد التركيب الاحترافي، كل تفصيلة مبنية على خبرة حقيقية في السيارات.',
    'about.story': 'تحت سقف واحد. كل حاجة عربيتك محتاجاها.',
    'about.story.desc': 'جمعنا ماركات موثوقة ونصيحة صادقة وشغل متقن في ورشة واحدة. فريقنا بيساعدك تختار التعديل المناسب لعربيتك وطريقة استخدامك.',
    'about.years': 'سنة خبرة',
    'about.cars': 'عربية اتطورت',
    'about.brands': 'ماركة موثوقة',
    'about.cta': 'كلم فريقنا',

    // Offers
    'offers.title': 'عروض جولدن كار',
    'offers.eyebrow': 'عروض لفترة محدودة',
    'offers.desc': 'طور عربيتك بباكدجات مختارة من ورشتنا مع دعم كامل في التركيب من فريق جولدن.',
    'offers.package1': 'باكدج تطوير الإضاءة',
    'offers.package1.desc': 'عدسات LED فاخرة مع تركيب احترافي.',
    'offers.package2': 'باكدج الشاشة الذكية',
    'offers.package2.desc': 'شاشة أندرويد متكاملة بشكل نظيف مع تابلوه عربيتك.',
    'offers.package3': 'باكدج الأداء والشكل',
    'offers.package3.desc': 'تفاصيل خارجية أقوى وتعديلات أداء مختارة من الورشة.',
    'offers.cta': 'اسأل عن عروض النهارده',

    // FAQ
    'faq.title': 'الأسئلة الشائعة',
    'faq.eyebrow': 'عندك سؤال؟',

    // Contact
    'contact.title': 'زورنا في القاهرة',
    'contact.eyebrow': 'التواصل والعنوان',
    'contact.location': 'جولدن كار ستورز، التوفيقية، القاهرة، مصر',
    'contact.phone': '+20 111 192 6799',
    'contact.email': 'Hussein.sayed.hassn91@gmail.com',
    'contact.hours': 'السبت–الخميس: ١٠ ص – ١٠ م',
    'contact.whatsapp': 'WhatsApp',
    'contact.call': 'اتصل الآن',

    // Warranty
    'warranty.title': 'ضمان مدى الحياة',
    'warranty.eyebrow': 'ضمان جولدن',
    'warranty.desc': 'كل منتج بنبيعه مضمون ومع ضمان استبدال. منتجات أصلية وخدمة حقيقية.',
    'warranty.track': 'منتجات أصلية',
    'warranty.track.desc': 'كل المنتجات أصلية ١٠٠٪ من ماركات عالمية موثوقة مع تغليف أصلي.',
    'warranty.fit': 'تركيب احترافي',
    'warranty.fit.desc': 'كل إكسسوار بيتركب بأيدي محترفين متخصصين في نوع سيارتك.',
    'warranty.return': 'استبدال سهل',
    'warranty.return.desc': 'مش راضي؟ هنساعدك في الاستبدال. رضا العميل هو أولويتنا.',
    'warranty.claim': 'محتاج تقدم طلب ضمان؟',
    'warranty.claim.sub': 'فريقنا متاح ٦ أيام في الأسبوع. تواصل معنا على واتساب للرد الأسرع.',
    'warranty.cta': 'تواصل مع الدعم',

    // Support
    'support.title': 'الدعم الفني',
    'support.eyebrow': 'مركز دعم جولدن',
    'support.desc': 'عندك سؤال عن التركيب؟ محتاج مساعدة في اختيار الإضاءة المناسبة؟ تواصل مع فريقنا المتخصص.',
    'support.faq': 'أسئلة شائعة',
    'support.direct': 'تواصل مباشر',
    'support.ticket': 'أرسل استفسارك',
    'support.ticket.desc': 'اكتب استفسارك وهنرد عليك بسرعة.',
    'support.vehicle': 'السيارة النشطة',
    'support.part': 'المنتج / الكود',
    'support.issue': 'وصف المشكلة أو الاستفسار',
    'support.submit': 'إرسال الاستفسار',
    'support.submitted': 'تم الإرسال!',
    'support.submitted.desc': 'وصلنا استفسارك وهنرد عليك قريب.',
    'support.another': 'إرسال استفسار آخر',

    // Dashboard
    'dash.title': 'لوحة المبيعات',
    'dash.eyebrow': 'تحليلات الإدارة',
    'dash.revenue': 'إجمالي الإيرادات',
    'dash.orders': 'طلبات اليوم',
    'dash.sold': 'قطع مباعة',
    'dash.customers': 'عملاء',
    'dash.trend': 'اتجاه الإيرادات (١٢ شهر)',
    'dash.categories': 'المبيعات حسب الفئة',
    'dash.recentOrders': 'آخر الطلبات',
    'dash.topProducts': 'الأكثر مبيعاً',
    'dash.orderNum': 'رقم الطلب',
    'dash.product': 'المنتج',
    'dash.date': 'التاريخ',
    'dash.status': 'الحالة',
    'dash.amount': 'المبلغ',
    'dash.completed': 'مكتمل',
    'dash.pending': 'قيد الانتظار',
    'dash.processing': 'قيد المعالجة',

    // Admin
    'admin.title': 'إدارة المنتجات',
    'admin.eyebrow': 'لوحة الإدارة',
    'admin.addProduct': 'إضافة منتج جديد',
    'admin.editProduct': 'تعديل المنتج',
    'admin.productList': 'كل المنتجات',
    'admin.name': 'اسم المنتج',
    'admin.brand': 'الماركة',
    'admin.category': 'الفئة',
    'admin.price': 'السعر (جنيه)',
    'admin.discount': 'الخصم (%)',
    'admin.sku': 'كود المنتج',
    'admin.description': 'الوصف',
    'admin.image': 'صورة المنتج',
    'admin.save': 'حفظ المنتج',
    'admin.cancel': 'إلغاء',
    'admin.edit': 'تعديل',
    'admin.delete': 'حذف',
    'admin.deleteConfirm': 'هل أنت متأكد من حذف هذا المنتج؟',
    'admin.saved': 'تم حفظ المنتج بنجاح!',
    'admin.deleted': 'تم حذف المنتج.',
    'admin.noProducts': 'لا توجد منتجات مضافة بعد.',
    'admin.customBadge': 'مضاف',
    'admin.editedBadge': 'معدل',
    'admin.staticBadge': 'أساسي',

    // Footer
    'footer.desc': 'الوجهة الأولى للإكسسوارات الفاخرة في القاهرة منذ ١٩٩٠.',
    'footer.shop': 'المنتجات',
    'footer.warranty': 'الضمان والتوافق',
    'footer.contact': 'جولدن كار - القاهرة',
    'footer.rights': '© ٢٠٢٦ جولدن كار ستورز. جميع الحقوق محفوظة.',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.terms': 'شروط الاستخدام',

    // Common
    'common.loading': 'جار التحميل...',
    'common.egp': 'ج.م',
    'common.viewAll': 'عرض الكل',
    'common.learnMore': 'اعرف أكثر',
    'common.close': 'إغلاق',
    'common.or': 'أو',
    'common.search': 'بحث',
  }
};

export const LanguageContext = createContext({
  lang: 'ar',
  setLang: () => { },
  t: (key) => key,
  isAr: true,
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('gc_lang') || 'ar';
  });

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('gc_lang', newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isAr: lang === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
