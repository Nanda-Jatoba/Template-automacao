const Modulo = "nomeModulo/"
describe('DELETE nomeModulo by ID', () => {
    context('Sucesso', () => {
        it('Delete nomeModulo by id estando logado e utilizando id válido', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'DELETE',
                    url: Modulo + Cypress.env("userId"),
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(200)
                    expect(body.message).to.equal("")
                })
            })
        })
    })
    context('Falha', () => {
        it('Sem estar logado DEVE retornar Unauthorized e status 401', () => {
            cy.api({
                method: 'DELETE',
                url: Modulo + Cypress.env("userId"),
                failOnStatusCode: false
            }).then(({ body, status }) => {
                expect(status).to.equal(401)
                expect(body.message).to.be.equal("É necessário estar logado para poder realizar essa ação!")
                expect(body.error).to.be.equal("Unauthorized")
            })
        })
        it('Não preenchendo id corretamente', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'DELETE',
                    url: Modulo + ' ',
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(404)
                    expect(body.message).to.be.equal("")
                    expect(body.error).to.be.equal("Not Found")
                })
            })
        })
        it('QUANDO preencho com um ID não existente', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'DELETE',
                    url: Modulo + '10000',
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(404)
                    expect(body.message).to.be.equal("")
                })
            })
        })
    })
})