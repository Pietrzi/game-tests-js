const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World')
})

router.get('/status', (req, res) => {
    res.status(200).json({ message: 'ok', statu: 200 })
})

router.post('/signup', passport.authenticate('signup', { session: false }), async (req, res) => { 
    res.status(200).json({ message: 'signup successful', statu: 200 });
})

router.post('/login', (req, res) => {
    passport.authenticate('login', (error, user) => {
        try {
            if (error) {
                return next(error);
            }
            if (!user) {
                return next(new Error('email and password are required'))
            }

            req.login()(user, { session: false }, (err) => {
                if (err) return next (err);
                return res.status(200).json({ user, status: 200 })
            });

        } catch (err) {
            console.log(err);
            return next(err);
        }
    })(req, res, next);
})

router.post('/logout', (req, res) => {
    if(!req.body) {
        res.status(400).json({ message: 'invalid body', statu: 400 });
    }
    res.status(200).json({ message: 'ok', statu: 200 });
})

router.post('/token', (req, res) => {
    if(!req.body || !req.body.refreshToken) {
        res.status(400).json({ message: 'invalid body', statu: 400 });
    }
    const { refreshToken } = req.body;
    res.status(200).json({ message: `refresh token requested for token ${refreshToken}`, statu: 200 });
})

module.exports = router;