const connection = require("../db/connection");

exports.checkUsernameById = (username) => {
  if (username !== "string") {
    return connection
      .query(
        `
        SELECT 
        username
        FROM users
        WHERE username = $1;
  `,
        [username]
      )
      .then((result) => {
        if (result.rows.length > 0) {
          return result.rows[0];
        } else {
          return Promise.reject({
            status: 404,
            message: "Path not found, invalid username",
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