module.exports = {
    usersOnly: (req, res, next) => {
        if(!req.session.user) {
            return res.status(401).send({message: "Please Log In."})
        }
        next();
    },

    adminsOnly: (req, res, next) => {
        if (!req.session.user.isAdmin) {
          return res.status(403).send('You are not an admin.');
        }
        next();
      }
}
