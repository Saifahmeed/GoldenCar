// dashboardData.js — Golden Car Stores mock sales analytics (EGP)

export const monthLabels = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
export const monthLabelsAr = ['أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو'];

export const revenueData = [
  42500, 38900, 51200, 67800, 89400, 74300,
  58600, 63200, 71500, 82100, 94700, 108300
];

export const ordersData = [
  18, 16, 22, 29, 38, 31, 25, 27, 30, 35, 41, 47
];

export const categoryData = [
  { name: 'Lighting', nameAr: 'الإضاءة', value: 38, color: '#E31E24' },
  { name: 'Screens', nameAr: 'الشاشات', value: 27, color: '#c0392b' },
  { name: 'Seats', nameAr: 'الكراسي', value: 18, color: '#922b21' },
  { name: 'Floor Mats', nameAr: 'الفرش', value: 10, color: '#641e16' },
  { name: 'Exterior', nameAr: 'الخارجي', value: 7, color: '#4a0000' },
];

export const recentOrders = [
  { id: 'GC-7841', product: 'GOLDEN Laser LED Projector Lenses', customer: 'Ahmed Mostafa', date: '2026-07-28', status: 'completed', amount: 7200 },
  { id: 'GC-7840', product: 'GOLDEN Tesla-Style Vertical Screen', customer: 'Mohamed Tarek', date: '2026-07-28', status: 'processing', amount: 14400 },
  { id: 'GC-7839', product: 'GOLDEN 7D Luxury Floor Mats', customer: 'Karim Hassan', date: '2026-07-27', status: 'completed', amount: 4200 },
  { id: 'GC-7838', product: 'GOLDEN Dynamic Ambient Lighting', customer: 'Sherif Adel', date: '2026-07-27', status: 'completed', amount: 3900 },
  { id: 'GC-7837', product: 'GOLDEN Custom Leather Seat Covers', customer: 'Hossam Badr', date: '2026-07-27', status: 'pending', amount: 8400 },
  { id: 'GC-7836', product: 'GOLDEN Carbon Fiber Mirror Covers', customer: 'Youssef Mahmoud', date: '2026-07-26', status: 'completed', amount: 3300 },
  { id: 'GC-7835', product: 'GOLDEN Smart Android Screen 10.25"', customer: 'Ramy Nasser', date: '2026-07-26', status: 'completed', amount: 11700 },
  { id: 'GC-7834', product: 'GOLDEN Hyper-LED Headlight Kit', customer: 'Khaled Farouk', date: '2026-07-25', status: 'completed', amount: 1950 },
  { id: 'GC-7833', product: 'GOLDEN Performance Trunk Spoiler', customer: 'Tarek Soliman', date: '2026-07-25', status: 'processing', amount: 5100 },
  { id: 'GC-7832', product: 'GOLDEN Alcantara Steering Wrap', customer: 'Maged Khalil', date: '2026-07-24', status: 'completed', amount: 2700 },
];

export const topProducts = [
  { name: 'GOLDEN 7D Luxury Floor Mats', nameAr: 'فرش 7D الفاخرة', sold: 195, revenue: 819000, trend: 'up' },
  { name: 'GOLDEN Smart Android Screen 10.25"', nameAr: 'شاشة أندرويد ١٠.٢٥ بوصة', sold: 142, revenue: 1107600, trend: 'up' },
  { name: 'GOLDEN Laser LED Projector Lenses', nameAr: 'عدسات ليزر LED', sold: 124, revenue: 892800, trend: 'up' },
  { name: 'GOLDEN Custom Leather Seat Covers', nameAr: 'كفرات جلد مخصصة', sold: 110, revenue: 924000, trend: 'stable' },
  { name: 'GOLDEN Dynamic Ambient Lighting', nameAr: 'إضاءة محيطية ديناميكية', sold: 96, revenue: 374400, trend: 'up' },
];

export const kpiData = {
  totalRevenue: 842500,
  ordersToday: 8,
  itemsSold: 1247,
  customers: 934,
  revenueGrowth: '+18%',
  ordersGrowth: '+5',
  soldGrowth: '+23',
  customersGrowth: '+12%',
};

// Seed localStorage with orders if not present
export function seedDashboardData() {
  if (!localStorage.getItem('gc_orders_seeded')) {
    localStorage.setItem('gc_orders', JSON.stringify(recentOrders));
    localStorage.setItem('gc_orders_seeded', '1');
  }
}

export function formatEGP(amount) {
  return `${amount.toLocaleString('ar-EG')} ج.م`;
}

export function formatEGPEn(amount) {
  return `EGP ${amount.toLocaleString()}`;
}
