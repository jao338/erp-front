import { defineConfig } from 'cypress';

import dayjs from 'dayjs';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  watchForFileChanges: false,
  screenshotOnRunFailure: true,
  trashAssetsBeforeRuns: true,
  defaultCommandTimeout	: 15000,
  responseTimeout	: 15000,
  viewportWidth: 1600,
  viewportHeight: 900,
  retries: { 'runMode': 0, 'openMode': 0 },
  e2e: {
    experimentalRunAllSpecs: true,
    testIsolation: true,
    specPattern: ['**/*.cy.{js,ts}'],
    excludeSpecPattern: [
      '**/auth/*',
    ],
    baseUrl: 'http://localhost:9000',

    setupNodeEvents(on, config) {
      const errorLogPath = path.resolve(__dirname, 'cypress', 'support', 'logs', 'logs.json');

      on('task', {
        logErrorToFile({
                         errorMessage,
                         originalMessage,
                         testLocation,
                         relativePath,
                         lineNumber,
                         stackTrace
                       }: {
          errorMessage: string;
          originalMessage: string;
          testLocation: string;
          relativePath: string,
          lineNumber: string;
          stackTrace: string;
        }) {
          const errorData = {
            errorMessage,
            originalMessage,
            testLocation,
            relativePath,
            lineNumber,
            stackTrace,
            timestamp: dayjs().format('DD/MM/YYYY HH:mm'),
          };

          try {
            if (!fs.existsSync(path.dirname(errorLogPath))) {
              fs.mkdirSync(path.dirname(errorLogPath), { recursive: true });
            }

            if (fs.existsSync(errorLogPath)) {
              const existingData = JSON.parse(fs.readFileSync(errorLogPath, 'utf-8'));
              const updatedData = Array.isArray(existingData)
                ? [...existingData, errorData]
                : [existingData, errorData];
              fs.writeFileSync(errorLogPath, JSON.stringify(updatedData, null, 2), 'utf-8');
            } else {
              fs.writeFileSync(errorLogPath, JSON.stringify([errorData], null, 2), 'utf-8');
            }

            return null;

          } catch (error) {
            console.error('Erro ao registrar mensagem no arquivo de log:', error);
            throw error;
          }
        },
      });

      return config;
    },
    env: {
      CY_USER: "admin@teste.com",
      CY_PASSWORD: "Senha_nada_segura123",
      CY_URL: "http://localhost:9000/",
    },
  },
});
