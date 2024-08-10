import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

///compo//
import Sidenav from '../src/Components/Sidenav';



// auth
import './auth/login.css';
import Login from './auth/login';
import Logout from './auth/logout';
import { AuthProvider } from './auth/AuthContext';
import PrivateRoute from './PrivateRoute';
import Forgetpassword from './auth/forgotpassword';


// Admin
import Index from './Admin/index';
import Invoices from './Admin/invoices';
import Orders from './Admin/orders';
import Sales from './Admin/sales';
import Tickets from './Admin/tickets';
import Users from './Admin/users';
import Upload_tickets from './Admin/upload_tickets';
import ToEveryone from './Admin/toEveryone';
import Upload_products from './Admin/upload_products'


// super_Admin
import Indexs from './Super_admin/indexs';
import Invoicess from './Super_admin/invoicess';
import Orderss from './Super_admin/orderss';
import Saless from './Super_admin/saless';
import Ticketss from './Super_admin/ticketss';
import Userss from './Super_admin/userss';

// captain/old name manager
import Indexm from './Captain/indexm';
import Invoicesm from './Captain/invoicesm';
import Ordersm from './Captain/ordersm';
import Salesm from './Captain/salesm';
import ToCloser from './Captain/toCloser';
import Ticketsm from './Captain/ticketsm';


// Closer/old name agent
import Indexa from './Closer/indexa';
import Upticket from './Closer/upticket';
import Invoicesa from './Closer/invoicesa';
import Ordersa from './Closer/ordersa';
import Salesa from './Closer/salesa';
import Ticketsa from './Closer/ticketsa';
import Usersa from './Closer/usersa';

// Senior_supervisor 
import Indexss from './Senior_supervisor/indexss';
import Ticketsss from './Senior_supervisor/ticketsss';
import Invoicesss from './Senior_supervisor/invoicesss';
import ToCaptain from './Senior_supervisor/toCaptain';


// componenets css
import './Components/css/themedigproX01.css';
import './Components/css/themedigproX01.scss';


// css/////////////////
import './Admin/css/admin.css';
import './Admin/css/admin.scss';

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
            <Route exact path="/forgot_password" element={<Forgetpassword />} />

            <Route element={<PrivateRoute />}>


              {/* compo */}
              <Route exact path="/sidenav" element={<Sidenav />} />

              {/* Admin */}
              <Route exact path="/admin_index" element={<Index />} />
              <Route exact path="/admin_invoices" element={<Invoices />} />
              <Route exact path="/admin_orders" element={<Orders />} />
              <Route exact path="/admin_sales" element={<Sales />} />
              <Route exact path="/admin_tickets" element={<Tickets />} />
              <Route exact path="/admin_users" element={<Users />} />
              <Route exact path="/admin_to_everyone" element={<ToEveryone />} />
              <Route exact path="/admin_upload_tickets" element={<Upload_tickets />} />
              <Route exact path="/admin_upload_products" element={<Upload_products />} />


              {/* super_Admin */}
              <Route exact path="/super_admin_index" element={<Indexs />} />
              <Route exact path="/super_admin_invoices" element={<Invoicess />} />
              <Route exact path="/super_admin_orders" element={<Orderss />} />
              <Route exact path="/super_admin_sales" element={<Saless />} />
              <Route exact path="/super_admin_tickets" element={<Ticketss />} />
              <Route exact path="/super_admin_users" element={<Userss />} />

              {/* caption manager*/}
              <Route exact path="/captain_index" element={<Indexm />} />
              <Route exact path="/captain_invoices" element={<Invoicesm />} />
              <Route exact path="/captain_orders" element={<Ordersm />} />
              <Route exact path="/captain_sales" element={<Salesm />} />
              <Route exact path="/captain_to_closer" element={<ToCloser />} />
              <Route exact path="/captain_tickets" element={<Ticketsm />} />


              {/* Closer/agent */}
              <Route exact path="/closer_index" element={<Indexa />} />
              <Route exact path="/closer_upload_tickets" element={<Upticket />} />
              <Route exact path="/closer_invoices" element={<Invoicesa />} />
              <Route exact path="/closer_orders" element={<Ordersa />} />
              <Route exact path="/closer_sales" element={<Salesa />} />
              <Route exact path="/closer_tickets" element={<Ticketsa />} />
              <Route exact path="/closer_users" element={<Usersa />} />

              {/*Senior supervisor*/}
              <Route exact path="/senior_supervisor_index" element={<Indexss />} />
              <Route exact path="/senior_supervisor_tickets" element={<Ticketsss />} />
              <Route exact path="/senior_supervisor_invoices" element={<Invoicesss />} />
              <Route exact path="/senior_supervisor_to_captain" element={<ToCaptain />} />

            </Route>
          </Routes>
        </Router>
      </AuthProvider>

    </>
  );
}

export default App;
