const Rota = "authentication/recover-password"
describe('RECOVER PASSWORD', () => {
  context('Sucesso', () => {
    it('Recuperação de senha com um email cadastrado no sistema', () => {
      cy.api({
        method: 'POST',
        url: Rota,
        body: {
          "email": Cypress.env("user-valido").email
        },
        failOnStatusCode: false
      }).then(({ status, body }) => {
        expect(status).to.equal(201)
        expect(body.message).to.equal("A solicitação de recuperação de e-mail foi enviada!")
        cy.mailosaurGetMessage(Cypress.env("server-mailsaur"), {
          sentTo: Cypress.env("user-valido").email
        })
      }).then((email) => {
        expect(email.subject).to.equal("[WhatsS] - Recuperação de Senha do Sistema WhatsS");
      })
    })
  });
  context('Falha', () => {
    it('Tentativa de recuperar um e-mail que já solicitou recuperação de senha', () => {
      cy.api({
        method: 'POST',
        url: Rota,
        body: {
          "email": Cypress.env("user-valido").email
        },
        failOnStatusCode: false
      }).then(({ body, status }) => {
        expect(status).to.equal(400)
        expect(body.message).to.be.equal('A redefinição de senha já foi solicitada. Tente mais tarde!')
      })
    })
    it('Tentativa de recuperar um e-mail com formato inválido', () => {
      cy.api({
        method: 'POST',
        url: Rota,
        body: {
          "email": "nao_formatado"
        },
        failOnStatusCode: false
      }).then(({ body, status }) => {
        expect(status).to.equal(400)
        expect(body.message[0]).to.contain('E-mail: O campo \"email\" deve ser válido!')
        expect(body.error).to.be.equal('Bad Request')
      })
    })
    it.skip('Tentativa de recuperar um e-mail não cadastrado', () => {
      cy.log("*DEVERIA* retornar erro de localização de email no sistema e status 404 (mas retorna que email foi enviado com sucesso)")
      cy.api({
        method: 'POST',
        url: Rota,
        body: {
          "email": "nao_cadastrado@testeqa.com"
        },
        failOnStatusCode: false
      }).then(({ body, status }) => {
        expect(status).to.equal(404)
        expect(body.message).to.equal("Nenhum usuário foi localizado no sistema com o email fornecido. Por favor informe o e-mail com o qual se registrou no sistema.")
      })
    })
    it('Tentativa de enviar e-mail vazio', () => {
      cy.api({
        method: 'POST',
        url: Rota,
        body: {
          "email": ""
        },
        failOnStatusCode: false
      }).then(({ body, status }) => {
        expect(status).to.equal(400)
        expect(body.message[0]).to.be.equal("E-mail: O campo \"email\" não pode ser vazio!")
        expect(body.error).to.be.equal('Bad Request')
      })
    })
  })
});