import axios from "axios";

const BASE_URL = "http://127.0.0.1:3000";

describe("Register User", () => {
  const uniqueEmail = `testuser_${Date.now()}@example.com`;
  it("should register successfully and return 201", async () => {
    const response = await axios.post(`${BASE_URL}/api/users/register`, {
      first_name: "Test",
      last_name: "User",
      email: uniqueEmail,
      password: "password123",
    });
    expect(response.status).toBe(201);
    expect(response.data.body.data).toHaveProperty("uuid");
    expect(response.data.body.data).toHaveProperty("user_email", uniqueEmail);
  });

  it("should throw 409 conflict error for duplicate email", async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/users/register`, {
        first_name: "Test",
        last_name: "User",
        email: uniqueEmail,
        password: "password",
      });
      expect(response.status).toBe(409);
    } catch (error: any) {
      expect(error.response?.status).toBe(409);
    }
  });

  it("should return 400 for invalid or missing fields", async () => {
    try {
      await axios.post(`${BASE_URL}/api/users/register`, {
        first_name: "Test",
        last_name: "User",
        email: "john.doe@example.com",
        password: "123",
      });
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
    }
    try {
      await axios.post(`${BASE_URL}/api/users/register`, {
        first_name: "Test",
        last_name: "User",
        // missing email
        password: "password123",
      });
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
    }
  });
});

describe("Login User", () => {
  const uniqueEmail = `testuser_${Date.now()}@example.com`;
  it("should login successfully and return 200 with JWT", async () => {
    await axios.post(`${BASE_URL}/api/users/register`, {
      first_name: "Login",
      last_name: "User",
      email: uniqueEmail,
      password: "securePassword123",
    });
    // Now login
    const response = await axios.post(`${BASE_URL}/api/users/login`, {
      email: uniqueEmail,
      password: "securePassword123",
    });
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("token");
    expect(typeof response.data.token).toBe("string");
    expect(response.data.token.length).toBeGreaterThan(10);
  });

  it("should return 401 for invalid credentials", async () => {
    try {
      await axios.post(`${BASE_URL}/api/users/login`, {
        email: uniqueEmail,
        password: "wrongpassword",
      });
    } catch (error: any) {
      expect(error.response?.status).toBe(401);
    }
  });
});
