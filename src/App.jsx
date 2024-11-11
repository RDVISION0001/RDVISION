import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

///compo//
import Sidenav from './components/sidenav';
import Topnav from './components/topnav'

//Coustomer invoice
import Coustomer from './components/Coustomer';


// pages
import Paid from './pages/Invoices/Paid'
import Pending from './pages/Invoices/Pending';
import Live from './pages/Tickets/live'
import Upticket from './pages/Tickets/upticket';
import InNegotiation from './pages/Tickets/InNegotiation';
import Products from './pages/Products';
import New_Products from './pages/New_Products';
import ActionMode from './pages/ActionMode';
import SalesReport from './pages/SalesReport';
import VerifyedSales from './pages/VerifyedSales';



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
import ToEveryone from './admin/toEveryone';


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
import Tocloser from './captain/toCloser';
import Ticketsm from './captain/ticketsm';


// closer/old name agent
import Indexa from './closer/indexa';
import Ordersa from './closer/ordersa';
import Salesa from './closer/salesa';
import Usersa from './closer/usersa';
import Ass from './closer/Ass';


// senior_supervisor 
import Indexss from './senior_supervisor/indexss';
import Uptickets from './senior_supervisor/uptickets';
import Ticketsss from './senior_supervisor/ticketsss';
import Invoicesss from './senior_supervisor/invoicesss';
import Tocaptain from './senior_supervisor/toCaptain';


// componenets css
import './components/css/themedigproX01.css';
import './components/css/themedigproX01.scss';

//common css
import './css/common.css'


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


import ViewInvoice from './components/ViewInvoice';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentFailed from './components/PaymentFailed';
import Terms_Conditions from './components/Terms_Conditions';
import Team from './senior_supervisor/Team';
import TicketHouse from './components/TicketHouse';






function App() {

  return (
    <>

      <ToastContainer />
      <AuthProvider>
        <Router>
          <div className="superadmin-page">

            {localStorage.getItem("userId") && <Sidenav />}

            <div className="my-container main-content-block2658 active-cont bg-white">

              {localStorage.getItem("userId") && <Topnav />}

              <Routes>

                {/* //costoumer  invoice*/}
                <Route exact path="/coustomer_invoice" element={<Coustomer />} />
                <Route exact path="/viewinvoice/:orderid" element={<ViewInvoice />} />
                <Route exact path="/success/:orderid" element={<PaymentSuccess />} />
                <Route exact path="/failed_payment/:orderid" element={<PaymentFailed />} />
                <Route exact path="/terms" element={<Terms_Conditions />} />


                {/* auth */}
                <Route exact path="/" element={<Login />} />
                <Route exact path="/logout" element={<Logout />} />
                <Route exact path="/forgot_password" element={<Forgetpassword />} />

                <Route element={<PrivateRoute />}>

                  {/* compo */}
                  <Route exact path="/sidenav" element={<Sidenav />} />

                  {/* pages */}
                  <Route exact path="/live_tickets" element={<Live />} />
                  <Route exact path="/upload_tickets" element={<Upticket />} />
                  <Route exact path="/invoices_pending" element={<Pending />} />
                  <Route exact path="/invoices_paid" element={<Paid />} />
                  <Route exact path="/in_negotiation" element={<InNegotiation />} />
                  <Route exact path="/in_negotiation/:date" element={<InNegotiation />} />
                  <Route exact path="/upload_products" element={<Products />} />
                  <Route exact path="/new_products" element={<New_Products />} />
                  <Route exact path="/action_mode" element={<ActionMode />} />
                  <Route exact path="/sales_report" element={<SalesReport />} />
                  <Route exact path="/verifyed_sales" element={<VerifyedSales />} />


                  {/* admin */}
                  <Route exact path="/admin_index" element={<Index />} />
                  <Route exact path="/admin_invoices" element={<Invoices />} />
                  <Route exact path="/admin_orders" element={<Orders />} />
                  <Route exact path="/admin_sales" element={<Sales />} />
                  <Route exact path="/admin_tickets" element={<Tickets />} />
                  <Route exact path="/admin_users" element={<Users />} />
                  <Route exact path="/admin_to_everyone" element={<ToEveryone />} />
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
                  <Route exact path="/captain_to_closer" element={<Tocloser />} />
                  <Route exact path="/captain_tickets" element={<Ticketsm />} />

                  {/* closer/agent */}
                  <Route exact path="/closer_index" element={<Indexa />} />
                  <Route exact path="/closer_orders" element={<Ordersa />} />
                  <Route exact path="/closer_sales" element={<Salesa />} />
                  <Route exact path="/closer_users" element={<Usersa />} />
                  <Route exact path="/after_sales_service" element={<Ass />} />


                  {/*Senior supervisor*/}
                  <Route exact path="/senior_supervisor_index" element={<Indexss />} />
                  <Route exact path="/senior_supervisor_upload_tickets" element={<Uptickets />} />
                  <Route exact path="/senior_supervisor_tickets" element={<Ticketsss />} />
                  <Route exact path="/senior_supervisor_invoices" element={<Invoicesss />} />
                  <Route exact path="/senior_supervisor_to_captain" element={<Team />} />
                  <Route exact path="/ticket_house" element={<TicketHouse />} />


                </Route>
              </Routes>
            </div>
          </div>
        </Router>
      </AuthProvider>

    </>
  );
}

export default App;
