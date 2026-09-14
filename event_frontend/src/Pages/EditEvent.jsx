import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditEvent.css";

function EditEvent() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [event, setEvent] = useState({
        eventName: "",
        ticketPrice: "",
        category: "",
        description: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const handleChange = (e) => {
        setEvent({
            ...event,
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/events/${id}`
                );

                if (response.ok) {
                    const data = await response.json();
                    setEvent({
                        eventName: data.eventName || "",
                        ticketPrice: data.ticketPrice || "",
                        category: data.category || "",
                        description: data.description || ""
                    });
                } else {
                    setMessage("Event not found");
                }
            } catch (error) {
                console.error(error);
                setMessage("Failed to load event");
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/events/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        eventName: event.eventName,
                        ticketPrice: Number(event.ticketPrice),
                        category: event.category,
                        description: event.description
                    })
                }
            );
            if (response.ok) {
                setMessage("Event updated successfully");

                setTimeout(() => {
                    navigate("/admin/events");
                }, 1000);
            } else {
                setMessage("Failed to update event");
            }
        } catch (error) {
            console.error(error);
            setMessage("Server error");
        }
    };
    if (loading) {
        return (
            <div className="edit-event-loading">
                Loading event...
            </div>
        );
    }

    return (
        <div className="edit-event-page">
            <div className="edit-event-container">
                <h1>Edit Event</h1>
                <p>Update the event details below.</p>
                {message && (
                    <div className="edit-event-message">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Event Name</label>
                        <input
                            type="text"
                            name="eventName"
                            value={event.eventName}
                            onChange={handleChange}
                            placeholder="Enter event name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Ticket Price</label>
                        <input
                            type="number"
                            name="ticketPrice"
                            value={event.ticketPrice}
                            onChange={handleChange}
                            placeholder="Enter ticket price"
                            min="0"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select
                            name="category"
                            value={event.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                Select Category
                            </option>
                            <option value="Wedding">
                                Wedding
                            </option>
                            <option value="Engagement">
                                Engagement
                            </option>
                            <option value="Birthday">
                                Birthday
                            </option>
                            <option value="Corporate">
                                Corporate
                            </option>
                            <option value="College Fest">
                                College Fest
                            </option>
                            <option value="Music Concert">
                                Music Concert
                            </option>
                            <option value="Sports">
                                Sports
                            </option>
                            <option value="Party">
                                Party
                            </option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={event.description}
                            onChange={handleChange}
                            placeholder="Enter event description"
                            rows="5"
                            required
                        ></textarea>
                    </div>

                    <div className="edit-event-buttons">
                        <button
                            type="submit"
                            className="update-btn"
                        >
                            Update Event
                        </button>
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() =>
                                navigate("/admin/events")
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
export default EditEvent;