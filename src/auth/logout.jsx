import React from 'react';
import { useAuth } from '../auth/AuthContext'; 
const logout = () => {
  const { logout } = useAuth();

  return (
    <a onClick={logout}>
      Log Out
    </a>
  );
};


export default logout