import React from 'react'
import { useAuth } from './AuthContext';


function logout() {
  const { logout } = useAuth();
  localStorage.removeItem('token');
  setIsAuthenticated(false);

  return (
    <>
      <h1>sign_out</h1>
      <button onClick={logout}>Logout</button>
    </>
  )
}

export default logout