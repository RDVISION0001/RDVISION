import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../axiosInstance';

const AddressForm = ({ ticketId,close}) => {
    const [formData, setFormData] = useState({
        addressId: '',
        ticketId: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        houseNumber: '',
        landmark: '',
        city: '',
        zipCode: '',
        state: '',
        country: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/address/createAddress', {
                houseNumber:formData.houseNumber,
                landmark:formData.landmark,
                city: formData.city,
                zipCode: formData.zipCode,
                state:formData.state,
                country: formData.country,
                ticketId: ticketId
            });
            toast.success('Address added successfully!');
            close()
        } catch (err) {
           
            toast.error('Failed to add address');
        } 
    };

    return (
        <form onSubmit={handleSubmit} className="p-3">
            <div className="d-flex flex-wrap justify-content-between p-3">
                <div className="form-group col-6">
                    <label>House Number</label>
                    <input
                        type="text"
                        name="houseNumber"
                        className="form-control"
                        value={formData.houseNumber}
                        onChange={handleChange}
                    />
                </div>
                <div className=" ml-2 form-group col-6">
                    <label>Landmark</label>
                    <input
                        type="text"
                        name="landmark"
                        className="form-control"
                        value={formData.landmark}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group col-6">
                    <label>City</label>
                    <input
                        type="text"
                        name="city"
                        className="form-control"
                        value={formData.city}
                        onChange={handleChange}
                    />
                </div>
                <div className=" ml-2 form-group col-6">
                    <label>Zip Code</label>
                    <input
                        type="text"
                        name="zipCode"
                        className="form-control"
                        value={formData.zipCode}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group col-6">
                    <label>State</label>
                    <input
                        type="text"
                        name="state"
                        className="form-control"
                        value={formData.state}
                        onChange={handleChange}
                    />
                </div>
                <div className=" ml-2 form-group col-6">
                    <label>Country</label>
                    <input
                        type="text"
                        name="country"
                        className="form-control"
                        value={formData.country}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <button type="submit" className="btn btn-primary mt-3">Submit</button>
        </form>
    );
};

export default AddressForm;
