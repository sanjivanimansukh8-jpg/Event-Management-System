import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageUsers.css";

function ManageUsers() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");

    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:8080/users");
            if (response.ok) {
                const data = await response.json();
                console.log("Users received:", data);
                setUsers(data);
            } else {
                setMessage("Failed to load users");
            }
        } catch (error) {
            console.error(error);
            setMessage("Server error");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteUser = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );
        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8080/users/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (response.ok) {
                setMessage("User deleted successfully");
                fetchUsers();
            } else {
                setMessage("Failed to delete user");
            }
        } catch (error) {
            console.error(error);
            setMessage("Server error");
        }
    };

    return (
        <div className="manage-users-page">
            <div className="manage-users-container">
                <div className="users-header">
                    <div>
                        <h1>Manage Users</h1>
                        <p>View and manage registered users.</p>
                    </div>
                    <button
                        className="back-btn"
                        onClick={() => navigate("/admin")}
                    >
                        Back to Dashboard
                    </button>
                </div>

                {message && (
                    <div className="user-message">
                        {message}
                    </div>
                )}
                {users.length === 0 ? (
                    <div className="no-users">
                        <h2>No Users Found</h2>
                        <p>There are currently no registered users.</p>
                    </div>
                ) : (
                    <div className="user-table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>
                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    deleteUser(user.id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageUsers;