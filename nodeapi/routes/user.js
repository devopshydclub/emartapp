const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secretOrKey = require("../config/keys").secretOrKey;
const User = require("../models/User"); // User model

const validateRegisterInput = require("../validation/register"); // register validation
const validateLoginInput = require("../validation/login"); // login validation

//----------------------------------Routes----------------------------------//

// @route   POST /user/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) return res.status(400).json({ success: false, message: errors });
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json({ success: false, message: errors.email });
    } else {
      User.findOne({ cardId: req.body.cardId }).then(user => {
        if (user) {
          errors.cardId = "Personal ID already exists";
          return res.status(400).json({ success: false, message: errors.cardId });
        } else {

///mailing

const nodemailer = require("nodemailer");
 
var sender = nodemailer.createTransport({
  service: 'gmail',
  type: "SMTP",
  host: "smtp.gmail.com",
  auth: {
    user: 'keshav.visu@gmail.com',
    pass: '271298318929'
  }
});
 
var mail = {
  from: "keshav.visu@gmail.com",
  to: req.body.email,
  subject: "E_MART Registration Successfull",
  text: "Dear "+req.body.fname+"! Your Registration Finished Successfully.\nWelcome to E-MART Family.\n Thankyou!"
};
 
sender.sendMail(mail, function(error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent successfully: "
                 + info.response);
  }
});



// mailing end

          // Admin Role
             urole=0;
              if(req.body.fname=="admin"||req.body.fname=="ADMIN"||
              req.body.lname=="admin"||req.body.lname=="ADMIN"||req.body.email=="admin@gmail.com"||
              req.body.email=="admin@mail.com"||req.body.email=="ADMIN@gmail.com"||
              req.body.email=="ADMIN@mail.com") {urole =1};
          // Admin Role
          
          const newUser = new User({


             role:urole,
            cardId: req.body.cardId,
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            password: req.body.password,
            city: req.body.city,
            street: req.body.street
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => res.json({ success: true, user }))
                .catch(err => res.status(404).json({ success: false, message: "Could not register user" }));
            });
          });
        }
      });
    }
  });
});

// @route   POST /user/login
// @desc    Login user | Returning JWT Token
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  // if (!isValid) return res.status(400).json({ success: false, message: errors });
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "User not found";
      return res.status(400).json({ success: false, message: errors.email });
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // Create JWT payload
        const payload = {
          id: user.id,
          fname: user.fname,
          lname: user.lname
        };
        // Sign token
        jwt.sign(payload, secretOrKey, (err, token) => {
          if (err) throw err;
          res.json({ success: true, message: "Token was assigned", token: token, user: user });
        });


///mailing

const nodemailer = require("nodemailer");
 
var sender = nodemailer.createTransport({
  service: 'gmail',
  type: "SMTP",
  host: "smtp.gmail.com",
  auth: {
    user: 'keshav.visu@gmail.com',
    pass: '21312312312'
  }
});
 
var mail = {
  from: "keshav.visu@gmail.com",
  to: email,
  subject: "Login alert mail from E-Mart",
  text: "Dear "+email +" , you have Loggedin successfully at "+Date.now()
};
 
sender.sendMail(mail, function(error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent successfully: "
                 + info.response);
  }
});



// mailing end



      } else {
        errors.password = "Password is incorrect";
        return res.status(400).json({ success: false, message: errors.password });
      }
    });
  });
});

module.exports = router;
