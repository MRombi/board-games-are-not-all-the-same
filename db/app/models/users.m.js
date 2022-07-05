const connection = require("../../connection");

exports.selectUsers = () => {
  return connection
    .query(
      `
  SELECT username, name, avatar_url FROM users;
  `
    )
    .then((result) => {
      return result.rows;
    });
};