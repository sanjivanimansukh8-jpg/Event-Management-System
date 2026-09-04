import "../assets/styles/Home.css";
import eventBackground from "../assets/images/event-background.jpeg";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate=useNavigate();
  return (
    <div className="home">
      <section
        className="hero"
        style={{
          backgroundImage: `url(${eventBackground})`
        }}
      >

        <div className="hero-overlay">
          <div className="hero-content">
            <p className="hero-subtitle">
              WELCOME TO EVENT HUB
            </p>
            <h1>
              Plan Your Perfect Event
            </h1>

            <p className="hero-description">
               From elegant weddings and engagements to corporate events,
               birthday celebrations and cultural programs, we plan every
               detail to make your special moments unforgettable.
            </p>

            <button className="events-btn" onClick={()=>navigate("/events")}>
              Plan Your Event
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;