import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

///compo//
import Sidenav from './components/sidenav';

// auth
import './auth/login.css';
import Login from './auth/login';
import Logout from './auth/logout';
import { AuthProvider } from './auth/AuthContext';
import PrivateRoute from './PrivateRoute';
import axiosInstance from './axiosInstance'; // Use the custom Axios instance


// admin
import Index from './admin/index';
import Invoices from './admin/invoices';
import Orders from './admin/orders';
import Sales from './admin/sales';
import Tickets from './admin/tickets';
import Users from './admin/users';

// super_admin
import Indexs from './super_admin/indexs';
import Invoicess from './super_admin/invoicess';
import Orderss from './super_admin/orderss';
import Saless from './super_admin/saless';
import Ticketss from './super_admin/ticketss';
import Userss from './super_admin/userss';

// manager
import Indexm from './manager/indexm';
import Invoicesm from './manager/invoicesm';
import Ordersm from './manager/ordersm';
import Salesm from './manager/salesm';
import Ticketsm from './manager/ticketsm';
import Usersm from './manager/usersm';

// agent
import Indexa from './agent/indexa';
import Invoicesa from './agent/invoicesa';
import Ordersa from './agent/ordersa';
import Salesa from './agent/salesa';
import Ticketsa from './agent/ticketsa';
import Usersa from './agent/usersa';

// componenets css
import './components/css/themedigproX01.css';
import './components/css/themedigproX01.scss';


// css/////////////////
import './admin/css/admin.css';
import './admin/css/admin.scss';

import './css/Sidebar/sidebar.css';
import './css/Sidebar/sidebar.scss';

import './css/Agent/dashAgent.css';
import './css/Agent/dashAgent.scss';

import './css/dashboard/dashboard.css';
import './css/dashboard/dashboard.scss';

import './css/generalcss/global.css';
import './css/generalcss/global.scss';

import './css/superadmin/superadmin.css';

import './css/superadmin/users.css';
import './css/superadmin/users.scss';

import './css/superadmin/order.css';
import './css/superadmin/order.scss';

import './css/home.css';
import './css/home.scss';


import '@fortawesome/fontawesome-free/css/all.css';
import 'bootstrap/dist/css/bootstrap.min.css';




function App() {

  return (
    <>
      <ToastContainer />
      <AuthProvider>
        <Router>
          <Routes>

            {/* auth */}
            <Route exact path="/" element={<Login />} />
            <Route exact path="/logout" element={<Logout />} />



            {/* compo */}
            <Route exact path="/sidenav" element={<Sidenav />} />

            {/* <Route element={<PrivateRoute />}> */}


            {/* admin */}
            <Route exact path="/admin_index" element={<Index />} />
            <Route exact path="/admin_invoices" element={<Invoices />} />
            <Route exact path="/admin_orders" element={<Orders />} />
            <Route exact path="/admin_sales" element={<Sales />} />
            <Route exact path="/admin_tickets" element={<Tickets />} />
            <Route exact path="/admin_users" element={<Users />} />


            {/* super_admin */}
            <Route exact path="/super_admin_index" element={<Indexs />} />
            <Route exact path="/super_admin_invoices" element={<Invoicess />} />
            <Route exact path="/super_admin_orders" element={<Orderss />} />
            <Route exact path="/super_admin_sales" element={<Saless />} />
            <Route exact path="/super_admin_tickets" element={<Ticketss />} />
            <Route exact path="/super_admin_users" element={<Userss />} />

            {/* agent */}
            <Route exact path="/agent_index" element={<Indexa />} />
            <Route exact path="/agent_invoices" element={<Invoicesa />} />
            <Route exact path="/agent_orders" element={<Ordersa />} />
            <Route exact path="/agent_sales" element={<Salesa />} />
            <Route exact path="/agent_tickets" element={<Ticketsa />} />
            <Route exact path="/agent_users" element={<Usersa />} />

            {/* manager */}
            <Route exact path="/manager_index" element={<Indexm />} />
            <Route exact path="/manager_invoices" element={<Invoicesm />} />
            <Route exact path="/manager_orders" element={<Ordersm />} />
            <Route exact path="/manager_sales" element={<Salesm />} />
            <Route exact path="/manager_tickets" element={<Ticketsm />} />
            <Route exact path="/manager_users" element={<Usersm />} />

            {/* </Route> */}
          </Routes>
        </Router>
      </AuthProvider>

    </>
  );
}

export default App;
