import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageInquiries.css";

function ManageInquiries() {
    const navigate = useNavigate();
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchInquiries = async () => {
        try {
            const response = await fetch(
                "http://localhost:8080/inquiries"
            );
            if (!response.ok) {
                throw new Error("Failed to fetch inquiries");
            }
            const data = await response.json();
            console.log("Inquiries:", data);
            setInquiries(data);
        } catch (error) {
            console.error("Inquiry Error:", error);
            alert("Unable to load inquiries.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchInquiries();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this inquiry?"
        );
        if (!confirmDelete) {
            return;
        }
        try {
            const response = await fetch(
                `http://localhost:8080/inquiries/${id}`,
                {
                    method: "DELETE"
                }
            );
            if (!response.ok) {
                throw new Error("Failed to delete inquiry");
            }
            setInquiries(
                inquiries.filter(
                    (inquiry) => inquiry.id !== id
                )
            );
            alert("Inquiry deleted successfully.");
        } catch (error) {
            console.error("Delete Inquiry Error:",error);
            alert("Unable to delete inquiry.");
        }
    };

    const handleStatusChange = async (
        inquiry
    ) => {
        const newStatus =
            inquiry.status === "Pending"
                ? "Resolved"
                : "Pending";
        try {
            const response = await fetch(
                `http://localhost:8080/inquiries/${inquiry.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        ...inquiry,
                        status: newStatus
                    })
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to update inquiry"
                );
            }

            const updatedInquiry =
                await response.json();

            setInquiries(
                inquiries.map(
                    (item) =>
                        item.id === inquiry.id
                            ? updatedInquiry
                            : item
                )
            );

        } catch (error) {
            console.error(
                "Update Inquiry Error:",
                error
            );
            alert("Unable to update inquiry status.");
        }
    };

    if (loading) {
        return (
            <div className="manage-inquiries-page">
                <div className="inquiry-loading">
                    Loading inquiries...
                </div>
            </div>
        );
    }


    return (
        <div className="manage-inquiries-page">
            <div className="manage-inquiries-header">
                <div>
                    <h1>Manage Inquiries</h1>
                    <p>
                        View and manage customer
                        event inquiries.
                    </p>
                </div>

                <button
                    className="back-admin-btn"
                    onClick={() =>
                        navigate("/admin")
                    }
                >
                    ← Back to Dashboard
                </button>
            </div>


            {inquiries.length === 0 ? (
                <div className="no-inquiries">
                    <h2>No Inquiries Found</h2>
                    <p>
                        Customers have not submitted
                        any inquiries yet.
                    </p>
                </div>
            ) : (

                <div className="inquiries-container">
                    {inquiries.map(
                        (inquiry) => (
                            <div
                                className="inquiry-card"
                                key={inquiry.id}
                            >
                                <div className="inquiry-card-header">
                                    <div>
                                        <h2>
                                            {
                                                inquiry.eventName ||
                                                "Event Inquiry"
                                            }
                                        </h2>
                                        <span className="inquiry-id">
                                            Inquiry #{inquiry.id}
                                        </span>
                                    </div>

                                    <span
                                        className={
                                            inquiry.status ===
                                            "Resolved"
                                                ? "status resolved"
                                                : "status pending"
                                        }
                                    >
                                        {
                                            inquiry.status ||
                                            "Pending"
                                        }
                                    </span>
                                </div>

                                <div className="inquiry-section">
                                    <h3>Customer Information</h3>
                                    <div className="inquiry-grid">
                                        <div>
                                            <span>Name</span>
                                            <strong>
                                                {
                                                    inquiry.userName ||
                                                    "Not available"
                                                }
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Email</span>
                                            <strong>
                                                {
                                                    inquiry.email ||
                                                    "Not available"
                                                }
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Phone</span>
                                            <strong>
                                                {
                                                    inquiry.phone ||
                                                    "Not available"
                                                }
                                            </strong>
                                        </div>
                                    </div>
                                </div>

                                <div className="inquiry-section">
                                    <h3>Inquiry Details</h3>
                                    <div className="inquiry-grid">
                                        <div>
                                            <span>Preferred Date</span>
                                            <strong>
                                                {
                                                    inquiry.preferredDate ||
                                                    "Not specified"
                                                }
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Number of People</span>
                                            <strong>
                                                {
                                                    inquiry.numberOfPeople ||
                                                    "Not specified"
                                                }
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Subject</span>
                                            <strong>
                                                {
                                                    inquiry.subject ||
                                                    "No subject"
                                                }
                                            </strong>
                                        </div>
                                    </div>
                                </div>

                                <div className="inquiry-message">
                                    <h3>Customer Message</h3>
                                    <p>
                                        {
                                            inquiry.message ||
                                            "No message provided."
                                        }
                                    </p>
                                </div>

                                <div className="inquiry-actions">
                                    <button
                                        className="status-btn"
                                        onClick={() =>
                                            handleStatusChange(
                                                inquiry
                                            )
                                        }
                                    >
                                        {inquiry.status ===
                                        "Resolved"
                                            ? "Mark as Pending"
                                            : "Mark as Resolved"}
                                    </button>

                                    <button
                                        className="delete-inquiry-btn"
                                        onClick={() =>
                                            handleDelete(
                                                inquiry.id
                                            )
                                        }
                                    >
                                        Delete                                   
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}

export default ManageInquiries;