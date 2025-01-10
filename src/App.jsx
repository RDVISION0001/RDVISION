import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

///compo//
import Sidenav from './components/sidenav';
import Topnav from './components/topnav';
import PaymentWindow from './components/PaymentWindow';
import SaleConframtion from './components/SaleConframtion';
import CloserSalesReport from './components/CloserSalesReport';

//Coustomer invoice
import Coustomer from './components/Coustomer';


// pages
import Live from './pages/Tickets/live'
import Upticket from './pages/Tickets/upticket';
import InNegotiation from './pages/Tickets/InNegotiation';
import Products from './pages/Products';
import New_Products from './pages/New_Products';
import ActionMode from './pages/ActionMode';
import SalesReport from './pages/SalesReport';
import VerifyedSales from './pages/VerifyedSales';
import InvoiceNewTemp from './pages/InvoiceNewTemp';
import MIS_Product from './pages/MIS_Product';
import ImgUpload from './pages/ImgUpload';


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
import AssignTktReport from './components/AssignTktReport';

// inventory management
import Indexi from './inventory/Indexi';

// componenets css
import './components/css/themedigproX01.css';
import './components/css/themedigproX01.scss';

//common css
import './css/common.css'


// css/////////////////
import './admin/css/admin.css';
import './admin/css/admin.scss';

import './css/Sidebar/sidebar.css';

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
import TicketTrack from './components/TicketTrack';
import TicketDistribution from './components/TicketDistribution';
import NotificationContainer from './components/NotificationContainer';
import { useSelector } from 'react-redux';
import EmailView from './components/EmailView';




