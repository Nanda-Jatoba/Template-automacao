const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
    MAILOSAUR_API_KEY: "", // ALTERAR API KEY MAILOSAUR
  },
  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    baseUrl: "https://", // ALTERAR BASE URL
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      reporterOptions: {
        charts: true,
        reportPageTitle: '', // ALTERAR NOME DO PROJETO
        embeddedScreenshots: true,
        inlineAssets: true,
        reportTitle: 'Resultado Teste Automatizado - ', // ALTERAR NOME DO PROJETO
        reportJsonFile: 'mochawesome.json',
        overwrite: true,
        quiet: true
      },
    },
  },
});
