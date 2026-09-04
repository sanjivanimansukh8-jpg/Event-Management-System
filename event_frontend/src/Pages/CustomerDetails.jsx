import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CustomerDetails.css";

function CustomerDetails() {

    const location = useLocation();
    const navigate = useNavigate();
    const bookingData = location.state;
    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [address, setAddress] = useState("");
    const [specialRequirements, setSpecialRequirements] = useState("");

    const handleContinue = () => {
        if (!address.trim()) {
            alert("Please enter your address.");
            return;
        }

        navigate("/booking-summary", {
            state: {
                ...bookingData,
                address: address,
                specialRequirements: specialRequirements
            }
        });
    };

    if (!bookingData) {
        return (
            <div className="customer-error">
                Booking information not found.
            </div>
        );
    }

    return (
        <div className="customer-details-page">
            <div className="customer-details-container">
                <h1>Customer Details</h1>
                <p className="customer-subtitle">
                    Your registered details are taken
                    from your account.
                </p>

                <div className="customer-section">
                    <h2>Registered Information</h2>
                    <div className="customer-form">
                        <div className="customer-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={user?.name || ""}
                                readOnly
                            />
                        </div>

                        <div className="customer-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                value={user?.phone || ""}
                                readOnly
                            />
                        </div>

                        <div className="customer-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={user?.email || ""}
                                readOnly
                            />
                        </div>
                    </div>
                </div>

                <div className="customer-section">
                    <h2>Booking Information</h2>
                    <div className="customer-group">
                        <label>Address *</label>
                        <textarea
                            value={address}
                            onChange={(e) =>
                                setAddress(e.target.value)
                            }
                            placeholder="Enter your address"
                            rows="4"
                        />
                    </div>

                    <div className="customer-group">
                        <label>
                            Special Requirements
                        </label>
                        <textarea
                            value={specialRequirements}
                            onChange={(e) =>
                                setSpecialRequirements(
                                    e.target.value
                                )
                            }
                            placeholder="Enter any special requirements"
                            rows="4"
                        />
                    </div>
                </div>

                <button
                    type="button"
                    className="customer-continue-btn"
                    onClick={handleContinue}
                >
                    Continue to Booking Summary
                </button>
            </div>
        </div>
    );
}

export default CustomerDetails;