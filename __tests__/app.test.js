const seed = require("../db/seeds/seed");
const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app/app");
const endpoints = require("../endpoints.json");

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
});

describe("/api/reviews/review_id", () => {
  describe("GET: /api/reviews/review_id", () => {
    test("200:  returns a review object, with the following properties: review_id, title, review_body, designer, review_img_url, votes, category field which references the slug in the categories table, owner field that references a user''s primary key (username), created_at", () => {
      return request(app)
        .get("/api/reviews/2")
        .expect(200)
        .then(({ body }) => {
          expect(typeof body.review).toBe("object");
          expect(body.review.review_id).toBe(2);
          expect(body.review.title).toBe("Jenga");
          expect(body.review.designer).toBe("Leslie Scott");
          expect(body.review.owner).toBe("philippaclaire9");
          expect(body.review.comment_count).toBe("3");
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
  describe("ERRORS - GET: /api/reviews/:review_id", () => {
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
          expect(body.message).toBe("Bad request, review_id must be a number");
        });
    });
  });
  describe("ERRORS - PATCH: /api/reviews/:review_id", () => {
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
          expect(body.message).toBe("Bad request, review_id must be a number");
        });
    });
    test("400:  bad request if the body of the request does not contain an object with key inc_votes", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({ test: 60 })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe(
            "bad request, the request body must contain inc_votes"
          );
        });
    });
    test("400: bad request inc_votes is not a number", () => {
      return request(app)
        .patch("/api/reviews/2")
        .send({ inc_votes: "test" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request, vote must be a number");
        });
    });
  });
});

