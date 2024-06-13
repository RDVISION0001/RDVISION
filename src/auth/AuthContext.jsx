import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [userId, setUserId] = useState(''); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRoleName = localStorage.getItem('roleName');
    const storedUserId = localStorage.getItem('userId'); 

    if (token) {
      setIsAuthenticated(true);
    }

    if (storedRoleName) {
      setRoleName(storedRoleName);
      console.log('Role Name:', storedRoleName);
    }

    if (storedUserId) {
      setUserId(storedUserId); 
      console.log('User Id:', storedUserId);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      if (response.status === 200) {
        const { jwtToken, user } = response.data;
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('roleName', user.roleDto.roleName);
        localStorage.setItem('userId', user.userId); 
        setIsAuthenticated(true);
        setRoleName(user.roleDto.roleName);
        setUserId(user.userId); 
        console.log(userId);
        toast.success('Login successfully!');
        return true;
      } else {
        toast.error('Login failed');
        return false;
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('An error occurred during login');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('roleName');
    localStorage.removeItem('userId'); 
    setIsAuthenticated(false);
    setRoleName('');
    setUserId(''); 
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, roleName, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
