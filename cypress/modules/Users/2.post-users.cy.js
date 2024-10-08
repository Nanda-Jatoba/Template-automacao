const faker = require('faker-br');

const pessoa = faker.name.firstName()
const email = pessoa + faker.name.lastName() + `@${Cypress.env("server-mailsaur")}.mailosaur.net`
const emailCadastrado = pessoa + faker.name.lastName() + `@${Cypress.env("server-mailsaur")}.mailosaur.net`
const cpf = `${faker.br.cpf()}`

const numeroForm = faker.phone.phoneNumber()
let celular = numeroForm.startsWith('+55') ? numeroForm.substring(3) : numeroForm;
celular = celular.replace(/\D/g, '');

const Modulo = "users"
describe('POST USERS', () => {
    context('Sucesso', () => {
        it('Criar usuário com infos válidas para cadastro', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'POST',
                    url: Modulo,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "name": "[API] QA " + pessoa,
                        "email": emailCadastrado,
                        "personType": "FÍSICA",
                        "cpf": cpf,
                        "phone": celular,
                        "roleId": 1,
                        "companyID": "",
                        "cnpj": "",
                        "password": Cypress.env("senha-base"),
                        "confirmPassword": Cypress.env("senha-base"),
                        "hasAgreedTermService": true
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(201);
                    expect(body.message).to.equal("O usuário foi criado com sucesso.");
                    let idCriado = body.user.id
                    Cypress.env("userId", idCriado)
                    // cy.wait(10000)
                    // cy.mailosaurGetMessage(Cypress.env("server-mailsaur"), {
                    //     sentTo: emailCadastrado,
                    //     failOnStatusCode: false})
                    // .then((email) => {
                    //     expect(email.subject).to.equal("[MDigital] - Registro no Sistema Maturidade Digital");
                    // })
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
        it('Não preenchendo NOME corretamente', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'POST',
                    url: Modulo,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "name": "",
                        "email": email,
                        "personType": "FÍSICA",
                        "cpf": cpf,
                        "phone": celular,
                        "roleId": 1,
                        "companyID": "",
                        "cnpj": "",
                        "password": Cypress.env("senha-base"),
                        "confirmPassword": Cypress.env("senha-base"),
                        "hasAgreedTermService": true
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400)
                    expect(body.message).to.contain("Nome: O campo do \"name\" deve possuir no mínimo 2 caracteres." || "Nome: O campo do \"name\" não pode ser vazio.")
                })
            })
        })
        it('Não preenchendo EMAIL corretamente', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'POST',
                    url: Modulo,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "name": "[API] QA " + pessoa,
                        "email": "",
                        "personType": "FÍSICA",
                        "cpf": cpf,
                        "phone": celular,
                        "roleId": 1,
                        "companyID": "",
                        "cnpj": "",
                        "password": Cypress.env("senha-base"),
                        "confirmPassword": Cypress.env("senha-base"),
                        "hasAgreedTermService": true
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400)
                    expect(body.message).to.contain("E-mail: O campo \"email\" deve ser válido." || "E-mail: O campo do \"email\" não pode ser vazio.")
                })
            })
        })
        it('Preenchendo EMAIL com email já cadastrado', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'POST',
                    url: Modulo,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "name": "[API] QA " + pessoa,
                        "email": Cypress.env("user-valido").email,
                        "personType": "FÍSICA",
                        "cpf": cpf,
                        "phone": celular,
                        "roleId": 1,
                        "companyID": "",
                        "cnpj": "",
                        "password": Cypress.env("senha-base"),
                        "confirmPassword": Cypress.env("senha-base"),
                        "hasAgreedTermService": true
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400)
                    expect(body.message[0]).to.equal("E-mail: Já existe um Usuário com este Email.")
                })
            })
        })
        it('Não preenchendo PERSON TYPE corretamente', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'POST',
                    url: Modulo,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "name": "[API] QA " + pessoa,
                        "email": email,
                        "personType": "",
                        "cpf": cpf,
                        "phone": celular,
                        "roleId": 1,
                        "companyID": "",
                        "cnpj": "",
                        "password": Cypress.env("senha-base"),
                        "confirmPassword": Cypress.env("senha-base"),
                        "hasAgreedTermService": true
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400)
                    expect(body.message[0]).to.equal('Tipo Pessoa: O campo de "personType" deve ser válido (FÍSICA, JURÍDICA)');
                })
            })
        })
        it('Não preenchendo CPF corretamente', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'POST',
                    url: Modulo,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "name": "[API] QA " + pessoa,
                        "email": email,
                        "personType": "FÍSICA",
                        "cpf": "",
                        "phone": celular,
                        "roleId": 1,
                        "companyID": "",
                        "cnpj": "",
                        "password": Cypress.env("senha-base"),
                        "confirmPassword": Cypress.env("senha-base"),
                        "hasAgreedTermService": true
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400)
                    expect(body.message).to.contain('O campo "cpf" precisa ser válido.' || 'CPF: Somente números são permitidos.' || 'CPF: O campo \"cpf\" precisa ter pelo menos 11 caracteres.')
                })
            })
        })
        it('Preenchendo com CPF já cadastrado', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'POST',
                    url: Modulo,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "name": "[API] QA " + pessoa,
                        "email": email,
                        "personType": "FÍSICA",
                        "cpf": "58510696004",
                        "phone": celular,
                        "roleId": 1,
                        "companyID": "",
                        "cnpj": "",
                        "password": Cypress.env("senha-base"),
                        "confirmPassword": Cypress.env("senha-base"),
                        "hasAgreedTermService": true
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400)
                    cy.log(body.message)
                    expect(body.message[0]).to.equal("Já existe um Usuário com este CPF.")
                })
            })
        })
        it('Não preenchendo TELEFONE corretamente', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'POST',
                    url: Modulo,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "name": "[API] QA " + pessoa,
                        "email": email,
                        "personType": "FÍSICA",
                        "cpf": cpf,
                        "phone": "",
                        "roleId": 1,
                        "companyID": "",
                        "cnpj": "",
                        "password": Cypress.env("senha-base"),
                        "confirmPassword": Cypress.env("senha-base"),
                        "hasAgreedTermService": true
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400)
                    expect(body.message).includes("Telefone: O campo \"phone\" é obrigátorio.")
                })
            })
        })
        it('Não preenchendo ROLE ID corretamente', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'POST',
                    url: Modulo,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "name": "[API] QA " + pessoa,
                        "email": email,
                        "personType": "FÍSICA",
                        "cpf": cpf,
                        "phone": celular,
                        "roleId": "",
                        "companyID": "",
                        "cnpj": "",
                        "password": Cypress.env("senha-base"),
                        "confirmPassword": Cypress.env("senha-base"),
                        "hasAgreedTermService": true
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400)
                    expect(body.message).to.contain('ID do Perfil de acesso: O campo \"roleId\" não pode ser vázio.' || 'Não existe um Perfil com esse ID.')
                })
            })
        })
        it('Não preenchendo PASSWORD com os requisitos', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'POST',
                    url: Modulo,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "name": "[API] QA " + pessoa,
                        "email": email,
                        "personType": "FÍSICA",
                        "cpf": faker.br.cpf(),
                        "phone": celular,
                        "roleId": 1,
                        "companyID": "",
                        "cnpj": "",
                        "password": "Sen",
                        "confirmPassword": "Sen",
                        "hasAgreedTermService": true
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400)
                    expect(body.message[0]).to.equal("A senha é muito fraca, por favor utilize uma senha forte.")
                })
            })
        })
        it('Preenchendo PASSWORDS diferentes', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'POST',
                    url: Modulo,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "name": "[API] QA " + pessoa,
                        "email": email,
                        "personType": "FÍSICA",
                        "cpf": faker.br.cpf(),
                        "phone": celular,
                        "roleId": 1,
                        "companyID": "",
                        "cnpj": "",
                        "password": Cypress.env("senha-base"),
                        "confirmPassword": "SenhaDiferente",
                        "hasAgreedTermService": true
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400)
                    expect(body.message[0]).to.equal("As senhas não coincidem-se, por favor tente novamente.")
                })
            })
        })
        it('Não preenchendo TERMOS DE SERVIÇO corretamente', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'POST',
                    url: Modulo,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "name": "[API] QA " + pessoa,
                        "email": email,
                        "personType": "FÍSICA",
                        "cpf": cpf,
                        "phone": celular,
                        "roleId": 1,
                        "companyID": "",
                        "cnpj": "",
                        "password": Cypress.env("senha-base"),
                        "confirmPassword": Cypress.env("senha-base"),
                        "hasAgreedTermService": ""
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400)
                    expect(body.message).to.contain("Necessário aceitar o termo de serviço" || "Necessário aceitar o termo de serviço: O campo deve ser um booleano")
                })
            })
        })
    })
})