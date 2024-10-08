const Modulo = "users/"
describe('DELETE ID', () => {
    context('Sucesso', () => {
        it('Delete id estando logado e utilizando id válido DEVE excluir o usuário, retornar mensagem de sucesso e status 200', () => {
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
                    expect(body.message).to.equal("O usuário foi removido com sucesso.")
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
        it('Não preenchendo id corretamente DEVE retornar erro not found e status 404', () => {
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
                    expect(body.message).to.be.equal("Cannot DELETE /api/"+Modulo)
                    expect(body.error).to.be.equal("Not Found")
                })
            })
        })
        it('QUANDO preencho com um ID não existente', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'DELETE',
                    url: Modulo +'10000',
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(404)
                    expect(body.message).to.be.equal("Usuário não encontrado")
                })
            })
        })
    })
})