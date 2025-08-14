export const rootPaths = {
  homeRoot: '/',
  authRoot: 'authentication',
  errorRoot: 'error',
  userRoot: 'user',
  orderRoot: 'Order',
  leaderRoot: 'LeaderBoard',
  products: 'Products',
  addProduct: 'Product',
  review: 'Review'
};

export default {
  home: `/${rootPaths.homeRoot}`,
  login: `/${rootPaths.authRoot}/login`,
  signup: `/${rootPaths.authRoot}/sign-up`,
  404: `/${rootPaths.errorRoot}/404`,
  user: `/${rootPaths.userRoot}/users`,
  order: `/${rootPaths.orderRoot}/orders`,
  leader: `/${rootPaths.leaderRoot}/leaderboard`,
  product: `/${rootPaths.products}/products`,
  addProduct:  `/${rootPaths.addProduct}/addProduct`,
  review: `/${rootPaths.review}/reviews` 
};
