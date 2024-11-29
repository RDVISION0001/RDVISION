import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { toast } from 'react-toastify';

const EditMIS_Product = (props) => {
    const productId = props.id;
    console.log(productId)

    // State to manage form data
    const [formData, setFormData] = useState({
        name: props.id.name,
        genericName: props.id.name,
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
        <div className="container mt-4">
            <form onSubmit={handleSubmit}>
                <div className="card shadow-sm p-4">
                    <div className="row mb-3">
                        <div className="col-md-12">
                            <label className="form-label fw-bold">Product Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Generic Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="genericName"
                                value={formData.genericName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Brand</label>
                            <input
                                type="text"
                                className="form-control"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Strength</label>
                            <input
                                type="text"
                                className="form-control"
                                name="strength"
                                value={formData.strength}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Packaging Size</label>
                            <input
                                type="text"
                                className="form-control"
                                name="packagingSize"
                                value={formData.packagingSize}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Packaging Type</label>
                            <input
                                type="text"
                                className="form-control"
                                name="packagingType"
                                value={formData.packagingType}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Treatment</label>
                            <input
                                type="text"
                                className="form-control"
                                name="treatment"
                                value={formData.treatment}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </div>


    );
}

export default EditMIS_Product;



