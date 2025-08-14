import { lazy, Suspense, ReactElement, PropsWithChildren } from 'react';
import { Outlet, RouteObject, RouterProps, createBrowserRouter } from 'react-router-dom';

import PageLoader from 'components/loading/PageLoader';
import Splash from 'components/loading/Splash';
import { rootPaths } from './paths';
import paths from './paths';
import PrivateRoute from './private';




const App = lazy<() => ReactElement>(() => import('App'));

const MainLayout = lazy<({ children }: PropsWithChildren) => ReactElement>(
  () => import('layouts/main-layout'),
);
const AuthLayout = lazy<({ children }: PropsWithChildren) => ReactElement>(
  () => import('layouts/auth-layout'),
);

const Dashboard = lazy<() => ReactElement>(() => import('pages/dashboard/Dashboard'));
const Login = lazy<() => ReactElement>(() => import('pages/authentication/Login'));
const SignUp = lazy<() => ReactElement>(() => import('pages/authentication/SignUp'));
const ErrorPage = lazy<() => ReactElement>(() => import('pages/error/ErrorPage'));
const User = lazy<() => ReactElement>(() => import('pages/user/users'));
const Order = lazy<() => ReactElement>(() => import('pages/Order/orders'));
const Leaderboard = lazy<() => ReactElement>(() => import('pages/LeaderBoard/leaderboard'));
const Products = lazy<() => ReactElement>(() => import('pages/Products/products'));
const ProductUploadForm= lazy<() => ReactElement>(() => import('components/sections/Product/addProduct'));
const Reviews= lazy<() => ReactElement>(() => import('pages/Review/reviews'));

const routes: RouteObject[] = [
  {
    element: (
      <Suspense fallback={<Splash />}>
        <App />
      </Suspense>
    ),
    children: [
      {
        path: paths.home,
        element: (
          <MainLayout>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </MainLayout>
        ),
        children: [
          {
            index: true,
            element: (
            <PrivateRoute> 
              <Dashboard />
            </PrivateRoute> 
            ),
          },
          {
            path: paths.user,
            element: (
                <PrivateRoute> 
                <User />
                </PrivateRoute> 
              
            ),
          },
          {
            path: paths.order,
            element: (
                <PrivateRoute> 
                <Order />
                </PrivateRoute>
            ),
          },
          {
            path: paths.leader,
            element: (
                <PrivateRoute> 
                <Leaderboard />
                </PrivateRoute>
            ),
          },
          {
            path: paths.product,
            element: (
                <PrivateRoute> 
                <Products />
                </PrivateRoute>
              
            ),
          },
          {
            path: paths.review,
            element: (
                <PrivateRoute> 
                <Reviews />
                </PrivateRoute>
            ),
          },
        ],
      },
      {
        path: paths.addProduct, 
        element: (
          <Suspense fallback={<PageLoader />}>
            <PrivateRoute>
            <ProductUploadForm />
            </PrivateRoute>
          </Suspense>
        )
      },
      {
        path: rootPaths.authRoot,
        element: (
          <AuthLayout>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </AuthLayout>
        ),
        children: [
          {
            path: paths.login,
            element: <Login />,
          },
          {
            path: paths.signup,
            element: <SignUp />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
];

const options: { basename: string } = {
  basename: '/nickelfox',
};

const router: Partial<RouterProps> = createBrowserRouter(routes, options);

export default router;
