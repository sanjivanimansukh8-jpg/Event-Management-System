import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewEvents.css";

function ViewEvents() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetch("http://localhost:8080/events")
            .then(response => response.json())
            .then(data => {
                setEvents(data);
            })
            .catch(error => {
                console.error("Error fetching events:", error);
            });
    }, []);

    return (
        <div className="view-events-page">
            <div className="view-events-header">
                <h1>View Events</h1>
                <p>Manage all events added to the system</p>
            </div>

            <div className="events-container">
                {events.length === 0 ? (
                    <div className="no-events">
                        <h2>No Events Found</h2>
                        <p>Please add an event to view it here.</p>
                        <button
                            onClick={() => navigate("/admin/add-event")}
                        >
                            Add Event
                        </button>
                    </div>
                ) : (
                    events.map((event) => (
                        <div className="event-card" key={event.id}>
                            <div className="event-card-header">
                                <h2>{event.eventName}</h2>
                                <span className="event-category">
                                    {event.category}
                                </span>
                            </div>

                            <div className="event-card-body">
                                <div className="event-info">
                                    <strong>Ticket Price</strong>
                                    <span>₹{event.ticketPrice}</span>
                                </div>
                                <div className="event-info">
                                    <strong>Category</strong>
                                    <span>{event.category}</span>
                                </div>
                                <div className="event-description">
                                    <strong>Description</strong>
                                    <p>{event.description}</p>
                                </div>
                            </div>

                            <div className="event-card-footer">
                                <button
                                    className="edit-btn"
                                    onClick={() =>
                                        navigate(`/admin/events/edit/${event.id}`)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={() => {
                                        if (
                                            window.confirm(
                                                "Are you sure you want to delete this event?"
                                            )
                                        ) {
                                            fetch(
                                                `http://localhost:8080/events/${event.id}`,
                                                {
                                                    method: "DELETE"
                                                }
                                            )
                                                .then(() => {
                                                    setEvents(
                                                        events.filter(
                                                            e => e.id !== event.id
                                                        )
                                                    );
                                                })
                                                .catch(error =>
                                                    console.error(
                                                        "Delete error:",
                                                        error
                                                    )
                                                );
                                        }
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ViewEvents;