const Modulo = "nomeModulo"
describe('GET nomeModulo', () => {
    context('Sucesso', () => {
        it('Get nomeModulo estando logado', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'GET',
                    url: Modulo,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(200)
                    expect(body[0]).to.have.property('id')
                })
            })
        })
    })
    context('Falha', () => {
        it('Sem estar logado DEVE retornar Unauthorized e status 401', () => {
            cy.api({
                method: 'GET',
                url: Modulo,
                failOnStatusCode: false
            }).then(({ body, status }) => {
                expect(status).to.equal(401)
                expect(body.message).to.be.equal("É necessário estar logado para poder realizar essa ação!")
                expect(body.error).to.be.equal("Unauthorized")
            })
        })
    })
})