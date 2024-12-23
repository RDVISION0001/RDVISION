import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import axiosInstance from "../axiosInstance";

const CostForm = ({ productId, order_id,closeFunction }) => {
  const [formData, setFormData] = useState({
    id:productId,
    rate: "",
    totalCost: "",
    shippingCharge: "",
    totalGoodsCost: "",
    paidAmount: "",
    dueAmount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => {
      const updatedFormData = {
        ...prevState,
        [name]: value,
      };

      // Automatically calculate the due amount
      if (name === "paidAmount" || name === "totalCost") {
        const due =
          Number(updatedFormData.totalCost || 0) -
          Number(updatedFormData.paidAmount || 0);
        updatedFormData.dueAmount = due > 0 ? due : 0;
      }

      return updatedFormData;
    });
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
  
    try{
      const response =await axiosInstance.put("/inventory/updateProductOrderDetails",formData)
      toast.success("Updated")
      closeFunction()
    }catch(e){
      toast.error("Some Error Occures")
    }
  };


  return (
    <>
      <div className="container mt-4">
        <div className="border border-secondary p-4 rounded">
          <h2 className="text-center text-uppercase fw-bold fs-4">
            Order Updatation Form
          </h2>
          <form onSubmit={handleSubmit} className="mt-4">
            {/* Rate */}
            <div className="row">
              <div className="mb-3 col-6">
                <label htmlFor="rate" className="form-label text-secondary">
                  Rate
                </label>
                <input
                  type="number"
                  className="form-control border-gray px-4 py-2 fs-6 rounded"
                  id="rate"
                  name="rate"
                  value={formData.rate}
                  onChange={handleChange}
                  placeholder="Enter rate"
                />
              </div>
              <div className="mb-3 col-6">
                <label
                  htmlFor="shippingCharge"
                  className="form-label text-secondary"
                >
                  Shipping Charge
                </label>
                <input
                  type="number"
                  className="form-control border-gray rounded px-4 py-2 fs-6"
                  id="shippingCharge"
                  name="shippingCharge"
                  value={formData.shippingCharge}
                  onChange={handleChange}
                  placeholder="Enter shipping charge"
                />
              </div>
            </div>

            {/* Total Cost */}
            <div className="row d-flex justify-content-between">
              <div className="mb-3 col-6">
                <label
                  htmlFor="totalCost"
                  className="form-label text-secondary"
                >
                  Total Cost
                </label>
                <input
                  type="number"
                  className="form-control border-gray rounded px-4 py-2 fs-6"
                  id="totalCost"
                  name="totalCost"
                  value={formData.totalCost}
                  onChange={handleChange}
                  placeholder="Enter total cost"
                />
              </div>
              <div className="mb-3 col-6">
                <label
                  htmlFor="paidAmount"
                  className="form-label text-secondary"
                >
                  Paid Amount
                </label>
                <input
                  type="number"
                  className="form-control border-gray rounded px-4 py-2 fs-6"
                  id="paidAmount"
                  name="paidAmount"
                  value={formData.paidAmount}
                  onChange={handleChange}
                  placeholder="Enter paid amount"
                />
              </div>
            </div>

            {/* Shipping Charge */}
            <div className="row d-flex justify-content-between">
              {/* Total Good Cost */}
              <div className="mb-3 col-6">
                <label
                  htmlFor="totalGoodsCost"
                  className="form-label text-secondary"
                >
                  Total Good Cost
                </label>
                <input
                  type="number"
                  className="form-control rounded px-4 py-2 fs-6 border-gray border"
                  id="totalGoodsCost"
                  name="totalGoodsCost"
                  value={formData.totalGoodsCost}
                  onChange={handleChange}
                  placeholder="Enter total good cost"
                />
              </div>
              <div className="mb-3 col-6">
                <label
                  htmlFor="dueAmount"
                  className="form-label text-secondary"
                >
                  Due Amount
                </label>
                <input
                  type="number"
                  className="form-control border-gray rounded px-4 py-2 fs-6"
                  id="dueAmount"
                  name="dueAmount"
                  value={formData.dueAmount}
                  readOnly
                  placeholder="Calculated due amount"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-end">
              <button
                type="submit"
                className="btn btn-primary rounded-pill px-4 py-2"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CostForm;
