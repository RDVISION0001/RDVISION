import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../axiosInstance';
import { toast } from 'react-toastify';

function ProductPriceForm({ productId, productName, onClose, ticketId, currency }) {
    const [unit, setUnit] = useState('');
    const [entries, setEntries] = useState([{ priceId: null, quantity: '', price: '', paymentLink: '' }]); // Default row
    const [prices, setPrices] = useState([]);

    // Fetch price list and unit
    const fetchPriceList = async () => {
        try {
            const response = await axiosInstance.post(`/product/getProductPrices`, {
                ticketId,
                productId,
            });
            setPrices(response.data);

            if (response.data.length > 0) {
                setUnit(response.data[0].unit);
            }

            const fetchedEntries = response.data.map(price => ({
                priceId: price.priceId,
                quantity: price.quantity,
                price: price.price,
                paymentLink: price.paymentLink 
            }));

            setEntries(fetchedEntries.length > 0 ? fetchedEntries : [{ priceId: null, quantity: '', price: '', paymentLink: '' }]);
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
        setEntries([...entries, { priceId: null, quantity: '', price: '', paymentLink: '' }]);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = entries.map((entry) => ({
            priceId: entry.priceId,
            unit,
            quantity: parseInt(entry.quantity, 10),
            price: parseInt(entry.price, 10),
            product: { productId },
            ticketId: ticketId,
            currency: currency,
            paymentLink: entry.paymentLink // Corrected reference
        }));

        try {
            const response = await axiosInstance.post('/product/addprices', data);
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
                            <input
                                type="link"
                                value={entry.paymentLink}
                                onChange={(e) => handleEntryChange(index, 'paymentLink', e.target.value)}
                                placeholder="Payment Link"
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
