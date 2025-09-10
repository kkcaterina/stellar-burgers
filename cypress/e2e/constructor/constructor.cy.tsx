describe('Проверяем доступность приложения', function () {
  it('Сервис должен быть доступен по адресу localhost:4000', function () {
    cy.visit('http://localhost:4000');
  });
});
