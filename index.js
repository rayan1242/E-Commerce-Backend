const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const dbConnect = require('./config/dbConnect');
const { notFound, ErrorHandler } = require('./middleware/errorHandler');
dotenv = require('dotenv').config();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use(notFound);
app.use(ErrorHandler);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
dbConnect();