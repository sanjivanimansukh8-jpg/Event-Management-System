import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddPackage.css";

function AddPackage() {
    const navigate = useNavigate();

    const [packageData, setPackageData] = useState({
        packageName: "",
        price: "",
        people: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setPackageData({
            ...packageData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
           const response = await fetch(
            `${import.meta.env.VITE_API_URL}/packagess`, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    packageName: packageData.packageName,
                    price: Number(packageData.price),
                    people: Number(packageData.people)
                })
            });

            if (response.ok) {
                setMessage("Package added successfully!");

                setTimeout(() => {
                    navigate("/admin/manage-packages");
                }, 1000);
            } else {
                setMessage("Failed to add package.");
            }
        } catch (error) {
            console.error(error);
            setMessage("Server error.");
        }
    };

    return (
        <div className="add-package-page">
            <div className="add-package-container">
                <h1>Add Package</h1>
                <p>Create a new event package</p>
                {message && (
                    <div className="package-message">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Package Name</label>
                        <input
                            type="text"
                            name="packageName"
                            value={packageData.packageName}
                            onChange={handleChange}
                            placeholder="Enter package name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Price</label>
                        <input
                            type="number"
                            name="price"
                            value={packageData.price}
                            onChange={handleChange}
                            placeholder="Enter price"
                            min="0"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>People Included</label>
                        <input
                            type="number"
                            name="people"
                            value={packageData.people}
                            onChange={handleChange}
                            placeholder="Enter number of people"
                            min="1"
                            required
                        />
                    </div>

                    <div className="package-buttons">
                        <button type="submit">Add Package</button>
                        <button
                            type="button"
                            onClick={() => navigate("/admin/manage-packages")}
                        >Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default AddPackage;