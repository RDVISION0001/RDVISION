import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../axiosInstance';
import { toast } from 'react-toastify';

function ProductPriceForm({ productId, productName, onClose, ticketId,currency }) {
    const [unit, setUnit] = useState('');
    const [entries, setEntries] = useState([{ priceId: null, quantity: '', price: '' }]); // Default row
    const [prices, setPrices] = useState([]);

    // Fetch price list and unit
    const fetchPriceList = async () => {
        try {
            const response = await axiosInstance.post(`/product/getProductPrices`, {
                ticketId,
                productId,
            });
            setPrices(response.data);

            // Set unit from the first price entry (assuming all entries have the same unit)
            if (response.data.length > 0) {
                setUnit(response.data[0].unit);
            }

            // Map existing prices to entries with editable fields
            const fetchedEntries = response.data.map(price => ({
                priceId: price.priceId,
                quantity: price.quantity,
                price: price.price,
            }));

            // Ensure at least one row is always shown
            setEntries(fetchedEntries.length > 0 ? fetchedEntries : [{ priceId: null, quantity: '', price: '' }]);
        } catch (e) {
            toast.error('Some error occurred while fetching prices.');
        }
    };

    useEffect(() => {
        if (productId > 0) {
            fetchPriceList();
        }
    }, [productId]);

    // Handle unit change
    const handleUnitChange = (e) => {
        setUnit(e.target.value);
    };

    // Handle input changes for quantity and price
    const handleEntryChange = (index, field, value) => {
        const updatedEntries = [...entries];
        updatedEntries[index][field] = value;
        setEntries(updatedEntries);
    };

    // Add a new empty quantity and price field
    const addQuantityPriceField = () => {
        setEntries([...entries, { priceId: null, quantity: '', price: '' }]);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Gather all data in the required format
        const data = entries.map((entry) => ({
            priceId: entry.priceId, // Include priceId for existing entries
            unit,
            quantity: parseInt(entry.quantity, 10),
            price: parseInt(entry.price, 10),
            product: { productId },
            ticketId: ticketId,
            currency:currency
        }));

        try {
            const response = await axiosInstance.post('/product/addprices', data);
            console.log('Submitted data:', response);
            toast.success('Prices updated successfully!');
            onClose(); // Close the form after submission
        } catch (error) {
            toast.error('Failed to submit prices.');
        }
    };

    return (
        <div className="p-4 rounded">
            <h5>Product: {productName}</h5>
            <form onSubmit={handleSubmit}>
                {/* Unit Input */}
                <div className="mb-3">
                    <label htmlFor="unit" className="form-label">Unit</label>
                    <input
                        type="text"
                        id="unit"
                        value={unit}
                        onChange={handleUnitChange}
                        className="form-control"
                        required
                    />
                </div>

                {/* Quantity and Price Inputs */}
                <div className="mb-3">
                    <label className="form-label">Quantities and Prices</label>
                    {entries.map((entry, index) => (
                        <div key={index} className="d-flex gap-2 mb-2">
                            <input
                                type="number"
                                value={entry.quantity}
                                onChange={(e) => handleEntryChange(index, 'quantity', e.target.value)}
                                placeholder="Quantity"
                                className="form-control"
                                required
                            />
                            <input
                                type="number"
                                value={entry.price}
                                onChange={(e) => handleEntryChange(index, 'price', e.target.value)}
                                placeholder="Price"
                                className="form-control"
                                required
                            />
                        </div>
                    ))}
                </div>

                {/* Add More Fields Button */}
                <div className="mb-3">
                    <button
                        type="button"
                        className="btn btn-outline-success"
                        onClick={addQuantityPriceField}
                    >
                        Add More
                    </button>
                </div>

                {/* Submit Button */}
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProductPriceForm;
