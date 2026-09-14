import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Inquiry.css";

function Inquiry() {
    const location = useLocation();
    const navigate = useNavigate();
    const event = location.state?.event;

    const user = JSON.parse(
        localStorage.getItem("user")
    );
    const [formData, setFormData] = useState({
        preferredDate: "",
        numberOfPeople: "",
        subject: "",
        message: ""
    });

    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert(
                "Please login before sending an inquiry.");
            navigate("/login");
            return;
        }

        if (!event) {
            alert("Event information not found.");
            navigate("/events");
            return;
        }

        if (!formData.subject.trim()) {
            alert("Please enter a subject.");
            return;
        }

        if (!formData.message.trim()) {
            alert("Please enter your inquiry.");
            return;
        }

        setLoading(true);
        const inquiryData = {
            userName:
                user.name || "",
            email:
                user.email || "",
            phone:
                user.phone || "",
            eventName:
                event.eventName || "",
            preferredDate:
                formData.preferredDate || "",
            numberOfPeople:
                formData.numberOfPeople
                    ? Number(
                        formData.numberOfPeople
                    )
                    : null,
            subject:
                formData.subject,
            message:
                formData.message,
            status:
                "Pending"
        };
        console.log(
            "Inquiry Data:",
            inquiryData
        );

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/inquiries`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify(
                        inquiryData
                    )
                }
            );

            if (!response.ok) {
                const errorText =
                    await response.text();
                throw new Error(
                    errorText ||
                    "Failed to submit inquiry"
                );
            }
            const savedInquiry =
                await response.json();
            console.log(
                "Inquiry submitted:",
                savedInquiry
            );
            localStorage.setItem(
                `inquiry_${event.id}`,
                "submitted"
            );
            alert("Your inquiry has been submitted successfully! You can now book this event.");
            navigate(
                `/events/${event.id}`
            );
        } catch (error) {
            console.error(
                "Inquiry Error:",
                error
            );
            alert("Unable to submit inquiry. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!event) {
        return (
            <div className="inquiry-page">
                <div className="inquiry-container">
                    <h2>
                        Event information not found
                    </h2>
                    <button
                        className="inquiry-btn"
                        onClick={() =>
                            navigate("/events")
                        }
                    >
                        Go to Events
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="inquiry-page">
            <div className="inquiry-container">
                <div className="inquiry-header">
                    <h1>
                        Event Inquiry
                    </h1>
                    <p>
                        Have questions about this
                        event? Send us your inquiry
                        and our admin will get back
                        to you.
                    </p>
                </div>

                <div className="selected-event">
                    <h2>
                        {event.eventName}
                    </h2>
                    <div className="event-info">
                        <span>
                            📍{" "}
                            {event.venue ||
                                "Venue not assigned"}
                        </span>
                        {event.category && (
                            <span>
                                🎉{" "}
                                {event.category}
                            </span>
                        )}
                    </div>
                </div>

                <form
                    className="inquiry-form"
                    onSubmit={
                        handleSubmit
                    }
                >

                    <div className="form-section">
                        <h3>
                            Your Information
                        </h3>
                        <p className="section-info">
                            Your registered account
                            information is automatically
                            filled.
                        </p>

                        <div className="form-row">
                            <div className="form-group">
                                <label>
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={
                                        user?.name ||
                                        ""
                                    }
                                    readOnly
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={
                                        user?.email ||
                                        ""
                                    }
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                value={
                                    user?.phone ||
                                    ""
                                }
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Inquiry Details</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Preferred Date</label>
                                <input
                                    type="date"
                                    name="preferredDate"
                                    value={
                                        formData.preferredDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min={
                                        new Date()
                                            .toISOString()
                                            .split(
                                                "T"
                                            )[0]
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Number of People</label>
                                <input
                                    type="number"
                                    name="numberOfPeople"
                                    min="1"
                                    placeholder="Optional"
                                    value={
                                        formData.numberOfPeople
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Subject</label>
                            <input
                                type="text"
                                name="subject"
                                placeholder="e.g. Package information"
                                value={
                                    formData.subject
                                }
                                onChange={
                                    handleChange
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Your Inquiry</label>
                            <textarea
                                name="message"
                                rows="6"
                                placeholder="Enter your questions or requirements..."
                                value={
                                    formData.message
                                }
                                onChange={
                                    handleChange
                                }
                            />
                        </div>
                    </div>

                    <div className="inquiry-buttons">
                        <button
                            type="button"
                            className="cancel-inquiry-btn"
                            onClick={() =>
                                navigate(
                                    `/events/${event.id}`
                                )
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="inquiry-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Submitting..."
                                : "Send Inquiry"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Inquiry;