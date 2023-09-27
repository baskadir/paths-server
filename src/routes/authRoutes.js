const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');

const router = express.Router();

router.post('/sign-up', async (req, res) => {
    const { userName, password } = req.body;

    try {
        const user = new User({ userName, password });
        await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);

        res.send({ token });
    } catch (error) {
        return res.status(422).send(error.message);
    }
});

router.post('/sign-in', async (req, res) => {
    const { userName, password } = req.body;

    if (!userName || !password)
        res.status(422).send({ error: 'Must provide username and password' });

    const user = await User.findOne({ userName });

    if (!user)
        res.status(422).send({ error: 'Invalid username or password a' });

    try {
        await user.comparePassword(password);
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);

        res.send({ token });
    } catch (error) {
        return res.status(422).send({ error: 'Invalid username or password b' });
    }
});

module.exports = router;