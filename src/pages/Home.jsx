import React from 'react';
import Header from '../Header';
import { Link } from "react-router-dom";


const Home = () => {
  return (
    <main>
      <section>
        <Header />
        <h2 className="home-h2">KOD ACIKTIRIR</h2>
        <h2 className="home-h2">PİZZA, DOYURUR</h2>
        <Link to='/order'><button>ACIKTIM</button></Link>
      </section>
    </main>
  );
};

export default Home;
