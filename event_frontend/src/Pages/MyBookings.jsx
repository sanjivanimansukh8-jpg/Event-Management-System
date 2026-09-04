
import { useEffect, useState } from "react";
import "./MyBookings.css";

function MyBookings() {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const storedUser =
            localStorage.getItem("user");

        if (!storedUser) {

            console.error(
                "User is not logged in"
            );

            setLoading(false);

            return;
        }

        let loggedInUser;

        try {

            loggedInUser =
                JSON.parse(storedUser);

        } catch (error) {

            console.error(
                "Invalid user data:",
                error
            );

            setLoading(false);

            return;
        }

        console.log(
            "Logged in user:",
            loggedInUser
        );

        if (
            loggedInUser.role &&
            loggedInUser.role.toUpperCase() ===
                "ADMIN"
        ) {

            window.location.href =
                "/admin";

            return;
        }

        const currentUserName =
            (
                loggedInUser.userName ||
                loggedInUser.name ||
                ""
            )
                .trim()
                .toLowerCase();

        const currentUserEmail =
            (
                loggedInUser.email ||
                ""
            )
                .trim()
                .toLowerCase();

        console.log(
            "Current username:",
            currentUserName
        );

        console.log(
            "Current email:",
            currentUserEmail
        );

        fetch(
            "http://localhost:8080/bookings"
        )
            .then((response) => {

                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch bookings"
                    );
                }

                return response.json();
            })
            .then((bookingData) => {

                console.log(
                    "ALL BOOKINGS:",
                    bookingData
                );

                const userBookings =
                    bookingData.filter(
                        (booking) => {

                            const bookingEmail =
                                (
                                    booking.email ||
                                    ""
                                )
                                    .trim()
                                    .toLowerCase();

                            const bookingUserName =
                                (
                                    booking.userName ||
                                    ""
                                )
                                    .trim()
                                    .toLowerCase();

                            const emailMatch =
                                currentUserEmail &&
                                bookingEmail &&
                                bookingEmail ===
                                    currentUserEmail;

                            const usernameMatch =
                                currentUserName &&
                                bookingUserName &&
                                bookingUserName ===
                                    currentUserName;

                            return (
                                emailMatch ||
                                usernameMatch
                            );
                        }
                    );

                console.log(
                    "MY BOOKINGS:",
                    userBookings
                );

                setBookings(
                    userBookings
                );

                setLoading(false);
            })
            .catch((error) => {

                console.error(
                    "Error fetching bookings:",
                    error
                );

                setLoading(false);
            });

    }, []);

    const cancelBooking = (id) => {

        if (
            !window.confirm(
                "Are you sure you want to cancel this booking?"
            )
        ) {
            return;
        }

        fetch(
            `http://localhost:8080/bookings/${id}`,
            {
                method: "DELETE"
            }
        )
            .then((response) => {

                if (!response.ok) {

                    throw new Error(
                        "Failed to cancel booking"
                    );
                }

                setBookings(
                    (prevBookings) =>
                        prevBookings.filter(
                            (booking) =>
                                booking.bookingId !==
                                id
                        )
                );

                alert(
                    "Booking cancelled successfully."
                );
            })
            .catch((error) => {

                console.error(
                    "Error cancelling booking:",
                    error
                );

                alert(
                    "Unable to cancel booking."
                );
            });
    };

    if (loading) {

        return (
            <div className="my-bookings-loading">
                Loading Bookings...
            </div>
        );
    }
    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    const upcomingBookings =
        bookings.filter(
            (booking) => {

                if (!booking.eventDate) {
                    return true;
                }

                const eventDate =
                    new Date(
                        booking.eventDate
                    );

                eventDate.setHours(
                    0,
                    0,
                    0,
                    0
                );

                return (
                    eventDate >= today
                );
            }
        );

    return (
        <div className="my-bookings-page">

            <div className="my-bookings-header">

                <h1>
                    My Bookings
                </h1>

                <p>
                    View and manage your event bookings.
                </p>

            </div>

            {upcomingBookings.length === 0 ? (

                <div className="no-bookings">

                    <h2>
                        No Upcoming Bookings
                    </h2>

                    <p>
                        You have no upcoming event
                        bookings.
                    </p>

                </div>

            ) : (

                <div className="bookings-container">

                    {upcomingBookings.map(
                        (booking) => (

                            <div
                                className="booking-card"
                                key={
                                    booking.bookingId
                                }
                            >

                                <div className="booking-card-header">

                                    <h2>
                                        {
                                            booking.eventName
                                        }
                                    </h2>

                                    <span>
                                        Booking #
                                        {
                                            booking.bookingId
                                        }
                                    </span>

                                </div>

                                <div className="booking-details">

                                    <p>
                                        <strong>
                                            Name:
                                        </strong>{" "}
                                        {
                                            booking.userName ||
                                            "N/A"
                                        }
                                    </p>

                                    <p>
                                        <strong>
                                            Email:
                                        </strong>{" "}
                                        {
                                            booking.email ||
                                            "N/A"
                                        }
                                    </p>

                                    <p>
                                        <strong>
                                            Phone:
                                        </strong>{" "}
                                        {
                                            booking.phone ||
                                            "N/A"
                                        }
                                    </p>

                                    <p>
                                        <strong>
                                            Event:
                                        </strong>{" "}
                                        {
                                            booking.eventName ||
                                            "N/A"
                                        }
                                    </p>

                                    <p>
                                        <strong>
                                            Event Date:
                                        </strong>{" "}
                                        {
                                            booking.eventDate ||
                                            "N/A"
                                        }
                                    </p>

                                    <p>
                                        <strong>
                                            Event Time:
                                        </strong>{" "}
                                        {
                                            booking.eventTime ||
                                            "N/A"
                                        }
                                    </p>

                                    <p>
                                        <strong>
                                            Venue:
                                        </strong>{" "}
                                        {
                                            booking.venue ||
                                            "N/A"
                                        }
                                    </p>

                                    <p>
                                        <strong>
                                            Package:
                                        </strong>{" "}
                                        {
                                            booking.packageName ||
                                            "N/A"
                                        }
                                    </p>

                                    <p>
                                        <strong>
                                            Number of People:
                                        </strong>{" "}
                                        {
                                            booking.numberOfPeople ||
                                            booking.numberOfTickets ||
                                            0
                                        }
                                    </p>

                                    <p>
                                        <strong>
                                            Payment Method:
                                        </strong>{" "}
                                        {
                                            booking.paymentMethod ||
                                            "N/A"
                                        }
                                    </p>

                                    <p>
                                        <strong>
                                            Payment Status:
                                        </strong>{" "}
                                        {
                                            booking.paymentStatus ||
                                            "N/A"
                                        }
                                    </p>

                                    <p>
                                        <strong>
                                            Total Amount:
                                        </strong>{" "}
                                        ₹
                                        {Number(
                                            booking.totalAmount ||
                                            0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </p>

                                </div>

                                <button
                                    className="cancel-booking-btn"
                                    onClick={() =>
                                        cancelBooking(
                                            booking.bookingId
                                        )
                                    }
                                >
                                    Cancel Booking
                                </button>

                            </div>
                        )
                    )}

                </div>
            )}

        </div>
    );
}

export default MyBookings;

