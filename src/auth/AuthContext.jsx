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
  const [lastName, setLastName] = useState(''); 


  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRoleName = localStorage.getItem('roleName');
    const storedUserId = localStorage.getItem('userId');
    const storedFirstName = localStorage.getItem('firstName'); 
    const storedLastName = localStorage.getItem('lastName'); 


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

    if (storedLastName) {
      setLastName(storedLastName); 
      console.log('Last Name:', storedLastName)
    }
  }, []);

  const login = async (email, password,logInOtp) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password,logInOtp });
      if (response.status === 200) {
        const { jwtToken, user } = response.data;
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('roleName', user.roleDto.roleName);
        localStorage.setItem('userId', user.userId);
        localStorage.setItem('firstName', user.firstName); 
        localStorage.setItem('lastName', user.lastName); 
        setIsAuthenticated(true);
        setRoleName(user.roleDto.roleName);
        setUserId(user.userId);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        console.log(user.lastName);
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
    <AuthContext.Provider value={{ isAuthenticated, roleName, userId, firstName, lastName, login, logout }}>
      {children}
    </AuthContext.Provider>

  );
};

export const useAuth = () => useContext(AuthContext);