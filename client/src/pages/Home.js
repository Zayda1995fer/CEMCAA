import React from "react";
import "../styles/Home.css";
import Banner from "../components/banner";
import QuienesSomos from "../components/QuienesSomos";
import HistoriasFelices from "../components/HistoriasFelices";
import MensajeFinal from "../components/MensajeFinal";
import Footer from "../components/Footer";

function Home() {
  return (
    <div style={{ backgroundColor: "#FAF9F6" }}>
      <Banner />
      <QuienesSomos />
      <HistoriasFelices />
      <MensajeFinal />
      <Footer />
    </div>
  );
}

export default Home;
