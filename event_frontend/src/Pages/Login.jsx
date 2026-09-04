
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

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
                "http://localhost:8080/users/login",
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
                throw new Error(
                    responseText || "Invalid email or password"
                );
            }
            if (!responseText) {
                throw new Error(
                    "Server returned an empty response."
                );
            }

            const data = JSON.parse(responseText);
            console.log("Login Successful:", data);
            console.log("User Role:", data.role);
            localStorage.setItem(
                "user",
                JSON.stringify(data)
            );
            localStorage.setItem(
                "role",
                data.role
            );
            setMessage("Login Successful!");
            if (data.role === "ADMIN") {
                console.log("Admin login detected");
                navigate("/admin");
            }
            else {
                console.log("User login detected");
                navigate("/");
            }
        } catch (error) {
            console.error("Login Error:", error);
            setError(
                error.message ||
                "Invalid email or password"
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

                {message && (
                    <p className="login-message success">
                        {message}
                    </p>
                )}
                {error && (
                    <p className="login-message error">
                        {error}
                    </p>
                )}
                <p className="account-text">
                    Don't have an account?{" "}
                    <Link to="/register">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
