import React from 'react';

function New_Products() {
    return (
        <div>
            {/* New products requirement */}
            <section className="followup-table-section py-3">
                <div className="container-fluid">
                    <div className="table-wrapper tabbed-table">
                        <h3 className="title">New Products Requirements</h3>
                        <div className="col-md-5 mb-3">
                            <div className="search-wrapper">
                                <input
                                    type="text"
                                    name="search-user"
                                    id="searchUsers"
                                    className="form-control"
                                    placeholder="Search products by name"
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
                                    <div className="col-md-2 mb-4">
                                        <div
                                            className="card product-card shadow-sm h-100"
                                            style={{
                                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                            }}
                                        >
                                            <div className="card-header">
                                                <h5 className="card-title">Product Name</h5>
                                            </div>
                                            <img
                                                src="path/to/image.jpg"
                                                className="card-img-top"
                                                alt="Product Name"
                                                style={{ height: "200px", objectFit: "cover" }}
                                            />
                                            <div className="card-body">
                                                <p className="card-text"><strong>Product Code:</strong> CODE123</p>
                                                <p className="card-text"><strong>Strength:</strong> 500mg</p>
                                                <p className="card-text"><strong>Packaging Size:</strong> 10 Tablets</p>
                                                <p className="card-text"><strong>Packaging Type:</strong> Box</p>
                                                <p className="card-text"><strong>Composition:</strong> Sample Composition</p>
                                                <p className="card-text"><strong>Brand:</strong> Sample Brand</p>
                                                <p className="card-text"><strong>Treatment:</strong> Treatment details...</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Repeat the card structure above for additional static products if needed */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default New_Products;
