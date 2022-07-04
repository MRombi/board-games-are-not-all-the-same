const connection = require("../../connection");

exports.selectCategories = () => {
  return connection
    .query(
      `
  SELECT slug, description FROM categories;
  `
    )
    .then((result) => {
      return result.rows;
    });
};
