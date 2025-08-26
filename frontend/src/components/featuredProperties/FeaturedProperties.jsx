import React from 'react';
import useFetch from "../../hooks/useFetch";
import "./featuredProperties.css";

const FeaturedProperties = () => {
  const { data, loading, error } = useFetch("/hotels?featured=true&limit=3");

  return (
    <section className="fp-section">
      <div className="fp-container">
        <h2 className="fp-title">Featured Hotels</h2>
        <div className="fp">
          {loading ? (
            <p>Loading please wait...</p>
          ) : error ? (
            <p>Could not fetch properties.</p>
          ) : (
            <>
              {Array.isArray(data) && data.map(item => (
                <div className="fpItem" key={item._id}>
                  <img
                    src={item.photos[0] || 'https://placehold.co/600x400/E2E8F0/4A5568?text=No+Image'}
                    alt={item.name}
                    className="fpImg"
                  />
                  <div className="fpContent">
                    <h3 className="fpName">{item.name}</h3>
                    <p className="fpCity">{item.city}</p>
                    <div className="fpDetails">
                      <span className="fpPrice">Starting from ${item.cheapestPrice}</span>
                      <button className="fpButton">Book Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
