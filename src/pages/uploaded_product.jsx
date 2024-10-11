import React, { useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import axiosInstance from '../axiosInstance';

function UploadedProduct() {
    const [isBasicActive, setBasicActive] = useState(true);
    const [basicData, setBasicData] = useState({
        productName: '',
        productCode: '',
        price: '',
        unit: '',
        description: '',
        productImage: [],
        productVideo: '',
        productBrochure: ''
    });

    const [advanceData, setAdvanceData] = useState({
        strength: '',
        packagingType: '',
        packagingSize: '',
        brand: '',
        manufacturer: '',
        prescription: ''
    });

    const handleFileChange = (e, field) => {
        const files = Array.from(e.target.files);  // Get all selected files
        const fileUrls = files.map(file => URL.createObjectURL(file));  // Create URLs for file previews
        if (field === 'productImage') {
            setBasicData(prevData => ({
                ...prevData,
                productImage: [...prevData.productImage, ...fileUrls]  // Append new image URLs to the existing ones
            }));
        }
        console.log(`${field} uploaded:`, files);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (isBasicActive) {
            setBasicData({ ...basicData, [id]: value });
        } else {
            setAdvanceData({ ...advanceData, [id]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Prepare payload based on the required format
        const payload = {
            productId: '',
            productCode: "P12345",
            productName: basicData.productName,
            composition: "Ingredient 1, Ingredient 2",
            brand: advanceData.brand,
            treatment: "Treatment Description",
            packagingSize: advanceData.packagingSize,
            packagingType: advanceData.packagingType,
            productVideo: basicData.productVideo,
            bruchureLink: basicData.productBrochure,
            images: basicData.productImage
        };

        try {
            const response = await axiosInstance.post('/product/addproduct', payload);
            console.log('Product added successfully:', response.data);
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };



    return (
        <div>
            {/* Toggle between Basic and Advance Details */}
            <section className="filter-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="container mt-4">
                            <div className="card">
                                <div className="text-white d-flex">
                                    <button className={`${isBasicActive ? "bg-primary" : "bg-secondary"} w-50`} onClick={() => setBasicActive(true)}>Basic Details</button>
                                    <button className={`${!isBasicActive ? "bg-primary" : "bg-secondary"} w-50`} onClick={() => setBasicActive(false)}>Advance Details</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Conditionally render based on the state */}
            {isBasicActive ? (
                <section className="filter-section">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="container mt-4">
                                <div className="card">
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-5 col-sm-12">
                                                    <div className="text-center">
                                                        <div className="container">
                                                            <div className="row row-cols-3">
                                                                <div className="col">
                                                                    {[...Array(5)].map((_, index) => (
                                                                        <div key={index} className="form-group mb-1">
                                                                            <label className="border rounded d-flex justify-content-center align-items-center" style={{ height: '50px', width: "50px", cursor: 'pointer' }}>
                                                                                <FaCamera size={10} />
                                                                                <input type="file" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'productImage')} multiple />
                                                                            </label>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div className="col d-flex justify-content-center align-items-center">
                                                                    <div className="form-group mb-3">
                                                                        <label className="border rounded p-4 d-flex justify-content-center align-items-center" style={{ height: '200px', width: "200px", cursor: 'pointer' }}>
                                                                            <FaCamera size={24} />
                                                                            <input type="file" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'productImage')} multiple />
                                                                        </label>
                                                                        <div className='d-flex justify-content-between mt-2'>
                                                                            <div className="form-group">
                                                                                <label className="border rounded p-4 d-flex justify-content-center align-items-center" style={{ height: '58px', width: "90px", cursor: 'pointer' }}>
                                                                                    <i className="fa fa-video" aria-hidden="true"></i>
                                                                                    <input type="file" style={{ display: 'none' }} accept="video/*" onChange={(e) => handleFileChange(e, 'productVideo')} />
                                                                                </label>
                                                                            </div>
                                                                            <div className="form-group">
                                                                                <label className="border rounded p-4 d-flex justify-content-center align-items-center" style={{ height: '58px', width: "90px", cursor: 'pointer' }}>
                                                                                    <i className="fa fa-file-pdf" aria-hidden="true"></i>
                                                                                    <input type="file" style={{ display: 'none' }} accept="application/pdf" onChange={(e) => handleFileChange(e, 'productBrochure')} />
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-7 col-sm-12">
                                                    <div className="d-flex">
                                                        <div className="form-group col-md-6 col-sm-12">
                                                            <label htmlFor="price">Product Name</label>
                                                            <div className="input-group">
                                                                <input type="text" className="form-control" id="productName" value={basicData.productName} onChange={handleInputChange} placeholder="Enter product name" required />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-6 col-sm-12" style={{ marginLeft: "3px" }}>
                                                            <label htmlFor="unit">Product Code</label>
                                                            <input type="number" className="form-control" id="productCode" value={basicData.productCode} onChange={handleInputChange} placeholder="Enter product code" required />
                                                        </div>
                                                    </div>

                                                    <div className="d-flex">
                                                        <div className="form-group col-md-6 col-sm-12">
                                                            <label htmlFor="price">Price</label>
                                                            <div className="input-group">
                                                                <div className="input-group-prepend">
                                                                    <span className="input-group-text">$</span>
                                                                </div>
                                                                <input type="number" className="form-control" id="price" value={basicData.price} onChange={handleInputChange} placeholder="Ex - ₹1000" required />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-6 col-sm-12" style={{ marginLeft: "3px" }}>
                                                            <label htmlFor="unit">- per -</label>
                                                            <input type="text" className="form-control" id="unit" value={basicData.unit} onChange={handleInputChange} placeholder="Ex - Pair, Piece etc" required />
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="description">Product/Service Description</label>
                                                        <textarea className="form-control" id="description" rows="5" value={basicData.description} onChange={handleInputChange} placeholder="Uses, details, benefits, etc." required></textarea>
                                                        <small className="text-muted">0 characters (maximum of 4000) including formatting.</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right mt-3 d-flex justify-content-end">
                                                <button className="btn btn-success" type="submit" onClick={() => setBasicActive(false)}>Save and Continue →</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ) : (
                <section className="filter-section">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="container mt-4">
                                <div className="card">
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row mb-3">
                                                <label className="col-sm-3 col-form-label">Strength</label>
                                                <div className="col-sm-9">
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="radio" name="strength" id="strength" value="5mg" onChange={handleInputChange} />
                                                        <label className="form-check-label">5 mg</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="radio" name="strength" id="strength" value="10mg" onChange={handleInputChange} />
                                                        <label className="form-check-label">10 mg</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="radio" name="strength" id="strength" value="50mg" onChange={handleInputChange} />
                                                        <label className="form-check-label">50 mg</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <label className="col-sm-3 col-form-label">Packaging Type</label>
                                                <div className="col-sm-9">
                                                    <select className="form-select" id="packagingType" value={advanceData.packagingType} onChange={handleInputChange}>
                                                        <option defaultValue>Select Packaging Type</option>
                                                        <option value="plastic-bottle">Plastic Bottle</option>
                                                        <option value="blister-pack">Blister Pack</option>
                                                        <option value="jar">Jar</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <label className="col-sm-3 col-form-label">Packaging Size</label>
                                                <div className="col-sm-9">
                                                    <input type="text" className="form-control" id="packagingSize" value={advanceData.packagingSize} onChange={handleInputChange} placeholder="Ex - 20 tablets, 50ml, etc." required />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <label className="col-sm-3 col-form-label">Brand</label>
                                                <div className="col-sm-9">
                                                    <input type="text" className="form-control" id="brand" value={advanceData.brand} onChange={handleInputChange} placeholder="Ex - XYZ Brand" />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <label className="col-sm-3 col-form-label">Manufacturer</label>
                                                <div className="col-sm-9">
                                                    <input type="text" className="form-control" id="manufacturer" value={advanceData.manufacturer} onChange={handleInputChange} placeholder="Ex - ABC Manufacturer" />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <label className="col-sm-3 col-form-label">Prescription Required</label>
                                                <div className="col-sm-9">
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="radio" name="prescription" id="prescription" value="yes" onChange={handleInputChange} />
                                                        <label className="form-check-label">Yes</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="radio" name="prescription" id="prescription" value="no" onChange={handleInputChange} />
                                                        <label className="form-check-label">No</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right mt-3 d-flex justify-content-end">
                                                <button className="btn btn-success" type="submit">Add Product</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

export default UploadedProduct;
