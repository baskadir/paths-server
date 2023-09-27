const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Path = mongoose.model('Path');

const router = express.Router();

router.use(requireAuth);

router.get('/paths', async (req, res) => {
    const paths = await Path.find({ userId: req.user._id })

    res.send(paths);
});

router.post('/paths', async (req, res) => {
    const { name, locations } = req.body;

    if (!name || !locations)
        return res.status(422).send({ error: 'Must provide a name and locations' });

    try {
        const path = new Path({ name, locations, userId: req.user._id });
        await path.save();

        res.send(path);
    } catch (error) {
        return res.status(422).send({ error: error.message })
    }
});

module.exports = router;