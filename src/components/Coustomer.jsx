import React from 'react';

const Coustomer = () => {
  return (
    <div className="container my-4">
      <div className="bg-white p-4 border">
        {/* Company Details */}
        <div className="text-center mb-4">
          <h1 className="h4 mb-1">Your Company Name</h1>
          <p className="mb-1">123 Company Address, City, Country</p>
          <p>Phone: +123 456 7890 | Email: info@company.com</p>
        </div>
        
        {/* Invoice and Customer Details */}
        <div className="mb-4">
          <div className="row">
            <div className="col-md-6">
              <p><strong>Invoice Number:</strong> #INV-123456789</p>
              <p><strong>Invoice Date:</strong> September 4, 2024</p>
              <p><strong>Due Date:</strong> September 11, 2024</p>
            </div>
            <div className="col-md-6 text-md-right">
              <p><strong>Billed To:</strong></p>
              <p>Customer Name</p>
              <p>Customer Address</p>
              <p>City, Country</p>
              <p>Phone: +987 654 3210</p>
            </div>
          </div>
        </div>
        
        {/* Products Table */}
        <div className="mb-4">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th className="text-right">Unit Price</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>PAIN O SOMA CARISOPRODOL 350 mg</td>
                <td>2</td>
                <td className="text-right">$139.00</td>
                <td className="text-right">$278.00</td>
              </tr>
              <tr>
                <td>PAIN O SOMA CARISOPRODOL 350 mg</td>
                <td>3</td>
                <td className="text-right">$89.00</td>
                <td className="text-right">$267.00</td>
              </tr>
              <tr>
                <td>TAPDOL 100</td>
                <td>3</td>
                <td className="text-right">$89.00</td>
                <td className="text-right">$267.00</td>
              </tr>
              <tr>
                <td>TAPDOL 105</td>
                <td>3</td>
                <td className="text-right">$349.00</td>
                <td className="text-right">$1047.00</td>
              </tr>
              <tr>
                <td>TOPCYNTA 103</td>
                <td>5</td>
                <td className="text-right">$189.00</td>
                <td className="text-right">$945.00</td>
              </tr>
              <tr>
                <td>PAIN O SOMA CARISOPRODOL 350 mg</td>
                <td>10</td>
                <td className="text-right">$69.99</td>
                <td className="text-right">$699.90</td>
              </tr>
              <tr>
                <td>PRO SOMA 500mg</td>
                <td>3</td>
                <td className="text-right">$279.00</td>
                <td className="text-right">$837.00</td>
              </tr>
              <tr>
                <td>PAIN O SOMA CARISOPRODOL 350 mg</td>
                <td>4</td>
                <td className="text-right">$285.00</td>
                <td className="text-right">$1140.00</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Total Amount */}
        <div className="text-right mb-4">
          <p className="h5"><strong>Total Amount: $930.99</strong></p>
        </div>
        
        {/* View Order Button */}
        <div className="text-center mb-4">
          <a href="https://yourwebsite.com/view-order/INV-123456789" className="btn btn-primary">
            View Order
          </a>
        </div>
        
        {/* Footer */}
        <div className="text-center text-muted" style={{ fontSize: '12px' }}>
          <p>&copy; 2024 Your Company Name. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
};



export default Coustomer;