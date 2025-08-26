import React from 'react';
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Featured from "../../components/featured/Featured";
import PropertyList from "../../components/propertyList/PropertyList";
import FeaturedProperties from "../../components/featuredProperties/FeaturedProperties";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import "./home.css";

const Home = () => {
  return (
    <div className="homeRoot">
      <Navbar />
      <Header />
      <main className="homeContainer">
        <Featured />
        <section className="homeSection">
          <h2 className="homeTitle">Browse by property type</h2>
          <PropertyList />
        </section>
        <section className="homeSection">
          <h2 className="homeTitle">Homes guests love</h2>
          <FeaturedProperties />
        </section>
        <MailList />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
