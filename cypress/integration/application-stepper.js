/// <reference types="cypress" />
it('Should pass', () => {
  expect(true).to.eq(true);
});

describe.skip('Application Stepper', function () {
  before(() => {
    cy.visit('/');
  });
  it('Start', function () {
    /** Login */
    cy.get('[data-test=submit-button]').should('have.text', 'Login');
    cy.get('[data-test=username-input] input').type(Cypress.env('TEST_USERNAME'));
    cy.get('[data-test=password-input] input').type(Cypress.env('TEST_PASSWORD'));
    cy.get('[data-test=submit-button]').click();

    /** Select organization */
    cy.wait(1000);
    cy.contains('unfoldingWord');
    cy.get('[data-test=organization-item]').eq(0).click();

    /** Select resource */
    cy.wait(1000);
    cy.get('[data-test=repository-item]').eq(0).click();

    /** Select language */
    cy.get('.language-select-dropdown').click();
    cy.focused().type('english{enter}');

    /** Select file */
    cy.contains('checking/').should('be.be.visible').click();
    cy.contains('acceptable/').should('be.be.visible').click();
    cy.contains('01.md').should('be.be.visible').click();

    /** Testing file selection*/
    cy.contains('Translation in an Acceptable Style', { timeout: 10000 });
  });
});