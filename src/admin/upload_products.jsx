import React, { useState, useEffect } from 'react';
import Topnav from '../components/topnav';
import Sidenav from '../components/sidenav';
import { Modal, Button } from "react-bootstrap";
import axiosInstance from '../axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function upload_products() {

  const [activeTab, setActiveTab] = useState("allTickets");
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  //loader
  const [loading,setLoading]=useState(false)
  const [dataToSave, setDataToSave] = useState({
    csvStringData: ""
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleRowClick = (tabName) => {
    setActiveTab(tabName);
    setCurrentPage(0);
    fetchTickets(params[tabName], 0);
  };
  const handleSelectTeam = (e) => {
    setSelectedTeam(e.target.value);
  };
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      fetchTickets(params[activeTab], currentPage - 1);
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      fetchTickets(params[activeTab], currentPage + 1);
    }
  };
  useEffect(()=>{
fetchProducts()
  },[])

  //fetching products 
  const fetchProducts=async ()=>{
    const response=await axiosInstance.get("product/getAllProducts")
    console.log(response.data)
  }
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;
      console.log(text)
      setDataToSave(prevState => ({
        ...prevState,
        csvStringData: text
      }));
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      toast.error("Failed to read the file.");
    };

    if (file) {
      reader.readAsText(file);
    } else {
      toast.error("No file selected.");
    }
  };

  //Handle upload CSV Data To Database
  const handleUploadDataToDB = async () => {
  try{
    if(dataToSave.csvStringData.length>0){
        setLoading(true)
        const response = await axiosInstance.post("product/uploadproductscsv", dataToSave)
        console.log("Response is ",response.data)
       if(response.data==="CSV products uploaded successfully"){
        toast.info("Succesfully uploaded")
        setLoading(false)
       }else{
        toast.error("Somthing went wrong Try Agaijn !")
        setLoading(false)
       }
      }else{
        toast.info("Please Check if file selected ")
      }
  }catch(err){
    console.log("ERROR IS ",err)
  }
   
  }
  return (
    <>
      <div className="admin-page tickets-page">
        <Sidenav />
        <div className="my-container main-content-block2658 active-cont">
          <Topnav />
          <div className="container-fluid mt-3">
            <section className="data-table-bgs_02x24 py-3">
              <div className="container-fluid">
                <div className="table-wrapper tabbed-table">
                  <div className="heading-wrapper">
                    <h3 className="title">Upload Products File</h3>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <input
                      type="file"
                      accept=".csv"
                      className="form-control mr-3"
                      id="customFile"
                      onChange={handleFileUpload}
                    />
                  
                    {loading?<div className='w-25 btn ml-3 rounded'><div className='loader '></div></div>:<button
                      className="btn btn-primary ml-3 rounded"
                      style={{ flex: '0 0 25%' }}
                      onClick={handleUploadDataToDB}
                    >
                      Upload Products
                    </button>}
                  </div>

                </div>
              </div>
            </section>
            <section className="filter-section">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-5">
                    <div className="search-wrapper">
                      <input type="text" name="search-user" id="searchUsers" className="form-control" placeholder="Search Department or Name..." />
                      <div className="search-icon">
                        <i className="fa-solid fa-magnifying-glass"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="data-table-bgs_02x24 py-3">
              <div className="container-fluid">
                <div className="table-wrapper tabbed-table">
                  <div className="heading-wrapper">
                    <h3 className="title">All Tickets</h3>
                    <Button onClick={handleShow} className="btn btn-assign" data-bs-toggle="modal" data-bs-target="#assignTicketModal">Hii</Button>
                  </div>
                  <ul className="nav recent-transactions-tab-header nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button className={`nav-link ${activeTab === "allTickets" ? "active" : ""}`}
                        onClick={() => handleRowClick("allTickets")} id="all-transactions-tab" data-bs-toggle="tab" data-bs-target="#all-transactions-tab-pane" type="button" role="tab" aria-controls="all-transactions-tab-pane" aria-selected="true">All Tickets</button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button className={`nav-link ${activeTab === "ongoing" ? "active" : ""}`}
                        onClick={() => handleRowClick("ongoing")} id="pendings-tab" data-bs-toggle="tab" data-bs-target="#pendings-tab-pane" type="button" role="tab" aria-controls="pendings-tab-pane" aria-selected="false" tabIndex="-1">Ongoing</button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button className={`nav-link ${activeTab === "newTickets" ? "active" : ""}`}
                        onClick={() => handleRowClick("newTickets")} id="new-arrivals-tab" data-bs-toggle="tab" data-bs-target="#new-arrivals-tab-pane" type="button" role="tab" aria-controls="new-arrivals-tab-pane" aria-selected="false" tabIndex="-1">New Tickets</button>
                    </li>
                  </ul>
                  <div className="tab-content recent-transactions-tab-body" id="myTabContent">
                    <div className="tab-pane fade show active" id="all-transactions-tab-pane" role="tabpanel" aria-labelledby="all-transactions-tab" tabIndex="0">
                      <div className="tickets-table table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th className="selection-cell-header" data-row-selection="true">
                                <input type="checkbox" className="" />
                              </th>
                              <th tabIndex="0">Product Name</th>
                              <th tabIndex="0">image</th>
                              <th tabIndex="0">composition</th>
                              <th tabIndex="0">brand</th>
                              <th tabIndex="0">treatment</th>
                              <th tabIndex="0">packagingSize</th>
                              <th tabIndex="0">form</th>
                              <th tabIndex="0">Pills Quantity</th>
                              <th tabIndex="0">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.map((data,index)=>(
                              <tr>
                              <td className="selection-cell">
                                <input type="checkbox" />
                              </td>
                              <td>{data.firstName+" "+data.lastName}</td>
                              <td>{data.senderCountryIso}</td>
                              <td>{data.mobileNumber}</td>
                              <td>{data.senderAddress}</td>
                              <td>{data.productEnquiry}</td>
                              <td>{data.email}</td>
                              <td>{data.email}</td>
                              <td>{data.email}</td>
                            </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
export default upload_products;
