describe('Проверяем доступность приложения', function () {
  it('Сервис должен быть доступен по адресу localhost:4000', function () {
    cy.visit('/');
  });
});

const SELECTORS = {
  MODAL: '[data-cy="modal"]',
  CLOSE_MODAL_BUTTON: '[data-cy="closeModalButton"]',
  OVERLAY: '[data-cy="overlay"]',
  TOP_ITEM: '[data-cy="topItem"]',
  BURGER_ITEMS: '[data-cy="burgerItems"]',
  BOTTOM_ITEM: '[data-cy="bottomItem"]',
  CREATE_ORDER_BUTTON: '[data-cy="createOrderButton"]',
  ORDER_DETAILS: '[data-cy="orderDetails"]',
  INGREDIENT: '[data-cy="/ingredients/643d69a5c3f7b9001cfa093d"]',
  PURPLE_BUN: '[data-cy="643d69a5c3f7b9001cfa093d"]',
  SALAD_MAIN: '[data-cy="643d69a5c3f7b9001cfa0949"]',
  CHEESE_MAIN: '[data-cy="643d69a5c3f7b9001cfa094a"]',
  RINGS_MAIN: '[data-cy="643d69a5c3f7b9001cfa0946"]',
  SPACE_SAUCE: '[data-cy="643d69a5c3f7b9001cfa0943"]',
  GALACTIC_SAUCE: '[data-cy="643d69a5c3f7b9001cfa0944"]'
};

describe('Проверяем работоспособность страницы конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredientsResponse.json'
    }).as('getIngredients');
    cy.visit('/');
  });
  describe('Проверяем модальное окно ингредиента', () => {
    beforeEach(() => {
      cy.get(SELECTORS.INGREDIENT).as('ingredient');
    });
    it('Тестируем открытие модального окна ингредиента и сверяем данные ингредиента', () => {
      cy.get('@ingredient').click();
      cy.get(SELECTORS.MODAL).as('modal');
      cy.get('@modal').should('contain.text', 'Флюоресцентная булка R2-D3');
    });
    it('Тестируем закрытие модального окна ингредиента при клике на кнопку закрытия', () => {
      cy.get('@ingredient').click();
      cy.get(SELECTORS.MODAL).as('modal');
      cy.get(SELECTORS.CLOSE_MODAL_BUTTON).as('closeModalButton');
      cy.get('@closeModalButton').click();
      cy.get('@modal').should('not.exist');
    });
    it('Тестируем закрытие модального окна ингредиента при клике на оверлей', () => {
      cy.get('@ingredient').click();
      cy.get(SELECTORS.MODAL).as('modal');
      cy.get(SELECTORS.OVERLAY).as('overlay');
      cy.get('@overlay').click({ force: true });
      cy.get('@modal').should('not.exist');
    });
  });
  describe('Проверяем добавление ингредиентов из списка ингредиентов в конструктор и создание заказа', () => {
    beforeEach(() => {
      cy.wait('@getIngredients');
      cy.get(SELECTORS.PURPLE_BUN).as('purpleBun');
      cy.get(SELECTORS.SALAD_MAIN).as('saladMain');
      cy.get(SELECTORS.CHEESE_MAIN).as('cheeseMain');
      cy.get(SELECTORS.RINGS_MAIN).as('ringsMain');
      cy.get(SELECTORS.SPACE_SAUCE).as('spaceSauce');
      cy.get(SELECTORS.GALACTIC_SAUCE).as('galacticSauce');
    });
    it('Тестируем возможность добавления ингредиента в конструктор', () => {
      cy.get('@purpleBun').contains('Добавить').click();
      cy.get('@saladMain').contains('Добавить').click();
      cy.get('@cheeseMain').contains('Добавить').click();
      cy.get('@ringsMain').contains('Добавить').click();
      cy.get('@spaceSauce').contains('Добавить').click();
      cy.get('@galacticSauce').contains('Добавить').click();

      cy.get(SELECTORS.TOP_ITEM).as('topItem');
      cy.get(SELECTORS.BURGER_ITEMS).as('burgerItems');
      cy.get(SELECTORS.BOTTOM_ITEM).as('bottomItem');

      cy.get('@topItem').should('contain.text', 'Флюоресцентная булка R2-D3');
      cy.get('@burgerItems').should('contain.text', 'Мини-салат Экзо-Плантаго');
      cy.get('@burgerItems').should(
        'contain.text',
        'Сыр с астероидной плесенью'
      );
      cy.get('@burgerItems').should(
        'contain.text',
        'Хрустящие минеральные кольца'
      );
      cy.get('@burgerItems').should(
        'contain.text',
        'Соус фирменный Space Sauce'
      );
      cy.get('@burgerItems').should(
        'contain.text',
        'Соус традиционный галактический'
      );
      cy.get('@bottomItem').should(
        'contain.text',
        'Флюоресцентная булка R2-D3'
      );
    });
    it('Тестируем оформление заказа', () => {
      cy.intercept('GET', 'api/auth/user', {
        fixture: 'userData.json'
      }).as('getUser');
      cy.intercept('POST', 'api/orders', {
        fixture: 'orderResponse.json'
      }).as('createOrder');
      cy.visit('/');
      cy.wait('@getUser');

      cy.get('@purpleBun').contains('Добавить').click();
      cy.get('@saladMain').contains('Добавить').click();
      cy.get('@cheeseMain').contains('Добавить').click();
      cy.get('@ringsMain').contains('Добавить').click();
      cy.get('@spaceSauce').contains('Добавить').click();
      cy.get('@galacticSauce').contains('Добавить').click();
      cy.get('@ringsMain').contains('Добавить').click();
      cy.get('@spaceSauce').contains('Добавить').click();

      cy.get(SELECTORS.CREATE_ORDER_BUTTON).as('createOrderButton');
      cy.get('@createOrderButton').click();
      cy.wait('@createOrder');

      cy.get(SELECTORS.ORDER_DETAILS).as('orderDetails');
      cy.get(SELECTORS.CLOSE_MODAL_BUTTON).as('closeModalButton');
      cy.get(SELECTORS.MODAL).as('modal');

      cy.get('@orderDetails').should('contain', '88585');
      cy.get('@closeModalButton').click();
      cy.get('@modal').should('not.exist');

      cy.contains('Выберите булки').should('be.visible');
      cy.contains('Выберите начинку').should('be.visible');
    });
  });
});
