import supertest from "supertest";
import getServer from "../src/server";
import {
  setupTestContainer,
  destroyTestContainer,
  clearDB,
} from "../tests/testContainer";

const UUID_1 = "11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000";
const UUID_2 = "11bf5b37-e0b8-42e0-8dcf-dc8c4aefc001";

describe("Entity API", () => {
  jest.setTimeout(180_000);

  let client: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    await setupTestContainer();
    client = supertest(await getServer());
  });

  afterAll(async () => {
    await destroyTestContainer();
  });

  afterEach(clearDB);

  it("[POST /models] [POST /entities]  Should be able to create a empty entity", async () => {
    await client.post("/models").send({
      id: UUID_2,
      fields: [],
    });

    const response = await client.post("/entities").send({
      id: UUID_1,
      model: {
        id: UUID_2,
      },
    });

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(UUID_1);
  });

  it("[POST /models] [POST /entities] Should be able to create a number entity", async () => {
    await client.post("/models").send({
      id: UUID_2,
      fields: [
        {
          type: "NUMBER",
          name: "age",
        },
      ],
    });

    const response = await client.post("/entities").send({
      attributes: {
        age: 25,
      },
      model: {
        id: UUID_2,
      },
    });

    expect(response.status).toBe(200);
    expect(response.body.data.attributes.age).toBe(25);
  });

  it("[POST /models] [POST /entities] Should be able to create a string entity", async () => {
    await client.post("/models").send({
      id: UUID_2,
      fields: [
        {
          type: "STRING",
          name: "name",
        },
      ],
    });

    const response = await client.post("/entities").send({
      attributes: {
        name: "Erik",
      },
      model: {
        id: UUID_2,
      },
    });

    expect(response.body.data.attributes.name).toBe("Erik");
  });

  it("Should be able to create a string entity with two attributes", async () => {
    await client.post("/models").send({
      id: UUID_2,
      fields: [
        {
          type: "NUMBER",
          name: "age",
        },
        {
          type: "STRING",
          name: "name",
        },
      ],
    });

    const response = await client.post("/entities").send({
      attributes: {
        name: "Erik",
        age: 25,
      },
      model: {
        id: UUID_2,
      },
    });

    expect(response.body.data.attributes.name).toBe("Erik");
    expect(response.body.data.attributes.age).toBe(25);
  });

  it("Should be able to create a LIST string entity with two attributes", async () => {
    await client.post("/models").send({
      id: UUID_2,
      fields: [
        {
          type: "LIST",
          name: "list",
          config: {
            field: {
              type: "STRING",
            },
          },
        },
      ],
    });

    const response = await client.post("/entities").send({
      attributes: {
        list: ["1", "2", "3"],
      },
      model: {
        id: UUID_2,
      },
    });

    expect(response.body.data.attributes.list).toEqual(["1", "2", "3"]);
  });

  it("Should be able to update an entity", async () => {
    await client.post("/models").send({
      id: UUID_2,
      fields: [
        {
          type: "STRING",
          name: "name",
        },
      ],
    });

    const response = await client.post("/entities").send({
      attributes: {
        name: "Erik",
      },
      model: {
        id: UUID_2,
      },
    });

    expect(response.body.data.attributes.name).toBe("Erik");

    const updated = await client
      .put("/entities/" + response.body.data.id)
      .send({
        id: response.body.data.id,
        attributes: {
          name: "Erik2",
        },
        model: {
          id: UUID_2,
        },
      });

    expect(updated.status).toBe(200);
    expect(updated.body.data.attributes.name).toBe("Erik2");
  });

  it("Should be able to update an one out of two fields for an entity", async () => {
    await client.post("/models").send({
      id: UUID_2,
      fields: [
        {
          type: "STRING",
          name: "name",
        },
        {
          type: "NUMBER",
          name: "age",
        },
      ],
    });

    const response = await client.post("/entities").send({
      attributes: {
        name: "Erik",
        age: 25,
      },
      model: {
        id: UUID_2,
      },
    });

    expect(response.body.data.attributes.name).toBe("Erik");
    expect(response.body.data.attributes.age).toBe(25);

    const updated = await client
      .put("/entities/" + response.body.data.id)
      .send({
        id: response.body.data.id,
        attributes: {
          name: "Erik2",
          age: 25,
        },
      });

    expect(updated.body.data.attributes.name).toBe("Erik2");
    expect(updated.body.data.attributes.age).toBe(25);
  });

  it("[GET /entities/:id] Should remove the field if the model field is removed", async () => {
    await client.post("/models").send({
      id: UUID_2,
      fields: [
        {
          type: "STRING",
          name: "name",
        },
      ],
    });

    await client.post("/entities").send({
      id: UUID_1,
      attributes: {
        name: "Erik",
      },
      model: {
        id: UUID_2,
      },
    });

    const response = await client.get("/entities/" + UUID_1).send({});
    expect(response.body.data.attributes.name).toBe("Erik");
  });

  it("Should be able to get all the entities", async () => {
    await client.post("/models").send({
      id: UUID_2,
      fields: [],
    });

    await client.post("/entities").send({
      model: {
        id: UUID_2,
      },
    });

    const result = await client.get("/entities").send();
    expect(result.body.data.length).toBe(1);
  });

  it("[POST /models] [POST /entities] Should be able to create references", async () => {
    await client.post("/models").send({
      id: UUID_2,
      fields: [
        {
          type: "REFERENCE",
          name: "ref",
        },
        {
          type: "STRING",
          name: "name",
        },
      ],
    });

    await client.post("/entities").send({
      id: UUID_1,
      attributes: {
        name: "Test",
      },
      model: {
        id: UUID_2,
      },
    });

    await client.post("/entities").send({
      id: UUID_2,
      attributes: {
        ref: {
          id: UUID_1,
        },
      },
      model: {
        id: UUID_2,
      },
    });

    const response = await client.get("/entities/" + UUID_2).send({});
    expect(response.body.data.attributes.ref[0].id).toBe(UUID_1);
    expect(response.body.data.attributes.ref[0].attributes.name).toBe("Test");
    // expect(response.body.data.attributes).toBe("Erik");
  });
});
