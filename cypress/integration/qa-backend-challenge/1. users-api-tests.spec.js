let pageVal = 2;
let pagesizeVal = Math.floor(Math.random() * 50); //when we use value more than 50 it return wrong numbers of items
let userName = 'QAmate';

describe('users APIs', () => {

  it('POST new user items', () => {

    cy.request('POST', '/users', { name: userName }).then(
      (response) => {
        expect(response).property('status').to.equal(201)
        expect(response.body).to.have.property('name', userName)
        expect(response.body).that.includes.keys(['id', 'name'])
        cy.task('setUserId', response.body.id);
      })
  })

  it('GET current user items with paramenters', () => {

    cy.request('GET', '/users?page=' + pageVal + '&page_size=' + pagesizeVal).should((response) => {
      expect(response).property('status').to.equal(200)
      expect(response.body).has.property('items')
      expect(response.body.items).to.length(pagesizeVal);
      expect(response.body)
        .to.have.nested.property('items[0]')
        .that.includes.all.keys(['id', 'name'])
    })
  })

  it('GET user by {id}', () => {

    cy.task('getUserId').then((userId) => {
      cy.request('GET', '/users/' + userId).should((response) => {
        expect(response).property('status').to.equal(200)
        expect(response.body).to.have.property('id', userId)
      })
    })
  })

  it('DELETE previously created user by {id}', () => {

    cy.task('getUserId').then((userId) => {
      cy.request('DELETE', '/users/' + userId).should((response) => {
        expect(response).property('status').to.equal(200)
        expect(response.body).to.not.have.property('id', userId)
      })
    })
  })

})