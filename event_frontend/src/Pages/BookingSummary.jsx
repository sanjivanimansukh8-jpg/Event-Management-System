import { useLocation, useNavigate } from "react-router-dom";
import "./BookingSummary.css";

function BookingSummary() {
    const location = useLocation();
    const navigate = useNavigate();
    const booking = location.state;
    const user = JSON.parse(
        localStorage.getItem("user")
    );
    if (!booking) {
        return (
            <div className="booking-summary-error">
                Booking information not found.
            </div>
        );
    }

    const handlePayment = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
        alert("Please login first.");
        navigate("/login");
        return;
    }

    const loggedInUser = JSON.parse(storedUser);
    const completeBooking = {
        ...booking,
        userName:
            loggedInUser.name ||
            loggedInUser.userName ||
            "",
        phone:
            loggedInUser.phone ||
            "",
        email:
            loggedInUser.email ||
            ""
    };
    navigate("/payment", {
        state: completeBooking
    });
};

    return (
        <div className="booking-summary-page">
            <div className="booking-summary-container">
                <h1>Booking Summary</h1>
                <p className="summary-subtitle">
                    Please review your booking details
                    before proceeding to payment.
                </p>

                <div className="summary-card">
                    <h2>Customer Details</h2>
                    <div className="summary-row">
                        <span>Name</span>
                        <strong>{user?.name || "N/A"}</strong>
                    </div>

                    <div className="summary-row">
                        <span>Email</span>
                        <strong>{user?.email || "N/A"}</strong>
                    </div>

                    <div className="summary-row">
                        <span>Phone</span>
                        <strong>{user?.phone || "N/A"}</strong>
                    </div>
                </div>

                <div className="summary-card">
                    <h2>Event Details</h2>
                    <div className="summary-row">
                        <span>Event</span>
                        <strong>{booking.event?.eventName}</strong>
                    </div>

                    <div className="summary-row">
                        <span>Date</span>
                        <strong>{booking.date}</strong>
                    </div>

                    <div className="summary-row">
                        <span>Time</span>
                        <strong>{booking.time}</strong>
                    </div>

                    <div className="summary-row">
                        <span>Venue</span>
                        <strong>{booking.venue}</strong>
                    </div>
                </div>

                <div className="summary-card">
                    <h2>Package Details</h2>
                    <div className="summary-row">
                        <span>Package</span>
                        <strong>
                            {
                                booking.package
                                    ?.packageName
                            }
                        </strong>
                    </div>

                    <div className="summary-row">
                        <span>People</span>
                        <strong>{booking.numberOfPeople}</strong>
                    </div>

                    <div className="summary-row">
                        <span>Price Per Person</span>
                        <strong>
                            ₹
                            {Number(
                                booking.pricePerPerson
                            ).toLocaleString("en-IN")}
                        </strong>
                    </div>

                    <div className="summary-row">
                        <span>Package Amount</span>
                        <strong>
                            ₹
                            {Number(
                                booking.packagePrice
                            ).toLocaleString("en-IN")}
                        </strong>
                    </div>
                </div>

                <div className="summary-card">
                    <h2>Additional Services</h2>
                    {booking.customServices?.length > 0 ? (
                        booking.customServices.map(
                            (service) => (
                                <div
                                    className="summary-row"
                                    key={service.name}
                                >
                                    <span>{service.name}</span>
                                    <strong>
                                        ₹
                                        {Number(
                                            service.price
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>
                                </div>
                            )
                        )
                    ) : (
                        <p className="no-services">
                            No additional services selected.
                        </p>
                    )}
                </div>

                <div className="summary-card">
                    <h2>Additional Information</h2>
                    <div className="summary-row">
                        <span>Address</span>
                        <strong>{booking.address}</strong>
                    </div>

                    <div className="special-requirements">
                        <span>Special Requirements</span>
                        <p>
                            {
                                booking.specialRequirements
                                    ? booking.specialRequirements
                                    : "None"
                            }
                        </p>
                    </div>
                </div>

                <div className="summary-total-card">
                    <span>Total Amount</span>
                    <strong>
                        ₹
                        {Number(
                            booking.totalAmount
                        ).toLocaleString("en-IN")}
                    </strong>
                </div>

                <button
                    className="payment-btn"
                    onClick={handlePayment}
                >
                    Proceed to Payment
                </button>
            </div>
        </div>
    );
}

export default BookingSummary;