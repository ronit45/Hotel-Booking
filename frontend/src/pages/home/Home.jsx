import React from 'react';
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Featured from "../../components/featured/Featured";
import PropertyList from "../../components/propertyList/PropertyList";
import FeaturedProperties from "../../components/featuredProperties/FeaturedProperties";
import Footer from "../../components/footer/Footer";
import "./home.css";

const Home = () => {
  return (
    <div className="homeRoot">
      <Navbar />
      <main className="homeContainer">
        <h1 className='title'>Find the right hotel today</h1>
        <p className='subtitle'>Search and compare prices from top travel sites.</p>
        <Header />
        <Featured />
        <section className="homeSection">
          <h2 className="homeTitle">Browse by property type</h2>
          <PropertyList />
        </section>
        <section className="homeSection">
          <h2 className="homeTitle">Homes guests love</h2>
          <FeaturedProperties />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
