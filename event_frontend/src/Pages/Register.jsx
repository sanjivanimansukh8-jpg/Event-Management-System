import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError("");
        setMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (formData.name.trim().length < 2) {
            setError("Name must contain at least 2 characters.");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (formData.password.length > 20) {
            setError("Password must not exceed 20 characters.");
            return;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            setError("Phone number must contain exactly 10 digits.");
            return;
        }

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

            console.log("Status:", response.status);
            const responseText = await response.text();
            console.log("Response:", responseText);
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

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (error) {
            console.error("Registration Error:", error);
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
                    </div>

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

                    <button
                        type="submit"
                        className="register-btn"
                    >
                        Register
                    </button>
                </form>

                {message && (
                    <p className="register-message success">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="register-message error">
                        {error}
                    </p>
                )}

                <p className="account-text">
                    Already have an account?
                    {" "}
                    <Link to="/login">
                        Login
                    </Link>
                </p>
           </div>
        </div>
    );
}

export default Register;