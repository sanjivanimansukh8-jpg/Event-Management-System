import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ManagePackages.css";

function ManagePackages() {
    const [packages, setPackages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8080/packages")
            .then(response => response.json())
            .then(data => {
                setPackages(data);
            })
            .catch(error => {
                console.error("Error fetching packages:", error);
            });
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this package?"
        );
        if (!confirmDelete) {
            return;
        }
        try {
            const response = await fetch(
                `http://localhost:8080/packages/${id}`,
                {
                    method: "DELETE"
                }
            );
            if (response.ok) {
                setPackages(
                    packages.filter(pkg => pkg.id !== id)
                );
                alert("Package deleted successfully!");
            } else {
                alert("Failed to delete package.");
            }
        } catch (error) {
            console.error("Error deleting package:", error);
            alert("Something went wrong.");
        }
    };

    return (
        <div className="manage-packages">
            <div className="manage-packages-header">
                <h1>Manage Packages</h1>
                <button
                    className="add-package-btn"
                    onClick={() => navigate("/admin/add-package")}
                >
                    + Add Package
                </button>
            </div>

            {packages.length === 0 ? (
                <p className="no-packages">
                    No packages available.
                </p>
            ) : (
                <div className="packages-container">
                    {packages.map((pkg) => {
                        const pricePerPerson =
                            Number(pkg.pricePerPerson) || 0;
                        const people =
                            Number(pkg.people) || 0;
                        const totalPrice =
                            pricePerPerson * people;

                        return (
                            <div
                                className="package-card"
                                key={pkg.id}
                            >
                                <h2>
                                    {pkg.packageName}
                                </h2>
                                <p className="package-price">
                                    ₹{pricePerPerson.toLocaleString("en-IN")}
                                    <span className="per-person">
                                        {" "} / person
                                    </span>
                                </p>
                                <p className="package-people">
                                    👥 {people} People
                                </p>
                                <p className="package-total">
                                    Total Price: ₹
                                    {totalPrice.toLocaleString("en-IN")}
                                </p>
                                <div className="package-actions">
                                    <button
                                        className="edit-package-btn"
                                        onClick={() =>
                                            navigate(
                                                `/admin/edit-package/${pkg.id}`
                                            )
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-package-btn"
                                        onClick={() =>
                                            handleDelete(pkg.id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ManagePackages;