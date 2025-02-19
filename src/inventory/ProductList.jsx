import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";
import axiosInstance from "../axiosInstance";
import AddInventoryProduct from "./AddInventoryProduct";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ProductList = () => {
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [isEdit, setIsEdit] = useState(false)
  const [filterValue, setFilterValue] = useState("")



  const handleClose = () => setShowModal(false);
  const handleCloseEdit = () => setIsEdit(false);

  const handleShow = () => setShowModal(true);

  const fetchProductList = async () => {
    const response = await axiosInstance.get("/product/getInventoryProducts");
    setProducts(response.data.dtoList.slice().reverse());
  };

  useEffect(() => {
    fetchProductList();
  }, []);

  // Calculate the index of the first and last item on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredProduct = products.filter((product) =>
    filterValue.length === 0 || product.name.toLowerCase().includes(filterValue.toLowerCase())
  );
  const currentItems = filteredProduct.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Change items per page
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page when changing items per page
  };

  const handleEdit = (product) => {
    setIsEdit(true)
    setSelectedProduct(product)
  }

  const handleDeleteProduct = (id) => {

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const resposnse = await axiosInstance.delete(`/product/deleteproduct/${id}`)
          Swal.fire({
            title: "Deleted!",
            text: resposnse.data,
            icon: "success"
          });
          fetchProductList()
        } catch (e) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: e.response.data,
        
          });
        }

      }
    });

  }
  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-center">
        <h2 className="text-center fw-bold mb-2" style={{ borderBottom: "2px solid black", width: "300px" }}>Product List</h2>

      </div>
      {/* Modal for Form */}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddInventoryProduct closeFunction={handleClose} refetchFunction={fetchProductList} />
        </Modal.Body>
      </Modal>

      <Modal show={isEdit} onHide={handleCloseEdit} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddInventoryProduct closeFunction={handleCloseEdit} refetchFunction={fetchProductList} isUpdate={true} product={selectedProduct} />
        </Modal.Body>
      </Modal>

      {/* Section for Table */}
      <section>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <NavLink variant="dark" className="rounded fw-bold p-2 bg-black text-white" style={{ border: "2px solid black" }} to="/index">← back</NavLink>
          <div className=" ">
            {/* <label htmlFor="search" className="fw-bold"> filter by name </label> */}
            <i class="fa-solid fa-magnifying-glass"></i> <input type="text" className=" p-1 rounded m-1 bg-white text-black " placeholder="Search by name " value={filterValue} onChange={(e) => setFilterValue(e.target.value)} />
          </div>
          <div className="m-2">
            <Form.Select value={itemsPerPage} onChange={handleItemsPerPageChange} style={{ width: 'auto' }}>
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </Form.Select>
          </div>


          <Button variant="dark" className="rounded p-2 fw-bold" onClick={handleShow}>
            + Add New Product
          </Button>
        </div>
        <div className="card-body">
          <div style={{ maxHeight: "80vh", overflowY: "auto", border: "1px solid #dee2e6" }}>
            <table className="table table-bordered table-striped m-0">
              <thead style={{ position: "sticky", top: 0, background: "#ffc107", zIndex: 1 }}>
                <tr>
                  <th>#</th>
                  <th>Composition </th>
                  <th>Medication Name</th>
                  <th>Manufacturer Name</th>
                  <th>Pack</th>
                  <th>Strength</th>
                  <th>Blister Price</th>
                  <th>Price Per Pill</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.
                  map((product, index) => (
                    <tr key={product.id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{product.composition}</td>
                      <td>{product.name}</td>
                      <td>{product.brand}</td>
                      <td>{product.packagingType}</td>
                      <td>{product.strength}</td>
                      <td>{product.blisterPrice || "N/A"}</td>
                      <td>{product.pricePerPill || "N/A"}</td>
                      <td className="d-flex ">
                        <div className="d-flex justify-content-center m-2">
                          <button className="btn bg-dark rounded text-white" onClick={() => handleEdit(product)}>Edit</button>
                        </div>
                        <div className="d-flex justify-content-center m-2">
                          <button className="btn bg-danger rounded text-white" onClick={() => handleDeleteProduct(product.productId)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>


        {/* Pagination Controls */}
        <nav>
          <ul className="pagination justify-content-center flex-wrap m-3">
            {Array.from({ length: Math.ceil(filteredProduct.length / itemsPerPage) }, (_, i) => (
              <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button onClick={() => paginate(i + 1)} className="page-link m-1">
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </div>
  );
};

export default ProductList;