function App() {
  const [isTicketTrackOn,setIsTicketTrackOn] = useState(false)
  const {theme} = useSelector((state)=>state.Theme)
  
  


  return (
    <div className={`${theme ?"bg-dark":"bg-white"}`} style={{height:'100vh'}} >      
          <div className='d-flex justify-content-end'>
        <NotificationContainer /> {/* This will handle WebSocket notifications */}
        {/* Other app content */}
      </div>
      <ToastContainer />
      <AuthProvider>
        <Router>
          <div className="superadmin-page">            
            {localStorage.getItem("userId") && localStorage.getItem("roleName") !== "Inventory" && <Sidenav />}
            <div className={`${localStorage.getItem("roleName")==="Inventory"?"":"my-container main-content-block2658 active-cont bg-white"}`}>
              {localStorage.getItem("userId") && localStorage.getItem("roleName") !== "Inventory" && <Topnav />}
              <div className={`d-flex  ${theme ?"bg-dark":"bg-white"}`}>
                <div>
                  {localStorage.getItem("roleName") !== "Admin" &&  localStorage.getItem("roleName")!=="Inventory" && <div className={`${theme ? 'text-white':'text-dark'}`} onClick={() => setIsTicketTrackOn((prev) => !prev)}>{isTicketTrackOn ? <i class="fa-regular fa-rectangle-xmark"></i> : <i class="fa-solid fa-book-open-reader"></i>}</div>}
                  <div className={`d-flex ${theme ?"bg-dark":"bg-white"} `}>
                    {isTicketTrackOn ? localStorage.getItem("roleName") !== "Admin" && <div className='d-none d-md-block '>
                      {localStorage.getItem("userId") && <TicketTrack />}
                    </div> : ""}
                  </div>
                </div>
                <div className="w-100 overflow-auto">
                  {localStorage.getItem("roleName") !== "Admin" &&
                    <div>
                      {localStorage.getItem("userId") && localStorage.getItem("roleName") !== "Inventory" && <TicketDistribution />}
                    </div>}
                  <Routes>
                    {/* Customer Invoice */}
                    <Route exact path="/coustomer_invoice" element={<Coustomer />} />
                    <Route exact path="/viewinvoice/:orderid" element={<ViewInvoice />} />
                    <Route exact path="/success/:orderid" element={<PaymentSuccess />} />
                    <Route exact path="/failed_payment/:orderid" element={<PaymentFailed />} />
                    <Route exact path="/terms" element={<Terms_Conditions />} />

                    {/* Authentication */}
                    <Route exact path="/" element={<Login />} />
                    <Route exact path="/logout" element={<Logout />} />
                    <Route exact path="/forgot_password" element={<Forgetpassword />} />
                    <Route exact path="/payment_window" element={<PaymentWindow />} />
                    {/* Private Routes */}
                    <Route element={<PrivateRoute />}>
                      {/* Components */}
                      <Route exact path="/sidenav" element={<Sidenav />} />
                      <Route exact path="/sale_conframtion" element={<SaleConframtion />} />

                      {/* Pages */}
                      <Route exact path="/live_tickets" element={<Live />} />
                      <Route exact path="/upload_tickets" element={<Upticket />} />
                      <Route exact path="/in_negotiation" element={<InNegotiation />} />
                      <Route exact path="/in_negotiation/:date" element={<InNegotiation />} />
                      <Route exact path="/upload_products" element={<Products />} />
                      <Route exact path="/new_products" element={<New_Products />} />
                      <Route exact path="/action_mode" element={<ActionMode />} />
                      <Route exact path="/sales_report" element={<SalesReport />} />
                      <Route exact path="/Verified_sales" element={<VerifyedSales />} />
                      <Route exact path="/invoice" element={<InvoiceNewTemp />} />
                      <Route exact path="/mis_product" element={<MIS_Product />} />
                      <Route exact path="/image_upload" element={<ImgUpload />} />


                      {/* Admin */}
                      <Route exact path="/admin_index" element={<Index />} />
                      <Route exact path="/admin_invoices" element={<Invoices />} />
                      <Route exact path="/admin_orders" element={<Orders />} />
                      <Route exact path="/admin_sales" element={<Sales />} />
                      <Route exact path="/admin_tickets" element={<Tickets />} />
                      <Route exact path="/admin_users" element={<Users />} />
                      <Route exact path="/admin_to_everyone" element={<ToEveryone />} />
                      <Route exact path="/admin_upload_tickets" element={<Upload_tickets />} />

                      {/* Super Admin */}
                      <Route exact path="/super_admin_index" element={<Indexs />} />
                      <Route exact path="/super_admin_invoices" element={<Invoicess />} />
                      <Route exact path="/super_admin_orders" element={<Orderss />} />
                      <Route exact path="/super_admin_sales" element={<Saless />} />
                      <Route exact path="/super_admin_tickets" element={<Ticketss />} />
                      <Route exact path="/super_admin_users" element={<Userss />} />

                      {/* Captain Manager */}
                      <Route exact path="/captain_index" element={<Indexm />} />
                      <Route exact path="/captain_invoices" element={<Invoicesm />} />
                      <Route exact path="/captain_orders" element={<Ordersm />} />
                      <Route exact path="/captain_sales" element={<Salesm />} />
                      <Route exact path="/captain_to_closer" element={<Tocloser />} />
                      <Route exact path="/captain_tickets" element={<Ticketsm />} />

                      {/* Closer/Agent */}
                      <Route exact path="/closer_index" element={<Indexa />} />
                      <Route exact path="/closer_orders" element={<Ordersa />} />
                      <Route exact path="/closer_sales" element={<Salesa />} />
                      <Route exact path="/closer_users" element={<Usersa />} />
                      <Route exact path="/after_sales_service" element={<Ass />} />
                      <Route exact path="/closer_sales_report" element={<CloserSalesReport />} />


                      {/* Senior Supervisor */}
                      <Route exact path="/senior_supervisor_index" element={<Indexss />} />
                      <Route exact path="/senior_supervisor_upload_tickets" element={<Uptickets />} />
                      <Route exact path="/senior_supervisor_tickets" element={<Ticketsss />} />
                      <Route exact path="/senior_supervisor_invoices" element={<Invoicesss />} />
                      <Route exact path="/senior_supervisor_to_captain" element={<Team />} />
                      <Route exact path="/ticket_house" element={<TicketHouse />} />
                      <Route exact path="/assign_ticket_report" element={<AssignTktReport />} />

                      {/* inventory  management*/}
                      <Route exact path="/index" element={<Indexi />} />
                      <Route exact path="/email" element={<EmailView />} />


                    </Route>
                  </Routes>
                </div>

              </div>
            </div>
          </div>
        </Router>
      </AuthProvider>
     

    </div>
  );
}

export default App;
