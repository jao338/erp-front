import translations from '../../../src/i18n/index';

interface SupplierFixture {
  create: Record<string, string>;
  update: Record<string, string>;
}

describe('cypress/e2e/suppliers/suppliers.cy.ts', () => {
  const baseUrl = 'api/suppliers';
  const supplierLabel = translations['pt-BR'].supplier.split(' | ')[0];
  let createData: Record<string, string>;
  let updateData: Record<string, string>;

  before(() => {
    cy.fixture('suppliers/supplier').then((fixture: SupplierFixture) => {
      createData = fixture.create;
      updateData = fixture.update;
    });
  });

  beforeEach(() => {
    cy.login(Cypress.env('CY_USER'), Cypress.env('CY_PASSWORD'));

    cy.visit('/suppliers');
  });

  it('test_should_access_supplier_menu', () => {
    cy.selectByAttribute('page-title').should('contain.text', supplierLabel);
    cy.selectByAttribute('btn-add').should('contain.text', translations['pt-BR'].add);
  });

  it('test_should_list_supplier_data', () => {
    cy.getDataList(baseUrl);
    cy.selectByAttribute('btn-filtrar').should('contain.text', translations['pt-BR'].filter);
  });

  it('test_should_create_supplier', () => {
    cy.getDataList(baseUrl);
    cy.intercept('POST', `**/${baseUrl}`).as('create');

    cy.selectByAttribute('btn-add').click();
    cy.selectByAttribute('supplier-name').should('be.visible');
    cy.fillForm(createData);
    cy.selectByAttribute('btn-salvar').should('contain.text', translations['pt-BR'].save).click();

    cy.waitResponse('create', 201);
    cy.contains(translations['pt-BR'].createdSuccessfully).should('be.visible');
  });

  it('test_should_show_supplier', () => {
    cy.getDataList(baseUrl);
    cy.intercept('GET', `**/${baseUrl}**`).as('show');

    cy.selectByAttribute('supplier-filter-name').type(createData['supplier-name'] as string);
    cy.selectByAttribute('btn-filtrar').click();

    cy.assertResponseHasData('show', 200);
    cy.get('tbody').should('contain', createData['supplier-name']);
  });

  it('test_should_update_supplier', () => {
    cy.getDataList(baseUrl);
    cy.intercept('GET', `**/${baseUrl}**`).as('show');
    cy.intercept('GET', `**/${baseUrl}/*`).as('showSupplier');
    cy.intercept('PUT', `**/${baseUrl}/*`).as('update');

    cy.selectByAttribute('supplier-filter-name').type(createData['supplier-name'] as string);
    cy.selectByAttribute('btn-filtrar').click();
    cy.assertResponseHasData('show', 200);
    cy.selectByAttribute('btn-edit-0').click();
    cy.assertResponseHasData('showSupplier', 200);

    cy.selectByAttribute('supplier-name').clear().type(updateData['supplier-name'] as string);
    cy.selectByAttribute('supplier-email').clear().type(updateData['supplier-email'] as string);
    cy.selectByAttribute('btn-salvar').click();

    cy.waitResponse('update', 204);
    cy.contains(translations['pt-BR'].updatedSuccessfully).should('be.visible');
  });

  it('test_should_delete_supplier', () => {
    cy.getDataList(baseUrl);
    cy.intercept('GET', `**/${baseUrl}**`).as('show');
    cy.intercept('DELETE', `**/${baseUrl}/*`).as('delete');

    cy.selectByAttribute('supplier-filter-name').type(updateData['supplier-name'] as string);
    cy.selectByAttribute('btn-filtrar').click();
    cy.assertResponseHasData('show', 200);

    cy.selectByAttribute('btn-remove-0').click();
    cy.clickOkConfirmDelete();

    cy.waitResponse('delete', 204);
    cy.contains(translations['pt-BR'].deletedSuccessfully).should('be.visible');
  });

  after(() => {
    cy.logout();
  });
});
