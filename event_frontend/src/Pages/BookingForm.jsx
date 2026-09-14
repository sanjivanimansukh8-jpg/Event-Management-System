import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./BookingForm.css";

function BookingForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const bookingData = location.state;

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [specialRequirements, setSpecialRequirements] = useState("");
    const [saving, setSaving] = useState(false);

    if (!bookingData) {
        return (
            <div className="booking-form-page">
                <div className="no-booking">
                    <h2>No Booking Details Found</h2>
                    <p>Please select your event and package first.</p>
                    <button
                        onClick={() => navigate("/booking")}
                        className="back-btn"
                    >
                        Go to Booking
                    </button>
                </div>
            </div>
        );
    }

    const {
        event,
        package: selectedPackage
    } = bookingData;

    const packagePrice = Number(selectedPackage?.price || 0);
    const totalAmount = packagePrice;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const booking = {
            userName: fullName,
            phone: phone,
            numberOfTickets: 1,
            eventName: event?.eventName || "",
            totalAmount: totalAmount
        };
        console.log("Sending booking:", booking);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/bookings`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(booking)
                }
            );
            if (!response.ok) {
                throw new Error("Failed to save booking");
            }
            const savedBooking = await response.json();
            console.log("Booking saved successfully:", savedBooking);
            alert("Booking confirmed successfully!");
            navigate("/my-bookings");
        } catch (error) {
            console.error("Booking Error:", error);
            alert("Failed to save booking. Please make sure the backend is running.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="booking-form-page">
            <div className="booking-form-header">
                <h1>Complete Your Booking</h1>
                <p>
                    Review your booking details and enter your personal information.
                </p>
            </div>

            <div className="booking-form-container">
                <div className="form-card">
                    <h2>1. Personal Details</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-field">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={fullName}
                                    onChange={(e) =>
                                        setFullName(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-field">
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Special Requirements</label>
                            <textarea
                                rows="4"
                                placeholder="Enter any special requirements..."
                                value={specialRequirements}
                                onChange={(e) =>
                                    setSpecialRequirements(e.target.value)
                                }
                            />
                        </div>

                        <button
                            type="submit"
                            className="confirm-btn"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving Booking..."
                                : "Confirm Booking"}
                        </button>
                    </form>
                </div>

                <div className="booking-summary-card">
                    <h2>2. Booking Summary</h2>
                    <div className="summary-item">
                        <span>Event</span>
                        <strong>
                            {event?.eventName || "Not selected"}
                        </strong>
                    </div>

                    <div className="summary-item">
                        <span>Date</span>
                        <strong>
                            {event?.eventDate || "Not available"}
                        </strong>
                    </div>

                    <div className="summary-item">
                        <span>Time</span>
                        <strong>
                            {event?.eventTime || "Not available"}
                        </strong>
                    </div>

                    <div className="summary-item">
                        <span>Venue</span>
                        <strong>
                            {event?.venue || "Not available"}
                        </strong>
                    </div>

                    <div className="summary-item">
                        <span>Package</span>
                        <strong>
                            {selectedPackage?.packageName || "Not selected"}
                        </strong>
                    </div>

                    <div className="summary-item">
                        <span>Package Price</span>
                        <strong>
                            ₹{packagePrice.toLocaleString("en-IN")}
                        </strong>
                    </div>

                    <div className="summary-divider"></div>
                    <div className="final-total">
                        <span>Total Amount</span>
                        <strong>
                            ₹{totalAmount.toLocaleString("en-IN")}
                        </strong>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingForm;