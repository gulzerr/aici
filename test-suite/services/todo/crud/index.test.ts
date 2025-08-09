import axios from "axios";

const BASE_URL = "http://127.0.0.1:3001";
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc1NDY3OTg2NCwiZXhwIjoxNzU0NzY2MjY0fQ.hZPQxO-3bF5edSuCEvWjIiolviUNIxGRV8VUz5hQOmw";

describe("Create todos", () => {
  it("should create a todo and return 201 with the created item", async () => {
    const todoData = { content: "Test todo item" };
    const response = await axios.post(`${BASE_URL}/api/todos`, todoData, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    expect(response.status).toBe(201);
    expect(response.data.isError).toBe(false);
    expect(response.data.body.data).toHaveProperty("content", "Test todo item");
  });

  it("should return 401 Unauthorized if JWT is missing", async () => {
    const todoData = { content: "Test todo item" };
    try {
      await axios.post(`${BASE_URL}/api/todos`, todoData);
    } catch (error: any) {
      expect(error.response.status).toBe(401);
      expect(error.response.data.isError).toBe(true);
    }
  });

  it("should return 401 Unauthorized if JWT is invalid", async () => {
    const todoData = { content: "Test todo item" };
    try {
      await axios.post(`${BASE_URL}/api/todos`, todoData, {
        headers: { Authorization: "Bearer invalidtoken" },
      });
    } catch (error: any) {
      expect(error.response.status).toBe(401);
      expect(error.response.data.isError).toBe(true);
    }
  });
});

describe("Read todos", () => {
  it("should return 200 OK with a list of todos in JSON format", async () => {
    const response = await axios.get(`${BASE_URL}/api/todos`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    expect(response.status).toBe(200);
    expect(response.data.isError).toBe(false);
    expect(Array.isArray(response.data.body.data)).toBe(true);
  });

  it("should return empty array if no todos exist", async () => {
    const response = await axios.get(`${BASE_URL}/api/todos`, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc1NDY3OTUzMSwiZXhwIjoxNzU0NzY1OTMxfQ.D6kHafHWzBpwOI_FFxyvCB2NeS766TLhHE7jRj8QM0c`,
      },
    });
    expect(response.status).toBe(200);
    expect(response.data.isError).toBe(false);
    expect(response.data.body.data).toEqual([]);
  });

  it("should return 401 Unauthorized if JWT is missing", async () => {
    try {
      await axios.get(`${BASE_URL}/api/todos`);
    } catch (error: any) {
      expect(error.response.status).toBe(401);
      expect(error.response.data.isError).toBe(true);
    }
  });

  it("should return 401 Unauthorized if JWT is invalid", async () => {
    try {
      await axios.get(`${BASE_URL}/api/todos`, {
        headers: { Authorization: "Bearer invalidtoken" },
      });
    } catch (error: any) {
      expect(error.response.status).toBe(401);
      expect(error.response.data.isError).toBe(true);
    }
  });
});

describe("Update todos", () => {
  it("should update a todo and return 200 with the updated item", async () => {
    const todoData = { content: "Update me" };
    const createRes = await axios.post(`${BASE_URL}/api/todos`, todoData, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const todoId = createRes.data.body.data.id;
    const updateData = { content: "Updated content" };
    const updateRes = await axios.put(
      `${BASE_URL}/api/todos/${todoId}`,
      updateData,
      {
        headers: { Authorization: `Bearer ${TOKEN}` },
      }
    );
    expect(updateRes.status).toBe(200);
    expect(updateRes.data.isError).toBe(false);
    expect(updateRes.data.body.data).toHaveProperty(
      "content",
      "Updated content"
    );
  });

  it("should return 404 or 403 if todo does not exist or does not belong to user", async () => {
    const updateData = { content: "Should not update" };
    try {
      await axios.put(`${BASE_URL}/api/todos/111111`, updateData, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
    } catch (error: any) {
      expect([403, 404]).toContain(error.response.status);
      expect(error.response.data.isError).toBe(true);
    }
  });

  it("should return 401 Unauthorized if JWT is missing or invalid", async () => {
    const updateData = { content: "Should not update" };
    try {
      await axios.put(`${BASE_URL}/api/todos/some-uuid`, updateData);
    } catch (error: any) {
      expect(error.response.status).toBe(401);
      expect(error.response.data.isError).toBe(true);
    }
    try {
      await axios.put(`${BASE_URL}/api/todos/some-uuid`, updateData, {
        headers: { Authorization: "Bearer invalidtoken" },
      });
    } catch (error: any) {
      expect(error.response.status).toBe(401);
      expect(error.response.data.isError).toBe(true);
    }
  });
});

describe("Delete todos", () => {
  it("should delete a todo and return 204 No Content", async () => {
    const todoData = { content: "Delete me" };
    const createRes = await axios.post(`${BASE_URL}/api/todos`, todoData, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const todoId = createRes.data.body.data.id;
    const deleteRes = await axios.delete(`${BASE_URL}/api/todos/${todoId}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    expect(deleteRes.status).toBe(204);
  });

  it("should return 404 or 403 if todo does not exist or does not belong to user", async () => {
    try {
      await axios.delete(`${BASE_URL}/api/todos/111111`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
    } catch (error: any) {
      expect([403, 404]).toContain(error.response.status);
      expect(error.response.data.isError).toBe(true);
    }
  });

  it("should return 401 Unauthorized if JWT is missing or invalid", async () => {
    try {
      await axios.delete(`${BASE_URL}/api/todos/some-uuid`);
    } catch (error: any) {
      expect(error.response.status).toBe(401);
      expect(error.response.data.isError).toBe(true);
    }
    try {
      await axios.delete(`${BASE_URL}/api/todos/some-uuid`, {
        headers: { Authorization: "Bearer invalidtoken" },
      });
    } catch (error: any) {
      expect(error.response.status).toBe(401);
      expect(error.response.data.isError).toBe(true);
    }
  });
});
