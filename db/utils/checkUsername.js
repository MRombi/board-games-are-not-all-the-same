const connection = require("../connection");

exports.checkUsernameById = (id, username) => {
  if (username !== "string") {
    return connection
      .query(
        `
        SELECT 
        owner
        FROM reviews
        WHERE review_id = $1 AND owner = $2;
  `,
        [id, username]
      )
      .then((result) => {
        if (result.rows.length > 0) {
          return result.rows[0];
        } else {
          return Promise.reject({
            status: 404,
            message: "Path not found, invilid username",
          });
        }
      });
  } else {
    return Promise.reject({
      status: 400,
      message: "Bad request, username must be a string",
    });
  }
};