// catalog.js — Golden Car Stores product catalog (EGP pricing)

export const vehiclesData = {
  makes: ["Toyota", "Hyundai", "Kia", "Mercedes", "BMW"],
  models: {
    Toyota: ["Corolla", "Fortuner", "C-HR"],
    Hyundai: ["Tucson", "Elantra", "Creta"],
    Kia: ["Sportage", "Cerato", "Seltos"],
    Mercedes: ["C-Class", "E-Class", "GLC"],
    BMW: ["3 Series", "5 Series", "X5", "M3"]
  },
  years: ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
  engines: {
    "Toyota-Corolla": ["1.6L Active CVT (120 HP)", "1.8L Hybrid Synergy (121 HP)"],
    "Toyota-Fortuner": ["2.7L Dual VVT-i (163 HP)", "4.0L V6 Dual VVT-i (235 HP)"],
    "Toyota-C-HR": ["1.2L Turbo CVT (115 HP)", "1.8L Hybrid Synergy (121 HP)"],
    "Hyundai-Tucson": ["1.6L T-GDI 7-Speed DCT (180 HP)", "2.0L MPI 6-Speed Auto (156 HP)"],
    "Hyundai-Elantra": ["1.6L MPI 6-Speed Auto (127 HP)", "2.0L MPI 6-Speed Auto (159 HP)"],
    "Hyundai-Creta": ["1.5L MPI CVT (115 HP)"],
    "Kia-Sportage": ["1.6L T-GDI 7-Speed DCT (180 HP)", "2.0L MPI 6-Speed Auto (156 HP)"],
    "Kia-Cerato": ["1.6L MPI 6-Speed Auto (128 HP)"],
    "Kia-Seltos": ["1.4L T-GDI 7-Speed DCT (140 HP)"],
    "Mercedes-C-Class": ["C180 1.5L MHEV 9G-Tronic (170 HP)", "C200 1.5L MHEV 9G-Tronic (204 HP)"],
    "Mercedes-E-Class": ["E200 2.0L Mild Hybrid (204 HP)", "E300 2.0L Mild Hybrid (258 HP)"],
    "Mercedes-GLC": ["GLC200 2.0L 9G-Tronic (204 HP)", "GLC300 2.0L 9G-Tronic (258 HP)"],
    "BMW-3 Series": ["318i 2.0L TwinPower Turbo (156 HP)", "320i 2.0L TwinPower Turbo (184 HP)"],
    "BMW-5 Series": ["520i 2.0L TwinPower Turbo (184 HP)", "530i 2.0L TwinPower Turbo (252 HP)"],
    "BMW-X5": ["xDrive40i 3.0L B58 I6 (375 HP)", "xDrive50e 3.0L Plug-in Hybrid (483 HP)"],
    "BMW-M3": ["3.0L Competition Twin-Turbo I6 (503 HP)"]
  }
};

export const categoriesData = [
  { id: "all", name: "All Accessories", nameAr: "كل المنتجات", icon: "Sliders" },
  { id: "lighting", name: "Premium Lighting", nameAr: "إضاءة فاخرة", icon: "Zap" },
  { id: "screens", name: "Android Screens", nameAr: "شاشات أندرويد", icon: "Activity" },
  { id: "seats", name: "Seats & Covers", nameAr: "كراسي وكفرات", icon: "Sliders" },
  { id: "floormats", name: "Luxury Floor Mats", nameAr: "فرش فاخرة", icon: "Disc" },
  { id: "exterior", name: "Exterior Styling", nameAr: "إكسسوارات خارجية", icon: "Wind" }
];

// Brands organized by category (from old Golden Car website)
export const brandsData = [
  {
    id: "lenses",
    icon: "🔦",
    nameEn: "Lenses & Laser",
    nameAr: "العدسات والليزر",
    brands: ["VAHID", "A80", "OKLAND", "AOZOOM"]
  },
  {
    id: "led",
    icon: "💡",
    nameEn: "LED Lights",
    nameAr: "إضاءة LED",
    brands: ["OKLAND", "AKO", "WOLF", "DIAMOND", "YOBIS"]
  },
  {
    id: "screens",
    icon: "📱",
    nameEn: "Android Screens",
    nameAr: "شاشات أندرويد",
    brands: ["WINCA", "SK", "ENJOYING", "Z POWER", "GEMSTONE", "DRIVE ONE", "STYLE TASLA"]
  }
];

