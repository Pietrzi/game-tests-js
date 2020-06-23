const passport = require('passport');
const localStrategy = require('passport-local');

const UserModel = require('../models/UserModel');

// handle user registration
passport.use('signup', new localStrategy.Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const { username } = req.body;
        const user = await UserModel.create({ email, password, username });
        return done(null, user);
    } catch (error) {
        return done(error)
    }
}));

// handle usel login
passport.use('login', new localStrategy.Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (email, password, done) => {

if (email !== 'joe@test.com') {
    return done(new Error('user not found'), false);
}

if (password !== 'test') {
    return done(new Error('invalid password'), false);
}

return done(null, { name: 'joe' });

}));