const express = require("express");
const router = express.Router();
const Course = require("../../models").Course;
const User = require("../../models").User;

const passport = require("passport");
const basic = require("../../auth/basic");
passport.use(basic);

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

/**
 * @route   GET api/courses/
 * @desc    Returns a list of courses
 * @access  Public
 */
router.get("/", (req, res) => {
  Course.findAll()
    .then(data => res.json(data))
    .catch(err => res.json({ error: err }));
});

/**
 * @route   GET api/courses/:id
 * @desc    Returns info on the course based on id params
 * @access  Public
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;
  Course.findByPk(id)
    .then(data => res.json(data))
    .catch(err => res.json({ error: err }));
});

/**
 * @route   POST api/courses/
 * @desc    Creates a course, sets the Location header
 *          to the URI for the course, and returns no content
 * @access  Private
 */
router.post(
  "/",
  passport.authenticate("basic", { session: false }),
  (req, res) => {
    const { body } = req;
    User.findOne({ where: { id: req.user.id } })
      .then(user => {
        return user.createCourse(body);
      })
      .then(() => {
        res.location("/");
        res.end();
      })
      .catch(err => res.json(err));
  }
);

module.exports = router;
