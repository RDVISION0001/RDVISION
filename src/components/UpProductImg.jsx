import React, { useState } from "react";
import { FaCamera, FaVideo, FaFilePdf } from "react-icons/fa";
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";

const SimpleUploadUI = (props) => {
    const productId = props.id;
    const [imageList, setImageList] = useState([])



    const handleFileChange = (event) => {
        const files = Array.from(event.target.files); // Convert FileList to an Array
        const newImageList = [];

        files.forEach((file) => {
            const reader = new FileReader();

            reader.onloadend = () => {
                newImageList.push(reader.result.split(",")[1]);

                // Once all files are processed, update the state
                if (newImageList.length === files.length) {
                    setImageList((prev) => [...prev, ...newImageList]);
                }
            };

            if (file) {
                reader.readAsDataURL(file); // Convert the file to a Base64 string
            }
            closeLinkInput()
        });
    };


    const openLinkInput = () => {

        const inputElement = document.getElementById("inputLink");
        inputElement.showModal()
        inputElement.classList.add("d-flex")
    };
    const closeLinkInput = () => {
        const inputElement = document.getElementById("inputLink");
        inputElement.classList.remove("d-flex")
        inputElement.close()
        // setImageLink("")
    };
    //resuble function to convert byte code to image url
    function convertToImage(imageString) {
        const byteCharacters = atob(imageString); // Decode base64 string
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        return url;

    }

    const hanleImageUplaod = async () => {
        let imageDataList = []
        for (let i = 0; i < imageList.length; i++) {
            imageDataList.push({
                product: {
                    productId: productId
                },
                imageData: imageList[i]
            })
        }
        console.log(imageDataList)
        const response = await axiosInstance.post("/product/addImage", imageDataList)
        console.log(response.data)

        toast.success("Image Uplaoded")
    }
    return (
        <div className="container d-flex align-items-center justify-content-center">
            <div>
                <div className="d-flex align-items-start">
                    {/* Left Column (Small Image Frames) */}
                    <div className="d-flex flex-column gap-2 me-4" style={{ marginRight: "40px" }}>
                        {[...Array(5)].map((_, index) => (
                            <div
                                key={index}
                                className="d-flex justify-content-center align-items-center border rounded"
                                style={{
                                    width: "70px",
                                    height: "70px",
                                    borderWidth: "2px",
                                    borderColor: "#ddd",
                                    backgroundColor: "#f9f9f9",
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                {imageList[index + 1] ? <img src={convertToImage(imageList[index + 1])} style={{ maxWidth: "70px" }} /> : <FaCamera size={20} className="text-muted" onClick={openLinkInput} />}
                            </div>
                        ))}
                    </div>

                    {/* Right Section */}
                    <div className="d-flex flex-column align-items-center gap-3">
                        {/* Large Main Image Frame */}
                        <div
                            className="d-flex justify-content-center align-items-center border rounded"
                            style={{
                                width: "250px",
                                height: "313px",
                                borderWidth: "2px",
                                borderColor: "#ddd",
                                backgroundColor: "#f9f9f9",
                                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                            }}
                        >

                            {imageList[0] ? <img src={convertToImage(imageList[0])} style={{ maxWidth: "250px" }} /> : <FaCamera size={40} className="text-muted" onClick={openLinkInput} />}
                        </div>

                        <div className="d-flex gap-3">

                            {/* <div
                            className="d-flex justify-content-center align-items-center border rounded"
                            style={{
                                width: "120px",
                                height: "50px",
                                borderWidth: "2px",
                                borderColor: "#ddd",
                                backgroundColor: "#f9f9f9",
                                boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <FaVideo size={20} className="text-muted" />
                        </div> */}

                            {/* <div
                            className="d-flex justify-content-center align-items-center border rounded"
                            style={{
                                width: "120px",
                                height: "50px",
                                borderWidth: "2px",
                                borderColor: "#ddd",
                                backgroundColor: "#f9f9f9",
                                boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <FaFilePdf size={20} className="text-muted" />
                        </div> */}
                        </div>
                    </div>

                </div>
                <button className='bg-primary text-white m-2' onClick={hanleImageUplaod}>Save Images</button>
            </div>
            <dialog id='inputLink' className='w-100 h-100  bg-transparent justify-content-center align-items-center' style={{ height: '100vh' }}>
                <>

                    <div className='d-flex flex-column justify-content-center align-items-center bg-white p-3 rounded'>
                        <div style={{ width: "100%", textAlign: "right", marginBottom: "4px" }}> <button onClick={closeLinkInput}>close</button></div>

                        <label htmlFor="image">Add image list</label>
                        <div className="custom-file">
                            <input
                                type="file"
                                className="custom-file-input"
                                id="upload-profile-img"
                                onChange={(e) => handleFileChange(e, 'image')}
                                name="upload-profile"
                                multiple // Allows multiple files to be selected
                            />
                            <label className="custom-file-label" htmlFor="upload-profile-img">
                                Choose files
                            </label>
                        </div>

                    </div>
                </>
            </dialog>
        </div>
    );
};

export default SimpleUploadUI;
