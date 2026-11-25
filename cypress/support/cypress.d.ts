declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<Element>;
    }

    interface Chainable {
      logout(): Chainable<Element>;
    }

    interface Chainable {
      selectByAttribute(field: string): Chainable<Element>;
    }

    interface Chainable {
      getMenu(): Chainable<Element>;
    }

    interface Chainable {
      waitResponse(value: string, status: number): Chainable<Element>;
    }

    interface Chainable {
      assertResponseHasData(
        value: string,
        status: number,
      ): Chainable<Element>;
    }

    interface Chainable {
      assertResponsesHasData(
        responses: string[],
        status: number,
      ): Chainable<Element>;
    }

    interface Chainable {
      clickOkConfirmDelete(): Chainable<Element>;
    }

    interface Chainable {
      checkIfFileExists(nameFile: string): Chainable<Element>;
    }

    interface Chainable {
      navigateToMenu(path: string[]): Chainable<Element>;
    }

    interface Chainable {
      getDataList(route: string): Chainable<Element>;
    }

    interface Chainable {
      returnIfResponseHasData(
        value: string,
        status: number,
        dataField: string
      ): Chainable<Element>;
    }

    interface Chainable {
      clickOnRow(value: string): Chainable<Element>;
    }

    interface Chainable {
      fillForm(data: Record<string, string>): Chainable<Element>;
    }
  }
}

export {};
