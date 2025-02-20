import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../axiosInstance";
import { Modal, Button } from 'react-bootstrap';
// Toast notification
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCamera } from 'react-icons/fa';
import UpProductImg from "../components/UpProductImg";
import EditMIS_Product from "../components/EditMIS_Product";
import Uploaded_product from '../pages/uploaded_product'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAuth } from "../auth/AuthContext";


function MIS_Product() {
    const [filterText, setFilterText] = useState("");
    const [debouncedFilterText, setDebouncedFilterText] = useState("");
    const debounceTimeout = useRef(null);
    const { dark } = useAuth()
    const [category, setCategory] = useState("");
    const [products, setProducts] = useState([]);
    const [image, setImage] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [one, setOne] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false);
    const [on, setOn] = useState(false);
    const [enable, setEnable] = useState(false);
    const [images, setImages] = useState([])
    // State for modal inputs
    const [unit, setUnit] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [quantities, setQuantities] = useState([{ quantity: "", price: "" }]);
    const [requestBody, setRequestBody] = useState([]);
    const [submitError, setSubmitError] = useState(null);
    const [productId, setProductId] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [isAddProductOpen, setIsAddProductOepn] = useState(false)

    //Pagination States
    const [currentPage, setCurrentPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(10)
    const [totalPages, setTotalPages] = useState(0)
    const startIndex = (currentPage - 1) * itemPerPage;
    const endIndex = startIndex + itemPerPage;

    const openAddProduct = () => {
        setIsAddProductOepn(true)
    }

    const handleCloseProductAdd = () => {
        setIsAddProductOepn(false)
        fetchProductImages()
        fetchProducts()
    }
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
        fetchProducts();
        fetchProductImages()
    }, []);

    useEffect(() => {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            setDebouncedFilterText(filterText);
        }, 300);
    }, [filterText]);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get("/product/getAllProducts");
            if (response.data?.dtoList) {
                setProducts(response.data.dtoList);
            } else {
                setError("Unexpected response format");
            }
        } catch (err) {
            setError(err.message || "Error fetching products");
        } finally {
            setLoading(false);
        }
    };


    const handleFilterChange = (e) => {
        setFilterText(e.target.value.toLowerCase());
        setCurrentPage(1)
    };

    const filteredProducts = (products || []).filter((product) =>
        product.name?.toLowerCase().includes(debouncedFilterText) ||
        product.genericName?.toLowerCase().includes(debouncedFilterText) || product.category?.toLowerCase().includes(debouncedFilterText)
    );

    useEffect(() => {
        const setTotalPagesForPagination = (pages) => {
            const actualPages = pages.filter((product) => product.strength)
            setTotalPages(Math.ceil(actualPages.length / itemPerPage))
        }
        setTotalPagesForPagination(filteredProducts)
    }, [filteredProducts])

    const handleClose = () => {
        setShow(false);
        setCategory("");
        setProductId(null);
    };
    const handleShow = (id) => {
        const product = products.find((p) => p.productId === id);
        setCategory(product?.category || "");
        setProductId(id);
        setShow(true);
    };

    //add iamge modal 
    const handleOff = () => {
        setOn(false);
        setProductId(null);
        fetchProductImages()
    };

    const handleOn = (id) => {
        setProductId(id);
        setOn(true);
    };

    //EDIT action
    const handleDesable = () => {
        setEnable(false);
        fetchProducts()
    };

    const handleEnable = (id) => {
        setProductId(id);
        setEnable(true);
    };

    //add price modal 
    const handleOne = (product) => {
        setOne(true);
        setSelectedProduct(product);
    };

    const handleZero = () => {
        setOne(false);
        setSelectedProduct(null);
        setUnit("");
        setQuantities([{ quantity: "", price: "" }]);
        setSubmitError(null);
    };

    const handleAddMore = (e) => {
        if (unit.length > 0 && currency.length > 0) {
            handleAddPriceInBody(e)
            setQuantities([...quantities, { quantity: "", price: "" }]);

        } else {
            toast.info("Please fill all fields")
        }
    };

    const handleRemoveRow = (index) => {
        setQuantities(quantities.filter((_, i) => i !== index));
    };

    const handleQuantityChange = (index, field, value) => {
        const updatedQuantities = [...quantities];
        updatedQuantities[index][field] = value;
        setQuantities(updatedQuantities);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        handleAddPriceInBody(e)

        setSubmitError(null);

        if (!unit || quantities.some((q) => !q.quantity || !q.price)) {
            setSubmitError("All fields are required.");
            return;
        }
        const latestQuantity = quantities[quantities.length - 1]
        let newBody = requestBody;
        newBody.push({
            product: {
                productId: selectedProduct.productId,
            },
            quantity: latestQuantity.quantity,
            // productCode: latestQuantity.productCode,
            price: latestQuantity.price,
            unit,
            currency: currency || "USD", // Default to USD if currency is not set
        })



        try {
            const response = await axiosInstance.post("/product/addFixedPriceList", newBody);
            console.log("Response:", response.data);
            handleZero();
            setSelectedProduct(null)
            fetchProducts();
        } catch (err) {
            setSubmitError(err.response?.data?.message || "Failed to submit data.");
        }
        setUnit("")
        setSelectedProduct(null)
        setRequestBody([])

    };

    const rowDetails = [
        { label: "Product Name", valueKey: "name" },
        { label: "Category", valueKey: "category" },
        { label: "Generic Name", valueKey: "genericName" },
        { label: "Brand", valueKey: "brand" },
        { label: "Strength", valueKey: "strength" },
        { label: "Packaging Sizes", valueKey: "packagingSize" },
        { label: "Packaging Types", valueKey: "packagingType" },
        { label: "Composition", valueKey: "composition" },
        { label: "Treatment", valueKey: "treatment" },
    ];

    // if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const handleAddPriceInBody = (e) => {
        e.preventDefault()
        const latestQuantity = quantities[quantities.length - 1]; // Get the last entry in the array

        if (latestQuantity.quantity.length > 0 && latestQuantity.price.length > 0) {
            setRequestBody((prev) => [
                ...prev,
                {
                    product: {
                        productId: selectedProduct.productId,
                    },
                    quantity: latestQuantity.quantity,
                    price: latestQuantity.price,
                    // productCode: latestQuantity.productCode,
                    unit,
                    currency: currency || "USD", // Default to USD if currency is not set
                },
            ]);
        } else {
            toast.info("please add proper quantity and price")
        }
    };

    const handleUpdateCategory = async () => {
        try {
            const response = await axiosInstance.put("/product/updateCategory", {
                productId,
                category,
            });
            console.log("Category updated successfully:", response.data);
            toast.success("Category updated successfully");
            fetchProducts();
            setShow(false);
            handleClose();
        } catch (error) {
            console.error("Error updating category:", error);
            toast.error("Failed to update category. Please try again.");
        }
    };

    const fetchProductImages = async (productId) => {
        try {
            const response = await axiosInstance.get(`/images/getProductImages`);
            setImages(response.data)
        } catch (error) {
            setImages([]);
        }
    };

    const getImageIds = (productId) => {
        if (images[productId]) {
            return (images[productId])
        } else {
            return [];
        }
    };

    const handleDeleteImage = async (imageId) => {
        await axiosInstance.delete(`/images/deleteImageById/${imageId}`);
        toast.success("Image Deleted")
        fetchProductImages()
    }

    const deletePrice = async (id) => {
        try {
            await axiosInstance.delete(`/product/deletePrice/${id}`)
            toast.success("Deleted")
            fetchProducts()
        } catch (e) {
            toast.error("Some error occures")
        }

    }
    const handleDeleteProduct = async (product) => {
        try {
            await axiosInstance.delete(`/product/deleteproduct/${product.productId}`)
            toast.success("deleted")
            fetchProducts()
        } catch (e) {
            toast.error("Some Error Occures")
        }
    }

    const generatePagination = () => {
        const buttons = [];
        for (let i = 1; i <= totalPages; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 m-1 rounded-md ${currentPage === i
                        ? 'bg-primary text-white'
                        : 'bg-secondary text-gray-800 hover:bg-gray-300'
                        }`}
                >
                    {i}
                </button>
            );
        }
        return buttons;
    };

    const handlePageChange = (i) => {
        setCurrentPage(i)
    }

    // corosoul
    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000, // Carousel changes every 2 seconds
    };
    const handleCopyImage = async (imageUrl) => {
        try {
            // Fetch the image as raw binary data
            const response = await axiosInstance.get(imageUrl, { responseType: "arraybuffer" });
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
    
            // Verify Clipboard API is available
            if (!navigator.clipboard) {
                toast.error("Clipboard API not supported in your browser.");
                return;
            }
    
            // Write the blob to the clipboard
            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob
                })
            ]);
    
            toast.success("Image copied to clipboard!");
        } catch (error) {
            console.error("Failed to copy image:", error);
            toast.error("Failed to copy image. Try downloading instead.");
        }
    };
    
    return (
        <div className={`container-fluid  ${dark ? `bg-dark text-white` : ``}`} >
            <h3 className="title text-center">MIS-Product Department</h3>
            <div className="mb-3">
                <input
                    type="text"
                    placeholder="Search by Name or Generic Name"
                    className={`form-control rounded ${dark ? `bg-secondary` : ``}`}
                    value={filterText}
                    onChange={handleFilterChange}
                />
            </div>

            <div className={`table  ${dark ? `table-dark` : ``} `} style={{ maxHeight: "1000px", overflowY: "auto" }}>
                {(localStorage.getItem("roleName") === "Product_Coordinator" || localStorage.getItem("roleName") === "SeniorSuperVisor") && <div className="d-flex justify-content-end p-3">
                    <button onClick={openAddProduct} className={`rounded ${dark ? `bg-secondary` : ``} `}>Add New Product</button>
                </div>}
                <table className={`table  ${dark ? `table-dark` : ``} `}>
                    <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                        <tr>
                            <th className={` text-center ${dark ? `bg-secondary text-white` : ``}`} style={{ width: "0%" }}>S.No.</th>
                            <th className={` text-center ${dark ? `bg-secondary text-white` : ``}`}
                                style={{
                                    width: localStorage.getItem("roleName") !== "Product_Coordinator"
                                        ? "5%"
                                        : "10%"
                                }}
                            >
                                Product Image
                            </th>
                            <th className={` text-center ${dark ? `bg-secondary text-white` : ``}`} style={{ width: "20%" }} colSpan="2">Product Details</th>
                            <th className={`text-center ${dark ? `bg-secondary text-white` : ``}`} style={{ width: "15%" }} >Price List</th>
                            {localStorage.getItem("roleName") === "Product_Coordinator" && <th className={`text-center ${dark ? `bg-secondary text-white` : ``}`} style={{ width: "10%" }}>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.filter((product) => product.strength).slice(startIndex, endIndex).map((product, index) => (
                                <React.Fragment key={product.productId}>
                                    {rowDetails.map((row, rowIndex) => (
                                        <tr className="" style={{ border: "2px solid black" }} key={`${product.productId}-${rowIndex}`}>
                                            {rowIndex === 0 && (
                                                <>
                                                    <td className="border " rowSpan={rowDetails.length} style={{ padding: "5px" }}>{startIndex + index + 1}</td>
                                                    <td className="border" rowSpan={rowDetails.length} style={{ padding: "10px", }}>
                                                        {localStorage.getItem("roleName") === "Product_Coordinator" && getImageIds(product.productId).map((imageId) => (
                                                            <>
                                                                <i class="fa-solid fa-xmark" style={{ color: "red", position: "relative", backgroundColor: "white", }} onClick={() => handleDeleteImage(imageId)}></i>
                                                                <img
                                                                    key={imageId}
                                                                    onClick={() => handleView(`https://image.rdvision.in/images/image/${imageId}`)}
                                                                    src={`https://image.rdvision.in/images/image/${imageId}`}
                                                                    alt="No Image Found"
                                                                    style={{ maxWidth: "100px" }}
                                                                />
                                                            </>

                                                        )
                                                        )}
                                                        {localStorage.getItem("roleName") !== "Product_Coordinator" &&
                                                            <div className="d-flex justify-content-center">
                                                                <div style={{ height: "200px", width: "200px" }}>
                                                                    <Slider {...carouselSettings}>
                                                                        {getImageIds(product.productId).map(imageId => (
                                                                            <>
                                                                              <button
                                                                                    onClick={() => handleCopyImage(`https://backend.rdvision.in/images/image/${imageId}`)}
                                                                                    className="btn btn-primary"
                                                                                >   
                                                                                    Copy Image
                                                                                </button>
                                                                            <div key={imageId} style={{ textAlign: "center" }}>
                                                                                <img
                                                                                    onClick={() => handleView(`https://backend.rdvision.in/images/image/${imageId}`)}
                                                                                    src={`https://backend.rdvision.in/images/image/${imageId}`}
                                                                                    alt="No Image Found"
                                                                                    style={{ maxWidth: "100%", height: "200px", marginBottom: "10px" }}
                                                                                />
                                                                                {/* Add the "Copy Image" button below the image */}
                                                                               
                                                                            </div>
                                                                          
                                                                            </>
                                                                        ))}
                                                                    </Slider>
                                                                </div>
                                                            </div>
                                                        }

                                                        <div className="mt-3">
                                                            {localStorage.getItem("roleName") === "Product_Coordinator" && <button
                                                                className="btn btn-sm btn-primary rounded"
                                                                onClick={() => handleOn(product.productId)}
                                                            >
                                                                Upload Image
                                                            </button>}
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                            <td className={`fw-bold border ${row.label === "Product Name" ? "bg-info" : ""}`} style={{ padding: "5px" }}>{row.label}</td>
                                            <td className={`${row.label === "Product Name" ? "bg-info" : ""}`} style={{ border: "2px solid black", padding: "5px" }} >
                                                {row.valueKey === "category" && (
                                                    <>
                                                        {product[row.valueKey] && product[row.valueKey] !== "N/A" ? (
                                                            <>
                                                                {product[row.valueKey]}{" "}
                                                                {localStorage.getItem("roleName") === "Product_Coordinator" && <button
                                                                    className="btn btn-sm btn-warning ms-2 rounded"
                                                                    onClick={() => handleShow(product.productId)}
                                                                >
                                                                    Edit
                                                                </button>}

                                                            </>
                                                        ) : (
                                                            localStorage.getItem("roleName") === "Product_Coordinator" ? <button onClick={() => handleShow(product.productId)}>Add Category</button> : "N/A"
                                                        )}
                                                    </>
                                                )}
                                                {row.valueKey !== "category" && (
                                                    <>
                                                        {product[row.valueKey] || "N/A"}
                                                    </>
                                                )}
                                            </td>
                                            {rowIndex === 0 && (
                                                <>
                                                    <td rowSpan={rowDetails.length} style={{ padding: "5px" }}>
                                                        {product.priceList && product.priceList.length > 0 ? (
                                                            <table className={`table table-sm table-bordered ${dark ? `table-secondary` : ``}`} style={{ fontSize: "12px" }}>
                                                                <thead>
                                                                    <tr>
                                                                        <th className={` text-center ${dark ? `bg-secondary text-white` : ``}`}>Product Code</th>
                                                                        <th className={` text-center ${dark ? `bg-secondary text-white` : ``}`}>Quantity</th>
                                                                        <th className={` text-center ${dark ? `bg-secondary text-white` : ``}`}>Price</th>
                                                                        {localStorage.getItem("roleName") === "Product_Coordinator" && <th className={` text-center ${dark ? `bg-secondary text-white` : ``}`}>Ac</th>}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {product.priceList.map((priceItem) => (
                                                                        <tr className="border-dark border" key={priceItem.priceId}>
                                                                            <td className="border-dark border" >{priceItem.productCode || "N/A"}</td>
                                                                            <td className="border-dark border" >{`${priceItem.quantity || "N/A"} ${priceItem.unit || ""}`}</td>
                                                                            <td className="border-dark border" >{`${priceItem.price || "N/A"} ${priceItem.currency || "USD"}`}</td>
                                                                            {localStorage.getItem("roleName") === "Product_Coordinator" && <td className="border-dark border"><i onClick={() => deletePrice(priceItem.priceId)} class="fa-solid fa-trash" style={{ color: "#f04b05" }}></i></td>}
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        ) : (
                                                            localStorage.getItem("roleName") === "Product_Coordinator" ? <button
                                                                className=""
                                                                onClick={() => handleOne(product)}
                                                            >
                                                                Add Price
                                                            </button> : "Price Not updated yet"
                                                        )}
                                                        {/* Add More button below the table */}
                                                        {product.priceList && product.priceList.length > 0 && (
                                                            localStorage.getItem("roleName") === "Product_Coordinator" && <button
                                                                className="btn btn-sm btn-success mt-2 rounded"
                                                                onClick={() => handleOne(product)}
                                                            >
                                                                Add More
                                                            </button>
                                                        )}
                                                    </td>

                                                    {localStorage.getItem("roleName") === "Product_Coordinator" && <td rowSpan={rowDetails.length} style={{ padding: "5px" }}>
                                                        <button onClick={() => handleEnable(product)}>EDIT</button>
                                                        <button style={{ marginLeft: "3px", backgroundColor: "transparent" }} onClick={() => handleDeleteProduct(product)}><img src="https://cdn-icons-png.flaticon.com/128/17381/17381043.png" style={{ height: "50px" }} />  </button>
                                                    </td>}
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    No products match your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>


            </div>
            <div style={{ paddingLeft: "100px", paddingRight: "100px" }} className="m-3">
                {generatePagination()}

            </div>
            {/* Add Price Modal */}
            <Modal show={one} onHide={handleZero} centered>
                <div className="modal-header bg-primary text-white">
                    <h5 className="text-center">Add Fixed Price</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={handleZero}></button>
                </div>
                <div className="modal-body">
                    <form >
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label htmlFor="unit" className="form-label">Unit</label>
                                <input
                                    type="text"
                                    id="unit"
                                    placeholder=""
                                    className="form-control"
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="currency" className="form-label">Currency</label>
                                <input
                                    type="text"
                                    id="currency"
                                    placeholder=""
                                    className="form-control"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Quantities and Prices</label>
                            {quantities.map((item, index) => (
                                <div className="d-flex gap-2 mb-2 align-items-center" key={index}>
                                    {/* <input
                                        type="text"
                                        placeholder="productCode"
                                        className="form-control"
                                        value={item.productCode}
                                        onChange={(e) => handleQuantityChange(index, "productCode", e.target.value)}
                                        required
                                    /> */}
                                    <input
                                        type="number"
                                        placeholder="Quantity"
                                        className={`form-control ${dark ? `bg-secondary text-light` : ``}`}
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(index, "quantity", e.target.value)}
                                        required
                                    />
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        className="form-control"
                                        value={item.price}
                                        onChange={(e) => handleQuantityChange(index, "price", e.target.value)}
                                        required
                                    />
                                    {/* <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => handleRemoveRow(index)}
                                    >
                                        Remove
                                    </button> */}
                                    {/* <button className="btn btn-success" onClick={handleAddPriceInBody}>Add</button> */}
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn btn-outline-success"
                                onClick={handleAddMore}
                            >
                                Add More
                            </button>
                        </div>

                        {submitError && <div className="text-danger">{submitError}</div>}

                        <div className="d-flex justify-content-end">
                            <button onClick={handleSubmit} className="btn btn-primary">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleZero}>
                        Close
                    </button>
                </div>
            </Modal>


            {/* Add Category Modal */}
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
                    <button className="btn btn-warning" onClick={handleUpdateCategory}>
                        {category ? "Update Category" : "Add Category"}
                    </button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>

            </Modal>

            {/* Add image Modal */}
            <Modal show={on} onHide={handleOn}>
                <Modal.Header OffButton>
                    <Modal.Title>Add Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <UpProductImg id={productId} ofFunction={handleOff} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleOff}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* action/EDIT */}
            <Modal className="" show={enable} onHide={handleDesable}>
                <div className="m-3 d-flex justify-content-end" >
                    <i onClick={handleDesable} class="fa-solid fa-xmark  fa-xl"></i>
                </div>
                <EditMIS_Product id={productId} closeFunction={handleDesable} />
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

            <Modal
                show={isAddProductOpen}
                onHide={handleCloseProductAdd}
                centered
                dialogClassName="custom-modal-width"
            >
                <Modal.Body className={`d-flex flex-column justify-content-center align-items-center ${dark ? "bg-dark" : ""}`}>
                    <Uploaded_product closeFunction={handleCloseProductAdd} />
                </Modal.Body>
            </Modal>


        </div>
    );
}

export default MIS_Product;
