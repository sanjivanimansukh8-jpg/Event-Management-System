import { useNavigate } from "react-router-dom"
import "./AdminDashboard.css";

function AdminDashboard() {
    const navigate=useNavigate();
    const user=JSON.parse(localStorage.getItem("user"));
    const handleLogout=()=>{
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        navigate("/login");
    };
    return(
        <div className="admin-dashboard">
            <div className="admin-header">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Welcome, {user?.name}</p>
                </div>
            <button onClick={handleLogout}>Logout</button>
        </div>

        <div className="admin-content">
            <div className="admin-card">
                <h2>Manage Events</h2>
                <p>Add, edit and delete events.</p>
                <button onClick={()=>navigate("/view-events")}>View Events</button>
            </div>

            <div className="admin-card">
                <h2>Manage Packages</h2>
                <p>View, add, edit and delete pacakges.</p>
                <button onClick={()=>navigate("/admin/manage-packages")}>
                    Manage Packages
                </button>
            </div>
            
            <div className="admin-card">
                <h2>Manage Bookings</h2>
                <p>View and manage customer bookings.</p>
                <button onClick={()=>navigate("/admin/manage-bookings")}>Manage Bookings</button>
            </div>

            <div className="admin-card">
                <h2>Add Event</h2>
                <p>Add a new event to the system.</p>
                <button onClick={()=>navigate("/admin/add-event")}>Add Event</button>
            </div>

            <div className="admin-card">
                <h2>Manage Payments</h2>
                <p>View customer payment details and payment status.</p>
                <button onClick={()=>navigate("/admin/manage-payments")}>
                    Manage Payments
                </button>
             </div>

             <div className="admin-card">
                <h2>Manage Inquiries</h2>
                <p>View and respond to customer event inquiries/</p>
                <button onClick={() =>
                navigate("/admin/manage-inquiries")
                }>Manage Inquiries</button>
                </div>

                <div className="admin-card">
                    <h2>Manage Users</h2>
                    <p>View and delete registered users.</p>
                    <button onClick={() => navigate("/admin/manage-users")}>
                        Manage Users
                        </button>
                </div>
            </div>
        </div>
    ) 
}
export default AdminDashboard;