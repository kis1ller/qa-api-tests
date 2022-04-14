let testmMonth = '2022-01';

describe('calendars APIs', () => {

  it('GET current user items with paramenters', () => {

    cy.request('GET', '/calendars?month=' + testmMonth).should((response) => {
      expect(response).property('status').to.equal(200)
      expect(response.body).to.have.nested.property('days')
    })
  })

})