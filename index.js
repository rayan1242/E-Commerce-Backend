const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const dbConnect = require('./config/dbConnect');
const { notFound, ErrorHandler } = require('./middleware/errorHandler');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
dotenv = require('dotenv').config();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use(notFound);
app.use(ErrorHandler);
app.use()
app.use(morgan('dev'));
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
dbConnect();