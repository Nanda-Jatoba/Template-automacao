const Rota = "authentication/edit-password"
describe('EDIT PASSWORD', () => {
    context('Sucesso', () => {
        it('Editar senha estando logado, adicionado senha atual e nova senha válida', () => {
            cy.getToken("user-reserva").then(() => {
                cy.api({
                    method: 'POST',
                    url: Rota,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "password": Cypress.env("senha-base"),
                        "newPassword": "NovaSenha!@34",
                        "confirmPassword": "NovaSenha!@34"
                      },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(201)
                    expect(body.message).to.equal("Sua senha foi alterada com sucesso!")
                })
                cy.api({
                    method: 'POST',
                    url: Rota,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "password": "NovaSenha!@34",
                        "newPassword": Cypress.env("senha-base"),
                        "confirmPassword": Cypress.env("senha-base")
                      },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(201)
                    expect(body.message).to.equal("Sua senha foi alterada com sucesso!")
                })
            })
        })
    })
    context('Falha', () => {
        it('Tentativa de editar senha sem estar logado', () => {
            cy.api({
                method: 'POST',
                url: Rota,
                failOnStatusCode: false
            }).then(({ body, status }) => {
                expect(status).to.equal(401)
                expect(body.message).to.be.equal("É necessário estar logado para poder realizar essa ação!")
                expect(body.error).to.be.equal("Unauthorized")
            })
        })
        it('Tentativa de editar senha estando logado mas a senha atual não está correta', () => {
            cy.getToken("user-reserva").then(() => {
                cy.api({
                    method: 'POST',
                    url: Rota,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "password": "SenhaErrada",
                        "newPassword": Cypress.env("senha-base"),
                        "confirmPassword": Cypress.env("senha-base")
                      },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400)
                    expect(body.message).to.equal("A senha atual está incorreta.")
                })
            })
        });
        it('Tentativa de editar senha estando logado, com a senha atual correta mas a nova senha não preenche os requisitos de senha', () => {
            cy.getToken("user-reserva").then(() => {
                cy.api({
                    method: 'POST',
                    url: Rota,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "password": Cypress.env("senha-base"),
                        "newPassword": "Sen",
                        "confirmPassword": "Sen"
                      },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400)
                    expect(body.message[0]).to.equal("A senha é muito fraca, por favor utilize uma senha forte.")
                })
            })
        });
        it('Tentativa de editar senha estando logado, a senha atual está correta, mas as novas senhas não coincidem', () => {
            cy.getToken("user-reserva").then(() => {
                cy.api({
                    method: 'POST',
                    url: Rota,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "password": Cypress.env("senha-base"),
                        "newPassword": Cypress.env("senha-base"),
                        "confirmPassword": "SenhaDiferente"
                      },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400)
                    expect(body.message[0]).to.equal("As senhas não coincidem, por favor tente novamente.")
                })
            })
        });
    })
})