const faker = require('faker-br');

const pessoa = faker.name.firstName();
const cpf = `${faker.br.cpf()}`;

const numeroForm = faker.phone.phoneNumber();
let celular = numeroForm.startsWith('+55') ? numeroForm.substring(3) : numeroForm;
celular = celular.replace(/\D/g, '');

const Modulo = "users/"
describe('PUT ID', () => {
    context('Sucesso', () => {
        it('Put id estando logado e utilizando dados válidos', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'PUT',
                    url: Modulo + Cypress.env("userId"),
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "id": Cypress.env("userId"),
                        "name": "[API] editado " + pessoa,
                        "email": pessoa + faker.name.lastName() + `@${Cypress.env("server-mailsaur")}.mailosaur.net`,
                        "personType": "FÍSICA",
                        "cpf": cpf,
                        "phone": celular,
                        "roleId": 1,
                        "companyID": 2,
                        "cnpj": faker.br.cnpj(),
                        "password": Cypress.env("senha-base"),
                        "confirmPassword": Cypress.env("senha-base")
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(200);
                    expect(body).to.have.property('user');
                    expect(body.message).to.equal("O usuário foi atualizado com sucesso.");
                });
            });
        });
    });
    context('Falha', () => {
        it('Sem estar logado', () => {
            cy.api({
                method: 'PUT',
                url: Modulo + "10",
                failOnStatusCode: false
            }).then(({ body, status }) => {
                expect(status).to.equal(401);
                expect(body.message).to.be.equal("É necessário estar logado para poder realizar essa ação!");
                expect(body.error).to.be.equal("Unauthorized");
            });
        });
        
        it('Não preenchendo ID na url corretamente', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'PUT',
                    url: Modulo + ' ',
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "id": "",
                        "name": "[API] editado " + pessoa,
                        "email": pessoa + `@${Cypress.env("server-mailsaur")}.mailosaur.net`,
                        "personType": "FÍSICA",
                        "cpf": cpf,
                        "phone": celular,
                        "roleId": 1,
                        "companyID": "",
                        "cnpj": "",
                        "password": Cypress.env("senha-base"),
                        "confirmPassword": Cypress.env("senha-base")
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(404);
                    expect(body.message).to.be.equal("Cannot PUT /api/"+Modulo);
                    expect(body.error).to.be.equal("Not Found");
                });
            });
        });
        it('Não preenchendo ID no body corretamente', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'PUT',
                    url: Modulo + Cypress.env("userId"),
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "id": "",
                        "name": "[API] editado " + pessoa,
                        "email": pessoa + `@${Cypress.env("server-mailsaur")}.mailosaur.net`,
                        "personType": "FÍSICA",
                        "cpf": cpf,
                        "phone": celular,
                        "roleId": 1,
                        "companyID": "",
                        "cnpj": "",
                        "password": Cypress.env("senha-base"),
                        "confirmPassword": Cypress.env("senha-base")
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400);
                    expect(body.error).to.be.equal("Bad Request");
                    expect(body.message).to.contain('ID: O campo \"id\" precisa ser um inteiro.' || 'ID: O campo \"id\" é obrigatório.')
                });
            });
        });
        // Nem sempre funciona
        it.skip('QUANDO utilizo user id que não existe', () => {
            cy.log("");
            cy.getToken().then(() => {
                cy.api({
                    method: 'PUT',
                    url: Modulo + 10000,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "id": 10000,
                        "name": "[API] editado " + pessoa,
                        "email": pessoa + `@${Cypress.env("server-mailsaur")}.mailosaur.net`,
                        "personType": "FÍSICA",
                        "cpf": cpf,
                        "phone": celular,
                        "roleId": 1,
                        "companyID": "",
                        "cnpj": "",
                        "password": Cypress.env("senha-base"),
                        "confirmPassword": Cypress.env("senha-base")
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400);
                    expect(body).not.to.have.property('id');
                    expect(body.message).to.equal("Usuário não encontrado");
                });
            });
        });
        it('Não preenchendo NOME corretamente', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'PUT',
                    url: Modulo + Cypress.env("userId"),
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "id": Cypress.env("userId"),
                        "name": "",
                        "email": pessoa + `@${Cypress.env("server-mailsaur")}.mailosaur.net`,
                        "personType": "FÍSICA",
                        "cpf": cpf,
                        "phone": celular,
                        "roleId": "1",
                        "companyID": "",
                        "cnpj": "",
                        "password": Cypress.env("senha-base"),
                        "confirmPassword": Cypress.env("senha-base")
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400);
                    expect(body.message).to.contain('Nome: O campo do \"name\" deve possuir no mínimo 2 caracteres.' || 'Nome: O campo do \"name\" não pode ser vazio.')
                });
            });
        });
        it('Não preenchendo EMAIL corretamente', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'PUT',
                    url: Modulo + Cypress.env("userId"),
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "id": Cypress.env("userId"),
                        "name": "[API] editado " + pessoa,
                        "email": "",
                        "personType": "FÍSICA",
                        "cpf": cpf,
                        "phone": celular,
                        "roleId": 1,
                        "companyID": "",
                        "cnpj": "",
                        "password": Cypress.env("senha-base"),
                        "confirmPassword": Cypress.env("senha-base")
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400);
                    expect(body.message).to.contain('E-mail: O campo \"email\" deve ser válido.' || 'E-mail: O campo do \"email\" não pode ser vazio.')
                });
            });
        });
        it('Preenchendo EMAIL com email já cadastrado', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'PUT',
                    url: Modulo + Cypress.env("userId"),
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "id": Cypress.env("userId"),
                        "name": "[API] editado " + pessoa,
                        "email": Cypress.env("user-valido").email,
                        "personType": "FÍSICA",
                        "cpf": cpf,
                        "phone": celular,
                        "roleId": 1,
                        "companyID": "",
                        "cnpj": "",
                        "password": Cypress.env("senha-base"),
                        "confirmPassword": Cypress.env("senha-base")
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400);
                    expect(body.message[0]).to.equal("E-mail: Já existe um Usuário com este Email.");
                });
            });
        });
        it('Não preenchendo PERSON TYPE corretamente', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'PUT',
                    url: Modulo + Cypress.env("userId"),
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "id": Cypress.env("userId"),
                        "name": "[API] editado " + pessoa,
                        "email": pessoa + `@${Cypress.env("server-mailsaur")}.mailosaur.net`,
                        "personType": "",
                        "cpf": cpf,
                        "phone": celular,
                        "roleId": 1,
                        "companyID": "",
                        "cnpj": "",
                        "password": Cypress.env("senha-base"),
                        "confirmPassword": Cypress.env("senha-base")
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400);
                    expect(body.message[0]).to.equal("Tipo Pessoa: O campo de \"personType\" deve ser válido (FÍSICA, JURÍDICA)")
                });
            });
        });
        it('Preenchendo CPF com CPF já cadastrado', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'PUT',
                    url: Modulo + Cypress.env("userId"),
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "id": Cypress.env("userId"),
                        "name": "[API] editado " + pessoa,
                        "email": pessoa + `@${Cypress.env("server-mailsaur")}.mailosaur.net`,
                        "personType": "FÍSICA",
                        "cpf": "52886778249",
                        "phone": celular,
                        "roleId": 1,
                        "companyID": "",
                        "cnpj": "",
                        "password": Cypress.env("senha-base"),
                        "confirmPassword": Cypress.env("senha-base")
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400);
                    expect(body.message[0]).to.equal("Já existe um Usuário com este CPF.");
                });
            });
        });
        it('Preenchendo CPF incorretamente', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'PUT',
                    url: Modulo + Cypress.env("userId"),
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "id": Cypress.env("userId"),
                        "name": "[API] editado " + pessoa,
                        "email": pessoa + `@${Cypress.env("server-mailsaur")}.mailosaur.net`,
                        "personType": "FÍSICA",
                        "cpf": "",
                        "phone": celular,
                        "roleId": 1,
                        "companyID": "",
                        "cnpj": "",
                        "password": Cypress.env("senha-base"),
                        "confirmPassword": Cypress.env("senha-base")
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400);
                    expect(body.message[0]).to.equal('O campo "cpf" precisa ser válido.');
                });
            });
        });
        it('Não preenchendo TELEFONE corretamente', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'PUT',
                    url: Modulo + Cypress.env("userId"),
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "id": Cypress.env("userId"),
                        "name": "[API] editado " + pessoa,
                        "email": pessoa + `@${Cypress.env("server-mailsaur")}.mailosaur.net`,
                        "personType": "FÍSICA",
                        "cpf": cpf,
                        "phone": "",
                        "roleId": 1,
                        "companyID": "",
                        "cnpj": "",
                        "password": Cypress.env("senha-base"),
                        "confirmPassword": Cypress.env("senha-base")
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400);
                    expect(body.message[0]).to.equal("Telefone: O campo \"phone\" é obrigátorio.")
                });
            });
        });
        it('Não preenchendo ROLE ID corretamente', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'PUT',
                    url: Modulo + Cypress.env("userId"),
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "id": Cypress.env("userId"),
                        "name": "[API] editado " + pessoa,
                        "email": pessoa + `@${Cypress.env("server-mailsaur")}.mailosaur.net`,
                        "personType": "FÍSICA",
                        "cpf": cpf,
                        "phone": celular,
                        "roleId": "",
                        "companyID": "",
                        "cnpj": "",
                        "password": Cypress.env("senha-base"),
                        "confirmPassword": Cypress.env("senha-base")
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400);
                    expect(body.message).to.contain('ID do Perfil de acesso: O campo \"roleId\" não pode ser vázio.' || 'Não existe um Perfil com esse ID.')
                });
            });
        });
        it('Preenchendo a senha sem os requisitos minimos', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'PUT',
                    url: Modulo + Cypress.env("userId"),
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "id": Cypress.env("userId"),
                        "name": "[API] editado " + pessoa,
                        "email": pessoa + `@${Cypress.env("server-mailsaur")}.mailosaur.net`,
                        "personType": "FÍSICA",
                        "cpf": cpf,
                        "phone": celular,
                        "roleId": 1,
                        "companyID": "",
                        "cnpj": "",
                        "password": "sen",
                        "confirmPassword": "sen"
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400);
                    expect(body.message[0]).to.equal("A senha é muito fraca, por favor utilize uma senha forte.")
                });
            });
        });
        it('Preenchendo com senhas diferentes', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'PUT',
                    url: Modulo + Cypress.env("userId"),
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {
                        "id": Cypress.env("userId"),
                        "name": "[API] editado " + pessoa,
                        "email": pessoa + `@${Cypress.env("server-mailsaur")}.mailosaur.net`,
                        "personType": "FÍSICA",
                        "cpf": cpf,
                        "phone": celular,
                        "roleId": 1,
                        "companyID": "",
                        "cnpj": "",
                        "password": Cypress.env("senha-base"),
                        "confirmPassword": "senhaDiferente"
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400);
                    expect(body.message[0]).to.equal("As senhas não coincidem-se, por favor tente novamente.")
                });
            });
        });
    });
});
