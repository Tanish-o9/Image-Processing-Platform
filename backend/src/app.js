require('dotenv').config();
const express=require('express');
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes =require("./routes/authroutes");
const imageRoutes =require("./routes/imageroutes");
const historyRoutes =require("./routes/historyroutes");
const analysisRoutes =require("./routes/analysisroutes");
const {notFound,errorHandler} = require("./middleware/errormiddleware");


const app = express();
app.set("trust proxy", 1);
// security
app.use(helmet());
// cors
app.use(cors({
        origin: process.env.CLIENT_URL || true,
        credentials: true
    })
);

// body parser
app.use(express.json({
    limit:"10mb"
}));

app.use(express.urlencoded({
        extended: true,
        limit:"10mb"
    })
);
// logging
app.use(morgan("dev"));

// health check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "ImageRise API is running"
    });
});

// auth route
app.use("/api/auth",authRoutes);
// image route
app.use("/api/images",imageRoutes);
// history route
app.use("/api/history",historyRoutes);
// ml routes
app.use("/api/analysis", analysisRoutes);

app.use(notFound);
app.use(errorHandler);
module.exports = app;
