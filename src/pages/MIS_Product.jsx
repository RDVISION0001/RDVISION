import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { Modal } from "react-bootstrap";

function MIS_Product() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [one, setOne] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // State for modal inputs
    const [unit, setUnit] = useState("");
    const [currency, setCurrency] = useState("");
    const [quantities, setQuantities] = useState([{ quantity: "", price: "" }]);
    const [requestBody, setRequestBody] = useState([])
    const [submitError, setSubmitError] = useState(null);

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

    return (
        <div>
            <h3 className="title text-center">MIS-Product Department</h3>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>S.No.</th>
                            <th>Product Image</th>
                            <th colSpan="2">Product Details</th>
                            <th>Product Code</th>
                            <th>Pills Qty</th>
                            <th>Price</th>
                            <th>Price per Pill</th>
                            <th>Brochure Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <React.Fragment key={product.productId}>
                                {rowDetails.map((row, rowIndex) => (
                                    <tr key={`${product.productId}-${rowIndex}`}>
                                        {rowIndex === 0 && (
                                            <>
                                                <td rowSpan={rowDetails.length}>{index + 1}</td>
                                                <td rowSpan={rowDetails.length}>
                                                    {product.images?.length > 0 ? (
                                                        <img src={product.images[0]} alt="Product" style={{ maxWidth: "100px" }} />
                                                    ) : (
                                                        "No Image"
                                                    )}
                                                </td>
                                            </>
                                        )}
                                        <td>{row.label}</td>
                                        <td>{product[row.valueKey] || "N/A"}</td>
                                        {rowIndex === 0 && (
                                            <>
                                                <td rowSpan={rowDetails.length}>{product.productCode || "N/A"}</td>
                                                <td rowSpan={rowDetails.length}>{product.packagingSize || "N/A"}</td>
                                                <td rowSpan={rowDetails.length}>
                                                    {product.price ? (
                                                        `$${product.price}`
                                                    ) : (
                                                        <button onClick={() => handleOne(product)}>Add</button>
                                                    )}
                                                </td>
                                                <td rowSpan={rowDetails.length}>
                                                    {product.price && product.packagingSize
                                                        ? `$${(product.price / product.packagingSize).toFixed(2)}`
                                                        : "N/A"}
                                                </td>
                                                <td rowSpan={rowDetails.length}>
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
        </div>
    );
}

export default MIS_Product;
