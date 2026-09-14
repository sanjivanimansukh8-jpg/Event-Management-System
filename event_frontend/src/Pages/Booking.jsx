import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Booking.css";

function Booking() {

    const navigate = useNavigate();
    const location = useLocation();

    const [events, setEvents] = useState([]);
    const [packagesList, setPackagesList] = useState([]);

    const [selectedEvent, setSelectedEvent] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedVenue, setSelectedVenue] = useState("");

    const [selectedPackage, setSelectedPackage] = useState(null);
    const [customServices, setCustomServices] = useState([]);
    const [numberOfPeople, setNumberOfPeople] = useState("");

    const [loading, setLoading] = useState(true);

    const services = [
        {
            name: "Decoration",
            price: 10000
        },
        {
            name: "Catering",
            price: 20000
        },
        {
            name: "Photography",
            price: 8000
        },
        {
            name: "DJ",
            price: 7000
        },
        {
            name: "Flowers",
            price: 3000
        },
        {
            name: "Music",
            price: 5000
        }
    ];

   useEffect(() => {
    Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/events`),
        fetch(`${import.meta.env.VITE_API_URL}/packages`)
    ])
        .then(async ([eventsResponse, packagesResponse]) => {

            if (!eventsResponse.ok) {
                throw new Error("Failed to load events");
            }

            if (!packagesResponse.ok) {
                throw new Error("Failed to load packages");
            }

            const eventData = await eventsResponse.json();
            const packageData = await packagesResponse.json();

            console.log("Events:", eventData);
            console.log("Packages:", packageData);

            setEvents(eventData);
            setPackagesList(packageData);

            setLoading(false);
        })
        .catch((error) => {
            console.error("ERROR:", error);
            setLoading(false);
        });
}, []);
    useEffect(() => {
        if (location.state?.event) {

            const event = location.state.event;

            console.log("Event received from EventDetails:", event);
            console.log("Automatic venue:", event.venue);

            setSelectedEvent(String(event.id));
            setSelectedVenue(event.venue || "");
        }
    }, [location.state]);

    const selectedEventData = events.find(
        (event) =>
            event.id === Number(selectedEvent)
    );

    const handleEventChange = (eventId) => {
        setSelectedEvent(eventId);
        setSelectedDate(null);
        setSelectedTime("");

        setSelectedPackage(null);
        setCustomServices([]);
        setNumberOfPeople("");

        const event = events.find(
            (item) =>
                item.id === Number(eventId)
        );
        if (event) {
            setSelectedVenue(event.venue || "");
        } else {
            setSelectedVenue("");
        }
    };

    const handlePackageSelect = (pkg) => {
        setSelectedPackage(pkg);
        setCustomServices([]);
        setNumberOfPeople("");
    };

    const handleServiceChange = (service) => {
        const alreadySelected =
            customServices.some(
                (item) =>
                    item.name === service.name
            );

        if (alreadySelected) {
            setCustomServices(
                customServices.filter(
                    (item) =>
                        item.name !== service.name
                )
            );
        } else {
            setCustomServices([
                ...customServices,
                service
            ]);
        }
    };

    const pricePerPerson = selectedPackage
        ? Number(
            selectedPackage.pricePerPerson || 0
        )
        : 0;
    const includedPeople = selectedPackage
        ? Number(
            selectedPackage.people || 0
        )
        : 0;
    const totalPeople =
        Number(numberOfPeople || 0);
    const packagePrice =
        pricePerPerson * totalPeople;
    const extraPeople =
        totalPeople > includedPeople
            ? totalPeople - includedPeople
            : 0;
    const extraPeopleCost =
        extraPeople * pricePerPerson;
    const customizationTotal =
        customServices.reduce(
            (total, service) =>
                total +
                Number(service.price || 0),
            0
        );
    const totalAmount =
        packagePrice +
        customizationTotal;
    
        const handleContinue = () => {
        if (!selectedEvent) {
            alert("Please select an event.");
            return;
        }

        if (!selectedDate) {
            alert("Please select a date.");
            return;
        }

        if (!selectedTime) {
            alert("Please select a time.");
            return;
        }

        if (!selectedVenue) {
            alert( "Venue is not assigned to this event.");
            return;
        }
        if (!selectedPackage) {
            alert("Please select a package.");
            return;
        }

        if (!numberOfPeople) {
            alert("Please enter number of people.");
            return;
        }

        if (Number(numberOfPeople) < 1) {
            alert("Number of people must be at least 1.");
            return;
        }

        navigate("/customer-details", {
            state: {
                event: selectedEventData,
                eventId:
                    Number(selectedEvent),
                date:
                    selectedDate
                        .toISOString()
                        .split("T")[0],
                time:
                    selectedTime,
                venue:
                    selectedVenue,
                package:
                    selectedPackage,
                includedPeople:
                    includedPeople,
                extraPeople:
                    extraPeople,
                extraPeopleCost:
                    extraPeopleCost,
                numberOfPeople:
                    totalPeople,
                customServices:
                    customServices,
                packagePrice:
                    packagePrice,
                pricePerPerson:
                    pricePerPerson,
                customizationTotal:
                    customizationTotal,
                totalAmount:
                    totalAmount
            }
        });
    };

    if (loading) {
        return (
            <div className="loading">
                Loading events and packages...
            </div>
        );
    }

    return (
        <div className="booking-page">
            <div className="booking-header">
                <h1>Customize Your Event</h1>
                <p>
                    Select your event, date,
                    time and package according
                    to your requirements.
                </p>
            </div>

            <div className="booking-section">
                <h2>1. Select Event Details</h2>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Select Event</label>
                        <select
                            value={selectedEvent}
                            onChange={(e) =>
                                handleEventChange(
                                    e.target.value
                                )
                            }
                        >
                            <option value="">-- Select Event --</option>
                            {events.map(
                                (event) => (
                                    <option
                                        key={event.id}
                                        value={event.id}
                                    >
                                        {event.eventName}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Select Date</label>
                        <DatePicker
                            selected={
                                selectedDate
                            }
                            onChange={(date) =>
                                setSelectedDate(date)
                            }
                            minDate={
                                new Date()
                            }
                            dateFormat="dd/MM/yyyy"
                            placeholderText={
                                "Select event date"
                            }

                            className="date-picker"
                        />
                    </div>

                    <div className="form-group">
                        <label>Select Time</label>
                        <input
                            type="time"
                            value={selectedTime}
                            onChange={(e) =>
                                setSelectedTime(
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Venue / Hall</label>
                        <input
                            type="text"
                            value={
                                selectedVenue
                            }
                            readOnly
                            placeholder="Venue will be shown automatically"
                        />
                        <small>
                            Venue is assigned by the
                            administrator.
                        </small>
                    </div>
                </div>
            </div>

            {selectedEventData && (
                <div className="event-preview">
                    <h2>
                        {
                            selectedEventData.eventName
                        }
                    </h2>
                    <div className="preview-details">
                        <div>
                            <span>Date</span>
                            <strong>
                                {selectedDate
                                    ? selectedDate.toLocaleDateString(
                                        "en-IN"
                                    )
                                    : "Not selected"}
                            </strong>
                        </div>

                        <div>
                            <span>Time</span>
                            <strong>
                                {selectedTime ||"Not selected"}
                            </strong>
                        </div>

                        <div>
                            <span>Venue</span>
                            <strong>
                                {selectedVenue ||"Not assigned"}
                            </strong>
                        </div>
                    </div>

                    {selectedEventData.description && (
                        <p>
                            {
                                selectedEventData.description
                            }
                        </p>
                    )}
                </div>
            )}

            {selectedEvent && (
                <div className="booking-section">
                    <h2>2. Choose Your Package</h2>
                    <div className="packages-container">
                        {packagesList.map(
                            (pkg) => {
                                const pkgPricePerPerson =
                                    Number(
                                        pkg.pricePerPerson ||
                                        0
                                    );
                                const pkgPeople =
                                    Number(pkg.people ||0);

                                return (
                                    <div
                                        key={pkg.id}
                                        className={
                                            selectedPackage?.id ===
                                            pkg.id
                                                ? "package-card selected-package"
                                                : "package-card"
                                        }
                                    >

                                        <h3>
                                            {
                                                pkg.packageName
                                            }
                                        </h3>

                                        <div className="package-price">
                                            ₹
                                            {pkgPricePerPerson.toLocaleString(
                                                "en-IN"
                                            )}
                                            <span>
                                                {" "}
                                                / person
                                            </span>
                                        </div>


                                        <div className="package-people">
                                            👥 Includes{" "}
                                            {pkgPeople}{" "}
                                            people
                                        </div>

                                        <div className="package-per-person">
                                            Price per person:
                                            {" "}
                                            ₹
                                            {pkgPricePerPerson.toLocaleString(
                                                "en-IN"
                                            )}
                                        </div>

                                        <p className="package-features">
                                            Package services
                                            included
                                        </p>


                                        <button
                                            type="button"
                                            className="package-btn"
                                            onClick={() =>
                                                handlePackageSelect(
                                                    pkg
                                                )
                                            }
                                        >

                                            {
                                                selectedPackage?.id ===
                                                pkg.id
                                                    ? "Selected ✓"
                                                    : "Select Package"
                                            }

                                        </button>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>
            )}

            {selectedPackage && (
                <div className="booking-section">
                    <h2>3. Customize Your Package</h2>
                    <p className="section-description">
                        Select additional services
                        if you need them.
                    </p>

                    <div className="services-container">
                        {services.map(
                            (service) => {
                                const selected =
                                    customServices.some(
                                        (item) =>
                                            item.name ===
                                            service.name
                                    );

                                return (
                                    <div
                                        key={service.name}
                                        className={
                                            selected
                                                ? "service-card service-selected"
                                                : "service-card"
                                        }
                                        onClick={() =>
                                            handleServiceChange(
                                                service
                                            )
                                        }
                                    >
                                        <div className="service-left">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    selected
                                                }
                                                onChange={() =>
                                                    handleServiceChange(
                                                        service
                                                    )
                                                }
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            />
                                            <span>
                                                {
                                                    service.name
                                                }
                                            </span>
                                        </div>

                                        <strong>
                                            ₹
                                            {Number(
                                                service.price ||
                                                0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>
            )}

            {selectedPackage && (
                <div className="booking-section">
                    <h2>4. Number of People</h2>
                    <div className="people-box">
                        <label>Enter number of people</label>
                        <input
                            type="number"
                            min="1"
                            placeholder="Enter number of people"
                            value={
                                numberOfPeople
                            }
                            onChange={(e) =>
                                setNumberOfPeople(
                                    e.target.value
                                )
                            }
                        />

                        <p className="people-info">
                            {
                                selectedPackage.packageName
                            }
                            {" "}package includes{" "}

                            <strong>
                                {includedPeople}
                                {" "}people
                            </strong>
                        </p>

                        <p className="people-info">
                            Price per person:
                            {" "}
                            <strong>
                                ₹
                                {pricePerPerson.toLocaleString(
                                    "en-IN",
                                    {
                                        maximumFractionDigits: 2
                                    }
                                )}
                            </strong>
                        </p>

                        {totalPeople > 0 && (
                            <p className="people-info">
                                Package amount for{" "}
                                {totalPeople} people:
                                {" "}
                                <strong>
                                    ₹
                                    {packagePrice.toLocaleString(
                                        "en-IN",
                                        {
                                            maximumFractionDigits: 2
                                        }
                                    )}
                                </strong>
                            </p>
                        )}

                        {extraPeople > 0 && (
                            <>
                                <p className="extra-people">
                                    Extra people:{" "}
                                    <strong>{extraPeople}</strong>
                                </p>

                                <p className="extra-people">
                                    Extra people cost:{" "}
                                    <strong>
                                        ₹
                                        {extraPeopleCost.toLocaleString(
                                            "en-IN",
                                            {
                                                maximumFractionDigits: 2
                                            }
                                        )}
                                    </strong>
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}

            {selectedPackage && (
                <div className="summary-section">
                    <h2>5. Booking Summary</h2>
                    <div className="summary-row">
                        <span>Event</span>
                        <strong>
                            {
                                selectedEventData?.eventName
                            }
                        </strong>
                    </div>

                    <div className="summary-row">
                        <span>Date</span>
                        <strong>
                            {selectedDate
                                ? selectedDate.toLocaleDateString(
                                    "en-IN"
                                )
                                : "Not selected"}
                        </strong>
                    </div>

                    <div className="summary-row">
                        <span>Time</span>
                        <strong>
                            {selectedTime ||"Not selected"}
                        </strong>
                    </div>

                    <div className="summary-row">
                        <span>Venue</span>
                        <strong>
                            {selectedVenue ||"Not assigned"}
                        </strong>
                    </div>

                    <div className="summary-row">
                        <span>Package</span>
                        <strong>
                            {
                                selectedPackage.packageName
                            }
                        </strong>
                    </div>

                    <div className="summary-row">
                        <span>Price Per Person</span>
                        <strong>
                            ₹
                            {pricePerPerson.toLocaleString(
                                "en-IN",
                                {
                                    maximumFractionDigits: 2
                                }
                            )}
                        </strong>
                    </div>

                    <div className="summary-row">
                        <span>People Included</span>
                        <strong>{includedPeople}</strong>
                    </div>

                    <div className="summary-row">
                        <span>Total People</span>
                        <strong>
                            {totalPeople ||"Not selected"}
                        </strong>
                    </div>

                    <div className="summary-row">
                        <span>Package Amount</span>
                        <strong>
                            ₹
                            {packagePrice.toLocaleString(
                                "en-IN",
                                {
                                    maximumFractionDigits: 2
                                }
                            )}
                        </strong>
                    </div>

                    <div className="summary-row">
                        <span>Extra People</span>
                        <strong>{extraPeople}</strong>
                    </div>

                    {extraPeople > 0 && (
                        <div className="summary-row">
                            <span>Extra People Cost</span>
                            <strong>
                                ₹
                                {extraPeopleCost.toLocaleString(
                                    "en-IN",
                                    {
                                        maximumFractionDigits: 2
                                    }
                                )}
                            </strong>
                        </div>
                    )}

                    <div className="summary-row">
                        <span>Customization</span>
                        <strong>
                            ₹
                            {customizationTotal.toLocaleString(
                                "en-IN"
                            )}
                        </strong>
                    </div>

                    {customServices.length > 0 && (
                        <div className="selected-services">
                            <h4>Additional Services</h4>
                            {customServices.map(
                                (service) => (
                                    <div
                                        className="summary-service"
                                        key={
                                            service.name
                                        }
                                    >
                                        <span>
                                            {
                                                service.name
                                            }
                                        </span>
                                        <span>
                                            ₹
                                            {Number(
                                                service.price ||
                                                0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    <hr />

                    <div className="summary-total">
                        <span>Estimated Total</span>
                        <strong>
                            ₹
                            {totalAmount.toLocaleString(
                                "en-IN",
                                {
                                    maximumFractionDigits: 2
                                }
                            )}
                        </strong>
                    </div>

                    <button
                        type="button"
                        className="continue-btn"
                        onClick={
                            handleContinue
                        }
                    >
                        Continue to Booking
                    </button>
                </div>
            )}
        </div>
    );
}
export default Booking;