import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

const ProductList = () => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 fw-bold">Product Management <span> <Button variant="warning" onClick={handleShow}>Add Product</Button></span></h2>

      {/* Modal for Form */}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Product Name"
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="composition"
                  className="form-control"
                  placeholder="Composition"
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="brand"
                  className="form-control"
                  placeholder="Brand"
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="packagingType"
                  className="form-control"
                  placeholder="Packaging Type"
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="strength"
                  className="form-control"
                  placeholder="Strength"
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="number"
                  step="0.01"
                  name="blisterPrice"
                  className="form-control"
                  placeholder="Blister Price"
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="number"
                  step="0.01"
                  name="pricePerPill"
                  className="form-control"
                  placeholder="Price Per Pill"
                  required
                />
              </div>
            </div>
            <div className="mt-4 text-center">
              <button type="submit" className="btn btn-warning text-white rounded">
                Add Product
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Section for Table */}
      <section>
        <div className="card shadow-sm">
          <h4 className="text-center fw-bold">Product List</h4>
          <div className="card-body">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th className="bg-warning">Name</th>
                  <th className="bg-warning">Composition</th>
                  <th className="bg-warning">Brand</th>
                  <th className="bg-warning">Packaging Type</th>
                  <th className="bg-warning">Strength</th>
                  <th className="bg-warning">Blister Price</th>
                  <th className="bg-warning">Price Per Pill</th>
                  <th className="bg-danger">Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Example row */}
                <tr>
                  <td>Sample Name</td>
                  <td>Sample Composition</td>
                  <td>Sample Brand</td>
                  <td>Sample Packaging</td>
                  <td>Sample Strength</td>
                  <td>10.00</td>
                  <td>1.00</td>
                  <td>
                    <div className="d-flex justify-content-center">
                      <button className="btn bg-warning rounded">Edit</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductList;