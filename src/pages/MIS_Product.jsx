import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { Modal, Button } from 'react-bootstrap';
// Toast notification
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MIS_Product() {
    const [category, setCategory] = useState(""); // Added state for category
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [one, setOne] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false);


    // State for modal inputs
    const [unit, setUnit] = useState("");
    const [currency, setCurrency] = useState("");
    const [quantities, setQuantities] = useState([{ quantity: "", price: "" }]);
    const [requestBody, setRequestBody] = useState([])
    const [submitError, setSubmitError] = useState(null);
    const [productId, setProductId] = useState([]);


    useEffect(() => {
        fetchProducts();
    }, []);

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

    //add catogry modal 
    const handleClose = () => {
        setShow(false);    // Close the modal
        setCategory("");   // Clear the category input
        setProductId(null); // Reset productId
    };
    const handleShow = (id) => {
        const product = products.find((p) => p.productId === id);
        setCategory(product?.category || ""); // Pre-fill category for editing
        setProductId(id);
        setShow(true);
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

    const handleAddMore = () => {
        setQuantities([...quantities, { quantity: "", price: "" }]);
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
        setSubmitError(null);

        if (!unit || quantities.some((q) => !q.quantity || !q.price)) {
            setSubmitError("All fields are required.");
            return;
        }

        const payload = {
            product: {
                productId: selectedProduct?.productId,
            },
            quantity: quantities[0]?.quantity,
            price: quantities[0]?.price,
            productCode: selectedProduct?.productCode || "N/A",
            unit,
            currency: currency || "USD",
        };

        try {
            const response = await axiosInstance.post("/product/addFixedPriceList", requestBody);
            console.log("Response:", response.data);
            handleZero();
            fetchProducts();
        } catch (err) {
            setSubmitError(err.response?.data?.message || "Failed to submit data.");
        }
    };

    const rowDetails = [
        { label: "Category", valueKey: "category" },
        { label: "Product Name", valueKey: "name" },
        { label: "Generic Name", valueKey: "composition" },
        { label: "Brand", valueKey: "brand" },
        { label: "Strength", valueKey: "strength" },
        { label: "Packaging Sizes", valueKey: "packagingSize" },
        { label: "Packaging Types", valueKey: "packagingType" },
        { label: "Treatment", valueKey: "treatment" },
    ];

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const handleAddPriceInBody = (e) => {
        e.preventDefault()
        const latestQuantity = quantities[quantities.length - 1]; // Get the last entry in the array

        setRequestBody((prev) => [
            ...prev,
            {
                product: {
                    productId: selectedProduct.productId,
                },
                quantity: latestQuantity.quantity,
                price: latestQuantity.price,
                unit,
                currency: currency || "USD", // Default to USD if currency is not set
            },
        ]);
    };
    console.log(requestBody)


    const handleUpdateCategory = async () => {
        try {
            const response = await axiosInstance.put("/product/updateCategory", {
                productId,
                category,
            });
            console.log("Category updated successfully:", response.data);
            toast.success("Category updated successfully");

            setShow(false);    // Close the modal

            // Automatically close the modal after success
            handleClose(); // Close the modal
        } catch (error) {
            console.error("Error updating category:", error);
            toast.error("Failed to update category. Please try again.");
        }
    };




    return (
        <div className="container-fluid">
            <h3 className="title text-center">MIS-Product Department</h3>
            <div className="table-responsive">
                <table className="table table-bordered border-dark">
                    <thead>
                        <tr>
                            <th style={{ width: "5%" }}>S.No.</th>
                            <th style={{ width: "10%" }}>Product Image</th>
                            <th style={{ width: "20%" }} colSpan="2">Product Details</th>
                            <th style={{ width: "15%" }}>Product Code</th>
                            <th style={{ width: "15%" }}>Quantity & Unit</th>
                            <th style={{ width: "15%" }}>Price & Currency</th>
                            <th style={{ width: "10%" }}>Brochure Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <React.Fragment key={product.productId}>
                                {rowDetails.map((row, rowIndex) => (
                                    <tr key={`${product.productId}-${rowIndex}`}>
                                        {rowIndex === 0 && (
                                            <>
                                                <td rowSpan={rowDetails.length} style={{ padding: "5px" }}>{index + 1}</td>
                                                <td rowSpan={rowDetails.length} style={{ padding: "5px" }}>
                                                    {product.images?.length > 0 ? (
                                                        <img src={product.images[0]} alt="Product" style={{ maxWidth: "80px" }} />
                                                    ) : (
                                                        "No Image"
                                                    )}
                                                </td>
                                            </>
                                        )}
                                        <td className="fw-bold" style={{ padding: "5px" }}>{row.label}</td>
                                        <td style={{ padding: "5px" }}>
                                            {row.valueKey === "category" && (
                                                <>
                                                    {product[row.valueKey] && product[row.valueKey] !== "N/A" ? (
                                                        <>
                                                            {product[row.valueKey]}{" "}
                                                            <button
                                                                className="btn btn-sm btn-warning ms-2"
                                                                onClick={() => handleShow(product.productId)}
                                                            >
                                                                Edit
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button onClick={() => handleShow(product.productId)}>Add Category</button>
                                                    )}
                                                </>
                                            )}
                                            {row.valueKey !== "category" && (
                                                <>
                                                    {product[row.valueKey] || "N/A"}
                                                </>
                                            )}
                                        </td>
                                        {/* Apply smaller padding and font size to the rest of the table rows */}
                                        {rowIndex === 0 && (
                                            <>
                                                <td rowSpan={rowDetails.length} style={{ padding: "5px" }}>
                                                    {product.priceList && product.priceList.length > 0 ? (
                                                        <table className="table table-sm table-bordered" style={{ fontSize: "12px" }}>
                                                            <tbody>
                                                                {product.priceList.map((priceItem) => (
                                                                    <tr key={priceItem.priceId}>
                                                                        <td>{priceItem.productCode || "N/A"}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    ) : (
                                                        <button onClick={() => handleOne(product)}>Add Price</button>
                                                    )}
                                                </td>
                                                <td rowSpan={rowDetails.length} style={{ padding: "5px" }}>
                                                    {product.priceList && product.priceList.length > 0 ? (
                                                        <table className="table table-sm table-bordered" style={{ fontSize: "12px" }}>
                                                            <tbody>
                                                                {product.priceList.map((priceItem) => (
                                                                    <tr key={priceItem.priceId}>
                                                                        <td>
                                                                            {priceItem.quantity || "N/A"} {priceItem.unit || ""}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    ) : (
                                                        "N/A"
                                                    )}
                                                </td>
                                                <td rowSpan={rowDetails.length} style={{ padding: "5px" }}>
                                                    {product.priceList && product.priceList.length > 0 ? (
                                                        <table className="table table-sm table-bordered" style={{ fontSize: "12px" }}>
                                                            <tbody>
                                                                {product.priceList.map((priceItem) => (
                                                                    <tr key={priceItem.priceId}>
                                                                        <td>
                                                                            {`$${priceItem.price}`} {priceItem.currency || "USD"}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    ) : (
                                                        "N/A"
                                                    )}
                                                </td>
                                                <td rowSpan={rowDetails.length} style={{ padding: "5px" }}>
                                                    <a href={product.bruchureLink || "#"}>Brochure</a>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>


                </table>

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
                                    placeholder="Pills"
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
                                    placeholder="USD"
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
                                    <input
                                        type="number"
                                        placeholder="Quantity"
                                        className="form-control"
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
                                    <button className="btn btn-success" onClick={handleAddPriceInBody}>Add</button>
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
        </div>
    );
}

export default MIS_Product;
