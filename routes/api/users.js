const express = require("express");
const router = express.Router();

const User = require("../../models").User;

const bcrypt = require("bcryptjs");

const passport = require("passport");
const basic = require("../../auth/basic");
passport.use(basic);

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

/**
 * @route   GET api/users
 * @desc    Returns the currently authenticated user
 * @access  Private
 */
router.get(
  "/",
  passport.authenticate("basic", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

/**
 * @route   POST api/users
 * @desc    Returns the currently authenticated user
 * @access  Private
 */
router.post("/", (req, res) => {
  const { body } = req;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(body.password, salt, function(err, hash) {
      User.create({
        firstName: body.firstName,
        lastName: body.lastName,
        emailAddress: body.emailAddress,
        password: hash
      })
        .then(() => {
          res.location("/");
          res.end();
        })
        .catch(err => res.status(500));
    });
  });
});

module.exports = router;
