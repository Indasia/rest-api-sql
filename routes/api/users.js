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
    User.findAll({
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      where: { id: req.user.id }
    })
      .then(user => res.json(user))
      .catch(err => next(err));
  }
);

/**
 * @route   POST api/users
 * @desc    Creates a new user
 * @access  Public
 */
router.post("/", (req, res, next) => {
  const { body } = req;
  if (!body.emailAddress) {
    const err = new Error();
    err.status = "400";
    err.message = "Incomplete data submitted";
    next(err);
  }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(body.password, salt, function(err, hash) {
      User.findOne({
        where: {
          emailAddress: body.emailAddress
        }
      })
        .then(user => {
          if (user) {
            const err = new Error();
            err.status = "400";
            err.message = "Email already in database";
            next(err);
          } else {
            User.create({
              emailAddress: body.emailAddress,
              firstName: body.firstName,
              lastName: body.lastName,
              password: hash
            });
            res.location(`/user/${user.id}`);
            res.status(201).end();
          }
        })
        .catch(err => {
          if (err.name === "SequelizeValidationError") {
            err.status = 400;
            err.message = "Incomplete data submitted";
          } else {
            next(err);
          }
        });
    });
  });
});

module.exports = router;
