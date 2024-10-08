Cypress.Commands.add('getToken', (user = "user-valido") => {
    cy.api({
        method: 'POST',
        url: 'authentication/login',
        body: Cypress.env(user),
        failOnStatusCode: false
    }).then(({ body }) => {
        Cypress.env("token", "Bearer " + body.accessToken)
    });
});
Cypress.Commands.add('getTempToken', (user = "user-valido") => {
    cy.mailosaurGetMessage(Cypress.env("server-mailsaur"), {
        sentTo: Cypress.env(user).email,
        failOnStatusCode: false
    }).then((email) => {
        let url = email.html.links[0].href
        cy.wrap(url).then((url) => {
            const prefix = '/redefinir-senha/';
            let temp_token = url.split(prefix)[1];
            Cypress.env("redefinition-token", temp_token)
        })
    })
})
Cypress.Commands.add('recoverPassword', () => {
    cy.api({
        method: 'POST',
        url: 'authentication/recover-password',
        body: {
            "email": Cypress.env("email-mailsaur")
        },
        failOnStatusCode: false
    }).then(({ status }) => {
        expect(status).to.equal(201)
        cy.getTempToken()
    })
})
