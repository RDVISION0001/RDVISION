import React, { useEffect, useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import axiosInstance from '../axiosInstance';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import ProductPriceModal from '../components/ProductPriceModal';
import { Button, Modal } from 'react-bootstrap';

function UploadedProduct() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCard, setIsCard] = useState(true)
    const [view, setView] = useState(false)
    const [selectedProductName, setSelectedProductName] = useState("")
    const [selecteProductId, setSelectedProductId] = useState("")
    const [selectedProductIdForPriceLIst,setSelectedProductIdForPrice]=useState(0)
    const [listView, setListView] = useState(false)
    const [prices, setPrices] = useState([])



    const toggleList = () => {
        if (listView) {
            setListView(false)
        } else {
            setListView(true)
        }
        setSelectedProductIdForPrice(0)
        setSelectedProductName("")
    }


    const toggleModel = () => {
        if (view) {
            setView(false)
        } else {
            setView(true)
        }
        setSelectedProductIdForPrice(0)
        setSelectedProductName("")
    }

    const toggleView = () => {
        if (isCard) {
            setIsCard(false)
        } else {
            setIsCard(true)
        }
    }
    // Filter products by search term
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    const response = await axiosInstance.delete(`/product/deleteproduct/${productId}`);
                    toast.success("Product deleted successfully");
                    fetchProducts(); // Refresh the product list after deletion
                } catch (error) {
                    toast.error("Failed to delete product. Please try again.");
                }
            }
        });

    };

    const openPriceModel = (id, name) => {
        setSelectedProductId(id)
        setSelectedProductName(name)
        toggleModel()
    }
    const openPriceList = (name, id) => {
        setSelectedProductName(name)
        setSelectedProductIdForPrice(id)
        toggleList()
    }

    const fetchPriceLIst = async () => {
        try {
            const response = await axiosInstance.get(`/product/getProductPrices/${selectedProductIdForPriceLIst}`)
            setPrices(response.data)
        } catch (e) {
            toast.error("Some Error occures")
        }
    }
    useEffect(() => {
        if (selectedProductIdForPriceLIst > 0 && listView) {
            fetchPriceLIst()
        }
    }, [selectedProductIdForPriceLIst])

    return (
        <div>
            {/* Toggle between Basic and Advance Details */}
            {localStorage.getItem("roleName") === "Product_Coordinator" && <>
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
            </>}
            <div className=" w-100 text-end" style={{paddingRight:"100px" }}>
                <button onClick={toggleView}>{isCard ? "Card" : "Table"}</button>
            </div>
            {/* Product Card List */}
            {isCard && <section className="followup-table-section py-3">
                <div className="container-fluid">
                    <div className="table-wrapper tabbed-table">
                        <h3 className="title">
                            Products List</h3>
                        <div className="col-md-5 mb-3">
                            <div className="search-wrapper">
                                <input
                                    type="text"
                                    name="search-user"
                                    id="searchUsers"
                                    className="form-control"
                                    placeholder="Search products by name"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="search-icon">
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </div>
                            </div>
                        </div>
                        <div className="tab-content recent-transactions-tab-body" id="followUpContent">
                            <div
                                className="tab-pane fade show active"
                                id="new-arrivals-tkts-tab-pane"
                                role="tabpanel"
                                aria-labelledby="new-arrivals-tkts-tab"
                                tabIndex="0"
                            >
                                <div className="row">
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.filter((product) => product.images !== null).map((product, index) => (
                                            <div className="col-md-2 mb-4" key={index}>
                                                <div
                                                    className="card product-card shadow-sm h-100"
                                                    style={{
                                                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                                    }}
                                                >
                                                    <div className="card-header">
                                                        <h5 className="card-title">{product.name}</h5>
                                                    </div>
                                                    <img
                                                        src={product.images}
                                                        className="card-img-top"
                                                        alt={product.name}
                                                        style={{ height: "200px", objectFit: "cover" }}
                                                    />
                                                    <div className="card-body">
                                                        <p className="card-text">
                                                            <strong>Product Code:</strong> {product.productCode}
                                                        </p>
                                                        <p className="card-text">
                                                            <strong>Strength:</strong> {product.strength}
                                                        </p>
                                                        <p className="card-text">
                                                            <strong>Packaging Size:</strong> {product.packagingSize}
                                                        </p>
                                                        <p className="card-text">
                                                            <strong>Packaging Type:</strong> {product.packagingType}
                                                        </p>
                                                        <p className="card-text">
                                                            <strong>Composition:</strong> {product.composition}
                                                        </p>
                                                        <p className="card-text">
                                                            <strong>Brand:</strong> {product.brand}
                                                        </p>
                                                        <p className="card-text">
                                                            <strong>Treatment:</strong> {product.treatment.split(' ').slice(0, 7).join(' ')}
                                                            {product.treatment.split(' ').length > 7 && '...'}
                                                        </p>

                                                        {localStorage.getItem("roleName") === "Product_Coordinator" && (
                                                            <div className="actions-wrapper">
                                                                <i
                                                                    className="fa-solid fa-trash fa-2xl"
                                                                    style={{ color: "#a8101f", cursor: "pointer" }}
                                                                    onClick={() => handleDeleteProduct(product.productId)}
                                                                ></i>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-12 text-center">
                                            <p>Loading ............</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>}

            {
                !isCard &&
                <div>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Product Code</th>
                                    <th>Strength</th>
                                    <th>Packaging Size</th>
                                    <th>Packaging Type</th>
                                    <th>Composition</th>
                                    <th>Brand</th>
                                    <th>Treatment</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product, index) => (
                                        <tr key={index}>
                                            <td>{product.name}</td>
                                            <td>{product.productCode}</td>
                                            <td>{product.strength}</td>
                                            <td>{product.packagingSize}</td>
                                            <td>{product.packagingType}</td>
                                            <td>{product.composition}</td>
                                            <td>{product.brand}</td>
                                            <td>{product.treatment && product.treatment.slice(0, 100)}</td>
                                            <td className='d-flex  align-items-center h-100 p-3 gap-2'>
                                                <button
                                                    className="btn "
                                                    onClick={() => handleDeleteProduct(product.productId)}
                                                >
                                                    <i class="fa-sharp fa-solid fa-trash fa-2xl" style={{ color: "#ff0000" }}></i>
                                                </button>
                                                {/* <button
                                                    className="btn "
                                                    onClick={() => openPriceModel(product.productId, product.name)}
                                                >
                                                    <i class="fa-solid fa-list-ul fa-2xl" style={{ color: "#072964" }}></i>
                                                </button>
                                                <button
                                                    className="btn "
                                                    onClick={() => openPriceList(product.name, product.productId)}
                                                >
                                                    <i class="fa-solid fa-table-list fa-2xl"></i>
                                                </button> */}

                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center">Loading ....... </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            }

            <Modal show={view} onHide={toggleModel} centered>
                <Modal.Header toggleModel>
                    <div className='d-flex justify-content-between  w-100'>
                        <Modal.Title>Add Price List</Modal.Title>

                        <Button variant="secondary" onClick={toggleModel}>
                            Close
                        </Button>
                    </div>
                </Modal.Header>

                <Modal.Body>
                    <ProductPriceModal
                        productId={selecteProductId}
                        productName={selectedProductName}
                        onClose={toggleModel}
                    />


                </Modal.Body>
            </Modal>


            <Modal show={listView} onHide={toggleList} centered>
                <Modal.Header toggleModel>
                    <div className='d-flex justify-content-between  w-100'>
                        <Modal.Title> Price List of :- {selectedProductName}</Modal.Title>
                        <Button variant="secondary" onClick={toggleList}>
                            Close
                        </Button>
                    </div>
                </Modal.Header>

                <Modal.Body>
                    <div className="container mt-3">
                        <h3> Price list</h3>
                        <table className="table table-bordered table-striped">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                           {prices.length>0? <tbody>
                                {prices.map((price) => (
                                    <tr key={price.priceId}>
                                        <td>{price.quantity} {price.unit} </td>
                                        <td>$ {price.price}</td>
                                    </tr>
                                ))}
                            </tbody>:"No price Available"}
                        </table>
                    </div>

                </Modal.Body>
            </Modal>

        </div>
    );
}

export default UploadedProduct;
