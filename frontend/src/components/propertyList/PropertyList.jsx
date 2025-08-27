import React from 'react';
import useFetch from "../../hooks/useFetch";
import "./propertyList.css";

const PropertyList = () => {
  const { data, loading, error } = useFetch("/hotels/countByType");
  console.log(data)
  const images = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1949&auto=format&fit=crop",
  ];

  return (
    <section className="pList-section">
      <div className="pList-container">
        <h2 className="pList-main-title">Browse by Property Type</h2>
        <div className="pList">
          {loading ? (
            <p>Loading please wait...</p>
          ) : error ? (
            <p>Could not fetch property types.</p>
          ) : (
            <>
              {Array.isArray(data) && data.map((item, i) => (
                <div className="pListItem" key={i}>
                  <img
                    src={images[i]}
                    alt={`Image of a ${item.type}`}
                    className="pListImg"
                  />
                  <div className="pListTitles">
                    <h1>{item.type}s</h1>
                    <h2>{item.count} properties</h2>
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

export default PropertyList;
