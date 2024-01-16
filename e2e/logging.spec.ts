import supertest from "supertest";
import getServer from "../src/server";
import {
  setupTestContainer,
  destroyTestContainer,
  clearDB,
} from "../tests/testContainer";
import setUpServices from "../src/services";

const UUID_1 = "11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000";

describe("Logging API", () => {
  jest.setTimeout(180_000);

  let client: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    await setupTestContainer();
    setUpServices();
    client = supertest(await getServer());
  });

  afterAll(async () => {
    await destroyTestContainer();
  });

  afterEach(clearDB);

  it("[POST /models] [POST /entities]  Should be able to create a empty entity", async () => {
    await client.post("/models").send({
      id: UUID_1,
      fields: [],
    });
  });
});
