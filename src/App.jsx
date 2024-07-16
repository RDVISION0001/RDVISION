import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

///compo//
import Sidenav from './components/sidenav';

// careers
import Jobpost from './careers/jobpost';

// auth
import './auth/login.css';
import Login from './auth/login';
import Logout from './auth/logout';
import { AuthProvider } from './auth/AuthContext';
import PrivateRoute from './PrivateRoute';
import axiosInstance from './axiosInstance'; 


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

// captain/manager
import Indexm from './captain/indexm';
import Invoicesm from './captain/invoicesm';
import Ordersm from './captain/ordersm';
import Salesm from './captain/salesm';
import Ticketsm from './captain/ticketsm';
import Team from './captain/team';

// agent
import Indexa from './closer/indexa';
import Invoicesa from './closer/invoicesa';
import Ordersa from './closer/ordersa';
import Salesa from './closer/salesa';
import Ticketsa from './closer/ticketsa';
import Usersa from './closer/usersa';

// componenets css
import './components/css/themedigproX01.css';
import './components/css/themedigproX01.scss';

// careers
import './careers/jobpost.css'

// css/////////////////
import './admin/css/admin.css';
import './admin/css/admin.scss';

import './css/Sidebar/sidebar.css';
import './css/Sidebar/sidebar.scss';

import './css/closer/dashAgent.css';
import './css/closer/dashAgent.scss';

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

            {/* careers */}
            <Route exact path="/careers_jobpost" element={<Jobpost />} />


            <Route element={<PrivateRoute />}>


              {/* compo */}
              <Route exact path="/sidenav" element={<Sidenav />} />

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
              <Route exact path="/closer_index" element={<Indexa />} />
              <Route exact path="/closer_invoices" element={<Invoicesa />} />
              <Route exact path="/closer_orders" element={<Ordersa />} />
              <Route exact path="/closer_sales" element={<Salesa />} />
              <Route exact path="/closer_tickets" element={<Ticketsa />} />
              <Route exact path="/closer_users" element={<Usersa />} />

              {/*captain /manager */}
              <Route exact path="/captain_index" element={<Indexm />} />
              <Route exact path="/captain_invoices" element={<Invoicesm />} />
              <Route exact path="/captain_orders" element={<Ordersm />} />
              <Route exact path="/captain_sales" element={<Salesm />} />
              <Route exact path="/captain_tickets" element={<Ticketsm />} />
              <Route exact path="/captain_team" element={<Team />} />

            </Route>
          </Routes>
        </Router>
      </AuthProvider>

    </>
  );
}

export default App;
