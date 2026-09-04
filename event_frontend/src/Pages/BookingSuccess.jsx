import { useLocation, useNavigate } from "react-router-dom";
import "./BookingSuccess.css";

function BookingSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const bookingData = location.state;
    if (!bookingData) {
        return (
            <div className="success-page">
                <div className="success-container">
                    <h2>Booking information not found</h2>
                    <button
                        onClick={() => navigate("/events")}
                    >Go to Events</button>
                </div>
            </div>
        );
    }

    return (
        <div className="success-page">
            <div className="success-container">
                <div className="success-icon">✓</div>

                <h1>Booking Confirmed!</h1>
                <p className="success-message">
                    Your event booking has been successfully
                    confirmed.
                </p>

                <div className="success-details">
                    <h2>Booking Details</h2>
                    <div className="success-row">
                        <span>Event</span>
                        <strong>
                            {bookingData.event?.eventName}
                        </strong>
                    </div>

                    <div className="success-row">
                        <span>Venue</span>
                        <strong>
                            {bookingData.venue}
                        </strong>
                    </div>

                    <div className="success-row">
                        <span>Date</span>
                        <strong>
                            {bookingData.date}
                        </strong>
                    </div>

                    <div className="success-row">
                        <span>Time</span>
                        <strong>
                            {bookingData.time}
                        </strong>
                    </div>

                    <div className="success-row">
                        <span>Package</span>
                        <strong>
                            {bookingData.package?.packageName}
                        </strong>
                    </div>

                    <div className="success-row">
                        <span>Number of People</span>
                        <strong>
                            {bookingData.numberOfPeople}
                        </strong>
                    </div>

                    <div className="success-row">
                        <span>Payment Method</span>
                        <strong>
                            {bookingData.paymentMethod}
                        </strong>
                    </div>

                    <div className="success-row">
                        <span>Payment Status</span>
                        <strong className="payment-status">
                            {bookingData.paymentStatus}
                        </strong>
                    </div>

                    {bookingData.razorpayPaymentId && (
                        <div className="success-row">
                            <span>Payment ID</span>
                            <strong>
                                {bookingData.razorpayPaymentId}
                            </strong>
                        </div>
                    )}
                    <hr />
                    <div className="success-total">
                        <span>Total Amount</span>
                        <strong>
                            ₹
                            {Number(
                                bookingData.totalAmount || 0
                            ).toLocaleString("en-IN")}
                        </strong>
                    </div>
                </div>
                <button
                    className="success-home-btn"
                    onClick={() => navigate("/events")}
                >
                    Browse More Events
                </button>
            </div>
        </div>
    );
}

export default BookingSuccess;