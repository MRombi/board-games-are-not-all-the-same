// const fs = require("fs");
const connection = require("../../connection");

exports.selectReviewById = (id) => {
  if (isNaN(id) === false) {
    return connection
      .query(
        `
  SELECT * FROM reviews WHERE review_id=$1;
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
