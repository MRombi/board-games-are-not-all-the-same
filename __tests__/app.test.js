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
        expect(body.categories[0]).toEqual({
          slug: "euro game",
          description: "Abstact games that involve little luck",
        });
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
});

describe("/api/reviews", () => {
  describe("/api/reviews/review_id", () => {
    describe("GET: /api/reviews/review_id", () => {
      test("200:  returns a review object, with the following properties: review_id, title, review_body, designer, review_img_url, votes, category field which references the slug in the categories table, owner field that references a user''s primary key (username), created_at", () => {
        return request(app)
          .get("/api/reviews/1")
          .expect(200)
          .then(({ body }) => {
            expect(typeof body.review).toBe("object");
            expect.objectContaining({
              title: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_img_url: expect.any(String),
              review_body: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(Number),
              votes: expect.any(Number),
            });
          });
      });
    });
    describe("PATCH: /api/reviews/review_id", () => {
      test("200:  changes specific details on the indicated endpoint depending on the submitted body", () => {
        return request(app)
          .patch("/api/reviews/1")
          .send({ inc_votes: 60 })
          .expect(200)
          .then(({ body }) => {
            expect(body.review.votes).toBe(61);
          });
      });
    });
  });
});

describe("ERRORS - /api/reviews/", () => {
  describe("GET: /api/reviews/:review_id", () => {
    test("404: bad path if review_id is not valid id number", () => {
      return request(app)
        .get("/api/reviews/40")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Path not found, invilid review_id");
        });
    });
    test("400: bad request if review_id is not a number", () => {
      return request(app)
        .get("/api/reviews/test")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe(
            "Bad request, review_id must be a number"
          );
        });
    });
  });
  describe("PATCH: /api/reviews/:review_id", () => {
    test("404: bad path if review_id is not valid id number", () => {
      return request(app)
        .patch("/api/reviews/40")
        .send({ inc_votes: 2 })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Path not found, invilid review_id");
        });
    });
    test("400: bad request if review_id is not a number", () => {
      return request(app)
        .patch("/api/reviews/test")
        .send({ inc_votes: 2 })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe(
            "Bad request, review_id must be a number"
          );
        });
    });
    test("400:  bad request if the body of the request does not contain an object with key inc_votes", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({ test: 60 })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("bad request, the request body must contain inc_votes");
        });
    });
    test("400: bad request inc_votes is not a number", () => {
      return request(app)
        .patch("/api/reviews/2")
        .send({ inc_votes: "test" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe(
            "Bad request, vote must be a number"
          );
        });
    });
  });
});