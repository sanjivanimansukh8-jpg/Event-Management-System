
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";

function Payment() {
    const location = useLocation();
    const navigate = useNavigate();

    const bookingData = location.state;

    const [paymentMethod, setPaymentMethod] = useState("");

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    if (!bookingData) {
        return (
            <div className="payment-page">
                <div className="payment-container">
                    <h2>Booking information not found</h2>

                    <button
                        onClick={() => navigate("/events")}
                    >
                        Go to Events
                    </button>
                </div>
            </div>
        );
    }

    // SAVE PAYMENT
    const savePayment = async (paymentData) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/payment/save`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(paymentData)
                }
            );

            if (!response.ok) {
                throw new Error("Failed to save payment");
            }

            const savedPayment = await response.json();

            console.log(
                "Payment saved successfully:",
                savedPayment
            );

            return savedPayment;

        } catch (error) {
            console.error(
                "Payment save error:",
                error
            );

            alert(
                "Payment completed but payment details could not be saved."
            );

            return null;
        }
    };

    // SAVE BOOKING
    const saveBooking = async ({
        paymentMethodName,
        paymentStatus,
        paymentId = null,
        razorpayOrderId = null,
        razorpayPaymentId = null
    }) => {
        try {
            const bookingToSave = {
                userName:
                    user?.userName ||
                    user?.name ||
                    "",

                email:
                    user?.email ||
                    "",

                phone:
                    user?.phone ||
                    "",

                eventName:
                    bookingData.event?.eventName ||
                    "",

                eventDate:
                    bookingData.date ||
                    "",

                eventTime:
                    bookingData.time ||
                    "",

                venue:
                    bookingData.venue ||
                    "",

                packageName:
                    bookingData.package?.packageName ||
                    "",

                numberOfTickets:
                    Number(
                        bookingData.numberOfPeople || 0
                    ),

                numberOfPeople:
                    Number(
                        bookingData.numberOfPeople || 0
                    ),

                totalAmount:
                    Number(
                        bookingData.totalAmount || 0
                    ),

                paymentMethod:
                    paymentMethodName,

                paymentStatus:
                    paymentStatus,

                paymentId:
                    paymentId,

                razorpayOrderId:
                    razorpayOrderId,

                razorpayPaymentId:
                    razorpayPaymentId
            };

            console.log(
                "BOOKING DATA BEING SENT:",
                bookingToSave
            );

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/bookings`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(
                        bookingToSave
                    )
                }
            );

            if (!response.ok) {
                const errorText =
                    await response.text();

                console.error(
                    "Backend booking error:",
                    errorText
                );

                throw new Error(
                    "Failed to save booking"
                );
            }

            const savedBooking =
                await response.json();

            console.log(
                "Booking saved successfully:",
                savedBooking
            );

            return savedBooking;

        } catch (error) {
            console.error(
                "Booking save error:",
                error
            );

            alert(
                "Payment completed but booking could not be saved."
            );

            return null;
        }
    };

    // HANDLE PAYMENT
    const handlePayment = async () => {
        if (!paymentMethod) {
            alert(
                "Please select a payment method."
            );

            return;
        }

        // =========================
        // CASH ON DELIVERY
        // =========================
        if (paymentMethod === "COD") {
            const paymentData = {
                amount:
                    Number(
                        bookingData.totalAmount || 0
                    ),

                eventName:
                    bookingData.event?.eventName ||
                    "",

                venue:
                    bookingData.venue ||
                    "",

                date:
                    bookingData.date ||
                    "",

                time:
                    bookingData.time ||
                    "",

                packageName:
                    bookingData.package?.packageName ||
                    "",

                numberOfPeople:
                    Number(
                        bookingData.numberOfPeople || 0
                    ),

                paymentMethod:
                    "Cash on Delivery",

                paymentStatus:
                    "Pending",

                razorpayOrderId:
                    null,

                razorpayPaymentId:
                    null
            };

            const savedPayment =
                await savePayment(
                    paymentData
                );

            if (!savedPayment) {
                return;
            }

            const savedBooking =
                await saveBooking({
                    paymentMethodName:
                        "Cash on Delivery",

                    paymentStatus:
                        "Pending",

                    paymentId:
                        savedPayment.id
                });

            if (!savedBooking) {
                return;
            }

            alert(
                "Booking confirmed! Payment will be collected at the venue."
            );

            navigate(
                "/booking-success",
                {
                    state: {
                        ...bookingData,

                        paymentMethod:
                            "Cash on Delivery",

                        paymentStatus:
                            "Pending",

                        paymentId:
                            savedPayment.id,

                        bookingId:
                            savedBooking.bookingId
                    }
                }
            );

            return;
        }

        // =========================
        // RAZORPAY
        // =========================
        if (paymentMethod === "RAZORPAY") {
            try {
                const amount =
                    Number(
                        bookingData.totalAmount || 0
                    );

                // CREATE RAZORPAY ORDER
                const response =
                    await fetch(
                        `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                amount: amount
                            })
                        }
                    );

                if (!response.ok) {
                    throw new Error(
                        "Failed to create Razorpay order"
                    );
                }

                const order =
                    await response.json();

                console.log(
                    "Razorpay Order:",
                    order
                );

                // RAZORPAY OPTIONS
                const options = {
                    key:
                        "rzp_test_TT9jHJjUCkdeQJ",

                    amount:
                        order.amount,

                    currency:
                        order.currency,

                    name:
                        "Navaratri Event Management",

                    description:
                        bookingData.event
                            ?.eventName ||
                        "Event Booking",

                    order_id:
                        order.id,

                    handler:
                        async function (
                            paymentResponse
                        ) {
                            console.log(
                                "Payment successful:",
                                paymentResponse
                            );

                            const paymentData = {
                                amount:
                                    Number(
                                        bookingData.totalAmount ||
                                        0
                                    ),

                                eventName:
                                    bookingData.event
                                        ?.eventName ||
                                    "",

                                venue:
                                    bookingData.venue ||
                                    "",

                                date:
                                    bookingData.date ||
                                    "",

                                time:
                                    bookingData.time ||
                                    "",

                                packageName:
                                    bookingData.package
                                        ?.packageName ||
                                    "",

                                numberOfPeople:
                                    Number(
                                        bookingData
                                            .numberOfPeople ||
                                        0
                                    ),

                                paymentMethod:
                                    "Razorpay",

                                paymentStatus:
                                    "Paid",

                                razorpayOrderId:
                                    paymentResponse
                                        .razorpay_order_id,

                                razorpayPaymentId:
                                    paymentResponse
                                        .razorpay_payment_id
                            };

                            // SAVE PAYMENT
                            const savedPayment =
                                await savePayment(
                                    paymentData
                                );

                            if (!savedPayment) {
                                return;
                            }

                            // SAVE BOOKING
                            const savedBooking =
                                await saveBooking({
                                    paymentMethodName:
                                        "Razorpay",

                                    paymentStatus:
                                        "Paid",

                                    paymentId:
                                        savedPayment.id,

                                    razorpayOrderId:
                                        paymentResponse
                                            .razorpay_order_id,

                                    razorpayPaymentId:
                                        paymentResponse
                                            .razorpay_payment_id
                                });

                            if (!savedBooking) {
                                return;
                            }

                            // GO TO SUCCESS PAGE
                            navigate(
                                "/booking-success",
                                {
                                    state: {
                                        ...bookingData,

                                        paymentMethod:
                                            "Razorpay",

                                        paymentStatus:
                                            "Paid",

                                        razorpayPaymentId:
                                            paymentResponse
                                                .razorpay_payment_id,

                                        razorpayOrderId:
                                            paymentResponse
                                                .razorpay_order_id,

                                        paymentId:
                                            savedPayment.id,

                                        bookingId:
                                            savedBooking.bookingId
                                    }
                                }
                            );
                        },

                    prefill: {
                        name:
                            user?.userName ||
                            user?.name ||
                            "",

                        email:
                            user?.email ||
                            "",

                        contact:
                            user?.phone ||
                            ""
                    },

                    theme: {
                        color:
                            "#3399cc"
                    }
                };

                // CHECK RAZORPAY
                if (!window.Razorpay) {
                    alert(
                        "Razorpay Checkout is not loaded. Please refresh the page and try again."
                    );

                    return;
                }

                // OPEN RAZORPAY
                const razorpay =
                    new window.Razorpay(
                        options
                    );

                razorpay.open();

            } catch (error) {
                console.error(
                    "Payment Error:",
                    error
                );

                alert(
                    "Unable to start payment. Please try again."
                );
            }
        }
    };

    return (
        <div className="payment-page">

            <div className="payment-container">

                <h1>
                    Complete Your Booking
                </h1>

                <div className="payment-summary">

                    <h2>
                        Booking Summary
                    </h2>

                    <p>
                        <strong>
                            Customer:
                        </strong>{" "}
                        {user?.userName ||
                            user?.name ||
                            "N/A"}
                    </p>

                    <p>
                        <strong>
                            Email:
                        </strong>{" "}
                        {user?.email ||
                            "N/A"}
                    </p>

                    <p>
                        <strong>
                            Phone:
                        </strong>{" "}
                        {user?.phone ||
                            "N/A"}
                    </p>

                    <p>
                        <strong>
                            Event:
                        </strong>{" "}
                        {bookingData.event
                            ?.eventName ||
                            "N/A"}
                    </p>

                    <p>
                        <strong>
                            Venue:
                        </strong>{" "}
                        {bookingData.venue ||
                            "N/A"}
                    </p>

                    <p>
                        <strong>
                            Date:
                        </strong>{" "}
                        {bookingData.date ||
                            "N/A"}
                    </p>

                    <p>
                        <strong>
                            Time:
                        </strong>{" "}
                        {bookingData.time ||
                            "N/A"}
                    </p>

                    <p>
                        <strong>
                            Package:
                        </strong>{" "}
                        {bookingData.package
                            ?.packageName ||
                            "N/A"}
                    </p>

                    <p>
                        <strong>
                            Number of People:
                        </strong>{" "}
                        {bookingData.numberOfPeople ||
                            0}
                    </p>

                    <hr />

                    <h2>
                        Total Amount: ₹
                        {Number(
                            bookingData.totalAmount ||
                            0
                        ).toLocaleString(
                            "en-IN"
                        )}
                    </h2>

                </div>

                <div className="payment-method">

                    <h2>
                        Select Payment Method
                    </h2>

                    <label className="payment-option">

                        <input
                            type="radio"
                            name="payment"
                            value="RAZORPAY"
                            checked={
                                paymentMethod ===
                                "RAZORPAY"
                            }
                            onChange={(e) =>
                                setPaymentMethod(
                                    e.target.value
                                )
                            }
                        />

                        <span>
                            💳 Online Payment

                            <small>
                                Pay using UPI, Card
                                or Net Banking
                            </small>
                        </span>

                    </label>

                    <label className="payment-option">

                        <input
                            type="radio"
                            name="payment"
                            value="COD"
                            checked={
                                paymentMethod ===
                                "COD"
                            }
                            onChange={(e) =>
                                setPaymentMethod(
                                    e.target.value
                                )
                            }
                        />

                        <span>
                            💵 Cash on Delivery

                            <small>
                                Pay at the venue
                            </small>
                        </span>

                    </label>

                </div>

                <button
                    className="payment-btn"
                    onClick={handlePayment}
                >
                    {paymentMethod ===
                    "RAZORPAY"
                        ? "Proceed to Online Payment"
                        : paymentMethod ===
                          "COD"
                        ? "Confirm Booking"
                        : "Select Payment Method"}
                </button>

            </div>
        </div>
    );
}

export default Payment;

