const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.cardId = !isEmpty(data.cardId) ? data.cardId : "";
  data.fname = !isEmpty(data.fname) ? data.fname : "";
  data.lname = !isEmpty(data.lname) ? data.lname : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
  data.street = !isEmpty(data.street) ? data.street : "";

  if (!Validator.isLength(data.cardId, { min: 9, max: 9 })) {
    errors.cardId = "Personal ID number must be 9 digits";
  }

  if (!Validator.isNumeric(data.cardId)) {
    errors.cardId = "Personal ID must contain only digits (0-9)";
  }

  if (!Validator.isLength(data.fname, { min: 2, max: 30 })) {
    errors.fname = "First name must be between 2 and 30 characters";
  }

  if (!Validator.isLength(data.lname, { min: 2, max: 30 })) {
    errors.lname = "Last name must be between 2 and 30 characters";
  }

  if (!Validator.isLength(data.street, { min: 2, max: 50 })) {
    errors.street = "Street address must be between 2 and 50 characters";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (!Validator.isLength(data.password, { min: 4, max: 30 })) {
    errors.password = "Password must be at least 4 characters";
  }

  if (Validator.isEmpty(data.cardId)) {
    errors.cardId = "Personal ID field is required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Password confirmation field is required";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }

  if (Validator.isEmpty(data.fname)) {
    errors.fname = "First name field is required";
  }

  if (Validator.isEmpty(data.lname)) {
    errors.lname = "Last name field is required";
  }

  if (Validator.isEmpty(data.street)) {
    errors.street = "Street field is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
