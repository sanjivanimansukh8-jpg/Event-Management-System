import { Link } from "react-router-dom";

function EventCard({event}) {
    return (
        <div className="event-card">
            <img src={event.image} alt={event.title}/>
            <div className="event-content">
                <h3>{event.title}</h3>
                <h3>{event.date}</h3>
                <h3>{event.location}</h3>

                <Link to={`/event/${event.id}`}>
                <button>View Details</button>
                </Link>
            </div>
        </div>
    )
}
export default EventCard;