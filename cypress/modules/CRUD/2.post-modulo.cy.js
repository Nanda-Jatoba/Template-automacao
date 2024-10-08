const Modulo = "nomeModulo"
describe('POST nomeModulo', () => {
    context('Sucesso', () => {
        it('Criar nomeModulo com infos válidas para cadastro', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'POST',
                    url: Modulo,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {

                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(201);
                    expect(body.message).to.equal("");
                    // let idCriado = body.user.id
                    // Cypress.env("userId", idCriado)
                })
            })
        })
    })
    context('Falha', () => {
        it('Sem estar logado DEVE retornar Unauthorized e status 401', () => {
            cy.api({
                method: 'POST',
                url: Modulo,
                failOnStatusCode: false
            }).then(({ body, status }) => {
                expect(status).to.equal(401)
                expect(body.message).to.be.equal("É necessário estar logado para poder realizar essa ação!")
                expect(body.error).to.be.equal("Unauthorized")
            })
        })
        it.skip('Testes basicos', () => {
            cy.log("Não preenchendo NOME corretamente")
            cy.log("Não preenchendo EMAIL corretamente")
            cy.log("Preenchendo EMAIL com email já cadastrado")
            cy.log("Não preenchendo CPF corretamente")
            cy.log("Preenchendo com CPF já cadastrado")
            cy.log("Não preenchendo CNPJ corretamente")
            cy.log("Preenchendo com CNPJ já cadastrado")
            cy.log("Não preenchendo PASSWORD com os requisitos")
            cy.log("Preenchendo PASSWORDS diferentes")
        });
        it('Não preenchendo  corretamente', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'POST',
                    url: Modulo,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                    
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400)
                    expect(body.message).to.contain('' || '')
                    cy.log(body.message)
                })
            })
        })
        it('Preenchendo com  já cadastrado', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'POST',
                    url: Modulo,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                    
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400)
                    expect(body.message).to.equal('')
                })
            })
        })
    })
})