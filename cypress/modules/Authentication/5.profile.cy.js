const Rota = "authentication/profile"
describe('PROFILE', () => {
    context('Sucesso', () => {
        it('Get Profile estando logado', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'GET',
                    url: Rota,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(200)
                    expect(body).to.have.property("id")
                    expect(body).to.have.property("menus")
                    expect(body).to.have.property("privileges")
                })
            })
        })
    })
    context('Falha', () => {
        it('Get profile sem estar logado', () => {
            cy.log("DEVE retornar erro Unauthorized e status 401")
            cy.api({
                method: 'GET',
                url: Rota,
                failOnStatusCode: false
            }).then(({ body, status }) => {
                expect(status).to.equal(401)
                expect(body.message).to.be.equal("É necessário estar logado para poder realizar essa ação!")
                expect(body.error).to.be.equal("Unauthorized")
            })
        })
    })
})