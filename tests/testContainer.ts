import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "testcontainers";
import Migrator from "./Migrator";
import { setupTypeOrmConnection, getDatasource } from "../src/utils/db";
import { MODELS } from "../src/config";

let postgresContainer: StartedPostgreSqlContainer | null = null;

interface SetupContainerConfig {
  shouldMigrate?: boolean;
  extraSQL?: string;
  serverAuth?: boolean;
}

export const setupTestContainer = async (config: SetupContainerConfig = {}) => {
  const { extraSQL, shouldMigrate = true, serverAuth = false } = config;

  postgresContainer = await new PostgreSqlContainer().start();

  await setupTypeOrmConnection(MODELS, {
    type: "postgres",
    host: postgresContainer.getHost(),
    port: postgresContainer.getPort(),
    database: postgresContainer.getDatabase(),
    username: postgresContainer.getUsername(),
    password: postgresContainer.getPassword(),
  });

  if (shouldMigrate) {
    const migrator = new Migrator();
    await migrator.run();

    if (extraSQL) {
      await migrator.query(extraSQL);
    }
  }
};

export const destroyTestContainer = async () => {
  await postgresContainer?.stop();
  await getDatasource().manager.connection.destroy();
};

export const clearDB = async () => {
  for (const model of MODELS) {
    await model.delete({});
  }
};
