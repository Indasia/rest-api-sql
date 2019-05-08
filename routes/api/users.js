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
 * @access  Public
 */
router.post("/", (req, res) => {
  const { body } = req;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(body.password, salt, function(err, hash) {
      User.findAll({
        where: {
          emailAddress: body.emailAddress
        }
      }).then(search => {
        if (search.length == 0) {
          User.create({
            firstName: body.firstName,
            lastName: body.lastName,
            emailAddress: body.emailAddress,
            password: hash
          })
            .then((user) => {
              res.location(`/user/${user.id}`)
              res.end();
            })
            .catch(err => {
              if (err.name === "SequelizeValidationError") {
                res.status(400).json(err.errors);
              }
            });
        } else {
          res.status(405).json({ message: "Email already in database" });
        }
      });
    });
  });
});

module.exports = router;
