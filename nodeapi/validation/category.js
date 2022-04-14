const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCategoryInput(data) {
  let errors = {};

  data.cat_name = !isEmpty(data.cat_name) ? data.cat_name : "";

  if (!Validator.isLength(data.cat_name, { min: 2, max: 30 })) {
    errors.cat_name = "Category must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.cat_name)) {
    errors.cat_name = "Category field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
