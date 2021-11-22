import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import Loader from 'react-loader-spinner'


export function AuthWrapper({ children }) {
  const {
    isLoading,
    error,
  } = useAuth0();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen" ><Loader type="ThreeDots" color="#00BFFF" height={120} width={120} /></div>;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }
  return <>{children}</>;
}
