import React, { useEffect, useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import axiosInstance from '../axiosInstance';
import { toast } from 'react-toastify';
import { Modal, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Uploaded_product from '../pages/uploaded_product'
import { useAuth } from '../auth/AuthContext';


function New_Products() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditProductOpen, setIsEditProductOpen] = useState(false)
    const [selectedProductId, setSelectedProductId]=useState()
    const [selectedPtoductName,setSelectedProductName]=useState("")
    const {dark} = useAuth()

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

    const handleEditProduct = (productId,name) => {
        setSelectedProductId(productId)
        setIsEditProductOpen(true)
        setSelectedProductName(name)
    }

    const handleCloseEditProduct = () => {
        setIsEditProductOpen(false)
        setSelectedProductId(0)
        setSelectedProductName("")
        fetchProducts()
    }




    return (
        <div>


            {/* Product Card List */}
            <section className={`followup-table-section py-3 ${dark ? "bg-dark":""}`}>
                <div className="container-fluid ">
                    <div className={`table-wrapper  tabbed-table ${dark ? "bg-dark text-light":""}`}>
                        <h3 className={`${dark ? "text-light":""}`}>Products List</h3>

                        {/* Search Bar */}
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

                        {/* Products Table */}
                        <div className="tab-content recent-transactions-tab-body" id="followUpContent">
                            <div
                                className="tab-pane fade show active border"
                                id="new-arrivals-tkts-tab-pane"
                                role="tabpanel"
                                aria-labelledby="new-arrivals-tkts-tab"
                                tabIndex="0"
                            >
                                <table className={`table table-striped ${dark?"table-dark":""}`}>
                                    <thead>
                                        <tr>
                                            <th className={`px-2 border ${dark?"bg-secondary":""}`} scope="col">New Query Product Name</th>
                                            <th className={`px-2 border ${dark?"bg-secondary":""}`} scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Map through filteredProducts to create rows */}
                                        {filteredProducts.filter((product)=>!product.brand && !product.strength )
                                            .map((product, index) => (
                                                <tr key={index}>
                                                    <td>{product.name}</td> {/* Product Name */}
                                                    <td>
                                                        {/* Action Buttons */}
                                                        <button className="btn btn-primary" onClick={() => handleEditProduct(product.productId,product.name)}>Edit Product</button>
                                                        <button className="btn btn-danger ms-2" onClick={() => handleDeleteProduct(product.productId)}>Delete</button>
                                                    </td>

                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Modal
                show={isEditProductOpen}
                onHide={handleCloseEditProduct}
                centered
                dialogClassName="custom-modal-width"
            >
                <Modal.Body className="d-flex flex-column justify-content-center align-items-center">
                    <Uploaded_product selectedProduct={selectedProductId} productName={selectedPtoductName} closeFunction={handleCloseEditProduct}/>
                </Modal.Body>
            </Modal>
        </div>
    );
}



export default New_Products;
