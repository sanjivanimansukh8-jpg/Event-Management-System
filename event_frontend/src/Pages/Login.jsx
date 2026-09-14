
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [otp, setOtp] = useState("");
    const [showOtp, setShowOtp] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setMessage("");
        setError("");
    };

    // LOGIN WITH EMAIL + PASSWORD
    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!formData.email) {
            setError("Please enter your email.");
            return;
        }

        if (!formData.password) {
            setError("Please enter your password.");
            return;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/users/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            console.log("Login Status:", response.status);

            const responseText = await response.text();

            console.log("Login Response:", responseText);

            if (!response.ok) {
                let errorMessage = "Invalid email or password";

                try {
                    const errorData = JSON.parse(responseText);
                    errorMessage =
                        errorData.message || errorMessage;
                } catch {
                    if (responseText) {
                        errorMessage = responseText;
                    }
                }

                throw new Error(errorMessage);
            }

            if (!responseText) {
                throw new Error(
                    "Server returned an empty response."
                );
            }

            const data = JSON.parse(responseText);

            console.log("Login Response Data:", data);

            // ==============================
            // ADMIN LOGIN - OTP REQUIRED
            // ==============================
            if (data.requiresOtp === true) {
                console.log("Admin login detected");

                setShowOtp(true);

                setMessage(
                    "OTP sent to your admin email."
                );

                return;
            }

            // ==============================
            // NORMAL USER LOGIN
            // ==============================

            console.log("User login detected");

            localStorage.setItem(
                "user",
                JSON.stringify(data)
            );

            localStorage.setItem(
                "role",
                data.role
            );

            setMessage("Login Successful!");

            navigate("/");

        } catch (error) {
            console.error("Login Error:", error);

            setError(
                error.message ||
                "Invalid email or password"
            );
        }
    };

    // ==============================
    // VERIFY ADMIN OTP
    // ==============================

    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!otp) {
            setError("Please enter the OTP.");
            return;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/users/admin-login/verify-otp`,
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

            const responseText =
                await response.text();

            console.log(
                "OTP Verification Response:",
                responseText
            );

            if (!response.ok) {
                let errorMessage =
                    "Invalid or expired OTP";

                try {
                    const errorData =
                        JSON.parse(responseText);

                    errorMessage =
                        errorData.message ||
                        errorMessage;

                } catch {
                    if (responseText) {
                        errorMessage =
                            responseText;
                    }
                }

                throw new Error(errorMessage);
            }

            const admin = JSON.parse(responseText);

            console.log(
                "Admin OTP verified:",
                admin
            );

            // Save admin ONLY after OTP verification
            localStorage.setItem(
                "user",
                JSON.stringify(admin)
            );

            localStorage.setItem(
                "role",
                admin.role
            );

            setMessage(
                "Admin login successful!"
            );

            // Go to Admin Dashboard
            navigate("/admin");

        } catch (error) {
            console.error(
                "OTP Verification Error:",
                error
            );

            setError(
                error.message ||
                "OTP verification failed"
            );
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <h1>Welcome Back</h1>

                <p className="login-subtitle">
                    Login to continue to EventHub
                </p>

                {/* ========================= */}
                {/* NORMAL LOGIN FORM */}
                {/* ========================= */}

                {!showOtp ? (

                    <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="login-btn"
                        >
                            Login
                        </button>

                    </form>

                ) : (

                    /* ========================= */
                    /* ADMIN OTP FORM */
                    /* ========================= */

                    <form onSubmit={handleVerifyOTP}>

                        <p>
                            Enter the OTP sent to:
                        </p>

                        <strong>
                            {formData.email}
                        </strong>

                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => {
                                    setOtp(e.target.value);
                                    setError("");
                                }}
                                maxLength="6"
                                inputMode="numeric"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="login-btn"
                        >
                            Verify OTP
                        </button>

                    </form>
                )}

                {/* SUCCESS MESSAGE */}

                {message && (
                    <p className="login-message success">
                        {message}
                    </p>
                )}

                {/* ERROR MESSAGE */}

                {error && (
                    <p className="login-message error">
                        {error}
                    </p>
                )}

                {/* REGISTER LINK */}

                {!showOtp && (
                    <p className="account-text">
                        Don't have an account?{" "}
                        <Link to="/register">
                            Register
                        </Link>
                    </p>
                )}

            </div>
        </div>
    );
}

export default Login;

