import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditPackage.css";

function EditPackage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [packageData, setPackageData] = useState({
        packageName: "",
        price: "",
        people: ""
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/packages/${id}`,
                );
                if (response.ok) {
                    const data = await response.json();

                    setPackageData({
                        packageName: data.packageName || "",
                        price: data.price || "",
                        people: data.people || ""
                    });
                } else {
                    setMessage("Package not found");
                }
            } catch (error) {
                console.error(error);
                setMessage("Failed to load package");
            } finally {
                setLoading(false);
            }
        };
        fetchPackage();
    }, [id]);
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
               `${import.meta.env.VITE_API_URL}/packages/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        packageName: packageData.packageName,
                        price: Number(packageData.price),
                        people: Number(packageData.people)
                    })
                }
            );

            if (response.ok) {
                setMessage("Package updated successfully");
                setTimeout(() => {
                    navigate("/admin/manage-packages");
                }, 1000);
            } else {
                setMessage("Failed to update package");
            }
        } catch (error) {
            console.error(error);
            setMessage("Server error");
        }
    };
    if (loading) {
        return (
            <div className="edit-package-loading">
                Loading package...
            </div>
        );
    }

    return (
        <div className="edit-package-page">
            <div className="edit-package-container">
                <h1>Edit Package</h1>
                <p>Update the package details below.</p>
                {message && (
                    <div className="edit-package-message">
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
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Package Price</label>
                        <input
                            type="number"
                            name="price"
                            value={packageData.price}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Number of People</label>
                        <input
                            type="number"
                            name="people"
                            value={packageData.people}
                            onChange={handleChange}
                            min="1"
                            required
                        />
                    </div>

                    <div className="edit-package-buttons">
                        <button
                            type="submit"
                            className="update-package-btn"
                        >
                            Update Package
                        </button>
                        <button
                            type="button"
                            className="cancel-package-btn"
                            onClick={() =>
                                navigate("/admin/manage-packages")
                            }
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default EditPackage;