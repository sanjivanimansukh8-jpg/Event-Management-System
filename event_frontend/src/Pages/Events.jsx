import { Link } from "react-router-dom";
import "./Events.css";

import weddingImage from "../assets/images/wedding.png";
import corporateImage from "../assets/images/corporate_event.png";
import sportsImage from "../assets/images/sport.png";
import culturalImage from "../assets/images/cultural.png";
import foodFestivalImage from "../assets/images/food & festival.png";
import collegeFestImage from "../assets/images/college fest.png";
import partiesImage from "../assets/images/parties.png";
import schoolEventsImage from "../assets/images/school_events.png";
import musicImage from "../assets/images/music.png";
import exhibitionImage from "../assets/images/exhibition.png";

function Events() {
    const categories = [
        {
            name: "Wedding",
            image: weddingImage
        },
        {
            name: "Parties",
            image: partiesImage
        },
        {
            name: "Corporate Events",
            image: corporateImage
        },
        {
            name: "Sports",
            image: sportsImage
        },
        {
            name: "School Events",
            image: schoolEventsImage
        },
        {
            name: "Music",
            image: musicImage
        },
        {
            name: "Food & Festival",
            image: foodFestivalImage
        },
        {
            name: "Exhibition",
            image: exhibitionImage
        },
        {
            name: "College Fest",
            image: collegeFestImage
        },
        {
            name: "Cultural",
            image: culturalImage
        }
    ];

    return (
        <div className="events-page">
            <h1>Explore Events</h1>
            <p className="events-subtitle">
                Discover the perfect event for you
            </p>

            <div className="category-container">
                {categories.map((category) => (
                    <Link
                        key={category.name}
                        to={`/events/category/${encodeURIComponent(category.name)}`}
                        className="category-card"
                    >
                        <img
                            src={category.image}
                            alt={category.name}
                            className="category-image"
                        />
                        <h2>{category.name}</h2>
                        <p>
                            Explore {category.name} events
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
export default Events;