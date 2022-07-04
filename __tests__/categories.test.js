const seed = require("../db/seeds/seed");
const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../db/app/app");

beforeEach(() => seed({ categoryData, commentData, reviewData, userData }));
afterAll(() => db.end());

describe("GET: /api/categories", () => {
  test("200:  returns an array of category objects, each of which should have the properties of slug and description", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body.categories).toHaveLength(4);
        expect(body.categories[0]).toEqual({ slug: 'euro game', description: 'Abstact games that involve little luck' });
        body.categories.forEach((category) => {
          expect.objectContaining({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("ERRORS - GET: /api/categories", () => {
  test("404: bad path if wrong endpoint written", () => {
    return request(app)
      .get("/api/testing")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Path not found");
      });
  });
})
