const bcrypt = require('bcryptjs');

module.exports = {
    register: async (req, res) => {
        let { username, password, isAdmin } = req.body;
        const db = req.app.get('db');
        const result = await db.get_user(username);
        const existingUser = result[0]
        if (existingUser) {
            res.status(409).send({ message: 'Username taken.' })
        } else {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            const registeredUser = await db.register_user(isAdmin, username, hash);
            const user = registeredUser[0];
            req.session.user = ({ isAdmin: user.is_admin, id: user.id, username: user.username })
            return res.status(201).send(req.session.user);
        }
    },

    login: async (req, res) => {
        const { username, password } = req.body;
        const db = req.app.get('db');
        const foundUser = await db.get_user(username);
        const user = foundUser[0];
        if (!user) {
            return res.status(403).send({ message: "Please register a new user before logging in." })
        }
        const isAuthenticated = bcrypt.compareSync(password, user.hash);
        if (isAuthenticated === false) {
            return res.status(403).send("Incorrect Password.");
        }
        req.session.user = { username: user.username, id: user.id, isAdmin: user.is_admin}
        return res.status(200).send(req.session.user);
    },

    logout: (req, res) => {
        req.session.destroy();
        res.status(200).send("logged out.");
    }
}