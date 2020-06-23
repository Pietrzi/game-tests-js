const passport = require('passport');
const localStrategy = require('passport-local');

// handle user registration
passport.use('signup', new localStrategy.Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
console.log(email, password);
console.log(req.body);

const { username } = req.body;
if (username && username !== 'error') {
    return done(null, { name: Joe });
}
return done(new Error('invalid user'))
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