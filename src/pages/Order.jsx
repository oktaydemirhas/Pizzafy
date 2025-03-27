import React, { useState, useEffect } from "react";
import axios from "axios";
import { pizzaVerileri } from "../data";
import { useHistory } from "react-router-dom";

const Order = () => {
  // Sayfada gösterilecek pizzayı seçiyoruz, ilk pizza
  const history = useHistory();
  const pizza = pizzaVerileri[0];

  // State tanımlamaları
  const [boyutSec, setBoyutSec] = useState("");
  const [hamurSec, setHamurSec] = useState("");
  const [secilenMalzemeler, setSecilenMalzemeler] = useState([]); // Seçilen ek malzemeler
  const [toplamSecimFiyati, setToplamSecimFiyati] = useState(0); // Her biri 5tl ek malzeme hesabı
  const [siparisAdeti, setSiparisAdeti] = useState(1);
  const [siparisNotu, setSiparisNotu] = useState("");
  const [formHatasi, setFormHatasi] = useState(true);
  const [isimHatasi, setIsimHatasi] = useState(true);
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [isim, setIsim] = useState(""); // İsim inputu için state
  const [minHatasi, setMinHatasi] = useState(true);
  const [maxHatasi, setMaxHatasi] = useState(false);

  // İsim inputu değiştiğinde çağrılan fonksiyon
  const handleIsimChange = (e) => {
    const girilenIsim = e.target.value; // Her karakterde değişkene ata
    setIsim(girilenIsim); // State'e at girilen ismi

    if (girilenIsim.length >= 3) {
      // Yazılan isim 3 harften büyükse
      setIsimHatasi(false); // İsim geçerli, hata mesajı gösterme
    } else {
      setIsimHatasi(true); // İsim geçersiz, hata mesajı göster
    }
  };

  // Pizza adet arttır-azalt
  const adetArtir = () => {
    setSiparisAdeti((prevAdet) => prevAdet + 1); // Başlangıç sipariş adeti 1 idi state tanımında, + tıklanırsa 1 ekliyor
  };

  const adetAzalt = () => {
    setSiparisAdeti((prevAdet) => (prevAdet > 1 ? prevAdet - 1 : 1)); // 1'in üstündeyse 1 eksilt, aksi durumda 1
  };

  // Malzeme seçimi değişikliğinde çağrılacak fonksiyon
  const handleMalzemeChange = (malzemeId) => {
    // Buradaki id parametresi checkboxların onChange özelliğinden geliyo, tıklanan malzemenin id'si buraya atanıyor
    let yeniSecimler;

    if (secilenMalzemeler.includes(malzemeId)) {
      // İlgili malzemeiId state içinde var mı
      yeniSecimler = secilenMalzemeler.filter((id) => id !== malzemeId); // Id'leri kontrol et, dizideki malzemenin id'ye eşit değilse
      setSecilenMalzemeler(yeniSecimler); // Demek ki dizide yok, ekle state güncelleyip
      setMaxHatasi(false); // Malzeme silindiğinde maksimum hata sıfırlanır

      if (yeniSecimler.length < 4) {
        // Seçilen malzemeler 4'ten küçükse
        setMinHatasi(true);
        setFormHatasi(true);
      } else {
        setMinHatasi(false);
        setFormHatasi(false);
      }
    } else {
      if (secilenMalzemeler.length < 10) {
        // Seçilen malzemeler 10'dan küçükse
        yeniSecimler = [...secilenMalzemeler, malzemeId]; // Eski diziye ilgili yeni malzemeyi ekle
        setSecilenMalzemeler(yeniSecimler); // State güncelle
        setMaxHatasi(false);

        if (yeniSecimler.length >= 4) {
          // Eğer 4 malzeme veya daha fazlası varsa ve 10'dan da küçükse
          setMinHatasi(false);
          setFormHatasi(false);
        }
      } else {
        setMaxHatasi(true); // Aksi durumda 10 aşılmaya çalışılıyordur
      }
    }
  };

  // Form doğrulama
  const formGecerliMi = () => {
    // Koşullar sağlanıyorsa true, form geçerli
    return (
      isim.length >= 3 &&
      boyutSec !== "" &&
      hamurSec !== "" &&
      secilenMalzemeler.length >= 4 &&
      secilenMalzemeler.length <= 10
    );
  };

  useEffect(() => {
    setFormHatasi(!formGecerliMi()); // formGecerliMi yeniden çağır, formda sorun yok yani true ise false ver setFormHatasi(false) olsun
  }, [isim, boyutSec, hamurSec, secilenMalzemeler]); // Bu değerlerden biri değiştiğinde kontrolü yeniden yap, yukarı

  // Toplam fiyat hesaplama - sadece pizza fiyatı + malzeme fiyatları
  const hesaplaToplam = () => {
    const pizzaFiyati = pizza.fiyat * siparisAdeti;
    const malzemeFiyati = secilenMalzemeler.length * 5; // Her malzeme 5₺
    const toplam = pizzaFiyati + malzemeFiyati;

    setToplamSecimFiyati(malzemeFiyati); // Malzemelerin total fiyatını state'e at
    return toplam;
  };

  // Her malzeme seçimi değiştiğinde toplam fiyatı yeniden çağırıp hesapla
  useEffect(() => {
    hesaplaToplam();
  }, [secilenMalzemeler]);

  // Form gönderme işlemi, sipariş ver butonu ile tetikleniyor
  const handleSubmit = async (e) => {
    // Asenkron çünkü api isteğiyle siparişi yollayacağız
    e.preventDefault(); // Her yenilemeden form göndermeyi durdur

    if (!formGecerliMi()) {
      // Form'a burada bakıyoruz. formGecerliMi false ise yani form sıkıntılıysa true dönüyor ve aşağısı çalışıyor
      setFormHatasi(true);
      return; // Hatalıysa gönderimi durdur
    }

    setFormHatasi(false); // Hata mesajı yok
    setGonderiliyor(true); // Gönderim işlemi başladı, bu sayede state ile sipariş veriliyor mesajı butona gidecek

    // Seçilen malzeme isimlerini al
    const secilenMalzemeIsimleri = secilenMalzemeler.map(
      // secilenMalzemeler'de malzeme id'leri var
      (id) => pizza.malzemeler.find((m) => m.id === id).isim // Bunları alıp data'daki id ile eşleşiyorsa isimlerini alıyoruz
    );

    // Form verilerini obje olarak hazırla
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
        siparisVerileri // JSON formatıyla iletiyoruz
      );
      console.log("Sipariş Özeti:", response.data); // Başarılıyla gönderme
      setGonderiliyor(false); // Gönderiliyor mesajını false'a çekiyor

      history.push("/order-completed"); // Sipariş alında sayfasına yolluyor
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
                  // Her boyut için indexi ata
                  <label key={index}>
                    <input
                      type="radio"
                      name="boyut"
                      value={boyut} // Radio butonun değerine boyutu atadık
                      checked={boyutSec === boyut} // State'deki boyut değeri radio butonun değerine eşitle
                      onChange={(e) => setBoyutSec(e.target.value)} // Her yeni seçimde tekrar state'e at
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
              {pizza.malzemeler.map(
                (
                  malzeme // Her malzemeyi dolaş
                ) => (
                  <div key={malzeme.id}>
                    <input
                      type="checkbox"
                      id={`malzeme-${malzeme.id}`} // Her checkbox'un idsi farklı "malzeme-1" örneğin
                      value={malzeme.id} // 1 ya da 2 gibi değeri checkbox'a value olarak veriyoruz
                      checked={secilenMalzemeler.includes(malzeme.id)} // secilenMalzemeler'de malzeme id'leri var sadece, includes ile içine bakıyoruz malzeme id var mı diye, true ise işaretle
                      onChange={() => handleMalzemeChange(malzeme.id)} // Her tıklamada fonksiyonu çağır, malzeme.id'yi parametre olarak yolla. Seçildiyse secilenMalzemeler ekle kaldırıldıysa secilenMalzemeler'den sil
                    />
                    <label htmlFor={`malzeme-${malzeme.id}`}>
                      {malzeme.isim}
                    </label>
                  </div>
                )
              )}
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
              onChange={handleIsimChange}
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
                onClick={handleSubmit} // Fonksiyonu çağır, orda form geçerli mi bak duruma göre api'ye post et. Aksi durumda hata mesajı ver
                disabled={formHatasi || isimHatasi || gonderiliyor} // 3 veya koşulu var burada. Hatalardan biri true ise yani sıkıntılıysa butonu pasif yapıyor
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
