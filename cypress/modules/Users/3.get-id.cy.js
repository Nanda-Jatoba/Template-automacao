const Modulo = "users/"
describe('GET ID', () => {
    context('Sucesso', () => {
        it('Get by id estando logado DEVE retornar o usuário solicitado', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'GET',
                    url: Modulo + Cypress.env("userId"),
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(200);
                    expect(body).to.have.property('id');
                    expect(body.id).to.equal(Cypress.env("userId"));
                });
            });
        });
    });

    context('Falha', () => {
        it('Sem estar logado DEVE retornar Unauthorized e status 401', () => {
            cy.api({
                method: 'GET',
                url: Modulo + Cypress.env("userId"),
                failOnStatusCode: false
            }).then(({ body, status }) => {
                expect(status).to.equal(401);
                expect(body.message).to.be.equal("É necessário estar logado para poder realizar essa ação!");
                expect(body.error).to.be.equal("Unauthorized");
            });
        });

        it('Estando logado, enviando um userid que não existe', () => {
            cy.getToken().then(() => {
                cy.api({
                    method: 'GET',
                    url: Modulo + 500,
                    headers: {
                        "accept": "application/json",
                        "Authorization": Cypress.env("token")
                    },
                    failOnStatusCode: false
                }).then(({ status, body }) => {
                    expect(status).to.equal(404);
                    expect(body).not.to.have.property('id');
                    expect(body.message).to.equal("Usuário não encontrado");
                });
            });
        });
    });
});
