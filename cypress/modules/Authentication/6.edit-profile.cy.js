const faker = require('faker-br');

let pessoa = faker.name.firstName()
let cpf = faker.br.cpf()

let numeroForm = faker.phone.phoneNumber()
let celular = numeroForm.startsWith('+55') ? numeroForm.substring(3) : numeroForm;
celular = celular.replace(/\D/g, '');

const Rota = "authentication/edit-profile"
describe('EDIT PROFILE', () => {
    context('Sucesso', () => {
        it('Editar perfil estando logado, adicionado informações válidas', () => {
            cy.getToken("user-reserva").then(({body}) => {
                cy.api({
                    method: 'POST',
                    url: Rota,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "id": body.user.id,
                        "name": `QA ${pessoa} editado`,
                        "email": Cypress.env("user-reserva").email,
                        "personType": "FÍSICA",
                        "cpf": cpf,
                        "phone": celular
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(201)
                    expect(body.message).to.equal("O dados foram atualizados com sucesso!")
                    expect(body).to.have.property("accessToken")
                    expect(body).to.have.property("user")
                })
            })
        })
    })
    context('Falha', () => {
        it('Tentativa de editar perfil sem estar logado', () => {
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
        it('Tentativa de editar perfil não preenchendo ID corretamente', () => {
            cy.getToken("user-reserva").then(() => {
                cy.api({
                    method: 'POST',
                    url: Rota,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "id": "",
                        "name": `QA ${pessoa} editado`,
                        "email": Cypress.env("user-reserva").email,
                        "personType": "FÍSICA",
                        "cpf": cpf,
                        "phone": celular
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400)
                    expect(body.message).to.contain("ID do Usuário: O campo de ID precisa ser um inteiro." || "ID do Usuário: O campo de ID é obrigátorio.")
                })
            })
        });
        it('Tentativa de editar perfil não preenchendo NOME corretamente', () => {
            cy.getToken("user-reserva").then(({body}) => {
                cy.api({
                    method: 'POST',
                    url: Rota,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "id": body.user.id,
                        "name": "",
                        "email": Cypress.env("user-reserva").email,
                        "personType": "FÍSICA",
                        "cpf": cpf,
                        "phone": celular
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400)
                    expect(body.message[0]).to.contain("Nome: O campo \"name\" é obrigatório" ||"Nome: O campo \"name\" deve ser válido!" || "Nome: O campo \"name\" deve ser uma string!")
                })
            })
        });
        it('Tentativa de editar perfil não preenchendo EMAIL corretamente', () => {
            cy.getToken("user-reserva").then(({body}) => {
                cy.api({
                    method: 'POST',
                    url: Rota,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "id": body.user.id,
                        "name": `QA ${pessoa} editado`,
                        "email": "",
                        "personType": "FÍSICA",
                        "cpf": cpf,
                        "phone": celular
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400)
                    expect(body.message).to.contain("E-mail: O campo \"email\" deve ser válido!" || "E-mail: O campo \"email\" deve ser válido!" || "E-mail: O campo \"email\" não pode ser vazio!" || "E-mail: O campo \"email\" deve ser uma string!")
                })
            })
        });
        it('Tentativa de editar perfil preenchendo EMAIL de um usuário já existente', () => {
            cy.getToken("user-reserva").then(({body}) => {
                cy.api({
                    method: 'POST',
                    url: Rota,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "id": body.user.id,
                        "name": `QA ${pessoa} editado`,
                        "email": Cypress.env("user-valido").email,
                        "personType": "FÍSICA",
                        "cpf": cpf,
                        "phone": celular
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400)
                    expect(body.message[0]).to.equal("Esse e-mail já está sendo utilizado por outra conta.")
                })
            })
        });
        it('Tentativa de editar perfil não preenchendo PERSON TYPE corretamente', () => {
            cy.getToken("user-reserva").then(({body}) => {
                cy.api({
                    method: 'POST',
                    url: Rota,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "id": body.user.id,
                        "name": `QA ${pessoa} editado`,
                        "email": Cypress.env("user-reserva").email,
                        "personType": "",
                        "cpf": cpf,
                        "phone": celular
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400)
                    expect(body.message[0]).to.contain('Tipo Pessoa: O campo de "personType" deve ser válido (FÍSICA, JURÍDICA)' || 'Tipo Pessoa: O campo de \"personType\" deve ser válido.')
                })
            })
        });
        it('Tentativa de editar perfil não preenchendo CPF corretamente', () => {
            cy.getToken("user-reserva").then(({body}) => {
                cy.api({
                    method: 'POST',
                    url: Rota,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "id": body.user.id,
                        "name": `QA ${pessoa} editado`,
                        "email": Cypress.env("user-reserva").email,
                        "personType": "FÍSICA",
                        "cpf": "",
                        "phone": celular
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(body.message[0]).to.contain('O campo "cpf" precisa ser válido.' || "CPF: O campo \"cpf\" precisa ter pelo menos 11 caracteres.")
                    cy.log(body.message)
                    expect(status).to.equal(400)
                })
            })
        });
        it('Tentativa de editar perfil preenchendo CPF de um usuário já existente', () => {
            cy.getToken("user-reserva").then(({body}) => {
                cy.api({
                    method: 'POST',
                    url: Rota,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "id": body.user.id,
                        "name": `QA ${pessoa} editado`,
                        "email": Cypress.env("user-reserva").email,
                        "personType": "FÍSICA",
                        "cpf": "58510696004",
                        "phone": celular
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400)
                    expect(body.message[0]).to.equal("Já existe um Usuário com este CPF.")
                })
            })
        });
        it('Tentativa de editar perfil não preenchendo TELEFONE corretamente', () => {
            cy.getToken("user-reserva").then(({body}) => {
                cy.api({
                    method: 'POST',
                    url: Rota,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "id": body.user.id,
                        "name": `QA ${pessoa} editado`,
                        "email": Cypress.env("user-reserva").email,
                        "personType": "FÍSICA",
                        "cpf": cpf,
                        "phone": ""
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400)
                    expect(body.message[0]).to.contain("Telefone: O campo \"phone\" é obrigátorio." || "Telefone: O campo \"phone\" deve ser uma string." || "Telefone: Somente números são permitidos.")
                })
            })
        });
    })
})