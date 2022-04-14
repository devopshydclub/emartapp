const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProductInput(data) {
  let errors = {};

  data.prod_name = !isEmpty(data.prod_name) ? data.prod_name : "";
  data.price = !isEmpty(data.price) ? data.price : "";
  data.category = !isEmpty(data.category) ? data.category : "";

  if (!Validator.isLength(data.prod_name, { min: 2, max: 30 })) {
    errors.prod_name = "Product name must be between 2 and 30 characters";
  }

  if (!Validator.isLength(data.category, { min: 2, max: 30 })) {
    errors.category = "Category must be between 2 and 30 characters";
  }

  if (!Validator.isNumeric(data.price)) {
    errors.price = "Price must be a number";
  }

  if (Validator.isEmpty(data.prod_name)) {
    errors.prod_name = "Product name field is required";
  }

  if (Validator.isEmpty(data.category)) {
    errors.category = "Category field is required";
  }

  if (Validator.isEmpty(data.price)) {
    errors.price = "Price field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
