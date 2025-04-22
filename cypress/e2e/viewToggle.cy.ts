describe('View Toggle', () => {
  it('switches views', () => {
    cy.visit('/')
    cy.contains('Week').click()
    cy.url().should('include', '/week')
    cy.get('.grid-cols-8').should('exist')
    cy.contains('Day').click()
    cy.url().should('include', '/day')
  })
})