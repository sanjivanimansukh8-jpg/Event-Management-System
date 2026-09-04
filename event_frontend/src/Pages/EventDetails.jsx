import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EventDetails.css";

function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    const formatTime = (time) => {
        if (!time) return "Not specified";
        const [hours, minutes] = time.split(":");
        const hour = Number(hours);
        const period = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${period}`;
    };

    useEffect(() => {
        fetch(`http://localhost:8080/events/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch event");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Event received:", data);
                setEvent(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error:", error);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="event-details-page">
                <div className="event-details-container">
                    <h2>Loading event...</h2>
                </div>
            </div>
        );
    }
    if (!event) {
        return (
            <div className="event-details-page">
                <div className="event-details-container">
                    <h2>Event not found</h2>
                    <button
                        className="back-btn"
                        onClick={() => navigate("/events")}
                    >
                        Back to Events
                    </button>
                </div>
            </div>
        );
    }

    const handleBookNow = () => {
        const user = localStorage.getItem("user");
        if (!user) {
            alert("Please login before booking an event.");
            navigate("/login", {
                state: {
                    from: "/events/" + event.id
                }
            });
            return;
        }

        const inquirySubmitted =
            localStorage.getItem(
                `inquiry_${event.id}`
            );

        if (!inquirySubmitted) {
            alert("Please submit an inquiry for this event before booking.");
            navigate("/inquiry", {
                state: {
                    event: event
                }
            });
            return;
        }
        console.log(
            "Sending event to Booking:",
            event
        );
        navigate("/booking", {
            state: {
                event: event
            }
        });
    };

    const handleInquiry = () => {
        const user = localStorage.getItem("user");
        if (!user) {
            alert("Please login before sending an inquiry.");
            navigate("/login", {
                state: {
                    from: "/events/" + event.id
                }
            });
            return;
        }
        navigate("/inquiry", {
            state: {
                event: event
            }
        });
    };

    return (
        <div className="event-details-page">
            <div className="event-details-container">
                <h1>{event.eventName}</h1>
                <div className="event-details">
                    <p>
                        <strong>
                            Category:
                        </strong>{" "}
                        {event.category}
                    </p>

                    <p>
                        <strong>
                            Date:
                        </strong>{" "}
                        {event.eventDate ||
                            "Not specified"}
                    </p>

                    <p>
                        <strong>
                            Time:
                        </strong>{" "}
                        {formatTime(
                            event.eventTime
                        )}
                    </p>

                    <p>
                        <strong>
                            Venue / Hall:
                        </strong>{" "}
                        {event.venue ||
                            "Not specified"}
                    </p>

                    <p>
                        <strong>
                            Ticket Price:
                        </strong>{" "}
                        ₹
                        {Number(
                            event.ticketPrice || 0
                        ).toLocaleString(
                            "en-IN"
                        )}
                    </p>

                    <p>
                        <strong>
                            Available Seats:
                        </strong>{" "}
                        {event.availableSeats ||
                            "Not specified"}
                    </p>

                    <div className="event-description">
                        <h3>Description</h3>
                        <p>
                            {event.description ||
                                "No description available."}
                        </p>
                    </div>
                </div>

                <div className="event-details-buttons">
                    <button
                        className="back-btn"
                        onClick={() =>
                            navigate(-1)
                        }
                    >
                        Back
                    </button>

                    <button
                        className="book-btn"
                        onClick={
                            handleBookNow
                        }
                    >
                        Book Now
                    </button>

                    <button
                        className="inquiry-button"
                        onClick={
                            handleInquiry
                        }
                    >
                        Send Inquiry
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EventDetails;