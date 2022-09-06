import { DataSource } from 'typeorm';

import * as fs from 'fs';
import * as path from 'path';

export class TestUtils {
  databaseService: DataSource;

  constructor(databaseService: DataSource) {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('ERROR-TEST-UTILS-ONLY-FOR-TESTS');
    }
    this.databaseService = databaseService;
  }

  async shutdownServer(server) {
    await server.httpServer.close();
    await this.closeDbConnection();
  }

  async closeDbConnection() {
    await this.databaseService.destroy();
  }

  async reloadFixtures(entities) {
    await this.cleanAll(entities);
    await this.loadAll(entities);
  }

  async cleanAll(entities) {
    try {
      for (const entity of entities) {
        const repository = await this.databaseService.getRepository(entity);
        await repository.query(`TRUNCATE TABLE "${entity}" CASCADE;`);
      }
    } catch (error) {
      console.log(error);
      throw new Error(`ERROR: Cleaning test db: ${error}`);
    }
  }

  async loadAll(entities) {
    try {
      for (const entity of entities) {
        const repository = await this.databaseService.getRepository(entity);
        const fixtureFile = `../mocks/${entity}.json`;
        const pathOfFile = path.join(__dirname, fixtureFile);
        if (fs.existsSync(pathOfFile)) {
          const items = JSON.parse(fs.readFileSync(pathOfFile, 'utf8'));

          await repository
            .createQueryBuilder(entity)
            .insert()
            .values(items)
            .execute();
        }
      }
    } catch (error) {
      throw new Error(
        `ERROR [TestUtils.loadAll()]: Loading fixtures on test db: ${error}`,
      );
    }
  }
}
