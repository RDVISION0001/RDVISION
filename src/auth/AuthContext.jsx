import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState(''); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRoleName = localStorage.getItem('roleName');
    const storedUserId = localStorage.getItem('userId');
    const storedFirstName = localStorage.getItem('firstName'); 

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

    if (storedFirstName) {
      setFirstName(storedFirstName); 
      console.log('First Name:', storedFirstName);
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
        localStorage.setItem('firstName', user.firstName); 
        setIsAuthenticated(true);
        setRoleName(user.roleDto.roleName);
        setUserId(user.userId);
        setFirstName(user.firstName);
        console.log(firstName);
        toast.success('Login successfully!');
        return true;
      } else {
        toast.error('Login failed');
        return false;
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Invalid email or password');
      navigate('/');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('roleName');
    localStorage.removeItem('userId');
    localStorage.removeItem('firstName'); 
    setIsAuthenticated(false);
    setRoleName('');
    setUserId('');
    setFirstName(''); 
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, roleName, userId, firstName, login, logout }}>
      {children}
    </AuthContext.Provider>

  );
};

export const useAuth = () => useContext(AuthContext);