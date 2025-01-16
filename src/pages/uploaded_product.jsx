import React, { useEffect, useState, useRef } from "react";
import { FaCamera } from 'react-icons/fa';
import axiosInstance from '../axiosInstance';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import { useAuth } from "../auth/AuthContext";


function UploadedProduct({ closeFunction, selectedProduct, productName }) {
    const {dark} = useAuth()
    const [products, setProducts] = useState([]);
    const [productId, setProductId] = useState([]);
    const [filterText, setFilterText] = useState("");
    const debounceTimeout = useRef(null);
    const [debouncedFilterText, setDebouncedFilterText] = useState("");
    const [selectedImage, setSelectedImage] = useState("");
    const [view, setView] = useState(false);
    const handleView = (imageUrl) => {
        setSelectedImage(imageUrl);
        setView(true);
    };

    const handleClosee = () => {
        setView(false);
        setSelectedImage("");
    };

    useEffect(() => {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            setDebouncedFilterText(filterText);
        }, 300);
    }, [filterText]);

    const handleFilterChange = (e) => {
        setFilterText(e.target.value);
    };

    const filteredProducts = products.filter((product) =>
        product.name?.toLowerCase().includes(debouncedFilterText.toLowerCase())
    );


    const [searchTerm, setSearchTerm] = useState('');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = (id) => {
        setShow(true)
        setProductId(id)
    };

    const rowDetails = [
        { label: "Category", valueKey: "category" },
        { label: "Product Name", valueKey: "name" },
        { label: "Generic Name", valueKey: "genericName" },
        { label: "Brand", valueKey: "brand" },
        { label: "Strength", valueKey: "strength" },
        { label: "Packaging Sizes", valueKey: "packagingSize" },
        { label: "Packaging Types", valueKey: "packagingType" },
        { label: "Composition", valueKey: "composition" },
        { label: "Treatment", valueKey: "treatment" },

    ];




    const [isBasicActive, setBasicActive] = useState(true);
    const [basicData, setBasicData] = useState({
        name: '',
        productCode: '',
        price: '',
        unit: '',
        description: '',
        productVideo: '',
        productBrochure: '',
        productId: selectedProduct ? selectedProduct : 0
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

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     if (imageList.length === 0) {
    //         toast.info("Add atlist one Image ")
    //     } else {
    //         let newImage = [];
    //         for (let i = 0; i < imageList.length; i++) {
    //             newImage.push({
    //                 imageData: imageList[i]
    //             })
    //         }

    //         const payload = {
    //             productCode: basicData.productCode,
    //             name: basicData.name,
    //             price: basicData.price,
    //             unit: basicData.unit,
    //             description: basicData.description,
    //             productVideo: basicData.productVideo,
    //             bruchureLink: basicData.productBrochure,
    //             imageListInByte: newImage,
    //             composition: advanceData.composition,
    //             brand: advanceData.brand,
    //             treatment: advanceData.treatment,
    //             packagingSize: advanceData.packagingSize,
    //             strength: advanceData.strength,
    //             packagingType: advanceData.packagingType,
    //         };

    //         try {
    //             const response = await axiosInstance.post('/product/addproduct', payload);
    //             console.log('Product added successfully:', response.data);
    //             toast.success("Product Added Successfully!"); 
    //             setBasicData({
    //                 name: '',
    //                 productCode: '',
    //                 price: '',
    //                 unit: '',
    //                 description: '',
    //                 productVideo: '',
    //                 productBrochure: ''
    //             })
    //             setimageList([])
    //             setAdvanceData({
    //                 strength: '',
    //                 packagingType: '',
    //                 packagingSize: '',
    //                 brand: '',
    //                 composition: '',
    //                 treatment: '',
    //             })
    //             closeFunction()
    //         } catch (error) {
    //             console.error('Error adding product:', error);
    //             toast.error("Failed to add product!"); 
    //         }
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (imageList.length === 0) {
            toast.info("Add atlist one Image ")
        } else {
            let newImage = [];
            for (let i = 0; i < imageList.length; i++) {
                newImage.push({
                    imageData: imageList[i]
                })
            }
            if (selectedProduct) {
                const payload = {
                    productCode: basicData.productCode,
                    name: basicData.name,
                    price: basicData.price,
                    unit: basicData.unit,
                    description: basicData.description,
                    productVideo: basicData.productVideo,
                    bruchureLink: basicData.productBrochure,
                    imageListInByte: newImage,
                    composition: advanceData.composition,
                    brand: advanceData.brand,
                    treatment: advanceData.treatment,
                    packagingSize: advanceData.packagingSize,
                    strength: advanceData.strength,
                    packagingType: advanceData.packagingType,
                    productId: selectedProduct
                };

                try {
                    const response = await axiosInstance.put('/product/updateProduct', payload);
                    toast.success("Product Updated Successfully!");
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
                    closeFunction()
                } catch (error) {
                    console.error('Error adding product:', error);
                    toast.error("Failed to add product!");
                }
            } else {
                const payload = {
                    productCode: basicData.productCode,
                    name: basicData.name,
                    price: basicData.price,
                    unit: basicData.unit,
                    description: basicData.description,
                    productVideo: basicData.productVideo,
                    bruchureLink: basicData.productBrochure,
                    imageListInByte: newImage,
                    composition: advanceData.composition,
                    brand: advanceData.brand,
                    treatment: advanceData.treatment,
                    packagingSize: advanceData.packagingSize,
                    strength: advanceData.strength,
                    packagingType: advanceData.packagingType
                };

                try {
                    const response = await axiosInstance.post('/product/addproduct', payload);
                    toast.success("Product Added Successfully!");
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
                    closeFunction()
                } catch (error) {
                    console.error('Error adding product:', error);
                    toast.error("Failed to add product!");
                }
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
    // const handleDeleteProduct = async (productId) => {
    //     try {
    //         const response = await axiosInstance.delete(`/product/deleteproduct/${productId}`);
    //         toast.success("Product deleted successfully");
    //         fetchProducts();
    //     } catch (error) {
    //         toast.error("Failed to delete product. Please try again.");
    //     }
    // };

    const [category, setCategory] = useState('');

    const handleUpdateCategory = async () => {
        console.log(productId)
        try {
            const response = await axiosInstance.put('/product/updateCategory', {
                productId: productId,
                category
            });
            console.log('Category updated successfully:', response.data);
            toast.success("Category updated successfully");
        } catch (error) {
            console.error('Error updating category:', error);
            toast.error("Failed to update category. Please try again.");
        }
    };
    //image handling
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files); // Convert FileList to an Array
        const newImageList = [];

        files.forEach((file) => {
            const reader = new FileReader();

            reader.onloadend = () => {
                newImageList.push(reader.result.split(",")[1]);

                // Once all files are processed, update the state
                if (newImageList.length === files.length) {
                    setimageList((prev) => [...prev, ...newImageList]);
                }
            };

            if (file) {
                reader.readAsDataURL(file); // Convert the file to a Base64 string
            }
            closeLinkInput()
        });
    };

    //resuble function to convert byte code to image url
    function convertToImage(imageString) {
        const byteCharacters = atob(imageString); // Decode base64 string
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        return url;

    }

    return (
        <div className={`p-4 ${dark?`bg-dark text-light`:``}`}>
            {selectedProduct && <div>
                {/* <span>                selected product Id is {basicData.productId}
                </span> */}
                <strong className={`${dark?`text-light`:``}`}> Product name :- {productName}</strong>
            </div>}
            {/* Toggle between Basic and Advance Details */}
            {(localStorage.getItem("roleName") === "Product_Coordinator" || localStorage.getItem("roleName") === "SeniorSuperVisor")  && <>
                <section className={`filter-section ${dark ? 'bg-dark' : ''}`}>
                    <div className={`container-fluid  ${dark ? 'bg-dark' : ''}`}>
                        <div className="row">
                            <div className={`container  ${dark ? 'bg-dark' : ''}`}>
                                <div className={`card ${dark ? 'bg-dark' : ''} `}>
                                    <div className="text-white d-flex gap-2">
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
                    <section className={`filter-section ${dark ? `bg-dark `:``}`} style={{ height: "700px" }}>
                        <div className="container-fluid  ">
                            <div className="row ">
                                <div className="container mt-4 ">
                                    <div className={`card ${dark? "bg-dark text-light":""}`}>
                                        <div className="card-body">
                                            <form onSubmit={handleSubmit}>
                                                <div className="row">
                                                    <div className={`col-md-12 col-sm-12 ${dark?"bg-dark text-light":""}`}>
                                                        <div className="text-center">
                                                            <div className="container">
                                                                <div className="row row-cols-3">
                                                                    <div className="col">
                                                                        {[...Array(5)].map((_, index) => (
                                                                            <div key={index} className="form-group mb-1">
                                                                                <label className="border rounded d-flex justify-content-center align-items-center" style={{ height: '50px', width: "50px", cursor: 'pointer' }}>
                                                                                    {imageList[index + 1] ? <img src={convertToImage(imageList[index + 1])} style={{ maxHeight: "50px" }} /> : <FaCamera size={10} onClick={openLinkInput} />
                                                                                    } </label>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    <div className="col d-flex justify-content-center align-items-center">
                                                                        <div className="form-group mb-3" onClick={openLinkInput}>
                                                                            <label className="border rounded p-4 d-flex justify-content-center align-items-center" style={{ height: '200px', width: "200px", cursor: 'pointer' }}>

                                                                                {imageList[0] ? <img src={convertToImage(imageList[0])} style={{ maxHeight: "200px" }} /> : <FaCamera size={24}  />
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

                                                                    <div className={`d-flex flex-column justify-content-center align-items-center  p-3 rounded ${dark? " bg-secondary text-light":""}`}>
                                                                        <div style={{ width: "100%", textAlign: "right", marginBottom: "4px" }}> <button onClick={closeLinkInput}>X</button></div>

                                                                        <label htmlFor="image">Add image list</label>
                                                                        <div className="custom-file">
                                                                            <input
                                                                                type="file"
                                                                                className="custom-file-input border"
                                                                                id="upload-profile-img"
                                                                                onChange={(e) => handleFileChange(e, 'image')}
                                                                                name="upload-profile"
                                                                                multiple // Allows multiple files to be selected
                                                                            />
                                                                            <label className={`custom-file-label ${dark?"mx-1":""}`} htmlFor="upload-profile-img">
                                                                                Choose files
                                                                            </label>
                                                                        </div>


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

                                                    <div className={`col-md-7 col-sm-12 ${dark?"bg-dark":""}`}>
                                                        <div className="d-flex">
                                                            {!selectedProduct && <div className="form-group col-md-6 col-sm-12">
                                                                <label htmlFor="price" className={`${dark?"text-light":""}`}>Product Name</label>
                                                                <div className="input-group">
                                                                    <input type="text" className={`form-control ${dark ? 'bg-secondary border text-light':''}`} id="name" value={basicData.name} onChange={handleInputChange} placeholder="Enter product name" required />
                                                                </div>
                                                            </div>}
                                                            {/* <div className="form-group col-md-6 col-sm-12" style={{ marginLeft: "3px" }}>
                                                                <label htmlFor="unit">Product Code</label>
                                                                <input type="text" className="form-control" id="productCode" value={basicData.productCode} onChange={handleInputChange} placeholder="Enter product code" />
                                                            </div> */}
                                                        </div>

                                                        {/* <div className="d-flex">
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
                                                        </div> */}
                                                        <div className="form-group">
                                                            <label htmlFor="description">Description</label>
                                                            <textarea className={`form-control ${dark?"text-light bg-secondary":""}`} id="description" rows="5" value={basicData.description} onChange={handleInputChange} placeholder="Uses, details, benefits, etc." ></textarea>
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
                    <section className="filter-section" style={{ height: "700px", width: "700px" }}>
                        <div className="container-fluid w-100">
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
            </>}

            {/* Product Card List */}





            {/* Modal */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <input
                                type="text"
                                name="category"
                                className="form-control"
                                value={category}
                                id="category"
                                placeholder="Enter category"
                                onChange={(e) => setCategory(e.target.value)} // Add this line
                            />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-warning' onClick={() => handleUpdateCategory(products.id)}>Add  Category</button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal to view image */}
            <Modal show={view} onHide={handleClose} centered>
                <Modal.Body className="d-flex flex-column justify-content-center align-items-center">
                    <img
                        src={selectedImage}
                        alt="Selected Product"
                        style={{ maxWidth: "100%", maxHeight: "80vh", }}
                    />
                    <button
                        className="btn btn-danger mt-3"
                        onClick={handleClosee}
                    >
                        Close
                    </button>
                </Modal.Body>
            </Modal>

        </div>
    );
}

export default UploadedProduct;