describe("GET: /api/users", () => {
  test("200:  returns an array of user objects, each of which should have the properties of username, name, and avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toHaveLength(4);
        expect(body.users[1]).toEqual({
          username: "philippaclaire9",
          name: "philippa",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
        });
        body.users.forEach((user) => {
          expect.objectContaining({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  describe("ERRORS - GET: /api/users", () => {
    test("404: bad path if wrong endpoint written", () => {
      return request(app)
        .get("/api/testing")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Path not found");
        });
    });
  });
});

describe("GET: /api/reviews", () => {
  test("200:  returns an array of review objects, each of which should have the properties of owner, title review_id, category, review_img_url, created_at, votes, review_body, designer, comment_count ordered by date in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("created_at", {
          descending: true,
          coerce: true,
        });
        expect(body.reviews[0]).toEqual({
          review_id: 7,
          title: "Mollit elit qui incididunt veniam occaecat cupidatat",
          category: "social deduction",
          designer: "Avery Wunzboogerz",
          owner: "mallionaire",
          review_body:
            "Consectetur incididunt aliquip sunt officia. Magna ex nulla consectetur laboris incididunt ea non qui. Enim id eiusmod irure dolor ipsum in tempor consequat amet ullamco. Occaecat fugiat sint fugiat mollit consequat pariatur consequat non exercitation dolore. Labore occaecat in magna commodo anim enim eiusmod eu pariatur ad duis magna. Voluptate ad et dolore ullamco anim sunt do. Qui exercitation tempor in in minim ullamco fugiat ipsum. Duis irure voluptate cupidatat do id mollit veniam culpa. Velit deserunt exercitation amet laborum nostrud dolore in occaecat minim amet nostrud sunt in. Veniam ut aliqua incididunt commodo sint in anim duis id commodo voluptate sit quis.",
          review_img_url:
            "https://images.pexels.com/photos/278888/pexels-photo-278888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          created_at: "2021-01-25T11:16:54.963Z",
          votes: 9,
          comment_count: "0",
        });
      });
  });
  test("200: returns with all reviews sorted by votes", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toHaveLength(13);
        expect(body.reviews[0].votes).toBe(100);
        expect(body.reviews[12].votes).toBe(1);
        expect(body.reviews).toBeSortedBy("created_at", {
          descending: true,
          coerce: true,
        });
      });
  });
  test("200: returns with all the reviews ordered by ASC", () => {
    return request(app)
      .get("/api/reviews?order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toHaveLength(13);
        expect(body.reviews).toBeSortedBy("created_at");
      });
  });
  test("200: returns with all the reviews with same category", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews[0].category).toBe("dexterity");
        body.reviews.forEach((review) => {
          expect(review.category).toBe("dexterity");
        });
      });
  });
  test("200: returns an empty array for a category that exists but that does not have any related review", () => {
    return request(app)
      .get("/api/reviews?category=children's games")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toEqual([]);
      });
  });
  test("200: returns sorted and ordered at the same time with multiple queries", () => {
    return request(app)
      .get("/api/reviews?sort_by=title&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toHaveLength(13);
        expect(body.reviews[0].title).toBe("Agricola");
        expect(body.reviews).toBeSortedBy("title", {
          descending: false,
          coerce: true,
        });
      });
  });
  test("200: returns data based on multiple queries", () => {
    return request(app)
      .get("/api/reviews/?category=dexterity&category=euro game")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toHaveLength(2);
        body.reviews.forEach((review) => {
          expect(review.category).toBeOneOf(["dexterity", "euro game"]);
        });
      });
  });
  describe("ERRORS - GET: /api/reviews", () => {
    test("404: bad path if wrong endpoint written", () => {
      return request(app)
        .get("/api/testing")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Path not found");
        });
    });
  });
  test("400: bad request if method is wrong", () => {
    return request(app)
      .get("/api/reviews?test=euro")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("Bad request, incorrect method");
      });
  });
  test("400: bad request if multiple methods are wrong", () => {
    return request(app)
      .get("/api/reviews?category=euro game&test2=dexterity")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("Bad request, incorrect method");
      });
  });
  test("400: bad request if sort_by is wrong", () => {
    return request(app)
      .get("/api/reviews/?sort_by=test")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("Bad request, incorrect sort_by");
      });
  });
  test("400: bad request if order is wrong", () => {
    return request(app)
      .get("/api/reviews/?order=test")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("Bad request, incorrect order");
      });
  });
  test("400: bad request if category is wrong", () => {
    return request(app)
      .get("/api/reviews/?category=test")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("Bad request, incorrect category");
      });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  describe("GET: /api/reviews/review_id/comments", () => {
    test.only("200:  returns an array of comments, with the following properties: comment_id, body, votes, author, review_id, created_at,", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body }) => {
          body.comments.forEach((comment) => {
            expect.objectContaining({
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              review_id: expect.any(Number),
              created_at: expect.any(String),
            });
          });
        });
    });
    test("200:  returns and empty array if the id is valid but there are no comments associated", () => {
      return request(app)
        .get("/api/reviews/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toEqual([]);
        });
    });
  });
  describe("POST: /api/reviews/review_id/comments", () => {
    test("201:  changes specific details on the indicated endpoint depending on the submitted body", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({
          username: "mallionaire",
          body: "Something valuable for our TESTS",
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toEqual({
            comment_id: 7,
            author: "mallionaire",
            body: "Something valuable for our TESTS",
          });
        });
    });
  });
  describe("ERRORS - GET: /api/reviews/:review_id/comments", () => {
    test("404: bad path if review_id is not valid id number", () => {
      return request(app)
        .get("/api/reviews/40/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Path not found, invilid review_id");
        });
    });
    test("400: bad request if review_id is not a number", () => {
      return request(app)
        .get("/api/reviews/test/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request, review_id must be a number");
        });
    });
  });
  describe("ERRORS - POST: /api/reviews/:review_id/comments", () => {
    test("404: bad path if review_id is not valid id number", () => {
      return request(app)
        .post("/api/reviews/40/comments")
        .send({
          username: "mallionaire",
          body: "Something valuable for our TESTS",
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Path not found, invilid review_id");
        });
    });
    test("400: bad request if username is not the correct one", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({ username: "testing", body: "Something valuable for our TESTS" })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Path not found, invilid username");
        });
    });
    test("400: bad request if review_id is not a number", () => {
      return request(app)
        .post("/api/reviews/test/comments")
        .send({
          username: "mallionaire",
          body: "Something valuable for our TESTS",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request, review_id must be a number");
        });
    });
    test("400:  bad request if the body of the request does not contain an object with keys username or body", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({
          us3rn4m3: "mallionaire",
          body: "Something valuable for our TESTS",
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe(
            "bad request, the request body must contain username and body"
          );
        });
    });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("DELETE /api/comments/:comment_id", () => {
    test("status:204, responds with an empty response body", () => {
      return request(app)
        .get("/api/comments/1")
        .expect(200)
        .then(() => {
          return request(app)
            .delete("/api/comments/1")
            .expect(204)
            .then(() => {
              return request(app).get("/api/comments/1").expect(404);
            });
        });
    });
  });
  describe("ERRORS - DELETE: /api/comments/:comment_id", () => {
    test("404: bad path if review_id is not valid id number", () => {
      return request(app)
        .delete("/api/comments/9999")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Path not found, invilid comment_id");
        });
    });
    test("400: bad request if review_id is not a number", () => {
      return request(app)
        .delete("/api/comments/test")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request, comment_id must be a number");
        });
    });
  });
});

describe("/api", () => {
  describe("GET /api", () => {
    test("200: returns a description of all the endpoints from the endpoints.json file", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({ endpoints });
        });
    });
  });
});
