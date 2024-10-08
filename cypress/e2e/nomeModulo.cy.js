describe('Modulo', () => {
    require("../modules/Modulo/1.get-Modulo.cy")
    require("../modules/Modulo/2.post-Modulo.cy")
    require("../modules/Modulo/3.get-id.cy")
    require("../modules/Modulo/4.put-id.cy")
    require("../modules/Modulo/5.delete-id.cy")
});
const faker = require('faker-br');
let mensagens

const pessoa = faker.name.firstName()
const email = pessoa + faker.name.lastName() + `@${Cypress.env("server-mailsaur")}.mailosaur.net`
const emailCadastrado = pessoa + faker.name.lastName() + `@${Cypress.env("server-mailsaur")}.mailosaur.net`
const cpf = `${faker.br.cpf()}`

const numeroForm = faker.phone.phoneNumber()
let celular = numeroForm.startsWith('+55') ? numeroForm.substring(3) : numeroForm;
celular = celular.replace(/\D/g, '');
