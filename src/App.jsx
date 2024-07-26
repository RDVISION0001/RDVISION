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
import Forgetpassword from './auth/forgotpassword';




// admin
import Index from './admin/index';
import Invoices from './admin/invoices';
import Orders from './admin/orders';
import Sales from './admin/sales';
import Tickets from './admin/tickets';
import Users from './admin/users';
import Upload_tickets from './admin/upload_tickets';


// super_admin
import Indexs from './super_admin/indexs';
import Invoicess from './super_admin/invoicess';
import Orderss from './super_admin/orderss';
import Saless from './super_admin/saless';
import Ticketss from './super_admin/ticketss';
import Userss from './super_admin/userss';

// captain/old name manager
import Indexm from './captain/indexm';
import Invoicesm from './captain/invoicesm';
import Ordersm from './captain/ordersm';
import Salesm from './captain/salesm';
import ToCloser from './captain/toCloser';
import Ticketsm from './captain/ticketsm';


// closer/old name agent
import Indexa from './closer/indexa';
import Invoicesa from './closer/invoicesa';
import Ordersa from './closer/ordersa';
import Salesa from './closer/salesa';
import Ticketsa from './closer/ticketsa';
import Usersa from './closer/usersa';

// senior_supervisor 
import Indexss from './senior_supervisor/indexss';
import Ticketsss from './senior_supervisor/ticketsss';
import Invoicesss from './senior_supervisor/invoicesss';
import ToCaptain from './senior_supervisor/toCaptain';



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
            <Route exact path="/forgot_password" element={<Forgetpassword />} />



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
              <Route exact path="/admin_upload_tickets" element={<Upload_tickets />} />

              {/* super_admin */}
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


              {/* closer/agent */}
              <Route exact path="/closer_index" element={<Indexa />} />
              <Route exact path="/closer_invoices" element={<Invoicesa />} />
              <Route exact path="/closer_orders" element={<Ordersa />} />
              <Route exact path="/closer_sales" element={<Salesa />} />
              <Route exact path="/closer_tickets" element={<Ticketsa />} />
              <Route exact path="/closer_users" element={<Usersa />} />

              {/*senior supervisor*/}
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
