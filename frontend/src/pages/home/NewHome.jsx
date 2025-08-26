import React, { useState } from "react";
import Featured from "../../components/featured/Featured";
import FeaturedProperties from "../../components/featuredProperties/FeaturedProperties";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Navbar from "../../components/navbar/Navbar";
import PropertyList from "../../components/propertyList/PropertyList";
import { useNavigate } from "react-router-dom";
import "./newhome.css";

const NewHome = () => {
  const [destination, setDestination] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/hotels', { state: { destination } });
  };

  return (
    <div className="nh-root">
      <Navbar />
      {/* hide Header's built-in hero so we can render a custom one */}
      <Header type="list" />

      <main className="nh-main">
        <section className="nh-hero">
          <div className="nh-heroInner">
            <div className="nh-heroLeft">
              <h1 className="nh-title">Travel well. Live well.</h1>
              <p className="nh-sub">Curated stays, effortless booking — designed for people who value craft and calm.</p>

              <div className="nh-searchPill">
                <input
                  className="nh-input"
                  placeholder="Search destinations, e.g. Paris"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
                <button className="nh-cta" onClick={handleSearch}>Search</button>
              </div>

              <div className="nh-features">
                <div className="nh-feature">Handpicked homes</div>
                <div className="nh-feature">Flexible bookings</div>
                <div className="nh-feature">Local experiences</div>
              </div>
            </div>

            <div className="nh-heroRight" aria-hidden>
              <div className="nh-visual" />
            </div>
          </div>
        </section>

        <section className="nh-section">
          <h2 className="nh-sectionTitle">Featured stays</h2>
          <div className="nh-sectionInner">
            <Featured />
          </div>
        </section>

        <section className="nh-section alt">
          <h2 className="nh-sectionTitle">Browse by property type</h2>
          <PropertyList />
        </section>

        <section className="nh-section">
          <h2 className="nh-sectionTitle">Homes guests love</h2>
          <FeaturedProperties />
        </section>

        <MailList />
        <Footer />
      </main>
    </div>
  );
};

export default NewHome;
