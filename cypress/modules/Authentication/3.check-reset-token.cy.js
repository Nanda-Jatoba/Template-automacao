const Rota = "authentication/check-reset-token/"
describe('CHECK RESET TOKEN', () => {
    context('Sucesso', () => {
        it('Check reset com token recebido por email válido ', () => {
            cy.wait(5000)
            cy.getTempToken().then(() => {
                cy.api({
                    method: 'GET',
                    url: Rota + Cypress.env("redefinition-token"),
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(200)
                    expect(body).to.have.property("id")
                    expect(body).to.have.property("email")
                })
            })
        })
    })
    context('Falha', () => {
        it('Tentativa de utilizar um token inválido', () => {
            cy.api({
                method: 'GET',
                url: Rota + 'invalido',
                failOnStatusCode: false
            }).then(({ body, status }) => {
                expect(status).to.equal(404)
                expect(body.message).to.be.equal("Não existe nenhuma solicitação de redefinição com esse token.")
                expect(body.error).to.be.equal("Not Found")
            })
        })
        it('Tentativa de enviar sem token', () => {
            cy.api({
                method: 'GET',
                url: Rota,
                failOnStatusCode: false
            }).then(({ body, status }) => {
                expect(status).to.equal(404)
                expect(body.message).to.be.equal("Cannot GET /api/" + Rota)
                expect(body.error).to.be.equal("Not Found")
            })
        })
    })
})