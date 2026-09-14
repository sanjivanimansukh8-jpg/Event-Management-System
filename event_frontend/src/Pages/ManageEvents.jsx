import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import "./ManageEvents.css";

function ManageEvents() {
    const navigate=useNavigate();
    const [events,setEvents]=useState([]);
    const [loading,setLoading]=useState(true);

    const fetchEvents=async()=>{
        try{
            const response=await fetch(`${import.meta.env.VITE_API_URL}/events`);
            if (!response.ok) {
                throw new Error("Failed to fetch events");
            }
            const data=await response.json();
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events:",error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(()=>{
        fetchEvents();
    },[]);

    const handleDelete=async(id)=>{
        const comfirmDelete=window.confirm(
            "Are you sure you want to delete this event?"
        );
        if(!comfirmDelete) {
            return;
        }
        try{
            const response=await fetch(
                `${import.meta.env.VITE_API_URL}/events/${id}`,
                {
                    method:"DELETE",
                }
            );
            if (!response.ok) {
                throw new Error("Failed to delete events");
            }
            alert("Event deleted successfully");
            fetchEvents();
        } catch (error) {
            console.error("Error deleting event:",error);
            alert("Failed to delete event");
        }
    }
    if (loading) {
        return (
            <div className="manage-events-loading">
                Loading events...
            </div>
        );
    }
    return (
        <div className="manage-events-page">
            <div className="manage-events-header">
                <div>
                    <h1>Manage Events</h1>
                    <p>View, add, edit and delete events.</p>
                </div>
                <button className="add-event-btn"
                onClick={()=>navigate("/admin/events/add")}>
                    + Add Event
                </button>
            </div>

            <div className="events-table-container">
                {events.length===0 ? (
                    <div className="no-events">
                        <p>No events avialabel</p>
                    </div>
                ):(
                    <table className="events-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Event Name</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Venue</th>
                                <th>Category</th>
                                <th>Ticket Price</th>
                                <th>Seats</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event)=>(
                                <tr key={event.id}>
                                    <td>{event.id}</td>
                                    <td>{event.eventName}</td>
                                    <td>{event.category}</td>
                                    <td>{event.venue}</td>
                                    <td>{event.ticketPrice}</td>
                                    <td>{event.availabeleSeats}</td>
                                    <td className="event-actions">
                                        <button className="edit-btn" 
                                        onClick={()=>
                                            navigate(`/admin/events/edit/${event.id}`)
                                        }>Edit</button>

                                        <button className="delete-btn" 
                                        onClick={()=>handleDelete(event.id)}>
                                            Delete </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
export default ManageEvents;