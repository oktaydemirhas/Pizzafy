import React, { useState } from 'react';
import axios from 'axios';
import { pizzaVerileri } from '../data'; // data.js'den verileri import ediyoruz

const Order = () => {
  // Sayfada gösterilecek pizzayı seçiyoruz (ilk pizza)
  const pizza = pizzaVerileri[0];
  
  // State tanımlamaları
  const [boyutSec, setBoyutSec] = useState("Orta");
  const [secilenMalzemeler, setSecilenMalzemeler] = useState([]);
  const [siparisNotu, setSiparisNotu] = useState("");
  const [formHatasi, setFormHatasi] = useState(false);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  // Malzeme seçimi değiştiğinde çağrılacak fonksiyon
  const handleMalzemeChange = (malzemeId) => {
    if (secilenMalzemeler.includes(malzemeId)) {
      setSecilenMalzemeler(secilenMalzemeler.filter(id => id !== malzemeId));
    } else {
      // Maksimum 10 malzeme seçilebilir
      if (secilenMalzemeler.length < 10) {
        setSecilenMalzemeler([...secilenMalzemeler, malzemeId]);
      }
    }
  };

  // Form validation kontrolü
  const formGecerliMi = () => {
    return (
      secilenMalzemeler.length >= 4 && 
      secilenMalzemeler.length <= 10
    );
  };

  // Toplam fiyat hesaplama - sadece pizza fiyatı + malzeme fiyatları
  const hesaplaToplam = () => {
    const pizzaFiyati = pizza.fiyat;
    const malzemeFiyati = secilenMalzemeler.length * 5; // Her malzeme 5₺
    
    return pizzaFiyati + malzemeFiyati;
  };

  // Form gönderme işlemi
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formGecerliMi()) {
      setFormHatasi(true);
      return;
    }
    
    setFormHatasi(false);
    setGonderiliyor(true);
    
    // Seçilen malzeme isimlerini al
    const secilenMalzemeIsimleri = secilenMalzemeler.map(
      id => pizza.malzemeler.find(m => m.id === id).isim
    );
    
    // Form verilerini hazırla
    const siparisVerileri = {
      boyut: boyutSec,
      malzemeler: secilenMalzemeIsimleri,
      ozel: siparisNotu,
      toplamFiyat: hesaplaToplam()
    };
    
    // API isteği gönder
    axios.post('https://reqres.in/api/pizza', siparisVerileri)
      .then(response => {
        console.log('Sipariş özeti:', response.data);
        setGonderiliyor(false);
        // Burada başarılı sipariş sonrası işlemler yapılabilir
      })
      .catch(error => {
        console.error('Sipariş hatası:', error);
        setGonderiliyor(false);
      });
  };

  return (
    <>
    <div className="nav-bar">asds</div>
    <div className="order-page-container">
      <div className="order-page-content">
        {/* Buraya form elemanlarını ve sipariş kısmını yazacağız */}
        <h1>Position Absolute Acı Pizza</h1>
        <p>Burada pizza seçenekleri olacak...</p>
      </div>
    </div>
    </>
  );
};

export default Order;
