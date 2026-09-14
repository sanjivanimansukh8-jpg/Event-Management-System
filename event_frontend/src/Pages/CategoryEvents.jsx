import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./CategoryEvents.css";

import acousticEvening from "../assets/event-images/acousticEvening.png";
import anniversaryParty from "../assets/event-images/anniversary-party.png";
import annualSchoolFunction from "../assets/event-images/annualSchoolFunction.png";
import artPainting from "../assets/event-images/artPainting.png";
import badmintonTournament from "../assets/event-images/badmintonTournament.png";
import birthdayBash from "../assets/event-images/birthday-bash.png";
import bollywoodNight from "../assets/event-images/bollywoodNight.png";
import businessConference from "../assets/event-images/businessConference.png";
import classicalDance from "../assets/event-images/classicalDance.png";
import collegeCulturalFest from "../assets/event-images/collegeCulturalFest.png";
import collegeTalentShow from "../assets/event-images/collegeTalentShow.png";
import corporateAnnualMeet from "../assets/event-images/corporateAnnualMeet.png";
import cricketTournament from "../assets/event-images/cricketTournament.png";
import destinationWedding from "../assets/event-images/destination-wedding.png";
import folkArts from "../assets/event-images/folkArts.png";
import footballChampionship from "../assets/event-images/footballChampionship.png";
import garbaNight from "../assets/event-images/garbaNight.png";
import internationalFood from "../assets/event-images/internationalFood.png";
import liveMusicConcert from "../assets/event-images/liveMusicConcert.png";
import mumbaiFoodCarnival from "../assets/event-images/mumbaiFoodCarnival.png";
import photographyExhibition from "../assets/event-images/photographyExhibition.png";
import productLaunch from "../assets/event-images/productLaunch.png";
import royalWedding from "../assets/event-images/royal-wedding.png";
import schoolScienceExhibition from "../assets/event-images/schoolScienceExhibition.png";
import schoolSportsDay from "../assets/event-images/schoolSportsDay.png";
import streetFood from "../assets/event-images/streetFood.png";
import technologyExhibition from "../assets/event-images/technologyExhibition.png";
import themeParty from "../assets/event-images/theme-party.png";
import traditionalMusic from "../assets/event-images/traditionalMusic.png";
import traditionalWedding from "../assets/event-images/traditional-wedding.png";

const eventImages = {
    "Acoustic Evening": acousticEvening,
    "Anniversary Party": anniversaryParty,
    "Annual School Function": annualSchoolFunction,
    "Art & Painting Exhibition": artPainting,
    "Badminton Tournament": badmintonTournament,
    "Birthday Bash": birthdayBash,
    "Bollywood Night": bollywoodNight,
    "Business Conference": businessConference,
    "Classical Dance Performance": classicalDance,
    "College Cultural Fest": collegeCulturalFest,
    "College Talent Show": collegeTalentShow,
    "Corporate Annual Meet": corporateAnnualMeet,
    "Cricket Tournament": cricketTournament,
    "Destination Wedding": destinationWedding,
    "Folk Arts & Heritage Show": folkArts,
    "Football Championship": footballChampionship,
    "Garba Night": garbaNight,
    "International Food": internationalFood,
    "Live Music Concert": liveMusicConcert,
    "Mumbai Food Carnival": mumbaiFoodCarnival,
    "Photography Exhibition": photographyExhibition,
    "Product Launch Event": productLaunch,
    "Royal Wedding": royalWedding,
    "School Science Exhibition": schoolScienceExhibition,
    "School Sports Day": schoolSportsDay,
    "Street Food Festival": streetFood,
    "Technology Exhibition": technologyExhibition,
    "Theme Party": themeParty,
    "Traditional Music Evening": traditionalMusic,
    "Traditional Wedding": traditionalWedding
};

function CategoryEvents() {
    const { category } = useParams();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const decodedCategory = decodeURIComponent(category);
        setLoading(true);
        fetch(
            `${import.meta.env.VITE_API_URL}/events/category/${encodeURIComponent(
                decodedCategory
            )}`
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch events");
                }
                return response.json();
            })
            .then((data) => {
                setEvents(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(
                    "Error fetching events:",
                    error
                );
                setLoading(false);
            });
    }, [category]);

    if (loading) {
        return (
            <div className="events-page">
                <div className="loading-container">
                    <h2>Loading events...</h2>
                </div>
            </div>
        );
    }

    const categoryName = decodeURIComponent(category);
    return (
        <div className="events-page">
            <div className="events-header">
                <h1>
                    {categoryName} Events
                </h1>
                <p>
                    Discover amazing {categoryName.toLowerCase()} events
                </p>
            </div>

            <div className="events-container">
                {events.length === 0 ? (
                    <div className="no-events">
                        <h2>
                            No events available
                        </h2>
                        <p>
                            There are currently no events
                            in this category.
                        </p>
                    </div>
                ) : (
                    events.map((event) => {
                        const image =
                            eventImages[event.eventName];

                            return (
                            <div
                                className="event-card"
                                key={event.id}
                            >

                                <div className="event-image-container">
                                    {image ? (
                                        <img
                                            src={image}
                                            alt={event.eventName}
                                            className="event-image"
                                        />
                                    ) : (
                                        <div className="image-placeholder">
                                            Event Image
                                        </div>
                                    )}
                                </div>

                                <div className="event-content">
                                    <h2>
                                        {event.eventName}
                                    </h2>
                                    <p className="event-category">
                                        <strong>
                                            Category:
                                        </strong>{" "}
                                        {event.category}
                                    </p>
                                    <p className="event-venue">
                                        <strong>
                                            Venue:
                                        </strong>{" "}
                                        {event.venue || "Venue will be announced"}
                                    </p>
                                    <p className="event-price">
                                        <strong>
                                            Ticket Price:
                                        </strong>{" "}
                                        ₹
                                        {Number(
                                            event.ticketPrice
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </p>
                                    <p className="event-description">
                                        {event.description}
                                    </p>
                                    <Link
                                        to={`/events/${event.id}`}
                                        className="event-btn"
                                    >
                                        View Event
                                    </Link>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
export default CategoryEvents;