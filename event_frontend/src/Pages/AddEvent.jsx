import { useNavigate } from "react-router-dom";
import "./AddEvent.css";
import { useState } from "react";

function AddEvent() {
    const navigate = useNavigate();
    const [event, setEvent] = useState({
        eventName: "",
        ticketPrice: "",
        category: "",
        description: ""
    });
    const [message, setMessage] = useState("");
    const handleChange = (e) => {
        setEvent({
            ...event,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                "http://localhost:8080/events",
                {
                    method: "POST",
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
                setMessage("Event added successfully!");
                setEvent({
                    eventName: "",
                    ticketPrice: "",
                    category: "",
                    description: ""
                });
            } else {
                const errorData = await response.text();
                console.error("Server error:", errorData);
                setMessage("Failed to add event.");
            }
        } catch (error) {
            console.error("Error adding event:", error);
            setMessage("Server error. Please try again.");
        }
    };

    return (
        <div className="add-event-page">
            <div className="add-event-container">
                <h1>Add Event</h1>
                <p>Create a new event for your customers.</p>
                {message && (
                    <div className="event-message">{message}</div>
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
                            <option value="">Select Category</option>
                            <option value="Wedding">Wedding</option>
                            <option value="Parties">Parties</option>
                            <option value="Corporate Events">Corporate Events</option>
                            <option value="Sports">Sports</option>
                            <option value="School Events">School Events</option>
                            <option value="Music">Music</option>
                            <option value="Food & Festival">Food & Festival</option>
                            <option value="Exhibition">Exhibition</option>
                            <option value="College Fest">College Fest</option>
                            <option value="Cultural">Cultural</option>
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

                    <div className="form-buttons">
                        <button
                            type="submit"
                            className="add-btn"
                        >
                            Add Event
                        </button>
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate("/admin")}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default AddEvent;