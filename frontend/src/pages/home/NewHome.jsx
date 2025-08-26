import React from 'react';
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Featured from "../../components/featured/Featured";
import PropertyList from "../../components/propertyList/PropertyList";
import FeaturedProperties from "../../components/featuredProperties/FeaturedProperties";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import "./Home.css";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Header />
      <main className="homeContainer">
        <Featured />
        <PropertyList />
        <FeaturedProperties />
        <MailList />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
