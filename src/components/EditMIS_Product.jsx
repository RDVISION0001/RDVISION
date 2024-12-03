import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { toast } from 'react-toastify';

const EditMIS_Product = ({ id }) => {
    // State for form data
    const productData = id;
    const [formData, setFormData] = useState({
        productId:id.productId,
        name: productData?.name || '',
        genericName: productData?.genericName || '',
        brand: productData?.brand || '',
        strength: productData?.strength || '',
        packagingSize: productData?.packagingSize || '',
        packagingType: productData?.packagingType || '',
        treatment: productData?.treatment || '',
    });

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission (API call to upload)
    const handleSubmit = (e) => {
        e.preventDefault();

        axiosInstance.post(`/product/updateProductDetails`, formData)
            .then(response => {
                console.log('Product updated successfully:', response.data);
                toast.success('Product updated successfully');
            })
            .catch(error => {
                console.error('Error updating product:', error);
            });
    };

    return (
        <div className=""style={{padding:"20px"}}>
            <div className="" >
                <h2 className="text-center mb-4" style={{ color: "#343a40" }}>Edit Product Details</h2>
                <form onSubmit={handleSubmit}>
                    <div className="row mb-4">
                        <div className="col-md-12">
                            <label className="form-label fw-semibold" style={{ color: "#6c757d" }}>Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-control p-3 rounded-3"
                                placeholder="Enter the product name"
                                style={{
                                    border: "1px solid #ced4da",
                                    backgroundColor: "#ffffff",
                                }}
                                required
                            />
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold" style={{ color: "#6c757d" }}>Generic Name</label>
                            <input
                                type="text"
                                name="genericName"
                                value={formData.genericName}
                                onChange={handleChange}
                                className="form-control p-3 rounded-3"
                                placeholder="Enter generic name"
                                style={{
                                    border: "1px solid #ced4da",
                                    backgroundColor: "#ffffff",
                                }}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold" style={{ color: "#6c757d" }}>Brand</label>
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                className="form-control p-3 rounded-3"
                                placeholder="Enter brand name"
                                style={{
                                    border: "1px solid #ced4da",
                                    backgroundColor: "#ffffff",
                                }}
                            />
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold" style={{ color: "#6c757d" }}>Strength</label>
                            <input
                                type="text"
                                name="strength"
                                value={formData.strength}
                                onChange={handleChange}
                                className="form-control p-3 rounded-3"
                                placeholder="Enter strength"
                                style={{
                                    border: "1px solid #ced4da",
                                    backgroundColor: "#ffffff",
                                }}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold" style={{ color: "#6c757d" }}>Packaging Size</label>
                            <input
                                type="text"
                                name="packagingSize"
                                value={formData.packagingSize}
                                onChange={handleChange}
                                className="form-control p-3 rounded-3"
                                placeholder="Enter packaging size"
                                style={{
                                    border: "1px solid #ced4da",
                                    backgroundColor: "#ffffff",
                                }}
                            />
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold" style={{ color: "#6c757d" }}>Packaging Type</label>
                            <input
                                type="text"
                                name="packagingType"
                                value={formData.packagingType}
                                onChange={handleChange}
                                className="form-control p-3 rounded-3"
                                placeholder="Enter packaging type"
                                style={{
                                    border: "1px solid #ced4da",
                                    backgroundColor: "#ffffff",
                                }}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold" style={{ color: "#6c757d" }}>Treatment</label>
                            <input
                                type="text"
                                name="treatment"
                                value={formData.treatment}
                                onChange={handleChange}
                                className="form-control p-3 rounded-3"
                                placeholder="Enter treatment"
                                style={{
                                    border: "1px solid #ced4da",
                                    backgroundColor: "#ffffff",
                                }}
                            />
                        </div>
                    </div>
                    <div className="d-flex justify-content-end ">
                        <button
                            type="submit"
                            className="btn rounded-pill"
                            style={{
                                backgroundColor: "#343a40",
                                color: "#ffffff",
                                padding: "10px 20px",
                                fontSize: "16px",
                                fontWeight: "bold",
                                border: "none",
                                width:'100px'
                            }}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditMIS_Product;
