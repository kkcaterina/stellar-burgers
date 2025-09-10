describe('Проверяем доступность приложения', function () {
  it('Сервис должен быть доступен по адресу localhost:4000', function () {
    cy.visit('http://localhost:4000');
  });
});

describe('Проверяем работоспособность страницы конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.get('[data-cy="643d69a5c3f7b9001cfa093d"]').as('purpleBun');
    cy.get('[data-cy="643d69a5c3f7b9001cfa0949"]').as('saladMain');
    cy.get('[data-cy="643d69a5c3f7b9001cfa094a"]').as('cheeseMain');
    cy.get('[data-cy="643d69a5c3f7b9001cfa0946"]').as('ringsMain');
    cy.get('[data-cy="643d69a5c3f7b9001cfa0943"]').as('spaceSauce');
    cy.get('[data-cy="643d69a5c3f7b9001cfa0944"]').as('galacticSauce');
  });
  describe('Проверяем модальное окно ингредиента', () => {
    it('Тестируем открытие модального окна ингредиента и сверяем данные ингредиента', () => {});
    it('Тестируем закрытие модального окна ингредиента при клике на кнопку закрытия', () => {});
    it('Тестируем закрытие модального окна ингредиента при клике на оверлей', () => {});
  });
  describe('Проверяем добавление ингредиента из списка ингредиентов в конструктор и создание заказа', () => {
    it('Тестируем возможность добавления ингредиента в конструктор', () => {
      cy.get('@purpleBun').contains('Добавить').click();
      cy.get('@saladMain').contains('Добавить').click();
      cy.get('@cheeseMain').contains('Добавить').click();
      cy.get('@ringsMain').contains('Добавить').click();
      cy.get('@spaceSauce').contains('Добавить').click();
      cy.get('@galacticSauce').contains('Добавить').click();
      cy.get('[data-cy="topItem"]').should(
        'contain.text',
        'Флюоресцентная булка R2-D3'
      );
      cy.get('[data-cy="burgerItems"]').should(
        'contain.text',
        'Мини-салат Экзо-Плантаго'
      );
      cy.get('[data-cy="burgerItems"]').should(
        'contain.text',
        'Сыр с астероидной плесенью'
      );
      cy.get('[data-cy="burgerItems"]').should(
        'contain.text',
        'Хрустящие минеральные кольца'
      );
      cy.get('[data-cy="burgerItems"]').should(
        'contain.text',
        'Соус фирменный Space Sauce'
      );
      cy.get('[data-cy="burgerItems"]').should(
        'contain.text',
        'Соус традиционный галактический'
      );
      cy.get('[data-cy="bottomItem"]').should(
        'contain.text',
        'Флюоресцентная булка R2-D3'
      );
    });
    it('Тестируем оформление заказа', () => {});
  });
});
