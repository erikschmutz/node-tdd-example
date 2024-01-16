import supertest from "supertest";
import getServer from "../src/server";
import {
  setupTestContainer,
  destroyTestContainer,
} from "../tests/testContainer";

const UUID_1 = "11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000";
const UUID_2 = "11bf5b37-e0b8-42e0-8dcf-dc8c4aefc001";

describe("Models API", () => {
  jest.setTimeout(180_000);

  let client: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    await setupTestContainer();
    client = supertest(await getServer());
  });

  afterAll(async () => {
    await destroyTestContainer();
  });

  it("Should be able to create a model", async () => {
    const response = await client.post("/models").send({
      id: UUID_1,
    });
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(UUID_1);
  });

  it("Should be able to create a model with a STRING field", async () => {
    const response = await client.post("/models").send({
      fields: [
        {
          type: "STRING",
          id: UUID_1,
          name: "name",
        },
      ],
    });

    expect(response.status).toBe(200);
    expect(response.body.data.fields[0].id).toBe(UUID_1);
    expect(response.body.data.fields[0].type).toBe("STRING");
  });

  it("Should be able to create a model with a LIST field", async () => {
    const response = await client.post("/models").send({
      fields: [
        {
          type: "LIST",
          id: UUID_1,
          name: "array",
        },
      ],
    });

    expect(response.status).toBe(200);
    expect(response.body.data.fields[0].id).toBe(UUID_1);
    expect(response.body.data.fields[0].type).toBe("LIST");
  });

  it("Should be able to create a model with a NUMBER field", async () => {
    const response = await client.post("/models").send({
      fields: [
        {
          type: "NUMBER",
          id: UUID_1,
          name: "age",
        },
      ],
    });

    expect(response.status).toBe(200);
    expect(response.body.data.fields[0].id).toBe(UUID_1);
    expect(response.body.data.fields[0].type).toBe("NUMBER");
  });

  it("Should be able to create a model with a ARRAY field", async () => {
    const response = await client.post("/models").send({
      fields: [
        {
          type: "LIST",
          config: {
            field: {
              type: "STRING",
            },
          },
          name: "age",
        },
      ],
    });

    expect(response.status).toBe(200);
    expect(response.body.data.fields[0].type).toBe("LIST");
    expect(response.body.data.fields[0].config.field.type).toBe("STRING");
  });

  it("Should NOT be able to create a model with a wrong field", async () => {
    const response = await client.post("/models").send({
      fields: [
        {
          type: "INTEGER",
          id: UUID_1,
          name: "age",
        },
      ],
    });

    expect(response.status).toBe(422);
  });

  it("[PUT /entities/:id] Should be able to update a model fields", async () => {
    const response = await client.post("/models").send({
      id: UUID_1,
      fields: [
        {
          type: "NUMBER",
          id: UUID_1,
          name: "age",
        },
        {
          type: "NUMBER",
          id: UUID_2,
          name: "name",
        },
      ],
    });

    expect(response.body.data.fields.length).toBe(2);

    const updated = await client.put("/models/" + UUID_1).send({
      id: UUID_1,
      fields: [
        {
          type: "NUMBER",
          id: UUID_1,
          name: "age",
        },
      ],
    });

    expect(updated.body.data.fields.length).toBe(1);
  });
});
