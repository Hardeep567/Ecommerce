export interface NavItem {
  id: number;
  path: string;
  title: string;
  icon: string;
  active: boolean;
}

const navItems: NavItem[] = [
  {
    id: 1,
    path: '/',
    title: 'Dashboard',
    icon: 'mingcute:home-1-fill',
    active: true,
  },
  {
    id: 2,
    path: '/user/users',
    title: 'Users',
    icon: 'clarity:user-line',
    active: true,
  },
  {
    id: 3,
    path: '/LeaderBoard/leaderboard',
    title: 'Leaderboard',
    icon: 'material-symbols-light:leaderboard-outline',
    active: true,
  },
  {
    id: 4,
    path: '/Order/orders',
    title: 'Order',
    icon: 'ant-design:shopping-cart-outlined',
    active: true,
  },
  {
    id: 5,
    path: 'Products/products',
    title: 'Product',
    icon: 'lets-icons:bag-alt-light',
    active: true,
  },
  {
    id: 7,
    path: 'Review/reviews',
    title: 'Message',
    icon: 'bi:chat',
    active: true,
  },
  {
    id: 11,
    path: 'authentication/login',
    title: 'Login',
    icon: 'tabler:login',
    active: true,
  },
  {
    id: 12,
    path: 'authentication/sign-up',
    title: 'Sign Up',
    icon: 'tdesign:user-add',
    active: true,
  },
];

export default navItems;
