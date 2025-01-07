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
  const [attendanceId, setAttendanceId] = useState('');
  const [followupState, setFolowupUpdate] = useState("null")
  const [noOfNweticketsRecevied, setNoOfnewticketsReceived] = useState(0)
  const [userReportReloader, setUserReportReloader] = useState(0)
  const [isSideBarOpen, setIsSideBarOpen] = useState(true)
  const [edit, setEdit] = useState(false); // Track which field is being edited


  const [takingBreak, setTakingBreak] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRoleName = localStorage.getItem('roleName');
    const storedUserId = localStorage.getItem('userId');
    const storedFirstName = localStorage.getItem('firstName');
    const storedLastName = localStorage.getItem('lastName');
    const storedAttendanceId = localStorage.getItem('attendanceId');



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

    if (storedAttendanceId) {
      setAttendanceId(storedAttendanceId);
      console.log('Attendance Id:', storedAttendanceId)
    }
  }, []);

  const login = async (email, password, logInOtp) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password, logInOtp });
      if (response.status === 200) {
        const { jwtToken, user, attendanceId } = response.data;
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('roleName', user.roleDto.roleName);
        localStorage.setItem('userId', user.userId);
        localStorage.setItem('firstName', user.firstName);
        localStorage.setItem('lastName', user.lastName);
        localStorage.setItem('attendanceId', attendanceId);
        localStorage.setItem("loginTime", new Date().getTime())
        localStorage.setItem("imageData", user.imageData)


        setIsAuthenticated(true);
        setRoleName(user.roleDto.roleName);
        setUserId(user.userId);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        console.log(user.lastName);
        toast.success('Login successfully!');
        return user.roleDto.roleName;
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
    localStorage.removeItem('workTime');
    localStorage.removeItem('breakTime');
    localStorage.removeItem('token');
    localStorage.removeItem('roleName');
    localStorage.removeItem('userId');
    localStorage.removeItem('firstName');
    localStorage.removeItem('attendanceId');
    localStorage.removeItem('loginTime');
    setIsAuthenticated(false);
    setRoleName('');
    setUserId('');
    setFirstName('');
    setAttendanceId('');
    window.location.reload()
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, roleName, userId, firstName, lastName, attendanceId, takingBreak, setTakingBreak, login, logout, followupState, setFolowupUpdate, noOfNweticketsRecevied, setNoOfnewticketsReceived, userReportReloader, setUserReportReloader, isSideBarOpen, setIsSideBarOpen,edit, setEdit }}>
      {children}
    </AuthContext.Provider>

  );
};

export const useAuth = () => useContext(AuthContext);