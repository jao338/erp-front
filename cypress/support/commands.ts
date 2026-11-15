Cypress.Commands.add('login', (username, password) => {
  cy.intercept('POST', '**/api/login').as('login');

  cy.session([username, password], () => {
    cy.visit('/login');

    cy.selectByAttribute('text-email').type(username);
    cy.selectByAttribute('text-password').type(password);

    cy.selectByAttribute('btn-login').click();

    cy.waitResponse('login', 200);
    cy.url().should('eq', `${Cypress.env('CY_URL')}/`);
  }, {
    cacheAcrossSpecs: true
  });

  cy.visit(Cypress.env('CY_URL'));
});

Cypress.Commands.add('logout', () => {
  cy.intercept('POST', '**/api/logout**').as('logout');

  cy.selectByAttribute('btn-user').click();
  cy.selectByAttribute('btn-logout').click();

  cy.waitResponse('logout', 200);
  cy.url().should('eq', `${Cypress.env('CY_URL')}/login`);

  cy.exec('node tests.js clear');

  Cypress.session.clearAllSavedSessions();
});

Cypress.Commands.add('selectByAttribute', (field: string) => {
  cy.get(`[data-cy=${field}]`).should('be.visible');
});

Cypress.Commands.add('getMenu', () => {
  cy.intercept('GET', '**/api/****/menu**').as('getMenu');
  cy.get('.q-drawer').should('be.visible');
  cy.waitResponse('getMenu', 200);
});

Cypress.Commands.add('waitResponse', (value: string, status: number) => {
  cy.wait(`@${value}`, { timeout: 15000 }).then((interception: any) => {
    expect(interception.response.statusCode).to.eq(status);
  });
});

Cypress.Commands.add(
  'assertResponseHasData',
  (value: string, status: number) => {
    cy.wait(`@${value}`).then((interception: any) => {
      expect(interception.response.statusCode).to.eq(status);
      const responseBody = interception.response.body;
      expect(responseBody).to.have.property('data');

      expect(responseBody['data']).to.not.be.null;
      expect(responseBody['data']).to.not.be.empty;
    });
  }
);

Cypress.Commands.add(
  'assertResponsesHasData',
  (responses: string[], status: number) => {
    responses.forEach((response) => {
      cy.wait(`@${response}`).then((interception: any) => {
        expect(interception.response.statusCode).to.eq(status);

        const responseBody = interception.response.body;

        expect(responseBody).to.have.property('data');

        expect(responseBody['data']).to.not.be.null;
        expect(responseBody['data']).to.not.be.empty;
      });
    })
  }
);

Cypress.Commands.add('clickOkConfirmDelete', () => {
  cy.get('[data-autofocus="true"]').should('be.visible').click();
});

Cypress.Commands.add('checkIfFileExists', (nameFile: string) => {
  const downloadsFolder = Cypress.config('downloadsFolder');

  cy.readFile(`${downloadsFolder}/${nameFile}`).should('exist');
});

Cypress.Commands.add('getDataList', (route: string) => {
  cy.intercept('GET', `**/${route}**`).as('index');
  cy.waitResponse('index', 200);
  cy.get('.q-table__progress').should('not.be.exist');
});

Cypress.Commands.add('navigateToMenu', (path: string[]) => {
  path.forEach((item) => {
    cy.selectByAttribute(item).click();
  });
});

Cypress.Commands.add(
  'returnIfResponseHasData',
  (value: string, status: number, dataField: string) => {
    return cy.wait(`@${value}`).then((interception: any) => {
      expect(interception.response.statusCode).to.eq(status);

      const responseBody = interception.response.body;
      expect(responseBody).to.have.property(dataField);

      return responseBody[dataField] && responseBody[dataField].length > 0;
    });
  }
);

Cypress.Commands.add('clickOnRow', (value: string) => {
  cy.get(`tbody > :nth-child(${value})`)
    .should('be.visible')
    .click();
});

Cypress.Commands.add(
  'fillForm',
  (data: Record<string, string>) => {
    Object.entries(data).forEach(([field, value]) => {
      cy.selectByAttribute(field).type(value);
    });
  },
);
