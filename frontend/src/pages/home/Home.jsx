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
      <div className='hero'>
        <h1 className='title'>Find the right hotel today</h1>
        <p className='subtitle'>Search and compare prices from top travel sites.</p>
        <Header />
      </div>
      <main className="homeContainer">
        <Featured />
        <section className="homeSection">
          <PropertyList />
        </section>
        <section className="homeSection">
          <FeaturedProperties />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
