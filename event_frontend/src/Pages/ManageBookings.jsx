import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageBookings.css";

function ManageBookings() {

    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [message, setMessage] = useState("");
    const fetchBookings = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/bookings`);
            if (response.ok) {
                const data = await response.json();
                setBookings(data);
            }
        } catch (error) {
            console.error(error);
            setMessage("Failed to load bookings");
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const deleteBooking = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this booking?"
        );
        if (!confirmDelete) {
            return;
        }
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/bookings/${id}`,
                {
                    method: "DELETE"
                }
            );
            if (response.ok) {
                setMessage("Booking deleted successfully");
                fetchBookings();
            } else {
                setMessage("Failed to delete booking");
            }
        } catch (error) {
            console.error(error);
            setMessage("Server error");
        }
    };

    return (
        <div className="manage-bookings-page">
            <div className="manage-bookings-container">
                <div className="bookings-header">
                    <div>
                        <h1>Manage Bookings</h1>
                        <p>View and manage customer bookings.</p>
                    </div>
                    <button
                        className="back-btn"
                        onClick={() => navigate("/admin")}
                    >Back to Dashboard</button>
                </div>
                {message && (
                    <div className="booking-message">
                        {message}
                    </div>
                )}
                {bookings.length === 0 ? (
                    <div className="no-bookings">
                        <h2>No Bookings Found</h2>
                        <p>There are currently no bookings.</p>
                    </div>
                ) : (
                    <div className="booking-table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Booking ID</th>
                                    <th>User Name</th>
                                    <th>Phone</th>
                                    <th>Event</th>
                                    <th>Tickets</th>
                                    <th>Total Amount</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking) => (
                                    <tr key={booking.bookingId}>
                                        <td>{booking.bookingId}</td>
                                        <td>{booking.userName}</td>
                                        <td>{booking.phone}</td>
                                        <td>{booking.eventName}</td>
                                        <td>{booking.numberOfTickets}</td>
                                        <td>₹{booking.totalAmount}</td>
                                        <td>
                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    deleteBooking(
                                                        booking.bookingId
                                                    )
                                                }
                                            >Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageBookings;