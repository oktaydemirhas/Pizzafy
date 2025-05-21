import React, { useEffect } from "react";

function OrderCompleted() {
  useEffect(() => {
    // Sayfa y ekseninde kaydırmayı devre dışı bırak
    document.body.style.overflowY = "hidden";

    // Component kaldırıldığında eski haline döndür
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, []);

  return (
    <>
      <div className="order-completed-page">
        {" "}
        {/* Değişiklik burada */}
        <div className="header">
          <div className="logo">
            <img src="/logo.svg" alt="Logo" />
          </div>
        </div>
        <div className="order-completed-container">
          <div className="completed-h2">
            <h2 className="home-h2">TEBRİKLER!</h2>
            <h2 className="home-h2">SİPARİŞİNİZ ALINDI!</h2>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderCompleted;
