require('./models/User');
require('./models/Path');

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;

const authRoutes = require('./routes/authRoutes');
const pathRoutes = require('./routes/pathRoutes');
const requireAuth = require('./middlewares/requireAuth');

const app = express();

app.use(bodyParser.json());
app.use(authRoutes);
app.use(pathRoutes);

const mongoUri = process.env.MONGO_URI

mongoose.connect(mongoUri);

mongoose.connection.on('connected', () => {
    console.log("Connected to mongo instance");
});

mongoose.connection.on('error', (error) => {
    console.log('Error connection to mongo instance : ', error);
});

app.get('/', requireAuth, (req, res) => {
    res.send(`Your email : ${req.user.email}`);
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});