export const productsData = [
  // ==================== PREMIUM LIGHTING ====================
  {
    id: "gd-lgt-laser-01",
    name: "GOLDEN Premium Laser LED Projector Lenses (3.0\")",
    nameAr: "عدسات ليزر LED جولدن (٣ بوصة)",
    brand: "GOLDEN Tuning",
    category: "lighting",
    price: 7200,
    offer: { oldPrice: 8500, discount: 15, duration: 7 },
    rating: 4.9,
    reviewsCount: 124,
    sku: "GD-LGT-LASER-30",
    image: "brakes.jpg",
    description: "Upgrade your vehicle lighting to professional standards. The GOLDEN Laser LED projector lenses provide unparalleled road visibility with a sharp cut-off line. Features high-output dual LED chips combined with a laser auxiliary high-beam, reaching over 600 meters.",
    descriptionAr: "طور إضاءة سيارتك لمستوى احترافي. عدسات ليزر LED من جولدن توفر رؤية لا مثيل لها على الطريق مع خط قطع حاد. تتميز بشرائح LED مزدوجة عالية الإخراج مع شعاع مساعد ليزر يصل لأكثر من ٦٠٠ متر.",
    specs: {
      "Light Output": "Low Beam: 6000LM | High Beam: 9000LM",
      "Color Temperature": "5500K - Cool Diamond White",
      "Laser Range": "Up to 600 meters",
      "Cooling System": "Dual ball-bearing silent fan with copper heat pipes",
      "Life Span": "30,000+ Hours",
      "Fitment Size": "3.0-inch universal thread mounting"
    },
    reviews: [
      { id: 1, user: "Ahmed T.", rating: 5, date: "2026-06-12", comment: "The brightness is insane! High beam reaches incredibly far on the highway." }
    ],
    compatibility: ["Toyota-Corolla", "Hyundai-Tucson", "Hyundai-Elantra", "Kia-Sportage", "Kia-Cerato", "Mercedes-C-Class", "Mercedes-E-Class", "BMW-3 Series", "BMW-5 Series"]
  },
  {
    id: "gd-lgt-ambient-02",
    name: "GOLDEN Dynamic Symphony App-Controlled Ambient Lighting",
    nameAr: "إضاءة محيطية ديناميكية بالتطبيق من جولدن",
    brand: "GOLDEN Tuning",
    category: "lighting",
    price: 3900,
    rating: 4.8,
    reviewsCount: 96,
    sku: "GD-LGT-AMBIENT-SYM",
    image: "ignition_coils.jpg",
    description: "Bring your car cabin to life. The GOLDEN Symphony Ambient Light kit provides multi-color dynamic LED strips that integrate seamlessly with your interior trim. Controlled via a mobile app or physical button, featuring music sync, gradient flow, and brightness control.",
    descriptionAr: "اجعل مقصورة سيارتك حية. مجموعة إضاءة محيطية من جولدن توفر شرائط LED ملونة ديناميكية تتكامل بسلاسة مع تشطيبات داخليتك. يتحكم فيها تطبيق الجوال أو زر مادي مع مزامنة الموسيقى.",
    specs: {
      "Strips Included": "4 door panels, 4 footwell lights, 2 dashboard lines",
      "Control Interface": "Bluetooth App (iOS & Android) & physical button",
      "Color Depth": "16 Million Colors RGB",
      "Material": "Acrylic optical fiber line (highly flexible and thin)",
      "Operating Voltage": "12V DC"
    },
    reviews: [
      { id: 1, user: "Sherif G.", rating: 5, date: "2026-05-18", comment: "Super clean installation, looks like factory ambient lighting from a 2026 model." }
    ],
    compatibility: ["Toyota-Corolla", "Toyota-Fortuner", "Toyota-C-HR", "Hyundai-Tucson", "Hyundai-Elantra", "Hyundai-Creta", "Kia-Sportage", "Kia-Cerato", "Kia-Seltos", "Mercedes-C-Class", "Mercedes-E-Class", "Mercedes-GLC", "BMW-3 Series", "BMW-5 Series", "BMW-X5"]
  },
  {
    id: "gd-lgt-ledbulbs-03",
    name: "GOLDEN Hyper-LED Headlight Bulb Kit (H7/H4/H11)",
    nameAr: "مجموعة لمبات LED هايبر من جولدن",
    brand: "GOLDEN Tuning",
    category: "lighting",
    price: 1950,
    offer: { oldPrice: 2300, discount: 15, duration: 7 },
    rating: 4.7,
    reviewsCount: 85,
    sku: "GD-LGT-H7LED",
    image: "spark_plugs.jpg",
    description: "Direct plug-and-play LED replacement bulbs for factory halogen headlights. Features an ultra-slim copper board matching original filament locations for perfect beam pattern alignment without blinding oncoming traffic.",
    descriptionAr: "لمبات LED بديلة مباشرة للمصابيح الهالوجين المصنعية. تتميز بلوحة نحاسية نحيفة للغاية تطابق مواقع الفتيل الأصلية لمحاذاة مثالية للشعاع.",
    specs: {
      "Socket Types": "Available in H7, H4, H11, HB3/9005, HB4/9006",
      "Power Output": "110W per pair",
      "Brightness": "18,000 LM per set",
      "Installation": "100% plug-and-play direct replacement",
      "Canbus Decoder": "Integrated anti-flicker and error-free chips"
    },
    reviews: [
      { id: 1, user: "Mustafa H.", rating: 4, date: "2026-04-30", comment: "Very good fit on my Corolla. The light is super white and crisp." }
    ],
    compatibility: ["Toyota-Corolla", "Toyota-Fortuner", "Toyota-C-HR", "Hyundai-Tucson", "Hyundai-Elantra", "Hyundai-Creta", "Kia-Sportage", "Kia-Cerato", "Kia-Seltos"]
  },

  // ==================== ANDROID SCREENS ====================
  {
    id: "gd-scr-octa-04",
    name: "GOLDEN Smart Android Screen 10.25\" (4GB / 64GB)",
    nameAr: "شاشة أندرويد جولدن ١٠.٢٥ بوصة (٤ جيجا / ٦٤ جيجا)",
    brand: "GOLDEN Tech",
    category: "screens",
    price: 11700,
    offer: { oldPrice: 13500, discount: 13, duration: 7 },
    rating: 4.9,
    reviewsCount: 142,
    sku: "GD-SCR-OCTA-10",
    image: "intercooler.jpg",
    description: "Unleash high-end infotainment features in your dashboard. High-resolution IPS capacitive touch screen running Android 12. Supports wireless Apple CarPlay and Android Auto. Fully integrates with original steering wheel controls, factory cameras, and radar sensors.",
    descriptionAr: "شاشة لمس IPS عالية الدقة بنظام Android 12. تدعم Apple CarPlay وAndroid Auto لاسلكياً. تتكامل تماماً مع أزرار عجلة القيادة الأصلية والكاميرات.",
    specs: {
      "Processor": "Unisoc Octa-Core 2.0GHz 64-Bit",
      "Memory": "4GB RAM + 64GB High-Speed Storage",
      "Display": "10.25-inch IPS Touch Panel (1920x720 HD)",
      "Connectivity": "Wireless CarPlay, Wireless Android Auto, Built-in 4G LTE Slot",
      "Audio DSP": "32-Band Equalizer with premium digital sound amplifier"
    },
    reviews: [
      { id: 1, user: "Youssef M.", rating: 5, date: "2026-06-02", comment: "The screen is lightning fast, and CarPlay connects automatically when I start the engine." }
    ],
    compatibility: ["Toyota-Corolla", "Toyota-Fortuner", "Hyundai-Tucson", "Hyundai-Elantra", "Kia-Sportage", "Kia-Cerato"]
  },
  {
    id: "gd-scr-tesla-05",
    name: "GOLDEN Tesla-Style Vertical Android Screen (6GB / 128GB)",
    nameAr: "شاشة أندرويد عمودية بتصميم تسلا من جولدن (٦ جيجا / ١٢٨ جيجا)",
    brand: "GOLDEN Tech",
    category: "screens",
    price: 14400,
    rating: 4.8,
    reviewsCount: 64,
    sku: "GD-SCR-TESLA-VERT",
    image: "downpipe.jpg",
    description: "The ultimate vertical display configuration. Inspired by luxury EV dashboards, this massive vertical screen replaces standard dash layouts, integrating dual-zone climate controls and complete vehicle settings directly onto the digital screen.",
    descriptionAr: "التكوين العمودي للشاشة النهائية. مستوحاة من لوحات القيادة الكهربائية الفاخرة، تدمج ضوابط مناخ ثنائية المنطقة وإعدادات السيارة الكاملة.",
    specs: {
      "Processor": "Qualcomm Snapdragon Octa-Core",
      "Memory": "6GB RAM + 128GB ROM",
      "Screen Size": "9.7-inch to 12.1-inch depending on model compatibility",
      "Climate Control": "Full digital AC dashboard integration",
      "Navigation": "Dual GPS + Glonass support"
    },
    reviews: [
      { id: 1, user: "Tarek S.", rating: 5, date: "2026-07-10", comment: "Gives a whole new look to my Tucson. The map and climate control on a huge display is awesome." }
    ],
    compatibility: ["Toyota-Corolla", "Toyota-Fortuner", "Hyundai-Tucson", "Hyundai-Elantra", "Kia-Sportage"]
  },

  // ==================== SEATS & COVERS ====================
  {
    id: "gd-sea-leather-06",
    name: "GOLDEN Custom Fit Premium Eco-Leather Seat Covers",
    nameAr: "كفرات مقاعد جلد إيكو مخصصة من جولدن",
    brand: "GOLDEN Interior",
    category: "seats",
    price: 8400,
    offer: { oldPrice: 9800, discount: 14, duration: 7 },
    rating: 4.7,
    reviewsCount: 110,
    sku: "GD-SEA-ECO-LTH",
    image: "springs.jpg",
    description: "Protect and upgrade your interior styling. Made from high-durability eco-leather that replicates the soft touch of genuine automotive leather. Airbag compatible and designed specifically for each vehicle model for a tight, original-looking fit.",
    descriptionAr: "احمي وطور تصميم مقصورتك. مصنوعة من جلد إيكو عالي المتانة يحاكي ملمس الجلد الأصلي. متوافقة مع الوسائد الهوائية ومصممة خصيصاً لكل موديل.",
    specs: {
      "Material": "Eco-Leather (Waterproof, scratch-resistant)",
      "Airbag Safe": "Yes, custom tear-away stitch panels for side airbags",
      "Package Content": "Full set (Front seats, rear seats, headrests, armrest covers)",
      "Padding": "5mm high-density foam backing for added comfort"
    },
    reviews: [
      { id: 1, user: "Maged K.", rating: 5, date: "2026-06-25", comment: "Fits perfectly. People think I had the seats reupholstered in genuine leather." }
    ],
    compatibility: ["Toyota-Corolla", "Toyota-Fortuner", "Toyota-C-HR", "Hyundai-Tucson", "Hyundai-Elantra", "Hyundai-Creta", "Kia-Sportage", "Kia-Cerato", "Kia-Seltos", "Mercedes-C-Class", "Mercedes-E-Class", "Mercedes-GLC", "BMW-3 Series", "BMW-5 Series"]
  },
  {
    id: "gd-sea-alcantara-07",
    name: "GOLDEN Alcantara Sports Steering Wheel Cover Wrap",
    nameAr: "غلاف عجلة القيادة رياضي من الألكانتارا - جولدن",
    brand: "GOLDEN Interior",
    category: "seats",
    price: 2700,
    rating: 5.0,
    reviewsCount: 58,
    sku: "GD-SEA-ALC-WRAP",
    image: "sway_bar.jpg",
    description: "Upgrade your steering feel to racetrack levels. Hand-stitched premium Alcantara wrap complete with racing top-center marker line. Offers superior grip and a luxurious matte look.",
    descriptionAr: "طور إحساسك بعجلة القيادة لمستوى مضمار السباق. غلاف ألكانتارا متميز مع خط علامة مركزي أعلى للسباقات. يوفر قبضة فائقة ومظهراً فاخراً.",
    specs: {
      "Material": "Premium Italian Alcantara wrap",
      "Top Marker": "Available in Red, Yellow, or Blue racing stripe",
      "Installation": "Requires custom hand stitching (sewing kit included)",
      "Grip Feel": "High-friction matte texture (sweat-resistant)"
    },
    reviews: [
      { id: 1, user: "Karim F.", rating: 5, date: "2026-07-02", comment: "Best upgrade for the cabin. Grip feels amazing, highly recommended." }
    ],
    compatibility: ["Toyota-Corolla", "Toyota-Fortuner", "Toyota-C-HR", "Hyundai-Tucson", "Hyundai-Elantra", "Hyundai-Creta", "Kia-Sportage", "Kia-Cerato", "Kia-Seltos", "Mercedes-C-Class", "Mercedes-E-Class", "Mercedes-GLC", "BMW-3 Series", "BMW-5 Series", "BMW-X5"]
  },

  // ==================== LUXURY FLOOR MATS ====================
  {
    id: "gd-mat-7d-08",
    name: "GOLDEN 7D Luxury Custom Fit Diamond Floor Mats",
    nameAr: "فرش سيارات 7D الفاخرة بشكل الألماس - جولدن",
    brand: "GOLDEN Interior",
    category: "floormats",
    price: 4200,
    offer: { oldPrice: 5000, discount: 16, duration: 7 },
    rating: 4.9,
    reviewsCount: 195,
    sku: "GD-MAT-7D-DLX",
    image: "brake_pads.jpg",
    description: "The gold standard in interior floor protection. 7D design offers 360-degree coverage, creeping up the side walls to prevent dirt and water from reaching original carpets. Features a dual-layer design with a removable coil mat for easy cleaning.",
    descriptionAr: "المعيار الذهبي في حماية أرضية الداخلية. التصميم 7D يوفر تغطية 360 درجة مع ارتفاع جوانب لمنع الأوساخ والماء. طبقة مزدوجة قابلة الفصل للتنظيف السهل.",
    specs: {
      "Structure": "Dual layer (Lower diamond-stitched leather mat + Upper coil wire mat)",
      "Coverage": "Deep sidewalls and full rear center hump coverage",
      "Cleaning": "Upper layer detaches in seconds for quick spray wash",
      "Safety": "Anti-slip backing and specialized locking clips to clear pedals"
    },
    reviews: [
      { id: 1, user: "Hossam B.", rating: 5, date: "2026-05-14", comment: "Fits edge to edge. The double layer makes cleaning so much easier." }
    ],
    compatibility: ["Toyota-Corolla", "Toyota-Fortuner", "Toyota-C-HR", "Hyundai-Tucson", "Hyundai-Elantra", "Hyundai-Creta", "Kia-Sportage", "Kia-Cerato", "Kia-Seltos", "Mercedes-C-Class", "Mercedes-E-Class", "Mercedes-GLC", "BMW-3 Series", "BMW-5 Series", "BMW-X5"]
  },

  // ==================== EXTERIOR STYLING ====================
  {
    id: "gd-ext-spoiler-09",
    name: "GOLDEN Performance Gloss Black Trunk Spoiler",
    nameAr: "سبويلر صندوق أسود لامع من جولدن",
    brand: "GOLDEN Exterior",
    category: "exterior",
    price: 5100,
    offer: { oldPrice: 6000, discount: 15, duration: 7 },
    rating: 4.8,
    reviewsCount: 89,
    sku: "GD-EXT-SPOILER-GB",
    image: "exhaust.jpg",
    description: "Enhance your car's profile with an aggressive racing stance. Engineered with high-strength lightweight ABS, finished in deep gloss black piano paint. Easily installs via double-sided automotive adhesive tape without drilling.",
    descriptionAr: "عزز مظهر سيارتك بمظهر سباق عدواني. مصمم من ABS خفيف الوزن عالي القوة بطلاء بيانو أسود لامع. التركيب بسهولة بشريط لاصق مزدوج الجانب بدون ثقب.",
    specs: {
      "Material": "Premium High-Impact ABS Plastic",
      "Finish": "UV-resistant Gloss Black Piano Lacquer",
      "Installation": "No-drill adhesive mounting (3M automotive tape included)",
      "Design Type": "M-Performance / Duckbill hybrid styling"
    },
    reviews: [
      { id: 1, user: "Ramy N.", rating: 5, date: "2026-06-20", comment: "Gives the rear end a much sportier look. Painted finish matches perfect." }
    ],
    compatibility: ["Toyota-Corolla", "Hyundai-Elantra", "Kia-Cerato", "Mercedes-C-Class", "Mercedes-E-Class", "BMW-3 Series", "BMW-5 Series"]
  },
  {
    id: "gd-ext-mirror-10",
    name: "GOLDEN Carbon Fiber M-Style Mirror Covers (Pair)",
    nameAr: "أغطية مرايا كربون فايبر بنمط M - جولدن",
    brand: "GOLDEN Exterior",
    category: "exterior",
    price: 3300,
    rating: 4.9,
    reviewsCount: 73,
    sku: "GD-EXT-MIRROR-CF",
    image: "intake.jpg",
    description: "Upgrade standard mirror housings to the legendary aggressive M-Style horns. Made from real 3K twill dry carbon fiber with a high-gloss clear coat layer that resists yellowing and fading.",
    descriptionAr: "حول مرايا سيارتك للتصميم العدواني الأسطوري M-Style. مصنوع من كربون فايبر 3K تويل حقيقي مع طبقة لامعة مقاومة للاصفرار.",
    specs: {
      "Material": "Real 3K Carbon Fiber weave with ABS backing clips",
      "Structure": "Direct clip-on replacement (not stick-on covers)",
      "Weave Pattern": "2x2 Twill weave pattern",
      "Weight": "Super lightweight (approx. 90g per cap)"
    },
    reviews: [
      { id: 1, user: "Khaled A.", rating: 4, date: "2026-04-14", comment: "Fits perfectly. Real carbon fiber weave is very clean and consistent." }
    ],
    compatibility: ["Mercedes-C-Class", "Mercedes-E-Class", "Mercedes-GLC", "BMW-3 Series", "BMW-5 Series", "BMW-X5"]
  }
];
