const BasicStrategy = require("passport-http").BasicStrategy;
const User = require("../models").User;
const bcrypt = require("bcryptjs");

module.exports = new BasicStrategy((userid, password, done) => {
  User.findOne({ where: { emailAddress: userid } })
    .then(user => {
      if (!user) {
        return done(null, false);
      }
      bcrypt
        .compare(password, user.password)
        .then(passRes => {
          if (!passRes) {
            return done(null, false);
          }
          return done(null, user);
        })
        .catch(err => {
          return done(err);
        });
    })
    .catch(err => {
      return done(err);
    });
});
