const connection = require("../../connection");
const { findCategory } = require("../../utils/find-category");
const reviews = require("../../data/test-data/reviews");
const { keys } = require("../../data/test-data/categories");

exports.selectReviewById = (id) => {
  if (isNaN(id) === false) {
    return connection
      .query(
        `
        SELECT 
        reviews.*, 
        COUNT(comments.body) AS comment_count
        FROM reviews
        LEFT JOIN comments ON comments.review_id = reviews.review_id
        WHERE reviews.review_id = $1
        GROUP BY reviews.review_id;
  `,
        [id]
      )
      .then((result) => {
        if (result.rows.length > 0) {
          return result.rows[0];
        } else {
          return Promise.reject({
            status: 404,
            message: "Path not found, invilid review_id",
          });
        }
      });
  } else {
    return Promise.reject({
      status: 400,
      message: "Bad request, review_id must be a number",
    });
  }
};

exports.updateReviewById = (id, votes) => {
  let vote = Object.values(votes).join("");
  let inc_votes = Object.keys(votes).join("");

  if (inc_votes !== "inc_votes") {
    return Promise.reject({
      status: 404,
      message: "bad request, the request body must contain inc_votes",
    });
  } else if (isNaN(id) === false) {
    if (isNaN(vote) === true) {
      return Promise.reject({
        status: 400,
        message: "Bad request, vote must be a number",
      });
    } else {
      return connection
        .query(
          `
  UPDATE reviews 
  SET votes = votes + $1
  WHERE review_id = $2
  RETURNING *
  `,
          [vote, id]
        )
        .then((result) => {
          if (result.rows.length > 0) {
            return result.rows[0];
          } else {
            return Promise.reject({
              status: 404,
              message: "Path not found, invilid review_id",
            });
          }
        });
    }
  } else {
    return Promise.reject({
      status: 400,
      message: "Bad request, review_id must be a number",
    });
  }
};

exports.selectReviews = async ({
  sort_by = "created_at",
  order = "DESC",
  category = "",
  ...query
}) => {
  let correctQueries = new Set(["sort_by", "order", "category"]);

  for (let key in query) {
    if (!correctQueries.has(key) && key.length > 0) {
      return Promise.reject({
        status: 400,
        message: "Bad request, incorrect method",
      });
    }
  }

  let whereStr = "";
  let sortByOptions = new Set([
    "title",
    "designer",
    "owner",
    "review_img_url",
    "review_body",
    "category",
    "created_at",
    "votes",
  ]);
  let checkSortOptions = sortByOptions.has(sort_by);

  if (checkSortOptions === false) {
    return Promise.reject({
      status: 400,
      message: "Bad request, incorrect sort_by",
    });
  }

  if (order.toLowerCase() !== "desc" && order.toLowerCase() !== "asc") {
    return Promise.reject({
      status: 400,
      message: "Bad request, incorrect order",
    });
  }
  const categorySet = await findCategory();

  if (Array.isArray(category)) {
    for (let i = 0; i < category.length; i++) {
      if (!categorySet.has(category[i])) {
        return Promise.reject({
          status: 400,
          message: "Bad request, incorrect category",
        });
      } else if (categorySet.has(category[i]) && i === 0) {
        whereStr = `WHERE category = $${i+1}`;
      } else if (categorySet.has(category[i]) && i > 0) {
        whereStr += ` OR category = $${i+1}`;
      }
    }
  } else if (typeof category === "string") {
    if (!categorySet.has(category) && category.length > 0) {
      return Promise.reject({
        status: 400,
        message: "Bad request, incorrect category",
      });
    } else if (category.length !== 0) {
      category = [category]
      whereStr = `WHERE category = $1`;
    }
  }
  return connection
    .query(
      `   
  SELECT 
  reviews.*,
  COUNT(comments.body) AS comment_count
  FROM reviews
  LEFT JOIN comments ON comments.review_id = reviews.review_id
  ${whereStr}
  GROUP BY reviews.review_id
  ORDER BY ${sort_by} ${order};
  `, [...category]
    )
    .then((result) => {
      return result.rows;
    });
};
