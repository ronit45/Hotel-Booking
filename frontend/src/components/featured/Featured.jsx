import React from 'react';
import useFetch from "../../hooks/useFetch";
import "./Featured.css";

const Featured = () => {
  const { data, loading, error } = useFetch("/hotels/countByCity?cities=madrid,london,berlin");

  const images = [
    "https://images.unsplash.com/photo-1596623814178-22b4a162339c?q=80&w=1932&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529655683826-1c21ef2be90c?q=80&w=1932&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?q=80&w=2070&auto=format&fit=crop"
  ];

  const cities = ["Berlin", "Madrid", "London"];

  return (
    <section className="featured-section">
      <div className="featured-container">
        <h2 className="featured-main-title">Explore Popular Destinations</h2>
        <div className="featured">
          {loading ? (
            <p>Loading please wait...</p>
          ) : error ? (
            <p>Could not fetch destinations.</p>
          ) : (
            <>
              {Array.isArray(data) && data.map((count, index) => (
                <div className="featuredItem" key={index}>
                  <img
                    src={images[index]}
                    alt={`View of ${cities[index]}`}
                    className="featuredImg"
                  />
                  <div className="featuredTitles">
                    <h1>{cities[index]}</h1>
                    <h2>{count} properties</h2>
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

export default Featured;
