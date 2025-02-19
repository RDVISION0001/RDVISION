import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { toast, ToastContainer } from 'react-toastify';

function AddInventoryProduct({ closeFunction, refetchFunction, product, isUpdate }) {
    const [formData, setFormData] = useState({
        name: product && product.name,
        composition: product && product.composition,
        brand: product && product.brand,
        packagingType: product && product.packagingType,
        strength: product && product.strength,
        blisterPrice: product && product.blisterPrice,
        pricePerPill: product && product.pricePerPill
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isUpdate) {
            const response = await axiosInstance.put("/product/updateInventoryProduct", {
                productId: product.productId,
                name: formData.name,
                composition: formData.composition,
                brand: formData.brand,
                packagingType: formData.packagingType,
                strength: formData.strength,
                blisterPrice: formData.blisterPrice,
                pricePerPill: formData.pricePerPill
            })
            closeFunction()
            refetchFunction()
            toast.success(response.data.message)
        } else {
            try {
                const response = await axiosInstance.post("/product/addInventoryProduct", formData);
                toast.success(response?.data?.message || "Product added successfully!");
                closeFunction()
                refetchFunction()
            } catch (error) {
                toast.error(error?.response?.data?.message || "An error occurred. Please try again.");
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label htmlFor="name">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Product Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="composition">Composition</label>
                        <input
                            type="text"
                            name="composition"
                            className="form-control"
                            placeholder="Composition"
                            value={formData.composition}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="brand">Brand</label>
                        <input
                            type="text"
                            name="brand"
                            className="form-control"
                            placeholder="Brand"
                            value={formData.brand}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="packagingType">Packaging Type</label>
                        <input
                            type="text"
                            name="packagingType"
                            className="form-control"
                            placeholder="Packaging Type"
                            value={formData.packagingType}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="strength">Strength</label>
                        <input
                            type="text"
                            name="strength"
                            className="form-control"
                            placeholder="Strength"
                            value={formData.strength}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="blisterPrice">Blister Price</label>
                        <input
                            type="number"
                            step="0.01"
                            name="blisterPrice"
                            className="form-control"
                            placeholder="Blister Price"
                            value={formData.blisterPrice}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="pricePerPill">Price Per Pill (INR)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="pricePerPill"
                            className="form-control"
                            placeholder="Price Per Pill"
                            value={formData.pricePerPill}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <button type="submit" className="btn btn-warning text-white rounded">
                        {isUpdate ? "Update Product" : " Add Product"}
                    </button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}

export default AddInventoryProduct;
