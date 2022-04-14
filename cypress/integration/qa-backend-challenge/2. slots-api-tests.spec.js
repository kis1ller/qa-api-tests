let pageVal = 2;
let pagesizeVal = Math.floor(Math.random() * 100); //when we use value more than 50 it return wrong numbers of items
let currentDate = new Date();
currentDate.setDate(currentDate.getDate() + 20); // plus 20 days from current time
let endDate = new Date();
endDate.setTime(currentDate.getTime() + 1000); // plus 1 second

describe('slots APIs', () => {

  it('POST new slot items', () => {

    cy.request('POST', '/slots', { startAt: currentDate.toISOString(), endAt: endDate.toISOString() }).then(
      (response) => {
        expect(response.body).to.have.property('startAt', currentDate.toISOString())
        expect(response.body).that.includes.keys(['startAt', 'endAt'])
        cy.task('setSlotId', response.body.id);
        cy.log(currentDate.toISOString());
        cy.log(endDate.toISOString());

      })
  })

  it('GET current slots items with paramenters', () => {

    cy.request('GET', '/slots?page=' + pageVal + '&page_size=' + pagesizeVal).should((response) => {
      expect(response).property('status').to.equal(200)
      expect(response.body).has.property('items')
      expect(response.body.items).to.length(pagesizeVal);
      expect(response.body)
        .to.have.nested.property('items[0]')
        .that.includes.all.keys(['id', 'startAt', 'endAt'])
    })
  })

  it('GET slot by {id}', () => {

    cy.task('getSlotId').then((slotId) => {
      cy.request('GET', '/slots/' + slotId).should((response) => {
        expect(response).property('status').to.equal(200)
        expect(response.body).to.have.property('id', slotId)

      })
    })
  })

  it('DELETE previously created slot by {id}', () => {

    cy.task('getSlotId').then((slotId) => {
      cy.request('DELETE', '/slots/' + slotId).should((response) => {
        expect(response).property('status').to.equal(200)
        expect(response.body).to.not.have.property('id', slotId)

      })
    })
  })
})