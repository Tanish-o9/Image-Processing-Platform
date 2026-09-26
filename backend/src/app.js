require('dotenv').config();
const express=require('express');
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes =require("./routes/authroutes");
const {notFound,errorHandler} = require("./middleware/errormiddleware");


const app = express();
// security
app.use(helmet());
// cors
app.use(cors({
        origin: process.env.CLIENT_URL || true,
        credentials: true
    })
);

// body parser
app.use(express.json());

app.use(express.urlencoded({
        extended: true
    })
);
// logging
app.use(morgan("dev"));

// health check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "ImageForge API is running"
    });
});

// auth route
app.use("/api/auth",authRoutes);

app.use(notFound);
app.use(errorHandler);
module.exports = app;