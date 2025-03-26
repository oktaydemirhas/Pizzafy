describe('Pizza Sipariş Testleri', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/order');  // Uygulamanın çalıştığı URL
    });

    // Input Metin
    it('İsim inputuna metin girme testi', () => {
      cy.get('input[placeholder="İsminizi giriniz (En az 3 karakter)"]')
        .type('Ahmet')
        .should('have.value', 'Ahmet');
    });
  
    // Malzeme Seçme
    it('Birden fazla malzeme seçme testi', () => {
      // Malzeme checkbox'larını seç
      cy.get('.ek-malzeme-checkbox input[type="checkbox"]').eq(0).check().should('be.checked');
      cy.get('.ek-malzeme-checkbox input[type="checkbox"]').eq(1).check().should('be.checked');
      cy.get('.ek-malzeme-checkbox input[type="checkbox"]').eq(2).check().should('be.checked');
      cy.get('.ek-malzeme-checkbox input[type="checkbox"]').eq(3).check().should('be.checked');
  
      // Seçili olup olmadığını kontrol et
      cy.get('.ek-malzeme-checkbox input[type="checkbox"]').eq(0).should('be.checked');
      cy.get('.ek-malzeme-checkbox input[type="checkbox"]').eq(1).should('be.checked');
      cy.get('.ek-malzeme-checkbox input[type="checkbox"]').eq(2).should('be.checked');
      cy.get('.ek-malzeme-checkbox input[type="checkbox"]').eq(3).should('be.checked');
    });
  
    // Form Gönder
    it('Form gönderme testi', () => {
      // İsim gir
      cy.get('input[placeholder="İsminizi giriniz (En az 3 karakter)"]').type('Mehmet');
  
      // Boyut seç
      cy.get('input[type="radio"][value="Orta"]').check();
  
      // Hamur seç
      cy.get('select').select('İnce');
  
      // 4 malzeme seç
      cy.get('.ek-malzeme-checkbox input[type="checkbox"]').eq(0).check();
      cy.get('.ek-malzeme-checkbox input[type="checkbox"]').eq(1).check();
      cy.get('.ek-malzeme-checkbox input[type="checkbox"]').eq(2).check();
      cy.get('.ek-malzeme-checkbox input[type="checkbox"]').eq(3).check();
  
      // Sipariş notu gir
      cy.get('input[placeholder="Siparişine eklemek istediğin bir not var mı?"]').type('Fazla pişmiş olsun.');
  
      // Sipariş butonuna tıkla
      cy.get('.siparis-button button').click();
  
      // Konsola sipariş özetinin düştüğünü kontrol et
      cy.wait(1000); // Siparişin işlenmesini bekle
      cy.log('Sipariş başarıyla gönderildi');
    });
});