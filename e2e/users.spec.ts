import supertest from "supertest";
import getServer from "../src/server";
import {
  setupTestContainer,
  destroyTestContainer,
  clearDB,
} from "../tests/testContainer";
import BootstrapUserAccountService from "../src/services/bootstrap";
import { sleep } from "../src/utils/common";
import application from "../src/application";

const UUID_1 = "11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000";
const UUID_2 = "11bf5b37-e0b8-42e0-8dcf-dc8c4aefc001";

describe("Entity API", () => {
  jest.setTimeout(180_000);

  let client: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    await setupTestContainer();
    BootstrapUserAccountService.register();
    client = supertest(await getServer());
  });

  afterAll(async () => {
    await destroyTestContainer();
  });

  afterEach(clearDB);

  it("[POST /users] Should be able to create a user", async () => {
    const response = await client.post("/users").send({
      id: UUID_1,
    });

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(UUID_1);
  });

  it("[POST /users] Should setup services", async () => {
    await client.post("/users").send({
      id: UUID_1,
    });
    await sleep(100);

    const response = await client.get("/models").send();
    const userModel = response.body.data.find(
      (model: any) => model.name === "User"
    );
    const organisationModel = response.body.data.find(
      (model: any) => model.name === "Organisation"
    );

    // expect(userModel.fields[0]);
  });
  it("[POST /users] Should setup models", async () => {
    await client.post("/users").send({
      id: UUID_1,
    });

    await sleep(100);

    const response = await client.get("/entities").send();
  });
});
