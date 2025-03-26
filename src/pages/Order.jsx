import React, { useState, useEffect } from "react";
import axios from "axios";
import { pizzaVerileri } from "../data";
import { useHistory } from "react-router-dom";

const Order = () => {
  // Sayfada gösterilecek pizzayı seçiyoruz (ilk pizza)
  const history = useHistory();
  const pizza = pizzaVerileri[0];

  // State tanımlamaları
  const [boyutSec, setBoyutSec] = useState("");
  const [hamurSec, setHamurSec] = useState("");
  const [secilenMalzemeler, setSecilenMalzemeler] = useState([]);
  const [toplamSecimFiyati, setToplamSecimFiyati] = useState(0);
  const [siparisAdeti, setSiparisAdeti] = useState(1);
  const [siparisNotu, setSiparisNotu] = useState("");
  const [formHatasi, setFormHatasi] = useState(true);
  const [isimHatasi, setIsimHatasi] = useState(true); // İsim hatası kontrolü
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [isim, setIsim] = useState(""); // İsim inputu için state
  const [minHatasi, setMinHatasi] = useState(true); // Minimum seçimi kontrol eder
  const [maxHatasi, setMaxHatasi] = useState(false); // Maksimum seçimi kontrol eder

  // Malzeme seçimi değiştiğinde çağrılacak fonksiyon
  const handleMalzemeChange = (malzemeId) => {
    let yeniSecimler;

    if (secilenMalzemeler.includes(malzemeId)) {
      yeniSecimler = secilenMalzemeler.filter((id) => id !== malzemeId);
      setSecilenMalzemeler(yeniSecimler);
      setMaxHatasi(false); // Malzeme silindiğinde maksimum hata sıfırlanır

      if (yeniSecimler.length < 4) {
        setMinHatasi(true);
        setFormHatasi(true);
      } else {
        setMinHatasi(false);
        setFormHatasi(false);
      }
    } else {
      if (secilenMalzemeler.length < 10) {
        yeniSecimler = [...secilenMalzemeler, malzemeId];
        setSecilenMalzemeler(yeniSecimler);
        setMaxHatasi(false);

        if (yeniSecimler.length >= 4) {
          setMinHatasi(false);
          setFormHatasi(false); // Eğer 4 malzeme veya daha fazlası varsa form hatası yok
        }
      } else {
        setMaxHatasi(true); // Maksimum hata sadece uyarı olarak gösterilecek
      }
    }
  };

  // Form validation kontrolü

  // Formdaki tüm koşulları dinamik olarak kontrol et
  const formGecerliMi = () => {
    return (
      isim.length >= 3 &&
      boyutSec !== "" &&
      hamurSec !== "" &&
      secilenMalzemeler.length >= 4 &&
      secilenMalzemeler.length <= 10
    );
  };
  useEffect(() => {
    setFormHatasi(!formGecerliMi()); // Sadece geçerliliği etkileyenler formHatasi’ni güncelliyor
  }, [isim, boyutSec, hamurSec, secilenMalzemeler]); // Bu değerler değiştiğinde kontrolü yeniden yap

  // Pizza adet arttır-azalt
  const adetArtir = () => {
    setSiparisAdeti((prevAdet) => prevAdet + 1);
  };

  const adetAzalt = () => {
    setSiparisAdeti((prevAdet) => (prevAdet > 1 ? prevAdet - 1 : 1)); // 1'in altına düşmesini engeller
  };

  // Toplam fiyat hesaplama - sadece pizza fiyatı + malzeme fiyatları
  const hesaplaToplam = () => {
    const pizzaFiyati = pizza.fiyat * siparisAdeti;
    const malzemeFiyati = secilenMalzemeler.length * 5; // Her malzeme 5₺
    const toplam = pizzaFiyati + malzemeFiyati;

    setToplamSecimFiyati(malzemeFiyati);
    return toplam;
  };

  // Her malzeme seçimi değiştiğinde toplam fiyatı hesapla
  useEffect(() => {
    hesaplaToplam();
  }, [secilenMalzemeler]);

  // İsim inputu değiştiğinde çağrılan fonksiyon
  const handleIsimChange = (e) => {
    const girilenIsim = e.target.value;
    setIsim(girilenIsim);

    if (girilenIsim.length >= 3) {
      setIsimHatasi(false); // İsim geçerli
    } else {
      setIsimHatasi(true); // İsim geçersiz
    }
  };

  // Form gönderme işlemi
  const handleSubmit = async (e) => {
    e.preventDefault(); // HTML tarafından gönderimi engelle

    if (!formGecerliMi()) {
      // Form geçerliliği kontrolü
      setFormHatasi(true);
      return; // Hatalıysa gönderimi durdur
    }

    setFormHatasi(false);
    setGonderiliyor(true);

    // Seçilen malzeme isimlerini al
    const secilenMalzemeIsimleri = secilenMalzemeler.map(
      (id) => pizza.malzemeler.find((m) => m.id === id).isim
    );

    // Form verilerini hazırla
    const siparisVerileri = {
      isim,
      boyut: boyutSec,
      hamur: hamurSec,
      malzemeler: secilenMalzemeIsimleri,
      ozel: siparisNotu,
      toplamFiyat: hesaplaToplam().toFixed(2),
      adet: siparisAdeti,
    };

    try {
      // API isteği gönder
      const response = await axios.post(
        "https://reqres.in/api/pizza",
        siparisVerileri
      );
      console.log("Sipariş Özeti:", response.data); // Başarılı sipariş yanıtı
      setGonderiliyor(false);

      history.push("/order-completed");
    } catch (error) {
      console.error("Sipariş hatası:", error);
      setGonderiliyor(false);
    }
  };

  return (
    <>
      <div className="header">
        <div className="logo">
          <img src="../images/iteration-1-images/logo.svg"></img>
        </div>
        <div className="nav-bar thin-text">
          <div className="navbardiv">
            <p>
              Anasayfa - <span className="bold-text">Sipariş Oluştur</span>
            </p>
          </div>
        </div>
      </div>

      <div className="home-container">
        <div className="order-page-container">
          <div className="baslik">
            <h2>{pizza.isim}</h2>
          </div>
          <div className="fiyat-puan">
            <div className="fiyat">
              <h2>{pizza.fiyat}₺</h2>
            </div>
            <div className="puan-yildiz">
              <div className="puan">
                <p>{pizza.puan}</p>
              </div>
              <div className="yildiz">
                <p>({pizza.yildiz})</p>
              </div>
            </div>
          </div>
          <div className="aciklama">
            <p>{pizza.aciklama}</p>
          </div>

          <div className="boyut-hamur-form-group">
            <div className="boyut-sec">
              <div className="boyut-baslik">
                <h3>
                  Boyut Seç <span>*</span>
                </h3>
              </div>
              <div className="boyut-radio">
                {pizza.boyutSecenekleri.map((boyut, index) => (
                  <label key={index}>
                    <input
                      type="radio"
                      name="boyut"
                      value={boyut}
                      checked={boyutSec === boyut}
                      onChange={(e) => setBoyutSec(e.target.value)}
                    />
                    {boyut}
                  </label>
                ))}
              </div>
            </div>

            <div className="hamur-sec">
              <div className="boyut-baslik">
                <h3>
                  Hamur Seç <span>*</span>
                </h3>
              </div>
              <div className="hamur-listbox">
                <select
                  value={hamurSec}
                  onChange={(e) => setHamurSec(e.target.value)}
                >
                  <option value="" disabled hidden>
                    Hamur Kalınlığı
                  </option>{" "}
                  {/* Placeholder*/}
                  {pizza.hamurSecenekleri.map((hamur, index) => (
                    <option key={index} value={hamur}>
                      {hamur}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="ek-malzeme">
            <div className="ek-malzeme-bilgi">
              <h3>Ek Malzemeler *</h3>
              <p>En fazla 10 malzeme seçebilirsiniz. (Her malzeme 5₺)</p>
            </div>
            <div className="ek-malzeme-checkbox">
              {pizza.malzemeler.map((malzeme) => (
                <div key={malzeme.id}>
                  <input
                    type="checkbox"
                    id={`malzeme-${malzeme.id}`}
                    value={malzeme.id}
                    checked={secilenMalzemeler.includes(malzeme.id)}
                    onChange={() => handleMalzemeChange(malzeme.id)}
                  />
                  <label htmlFor={`malzeme-${malzeme.id}`}>
                    {malzeme.isim}
                  </label>
                </div>
              ))}
            </div>
            {minHatasi && (
              <div className="error">Minimum 4 malzeme seçmelisiniz</div>
            )}
            {maxHatasi && (
              <div className="error">Maksimum 10 malzeme seçebilirsiniz</div>
            )}
          </div>

          <div className="isim-giris">
            <h3>
              İsim <span>*</span>
            </h3>
            <input
              type="text"
              placeholder="İsminizi giriniz (En az 3 karakter)"
              value={isim}
              onChange={handleIsimChange} // 📌 handleIsimChange fonksiyonunu buraya bağladık.
            />
            {isimHatasi && (
              <div className="error">İsim en az 3 karakter olmalıdır.</div>
            )}
          </div>

          <div className="siparis-notu">
            <h3>Sipariş Notu</h3>
            <input
              type="text"
              placeholder="Siparişine eklemek istediğin bir not var mı?"
              value={siparisNotu}
              onChange={(e) => setSiparisNotu(e.target.value)}
            />
          </div>

          <div className="cizgi">
            <hr />
          </div>

          <div className="siparis-ver">
            <div className="miktar">
              <button onClick={adetAzalt}>-</button>
              <span>{siparisAdeti}</span>
              <button onClick={adetArtir}>+</button>
            </div>
            <div className="siparis-toplam">
              <div className="uclu-siparis">
                <div className="siparis-baslik">
                  <h3>Sipariş Toplamı</h3>
                </div>
                <div className="secimler bold-text">
                  <div className="secimler-sol">
                    <span>Seçimler</span>
                  </div>
                  <div className="secimler-sag">
                    <span>{toplamSecimFiyati.toFixed(2)}₺</span>
                  </div>
                </div>
                <div className="toplam bold-text">
                  <div className="secimler-sol">
                    <span>Toplam</span>
                  </div>
                  <div className="secimler-sag">
                    <span>
                      {(toplamSecimFiyati + pizza.fiyat * siparisAdeti).toFixed(
                        2
                      )}
                      ₺
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="siparis-button">
              <button
                onClick={handleSubmit}
                disabled={formHatasi || isimHatasi || gonderiliyor} // Maksimum hatası bu durumu etkilemiyor
              >
                {gonderiliyor ? "Sipariş Veriliyor..." : "SİPARİŞ VER"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;
