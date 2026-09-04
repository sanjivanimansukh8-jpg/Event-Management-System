import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">EventHub</Link>
      </div>

      <ul className="navbar-menu">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/events">Events</Link>
        </li>
        <li>
          <Link to="/booking">Booking</Link>
        </li>

        {user && user.role === "USER" && (
          <li>
            <Link to="/my-bookings">My Bookings</Link>
          </li>
        )}

        {user ? (
          <>
            <li className="user-name">
              Hello, {user.name}
            </li>

            {user.role === "ADMIN" && (
              <>
                <li>
                  <Link to="/admin">Admin</Link>
                </li>

                <li>
                  <Link to="/admin/manage-bookings">
                    Manage Bookings
                  </Link>
                </li>
              </>
            )}

            <li>
              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}

      </ul>
    </nav>
  );
}

export default Navbar;