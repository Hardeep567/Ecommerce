import { ReactElement, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import paths from './paths';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // ✅ CORRECT


type Props = {
  children: ReactElement;
};

const PrivateRoute = ({ children }: Props): ReactElement => {
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      return;
    }

    const verifyToken = async () => {
      if (token) {
      const decoded = jwtDecode<{ id: number; role: string }>(token);
      console.log('User Role:', decoded.role);

      if (decoded.role === 'admin') {
        setIsValidToken(true);
      } else {
        setIsValidToken(false);
      }
    };
  }

    verifyToken();
  }, []);

  if (isValidToken === false) {
    return <Navigate to={paths.login} replace />;
  }

  if (isValidToken === null) {
    return <div>Loading...</div>; 
  }

  return children;
};

export default PrivateRoute;
