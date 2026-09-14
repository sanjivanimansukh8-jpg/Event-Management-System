import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: ""
    });

    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setError("");
        setMessage("");

        // If email is changed, OTP must be verified again
        if (e.target.name === "email") {
            setOtpSent(false);
            setOtpVerified(false);
            setOtp("");
        }
    };

    // Validate registration details
    const validateForm = () => {
        if (formData.name.trim().length < 2) {
            setError("Name must contain at least 2 characters.");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address.");
            return false;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return false;
        }

        if (formData.password.length > 20) {
            setError("Password must not exceed 20 characters.");
            return false;
        }

        const phoneRegex = /^[0-9]{10}$/;

        if (!phoneRegex.test(formData.phone)) {
            setError("Phone number must contain exactly 10 digits.");
            return false;
        }

        return true;
    };

    const handleSendOTP = async () => {
    console.log("SEND OTP CLICKED");

    setMessage("");
    setError("");

    // Only validate email for OTP
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address.");
        return;
    }

    try {
        const response = await fetch(
            "http://localhost:8080/otp/send",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: formData.email
                })
            }
        );

        const data = await response.json();

        console.log("OTP Send Status:", response.status);
        console.log("OTP Send Response:", data);

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to send OTP."
            );
        }

        // SHOW OTP BOX
        setOtpSent(true);
        setOtpVerified(false);

        setMessage(
            "OTP sent successfully. Please check your email."
        );

    } catch (error) {
        console.error("OTP Send Error:", error);

        setError(
            error.message ||
            "Failed to send OTP. Please try again."
        );
    }
};

    // Verify OTP
    const handleVerifyOTP = async () => {
        setMessage("");
        setError("");

        if (!otp || otp.length !== 6) {
            setError("Please enter the 6-digit OTP.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:8080/otp/verify",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        otp: otp
                    })
                }
            );

            const data = await response.json();

            console.log("OTP Verify Status:", response.status);
            console.log("OTP Verify Response:", data);

            if (!response.ok) {
                throw new Error(
                    data.message || "Invalid or expired OTP."
                );
            }

            if (data.verified) {
                setOtpVerified(true);
                setMessage(
                    "Email verified successfully!"
                );
                setError("");
            }

        } catch (error) {
            console.error("OTP Verify Error:", error);

            setOtpVerified(false);

            setError(
                error.message ||
                "Invalid or expired OTP."
            );
        }
    };

    // Register user
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!validateForm()) {
            return;
        }

        // OTP must be verified before registration
        if (!otpVerified) {
            setError(
                "Please verify your email with OTP before registering."
            );
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await fetch(
                "http://localhost:8080/users/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            console.log("Registration Status:", response.status);

            const responseText = await response.text();

            console.log(
                "Registration Response:",
                responseText
            );

            if (!response.ok) {
                throw new Error(
                    responseText ||
                    `Registration failed. Status: ${response.status}`
                );
            }

            setMessage("Registration Successful!");

            setFormData({
                name: "",
                email: "",
                password: "",
                phone: ""
            });

            setOtp("");
            setOtpSent(false);
            setOtpVerified(false);

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            console.error(
                "Registration Error:",
                error
            );
            setIsSubmitting(false);
            setError(
                error.message ||
                "Registration failed. Please try again."
            );
        }
    };

    return (
        <div className="register-page">
            <div className="register-card">

                <h1>Create Account</h1>

                <p className="register-subtitle">
                    Register to book your perfect event
                </p>

                <form onSubmit={handleSubmit}>

                    {/* Name */}
                    <div className="form-group">
                        <label>Name</label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            autoComplete="name"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />

                        <button
                            type="button"
                            className="register-btn"
                            onClick={handleSendOTP}
                        >
                            {otpSent ? "Resend OTP" : "Send OTP"}
                        </button>
                    </div>

                    {otpSent && !otpVerified && (
    <div className="form-group">
        <label>Enter OTP</label>

        <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => {
                const value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6);

                setOtp(value);
                setError("");
                setMessage("");
            }}
            maxLength={6}
            inputMode="numeric"
        />

        <button
            type="button"
            className="register-btn"
            onClick={handleVerifyOTP}
        >
            Verify OTP
        </button>
    </div>
)}
                   

                    {/* Password */}
                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            minLength={6}
                            maxLength={20}
                            required
                        />

                        <small>
                            Password must be 6–20 characters.
                        </small>
                    </div>

                    {/* Phone */}
                    <div className="form-group">
                        <label>Phone</label>

                        <input
                            type="tel"
                            name="phone"
                            placeholder="Enter your 10-digit phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            autoComplete="tel"
                            maxLength={10}
                            required
                        />
                    </div>

                    {/* Register */}
                    <button
                        type="submit"
                        className="register-btn"
                        disabled={!otpVerified}
                    >
                        {isSubmitting ? "Registering..." : "Register"}
                    </button>

                </form>

                {/* Success message */}
                {message && (
                    <p className="register-message success">
                        {message}
                    </p>
                )}

                {/* Error message */}
                {error && (
                    <p className="register-message error">
                        {error}
                    </p>
                )}

                <p className="account-text">
                    Already have an account?{" "}
                    <Link to="/login">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Register;

