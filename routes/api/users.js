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
    }).then(user => res.json(user));
  }
);

/**
 * @route   POST api/users
 * @desc    Creates a new user
 * @access  Private
 */
router.post("/", (req, res) => {
  const { body } = req;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(body.password, salt, function(err, hash) {
      User.findOrCreate({
        where: {
          emailAddress: body.emailAddress
        }
      })
        .then(([user, created]) => {
          if (!created) {
            res.status(400).json({ message: "User already in database" });
          }
          res.location("/");
          res.end();
        })
        .catch(err => {
          if (err.name === "SequelizeValidationError") {
            res.status(400).json(err.errors);
          }
        });
    });
  });
});

module.exports = router;