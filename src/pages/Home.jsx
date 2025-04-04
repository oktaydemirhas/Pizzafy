import React from "react";
import Header from "../Header";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    // Y ekseninde kaydırmayı devre dışı bırak
    document.body.style.overflowY = "hidden";

    // Component kaldırıldığında eski haline döndür
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, []);

  return (
    <main>
      <section>
        <div className="start-container">
          <Header />
          <span className="firsatSpan">fırsatı kaçırma</span>
          <h2 className="home-h2">KOD ACIKTIRIR</h2>
          <h2 className="home-h2">PİZZA, DOYURUR</h2>
          <Link to="/order">
            <button>ACIKTIM</button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
