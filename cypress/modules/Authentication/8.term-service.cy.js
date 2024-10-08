const Rota = "authentication/term-service/"
describe('TERM SERVICE', () => {
    context('Sucesso', () => {
        it('Aceitar termos de serviço estando logando, adicionado ID de um usuário do sistema', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'PUT',
                    url: Rota + "8",
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(200)
                    expect(body.message).to.equal("Termo de serviço foi aceito")
                    expect(body).to.have.property("accessToken")
                    expect(body).to.have.property("user")
                })
            })
        })
    })
    context('Falha', () => {
        it('Tentativa de editar senha sem estar logado', () => {
            cy.api({
                method: 'PUT',
                url: Rota + "8",
                failOnStatusCode: false
            }).then(({ body, status }) => {
                expect(status).to.equal(401)
                expect(body.message).to.be.equal("É necessário estar logado para poder realizar essa ação!")
                expect(body.error).to.be.equal("Unauthorized")
            })
        })
        it('Tentativa de enviar sem UserID', () => {
            cy.api({
                method: 'PUT',
                url: Rota,
                failOnStatusCode: false
            }).then(({ body, status }) => {
                expect(status).to.equal(404)
                expect(body.message).to.be.equal("Cannot PUT /api/" + Rota)
                expect(body.error).to.be.equal("Not Found")
            })
        })
    })
})