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
    .catch(err => res.status(500).json(err));
});

/**
 * @route   GET api/courses/:id
 * @desc    Returns info on the course based on id params
 * @access  Public
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;
  Course.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
    where: { id }
  })
    .then(data => res.json(data))
    .catch(err => res.status(500).json(err));
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
    const { user } = req;
    User.findOne({ where: { id: user.id } })
      .then(user => {
        body.userId = user.id;
        return user.createCourse(body);
      })
      .then(course => {
        res
          .status(201)
          .location(`/course/${course.id}`)
          .end();
      })
      .catch(err => {
        if (err.name === "SequelizeValidationError") {
          res.status(400).json(err.errors);
        } else {
          throw err;
        }
      });
  }
);

/**
 * @route   POST api/courses/:id
 * @desc    Updates a course, sets the Location header
 *          to the URI for the course, and returns no content
 * @access  Private
 */
router.put(
  "/:id",
  passport.authenticate("basic", { session: false }),
  (req, res, next) => {
    const { body } = req;
    const { id } = req.params;
    const { user } = req;

    Course.findOne({ where: { id } })
      .then(course => {
        if (!course) {
          res.status(404);
          next();
        } else if (course.userId === user.id) {
          course.update(body);
          res.status(204).end();
        } else {
          res.status(403).end();
        }
      })
      .catch(err => {
        throw err;
      });
  }
);

/**
 * @route   DELETE api/courses/:id
 * @desc    Deletes course with matching :id, returns no content
 * @access  Private
 */
router.delete(
  "/:id",
  passport.authenticate("basic", { session: false }),
  (req, res) => {
    const { body } = req;
    const { id } = req.params;
    const { user } = req;

    Course.findOne({ where: { id } }).then(course => {
      if (course.userId === user.id) {
        course.destroy();
        res.status(204).end();
      } else {
        res.status(403).json({ message: "Forbidden" });
      }
    });
  }
);

module.exports = router;
