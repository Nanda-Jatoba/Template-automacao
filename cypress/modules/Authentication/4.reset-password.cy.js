const Rota = "authentication/reset-password/"
describe('RESET PASSWORD', () => {
    context('Sucesso', () => {
        it('Resetar senha com um token de redefinição recebido por email e utilizando senhas válidas', () => {
            cy.getTempToken().then(() => {
                cy.api({
                    method: 'POST',
                    url: Rota + Cypress.env("redefinition-token"),
                    body: {
                        "password": Cypress.env("senha-base"),
                        "confirmPassword": Cypress.env("senha-base")
                    },
                    failOnStatusCode: false
                })
            }).then(({ status, body }) => {
                expect(status).to.equal(201)
                expect(body.message).to.equal("A senha foi redefinida com sucesso!")
            })
        })
    })
    context('Falha', () => {
        it('Tentativa de utilizar senhas INVÁLIDAS', () => {
            cy.getTempToken().then(() => {
                cy.api({
                    method: 'POST',
                    url: Rota + Cypress.env("redefinition-token"),
                body: {
                    "password": "SenhaInvalida",
                    "confirmPassword": "SenhaInvalida"
                },
                failOnStatusCode: false
            })
            }).then(({ body, status }) => {
                expect(status).to.equal(400)
                expect(body.message[0]).to.be.equal('A senha é muito fraca, por favor utilize uma senha forte.')
            })
        })
        it('Tentativa de utilizar senhas DIFERENTES', () => {
            cy.getTempToken().then(() => {
                cy.api({
                    method: 'POST',
                    url: Rota + Cypress.env("redefinition-token"),
                body: {
                    "password": Cypress.env("senha-base"),
                    "confirmPassword": "SenhaDiferente"
                  },
                failOnStatusCode: false})
            }).then(({ body, status }) => {
                expect(status).to.equal(400)
                expect(body.message[0]).to.be.equal('As senhas não coincidem, por favor tente novamente.')
            })
        })
        it('Tentativa de utilizar token INVÁLIDO', () => {
            cy.api({
                method: 'POST',
                url: Rota + "invalido",
                body: {
                    "password": Cypress.env("senha-base"),
                    "confirmPassword": Cypress.env("senha-base")
                  },
                failOnStatusCode: false
            }).then(({ body, status }) => {
                expect(status).to.equal(404)
                expect(body.message).to.be.equal("Não existe nenhuma solicitação de redefinição com esse token.")
            })
        })
        it('Tentativa de utilizar senhas VAZIAS', () => {
            cy.getTempToken().then(() => {
                cy.api({
                    method: 'POST',
                    url: Rota + Cypress.env("redefinition-token"),
                body: {
                    "password": "",
                    "confirmPassword": ""
                  },
                failOnStatusCode: false})
            }).then(({ body, status }) => {
                expect(status).to.equal(400)
                expect(body.message[2]).to.be.equal('Confirmação da senha: O campo \"confirmPassword\" não pode ser vazio.')
                expect(body.error).to.be.equal('Bad Request')
            })
        })
    })
});