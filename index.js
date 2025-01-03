const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const dbConnect = require('./config/dbConnect');
dotenv = require('dotenv').config();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
dbConnect();