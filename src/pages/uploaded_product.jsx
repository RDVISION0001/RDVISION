import React, { useEffect, useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import axiosInstance from '../axiosInstance';
import { toast } from 'react-toastify';

function UploadedProduct() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Fetch data from API
        fetchProducts()
    }, []);

    const fetchProducts = async () => {
        await axiosInstance
            .get('/product/getAllProducts')
            .then((response) => {
                // Assuming response contains an array of products
                setProducts(response.data.dtoList);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    }

    const [isBasicActive, setBasicActive] = useState(true);
    const [basicData, setBasicData] = useState({
        name: '',
        productCode: '',
        price: '',
        unit: '',
        description: '',
        productVideo: '',
        productBrochure: ''
    });

    const [imageList, setimageList] = useState([])

    const [advanceData, setAdvanceData] = useState({
        strength: '',
        packagingType: '',
        packagingSize: '',
        brand: '',
        composition: '',
        treatment: '',
    });

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
        if (imageList.length === 0) {
            toast.info("Add atlist one Image ")
        } else {
            const payload = {
                productCode: basicData.productCode,
                name: basicData.name,
                price: basicData.price,
                unit: basicData.unit,
                description: basicData.description,
                productVideo: basicData.productVideo,
                bruchureLink: basicData.productBrochure,
                images: imageList,
                composition: advanceData.composition,
                brand: advanceData.brand,
                treatment: advanceData.treatment,
                packagingSize: advanceData.packagingSize,
                strength: advanceData.strength,
                packagingType: advanceData.packagingType,
            };

            try {
                const response = await axiosInstance.post('/product/addproduct', payload);
                console.log('Product added successfully:', response.data);
                toast.success(" Product Added ")
                setBasicData({
                    name: '',
                    productCode: '',
                    price: '',
                    unit: '',
                    description: '',
                    productVideo: '',
                    productBrochure: ''
                })
                setimageList([])
                setAdvanceData({
                    strength: '',
                    packagingType: '',
                    packagingSize: '',
                    brand: '',
                    composition: '',
                    treatment: '',
                })
                fetchProducts()
            } catch (error) {
                console.error('Error adding product:', error);
            }
        }
    };
    const [imageLink, setImageLink] = useState("");
    const handleLinkChangeEvent = (e) => {
        setImageLink(e.target.value)
    }
    const openLinkInput = () => {

        const inputElement = document.getElementById("inputLink");
        inputElement.showModal()
        inputElement.classList.add("d-flex")
    };
    const closeLinkInput = () => {
        const inputElement = document.getElementById("inputLink");
        inputElement.classList.remove("d-flex")
        inputElement.close()
        setImageLink("")
    };
    const openVideoInput = () => {

        const inputElement = document.getElementById("videoLink");
        inputElement.showModal()
        inputElement.classList.add("d-flex")
    };
    const closevideoInput = () => {
        const inputElement = document.getElementById("videoLink");
        inputElement.classList.remove("d-flex")
        inputElement.close()
    };
    const openPdfInput = () => {

        const inputElement = document.getElementById("pdfLink");
        inputElement.showModal()
        inputElement.classList.add("d-flex")
    };
    const closePdfInput = () => {
        const inputElement = document.getElementById("pdfLink");
        inputElement.classList.remove("d-flex")
        inputElement.close()
    };
    const addImageInArray = () => {
        setimageList((prev) => {
            return [...prev, imageLink];
        });
        closeLinkInput();
    };
    const handleProductFileChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value)
        setBasicData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    //delete products
    const handleDeleteProduct = async (productId) => {
        try {
            const response = await axiosInstance.delete(`/product/deleteproduct/${productId}`);
            toast.success("Product deleted successfully");
            fetchProducts(); // Refresh the product list after deletion
        } catch (error) {
            toast.error("Failed to delete product. Please try again.");
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
                                                                                {imageList[index + 1] ? <img src={imageList[index + 1]} style={{ maxHeight: "50px" }} /> : <FaCamera size={10} onClick={openLinkInput} />
                                                                                } </label>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div className="col d-flex justify-content-center align-items-center">
                                                                    <div className="form-group mb-3">
                                                                        <label className="border rounded p-4 d-flex justify-content-center align-items-center" style={{ height: '200px', width: "200px", cursor: 'pointer' }}>

                                                                            {imageList[0] ? <img src={imageList[0]} style={{ maxHeight: "200px" }} /> : <FaCamera size={24} onClick={openLinkInput} />
                                                                            }
                                                                        </label>
                                                                        <div className='d-flex justify-content-between mt-2'>
                                                                            <div className="form-group">
                                                                                <label className="border rounded p-4 d-flex justify-content-center align-items-center" style={{ height: '58px', width: "90px", cursor: 'pointer' }}>
                                                                                    {basicData.productVideo.length > 0 ? "Added" : <i className="fa fa-video" aria-hidden="true" onClick={openVideoInput}></i>}
                                                                                </label>
                                                                            </div>
                                                                            <div className="form-group">
                                                                                <label className="border rounded p-4 d-flex justify-content-center align-items-center" style={{ height: '58px', width: "90px", cursor: 'pointer' }}>
                                                                                    {basicData.productBrochure.length > 0 ? "Added" : <i className="fa fa-file-pdf" aria-hidden="true" onClick={openPdfInput}></i>}
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <dialog id='inputLink' className='w-100 h-100  bg-transparent justify-content-center align-items-center' style={{ height: '100vh' }}>
                                                            <>
                                                                <div className='d-flex flex-column justify-content-center align-items-center bg-white p-3 rounded'>
                                                                    <div style={{ width: "100%", textAlign: "right", marginBottom: "4px" }}> <button onClick={closeLinkInput}>close</button></div>

                                                                    <input type="text" value={imageLink} className='p-2 bg-white text-black ' style={{ width: "500px" }} onChange={handleLinkChangeEvent} placeholder='Enter image Link' />
                                                                    <button className='bg-primary text-white m-2' onClick={addImageInArray}>Add Image</button>
                                                                </div>
                                                            </>
                                                        </dialog>
                                                        <dialog id='videoLink' className='w-100 h-100  bg-transparent justify-content-center align-items-center' style={{ height: '100vh' }}>
                                                            <>
                                                                <div className='d-flex flex-column justify-content-center align-items-center bg-white p-3 rounded'>
                                                                    <div style={{ width: "100%", textAlign: "right", marginBottom: "4px" }}> <button onClick={closevideoInput}>close</button></div>

                                                                    <input name='productVideo' type="text" value={basicData.productVideo} className='p-2 bg-white text-black ' style={{ width: "500px" }} onChange={handleProductFileChange} placeholder='Enter image Link' />
                                                                    <button className='bg-primary text-white m-2' onClick={closevideoInput}>Add Image</button>
                                                                </div>
                                                            </>
                                                        </dialog>
                                                        <dialog id='pdfLink' className='w-100 h-100  bg-transparent justify-content-center align-items-center' style={{ height: '100vh' }}>
                                                            <>
                                                                <div className='d-flex flex-column justify-content-center align-items-center bg-white p-3 rounded'>
                                                                    <div style={{ width: "100%", textAlign: "right", marginBottom: "4px" }}> <button onClick={closePdfInput}>close</button></div>

                                                                    <input type="text" name='productBrochure' value={basicData.productBrochure} className='p-2 bg-white text-black ' style={{ width: "500px" }} onChange={handleProductFileChange} placeholder='Enter image Link' />
                                                                    <button className='bg-primary text-white m-2' onClick={closePdfInput}>Add Image</button>
                                                                </div>
                                                            </>
                                                        </dialog>
                                                    </div>
                                                </div>

                                                <div className="col-md-7 col-sm-12">
                                                    <div className="d-flex">
                                                        <div className="form-group col-md-6 col-sm-12">
                                                            <label htmlFor="price">Product Name</label>
                                                            <div className="input-group">
                                                                <input type="text" className="form-control" id="name" value={basicData.name} onChange={handleInputChange} placeholder="Enter product name" required />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-6 col-sm-12" style={{ marginLeft: "3px" }}>
                                                            <label htmlFor="unit">Product Code</label>
                                                            <input type="text" className="form-control" id="productCode" value={basicData.productCode} onChange={handleInputChange} placeholder="Enter product code" />
                                                        </div>
                                                    </div>

                                                    <div className="d-flex">
                                                        <div className="form-group col-md-6 col-sm-12">
                                                            <label htmlFor="price">Price</label>
                                                            <div className="input-group">
                                                                <div className="input-group-prepend">
                                                                    <span className="input-group-text">$</span>
                                                                </div>
                                                                <input type="number" className="form-control" id="price" value={basicData.price} onChange={handleInputChange} placeholder="Ex - ₹1000" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-6 col-sm-12" style={{ marginLeft: "3px" }}>
                                                            <label htmlFor="unit">- per -</label>
                                                            <input type="text" className="form-control" id="unit" value={basicData.unit} onChange={handleInputChange} placeholder="Ex - Pair, Piece etc" />
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="description">Product/Service Description</label>
                                                        <textarea className="form-control" id="description" rows="5" value={basicData.description} onChange={handleInputChange} placeholder="Uses, details, benefits, etc." ></textarea>
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
                                                    <input type="text" className="form-control" id="strength" value={advanceData.strength} onChange={handleInputChange} placeholder="Ex - 200mg 500mg." />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <label className="col-sm-3 col-form-label">Packaging Type</label>
                                                <div className="col-sm-9">
                                                    <input type="text" className="form-control" id="packagingType" value={advanceData.packagingType} onChange={handleInputChange} placeholder="Ex - tablets, Syrup" />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <label className="col-sm-3 col-form-label">Packaging Size</label>
                                                <div className="col-sm-9">
                                                    <input type="text" className="form-control" id="packagingSize" value={advanceData.packagingSize} onChange={handleInputChange} placeholder="Ex - 20 tablets, 50ml, etc." />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <label className="col-sm-3 col-form-label">Brand</label>
                                                <div className="col-sm-9">
                                                    <input type="text" className="form-control" id="brand" value={advanceData.brand} onChange={handleInputChange} placeholder="Ex - XYZ Brand" />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <label className="col-sm-3 col-form-label">Composition</label>
                                                <div className="col-sm-9">
                                                    <input type="text" className="form-control" id="composition" value={advanceData.composition} onChange={handleInputChange} placeholder="Ex - ABC composition" />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <label className="col-sm-3 col-form-label">Treatment</label>
                                                <div className="col-sm-9">
                                                    <input type="text" className="form-control" id="treatment" value={advanceData.treatment} onChange={handleInputChange} placeholder="Ex - ABC treatment" />
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

            {/* productb table list */}
            <section className="followup-table-section py-3">
                <div className="container-fluid">
                    <div className="table-wrapper tabbed-table">
                        <h3 className="title">Products List<span className="d-flex justify-content-end"></span></h3>
                        <div className="tab-content recent-transactions-tab-body" id="followUpContent">
                            <div className="tab-pane fade show active" id="new-arrivals-tkts-tab-pane" role="tabpanel" aria-labelledby="new-arrivals-tkts-tab" tabindex="0">
                                <div className="followups-table table-responsive table-height">
                                    <table className="table">
                                        <thead className="sticky-header">
                                            <tr>
                                                <th tabindex="0">S No.</th>
                                                <th tabindex="0">Product Code</th>
                                                <th tabindex="0">Name of Medicine</th>
                                                <th tabindex="0">Product Image</th>
                                                <th tabindex="0">Strength</th>
                                                <th tabindex="0">Packging Size</th>
                                                <th tabindex="0">Packging Type</th>
                                                <th tabindex="0">Composition</th>
                                                <th tabindex="0">Brand</th>
                                                <th tabindex="0">Treatment</th>
                                                <th tabindex="0">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.length > 0 ? (
                                                products.map((product) => (
                                                    <tr>
                                                        <td><span className="text">1.</span></td>
                                                        <td><span className="text">{product.productCode}</span></td>
                                                        <td><span className="text">{product.name}</span></td>
                                                        <td>
                                                            <span className="text">
                                                                <img src={product.images} style={{ width: "50px", height: "50px" }} />
                                                            </span>
                                                        </td>
                                                        <td><span className="text">{product.strength}</span></td>
                                                        <td><span className="text">{product.packagingSize}</span></td>
                                                        <td><span className="text">{product.packagingType}</span></td>
                                                        <td><span className="text">{product.composition}</span></td>
                                                        <td><span className="text">{product.brand}</span></td>
                                                        <td><span className="text">{product.treatment}</span></td>
                                                        <td>
                                                            <span className="actions-wrapper">
                                                                <i
                                                                    className="fa-solid fa-trash fa-2xl"
                                                                    style={{ color: "#a8101f", cursor: "pointer" }}
                                                                    onClick={() => handleDeleteProduct(product.productId)}
                                                                ></i>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center">
                                                        No products found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pagination-controls">
                        <button className="next_prev" disabled>Previous</button>
                        <button className="next_prev active">1</button>
                        <button className="next_prev">Next</button>
                        <span> Items per page:</span>
                        <select className="next_prev">
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="1000">1000</option>
                        </select>
                    </div>
                </div>
            </section>

        </div>
    );
}

export default UploadedProduct;
