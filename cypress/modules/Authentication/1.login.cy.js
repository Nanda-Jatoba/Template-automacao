const Rota = "authentication/login"
describe('LOGIN', () => {
    context('Sucesso', () => {
      it('Login com dados válidos', () => {
        cy.api({
          method: 'POST',
          url: Rota,
          body: Cypress.env('user-valido'),
          failOnStatusCode: false
        }).then(({status, body}) => {
            expect(status).to.equal(201)
            expect(body).to.have.property("user")
            expect(body).to.have.property("accessToken")
        })
      })
    });
    context('Falha', () => {
      it('Tentativa de utilizar dados de um usuário não cadastrado', () => {
        cy.api({
          method: 'POST',
          url: Rota,
          body: {
            "email": "nao_cadastrado@testeqa.com",
            "password": Cypress.env("senha-base")
          },
          failOnStatusCode: false
        }).then(({status, body}) => {
            expect(status).to.equal(400)
            expect(body).not.to.have.property("accessToken")
            expect(body.message).to.be.equal('Essas credencias estão incorretas')
          })
      }) 
  
      it('Tentativa de utilizar um e-mail cadastrado e senha incorreta', () => {
        cy.api({
          method: 'POST',
          url: Rota,
          body: {
            "email": Cypress.env("user-valido").email,
            "password": "SenhaInvalida"
          },
          failOnStatusCode: false
        }).then(({status, body}) => {
            expect(status).to.equal(400)
            expect(body).not.to.have.property("accessToken")
            expect(body.message).to.be.equal('Essas credencias estão incorretas')
          })
      })
  
      it('Tentativa de utilizar um e-mail não formatado', () => {
        cy.api({
          method: 'POST',
          url: Rota,
          body: {
            "email": "nao-formatado",
            "password": Cypress.env("senha-base")
          },
          failOnStatusCode: false
        }).then(({status, body}) => {
            expect(status).to.equal(400)
            expect(body).not.to.have.property("accessToken")
            expect(body.message[0]).to.be.equal('O campo "email" deve ser válido!')
          })
      })
      it('Tentativa de utilizar um e-mail cadastrado e senha vazia', () => {
        cy.api({
          method: 'POST',
          url: Rota,
          body: {
            "email": Cypress.env("user-valido").email,
            "password": ""
          },
          failOnStatusCode: false
        }).then(({status, body}) => {
            expect(status).to.equal(400)
            expect(body).not.to.have.property("accessToken")
            expect(body.message[0]).to.be.equal('Senha: O campo "password" não pode ser vazio!')
          })
      })
    })
  });