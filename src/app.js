import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler.middleware.js';
import path from 'path';

const app = express();

app.use(cors({
    origin: process.env.ORIGIN || '*',
    credentials: true
}));
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));


//Routes Imports
import productRouter from "./routes/product.routes.js"
import categoryRoutes from "./routes/category.routes.js";
import brandRoutes from "./routes/brand.routes.js";
import fileRoutes from "./routes/file.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import wishListRoutes from "./routes/wishList.routes.js";
import returnRoutes from "./routes/return.routes.js";
import orderRoutes from "./routes/order.routes.js";
import userRoutes from "./routes/user.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import locationRoutes from "./routes/location.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import variantRoutes from "./routes/productVariant.routes.js";
import shipmentRoutes from "./routes/shipment.routes.js";



// API Routes
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlists", wishListRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/variants", variantRoutes);
app.use("/api/shipments", shipmentRoutes);

// Health Check Endpoint

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'healthy', message: "Backend is Running!!" });
});

// Error handler should be after all routes
app.use(errorHandler);

export { app }  