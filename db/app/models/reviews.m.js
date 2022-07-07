const connection = require("../../connection");
const { findCategory } = require("../../utils/find-category");
const reviews = require("../../data/test-data/reviews");

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

exports.selectReviews = (query = { sort_by: "created_at" }) => {
  let methods = ["sort_by", "order", "category"];
  let searchSort_by = "created_at";
  let searchOrder = "DESC";
  let whereStr = "";
  const request = Object.keys(query);
  if (!methods.includes(request[0])) {
    return Promise.reject({
      status: 400,
      message: "Bad request, incorrect method",
    });
  }
  if ("sort_by" in query) {
    const sort_by = query.sort_by;
    let sortByOptions = [
      "title",
      "designer",
      "owner",
      "review_img_url",
      "review_body",
      "category",
      "created_at",
      "votes",
    ];
    searchSort_by = sortByOptions.find(
      (elem) => elem.toLowerCase() === sort_by
    );
    if (!sortByOptions.includes(sort_by)) {
      return Promise.reject({
        status: 400,
        message: "Bad request, incorrect sort_by",
      });
    }
  }
  if ("order" in query) {
    const order = query.order;
    let orderOptions = ["asc", "desc"];
    searchOrder = orderOptions.find((elem) => elem.toLowerCase() === order);
    if (!orderOptions.includes(order)) {
      return Promise.reject({
        status: 400,
        message: "Bad request, incorrect order",
      });
    }
  }
  if ("category" in query) {
    const categorySet = findCategory(reviews);
    const category = query.category;
    if (Array.isArray(category)) {
      category.forEach((categoryName, i) => {
        if (!categorySet.has(categoryName)) {
          return Promise.reject({
            status: 400,
            message: "Bad request, incorrect category",
          });
        } else if (categorySet.has(categoryName) && i === 0) {
          whereStr = `WHERE category = '${categoryName}'`;
        } else if (categorySet.has(categoryName) && i > 0) {
          whereStr += ` OR category = '${categoryName}'`;
        }
      });
    }
    if (typeof category === "string") {
      whereStr = `WHERE category = '${category}'`;
    }

    if (!Array.isArray(category)) {
      if (!categorySet.has(category)) {
        return Promise.reject({
          status: 400,
          message: "Bad request, incorrect category",
        });
      }
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
  ORDER BY ${searchSort_by} ${searchOrder}; 
  `
    )
    .then((result) => {
      return result.rows;
    });
};
