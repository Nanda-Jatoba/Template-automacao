const Modulo = "nomeModulo/"
describe('PUT nomeModulo by ID', () => {
    context('Sucesso', () => {
        it('Put nomeModulo by id estando logado e utilizando dados válidos', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'PUT',
                    url: Modulo + Cypress.env("userId"),
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {

                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(200);
                    expect(body).to.have.property('');
                    expect(body.message).to.equal("");
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
        it.skip('Testes basicos', () => {
            cy.log("Não preenchendo ID na url corretamente")
            cy.log("Não preenchendo ID no body corretamente")
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
                    method: 'PUT',
                    url: Modulo + Cypress.env("userId"),
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {

                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400);
                    expect(body.message).to.contain("" || "")
                    cy.log(body.message);
                    expect(body).not.to.have.property("accessToken");
                });
            });
        });
        it('Não preenchendo  corretamente', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'PUT',
                    url: Modulo + Cypress.env("userId"),
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    body: {

                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(400);
                    expect(body.message).to.equal("")
                });
            });
        });
    });
});
