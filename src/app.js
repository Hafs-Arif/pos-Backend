import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler.middleware.js';
const app = express();

app.use(cors({
    origin: (process.env.ORIGIN),
    credentials: true
}));
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(errorHandler)


//Routes Imports
import productRouter from "./routes/product.routes.js"
import categoryRoutes from "./routes/category.routes.js";
import brandRoutes from "./routes/brand.routes.js";

// API Routes
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);

app.get('/api/health', (req, res) => {
    console.log("Backend is Running!!");
});

export { app }