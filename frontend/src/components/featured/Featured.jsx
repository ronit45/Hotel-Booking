import React from 'react';
import useFetch from "../../hooks/useFetch";
import "./featured.css";

const Featured = () => {
  const { data, loading, error } = useFetch("/hotels/countByCity?cities=madrid,london,berlin");

  const images = [
    "https://images.contentstack.io/v3/assets/blt06f605a34f1194ff/blt09d1de6a0e9b8f34/679fa8e212289967953af2d7/BCC-2024-EXPLORER-MADRID-GETTING-AROUND-HEADER_DESKTOP.jpg?format=webp&auto=avif&quality=60&crop=16%3A9&width=1440",
    "https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcSZSMjYljn2aj_XK3wn6tOr1LEIeQnTJ692veYEd_mdG54Yg2wv9QjwI82G9uz_8nrOnABHR_fPBVrfQpM_RKjDnVJEduplycGp7U0wLg",
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
