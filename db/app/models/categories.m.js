const connection = require("../../connection");

exports.selectCategories = () => {
  return connection.query(
      `
  SELECT slug, description FROM categories;
  `
    )
    .then((result) => {
      // console.log(result.rows);
      return result.rows;
    });
};
