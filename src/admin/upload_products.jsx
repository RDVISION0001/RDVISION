import React, { useState, useEffect } from 'react';
import Topnav from '../components/topnav';
import Sidenav from '../components/sidenav';
import axiosInstance from '../axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UploadProducts() {
  const [activeTab, setActiveTab] = useState("allTickets");
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dataToSave, setDataToSave] = useState({ csvStringData: "" });

  // Fetching products
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("product/getAllProducts");
      if (response.data.success.status === "200") {
        setData(response.data.dtoList);
      } else {
        toast.error("Failed to fetch products.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;
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

  // Handle upload CSV Data To Database
  const handleUploadDataToDB = async () => {
    try {
      if (dataToSave.csvStringData.length > 0) {
        setLoading(true);
        const response = await axiosInstance.post("product/uploadproductscsv", dataToSave);
        console.log("Response is ", response.data);
        if (response.data.success.status === "200") {
          toast.info("Successfully uploaded");
          setLoading(false);
          fetchProducts(); // Fetch updated products
        } else {
          toast.error("Something went wrong. Try again!");
          setLoading(false);
        }
      } else {
        toast.info("Please check if file is selected.");
      }
    } catch (err) {
      console.log("ERROR IS ", err);
      toast.error("An error occurred while uploading the data.");
      setLoading(false);
    }
  };

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
                    <h3 className="title">Upload Products File##</h3>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <input
                      type="file"
                      accept=".csv"
                      className="form-control mr-3"
                      id="customFile"
                      onChange={handleFileUpload}
                    />

                    {loading ? (
                      <div className='w-25 btn ml-3 rounded'>
                        <div className='loader'></div>
                      </div>
                    ) : (
                      <button
                        className="btn btn-primary ml-3 rounded"
                        style={{ flex: '0 0 25%' }}
                        onClick={handleUploadDataToDB}
                      >
                        Upload Products
                      </button>
                    )}
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
                  </div>
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
                              <th tabIndex="0">Image</th>
                              <th tabIndex="0">Composition</th>
                              <th tabIndex="0">Brand</th>
                              <th tabIndex="0">Treatment</th>
                              <th tabIndex="0">Size</th>
                              <th tabIndex="0">Form</th>
                              <th tabIndex="0">Pills Quantity</th>
                              <th tabIndex="0">Price</th>
                              {/* <th tabIndex="0">Link</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {data.map((item, index) => (
                              <tr key={item.productId}>
                                <td className="selection-cell">
                                  <input type="checkbox" />
                                </td>
                                <td>{item.name}</td>
                                <td>{item.image ? <img src={item.image} alt={item.name} /> : "N/A"}</td>
                                <td>{item.composition}</td>
                                <td>{item.brand}</td>
                                <td>{item.treatment}</td>
                                <td>{item.packagingSize}</td>
                                <td>{item.form}</td>
                                <td>{item.pillsQty}</td>
                                <td>{item.price}</td>
                                {/* <td>{item.paymentLink ? <a href={item.paymentLink}>Buy Now</a> : "N/A"}</td> */}
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
      <ToastContainer />
    </>
  );
}

export default UploadProducts;
