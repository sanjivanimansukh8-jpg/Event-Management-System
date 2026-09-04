import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ManagePayments.css";

function ManagePayments() {
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch("http://localhost:8080/api/payment")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch payments"
                    );
                }
                return response.json();
            })
            .then((data) => {
                console.log(
                    "Payments:",
                    data
                );
                setPayments(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(
                    "Payment Error:",
                    error
                );
                setLoading(false);
            });
    }, []);

    const formatDate = (date) => {
        if (!date) {
            return "Not specified";
        }
        const parts = date.split("-");
        if (parts.length === 3) {

            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return date;
    };

    const formatAmount = (amount) => {
        return Number(
            amount || 0
        ).toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 2
            }
        );
    };

    if (loading) {
        return (
            <div className="manage-payments-page">
                <div className="payments-loading">
                    Loading payments...
                </div>
            </div>
        );
    }

    return (
        <div className="manage-payments-page">
            <div className="payments-header">
                <div>
                    <h1>
                        Manage Payments
                    </h1>
                    <p>
                        View and manage all event
                        booking payments.
                    </p>
                </div>

                <button
                    className="back-dashboard-btn"
                    onClick={() =>
                        navigate("/admin")
                    }
                >
                    ← Back to Dashboard
                </button>
            </div>

            <div className="payment-stats">
                <div className="payment-stat-card">
                    <h3>
                        Total Payments
                    </h3>
                    <strong>
                        {payments.length}
                    </strong>
                </div>

                <div className="payment-stat-card">
                    <h3>
                        Paid
                    </h3>
                    <strong>
                        {
                            payments.filter(
                                (payment) =>
                                    payment.paymentStatus ===
                                    "Paid"
                            ).length
                        }
                    </strong>
                </div>

                <div className="payment-stat-card">
                    <h3>
                        Pending
                    </h3>
                    <strong>
                        {
                            payments.filter(
                                (payment) =>
                                    payment.paymentStatus ===
                                    "Pending"
                            ).length
                        }
                    </strong>
                </div>

                <div className="payment-stat-card">
                    <h3>
                        Total Amount
                    </h3>
                    <strong>
                        ₹
                        {formatAmount(
                            payments.reduce(
                                (
                                    total,
                                    payment
                                ) =>
                                    total +
                                    Number(
                                        payment.amount ||
                                        0
                                    ),
                                0
                            )
                        )}
                    </strong>
                </div>
            </div>

            <div className="payments-table-container">
                {payments.length === 0 ? (
                    <div className="no-payments">
                        <h2>
                            No Payments Found
                        </h2>
                        <p>
                            No booking payments have
                            been recorded yet.
                        </p>
                    </div>
                ) : (
                    <table className="payments-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Event</th>
                                <th>Venue</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Package</th>
                                <th>People</th>
                                <th>Amount</th>
                                <th>Payment Method</th>
                                <th>Status</th>
                                <th>Razorpay Payment ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(
                                (payment) => (
                                    <tr
                                        key={
                                            payment.id
                                        }
                                    >
                                        <td>
                                            #
                                            {
                                                payment.id
                                            }
                                        </td>
                                        <td className="event-name">
                                            {
                                                payment.eventName ||
                                                "Not specified"
                                            }
                                        </td>
                                        <td>
                                            {
                                                payment.venue ||
                                                "Not specified"
                                            }
                                        </td>
                                        <td>
                                            {
                                                formatDate(
                                                    payment.date
                                                )
                                            }
                                        </td>
                                        <td>
                                            {
                                                payment.time ||
                                                "Not specified"
                                            }
                                        </td>
                                        <td>
                                            {
                                                payment.packageName ||
                                                "Not specified"
                                            }
                                        </td>
                                        <td>
                                            {
                                                payment.numberOfPeople ||
                                                0
                                            }
                                        </td>
                                        <td className="amount">

                                            ₹
                                            {
                                                formatAmount(
                                                    payment.amount
                                                )
                                            }
                                        </td>
                                        <td>
                                            <span
                                                className={
                                                    payment.paymentMethod ===
                                                    "Razorpay"
                                                        ? "method-online"
                                                        : "method-cod"
                                                }
                                            >
                                                {
                                                    payment.paymentMethod
                                                }
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className={
                                                    payment.paymentStatus ===
                                                    "Paid"
                                                        ? "status-paid"
                                                       : "status-pending"
                                                }
                                            >
                                                {
                                                    payment.paymentStatus
                                                }
                                            </span>
                                        </td>
                                        <td className="razorpay-id">
                                            {
                                                payment.razorpayPaymentId ||
                                                "-"
                                            }
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
export default ManagePayments;