import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { toast } from 'react-toastify';

const EditMIS_Product = (props) => {
    const productId = props.id;

    // State to manage form data
    const [formData, setFormData] = useState({
        name: props.id.name,
        genericName: props.id.genericName,
        brand: props.id.brand,
        strength: props.id.strength,
        packagingSize: props.id.packagingSize,
        packagingType: props.id.packagingType,
        treatment: props.id.treatment,
        productId: props.id.productId,
    });

    // Set initial form data from props if available
    useEffect(() => {
        if (props.productData) {
            setFormData({
                name: props.productData.name || '',
                genericName: props.productData.genericName || '',
                brand: props.productData.brand || '',
                strength: props.productData.strength || '',
                packagingSize: props.productData.packagingSize || '',
                packagingType: props.productData.packagingType || '',
                treatment: props.productData.treatment || '',
            });
        }
    }, [props.productData]);

    // Handle form input change
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
        <div className="container mt-5">
            <form onSubmit={handleSubmit}>
                <div className="card shadow p-5 rounded-4">
                    <div className="row mb-3">
                        <div className="col-md-12">
                            <label className="form-label fw-semibold text-muted">Product Name</label>
                            <input
                                type="text"
                                className="form-control border-0 shadow-sm rounded-3 p-3"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter the product name"
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted">Generic Name</label>
                            <input
                                type="text"
                                className="form-control border-0 shadow-sm rounded-3 p-3"
                                name="genericName"
                                value={formData.genericName}
                                onChange={handleChange}
                                placeholder="Enter generic name"
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted">Brand</label>
                            <input
                                type="text"
                                className="form-control border-0 shadow-sm rounded-3 p-3"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                placeholder="Enter brand name"
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted">Strength</label>
                            <input
                                type="text"
                                className="form-control border-0 shadow-sm rounded-3 p-3"
                                name="strength"
                                value={formData.strength}
                                onChange={handleChange}
                                placeholder="Enter strength"
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted">Packaging Size</label>
                            <input
                                type="text"
                                className="form-control border-0 shadow-sm rounded-3 p-3"
                                name="packagingSize"
                                value={formData.packagingSize}
                                onChange={handleChange}
                                placeholder="Enter packaging size"
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted">Packaging Type</label>
                            <input
                                type="text"
                                className="form-control border-0 shadow-sm rounded-3 p-3"
                                name="packagingType"
                                value={formData.packagingType}
                                onChange={handleChange}
                                placeholder="Enter packaging type"
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted">Treatment</label>
                            <input
                                type="text"
                                className="form-control border-0 shadow-sm rounded-3 p-3"
                                name="treatment"
                                value={formData.treatment}
                                onChange={handleChange}
                                placeholder="Enter treatment"
                            />
                        </div>
                    </div>
                    <div className="d-grid gap-2 mt-4">
                        <button type="submit" className="btn btn-info btn-lg rounded-pill">
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditMIS_Product;



