const express = require('express');
const session = require('express-session');
const massive = require('massive')
require('dotenv').config();
const {SESSION_SECRET, CONNECTION_STRING} = process.env;
const authCtrl = require('./controllers/authController')
const treasureCtrl = require('./controllers/treasureController')
const auth = require('./middleware/authMiddleware')

const app = express();
const PORT = 4000;


app.use(express.json());
app.use(session({
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: true
}))

//auth endpoints
app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.delete('/auth/logout', authCtrl.logout);

//treasure endpoints
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);

massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
})

app.listen(PORT, () => console.log(`LISTENING ON PORT ${PORT}.`));