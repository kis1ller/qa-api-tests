let pageVal = 1;
let pagesizeVal = 5; //when we use value more than 50 it return wrong numbers of items
let currentDate = new Date();
currentDate.setDate(currentDate.getDate() + 20); // plus 20 days from current time
let endDate = new Date();
endDate.setTime(currentDate.getTime() + 10); // plus 1/100 second
let userName = 'QAdude';

describe('meetings APIs', () => {

  it('POST new user items', () => {

    cy.request('POST', '/users', { name: userName }).then(
      (response) => {
        expect(response).property('status').to.equal(201)
        expect(response.body).to.have.property('name', userName)
        expect(response.body).that.includes.keys(['id', 'name'])
        cy.task('setUserId', response.body.id);
      })
  })

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

  it('POST new meeting item', () => {

    cy.task('getSlotId').then((slotId) => {
      cy.task('getUserId').then((userId) => {
        cy.request('POST', '/meetings', {
          slotId: slotId,
          title: "test1",
          participants: [
            {
              id: userId
            }
          ]
        }).then(
          (response) => {
            expect(response).property('status').to.equal(201)
            expect(response.body).to.have.property('title', 'test1')
            expect(response.body).that.includes.keys(['id', 'title'])
            cy.task('setMeetingId', response.body.id)
          })
      })
    })
  })

  it('GET meeting items with paramenters', () => {

    cy.request('GET', '/meetings?page=' + pageVal + '&page_size=' + pagesizeVal).should((response) => {
      expect(response).property('status').to.equal(200)
      expect(response.body).has.property('items')
      expect(response.body.items).to.length(pagesizeVal);
      expect(response.body)
        .to.have.nested.property('items[0]')
        .that.includes.all.keys(['id', 'title', 'startAt', 'endAt', 'participants',])
    })
  })

  it('GET meeting by {id}', () => {

    cy.task('getMeetingId').then((meetingId) => {
      cy.request('GET', '/meetings/' + meetingId).should((response) => {
        expect(response).property('status').to.equal(200)
        expect(response.body).to.have.property('id', meetingId)
      })
    })
  })

  it('DELETE previously created meeting by {id}', () => {

    cy.task('getMeetingId').then((meetingId) => {
      cy.request('DELETE', '/meetings/' + meetingId).should((response) => {
        expect(response).property('status').to.equal(200)
        expect(response.body).to.not.have.property('id', meetingId)
      })
    })
  })

})