import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./src/db/db.js";
import incidentRoutes from "./src/routes/incident.routes.js";
import unitRoutes from "./src/routes/unit.routes.js";
import metricsRoutes from "./src/routes/metrics.routes.js";


const PORT = process.env.PORT || 9091;
const app = express();
app.use(cors(
    {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
    }
));
app.use(express.json());

connectDB()
.then(() => {
    console.log("Database connection established");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((err) => {
    console.error("Database connection error:", err);
});


app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use("/api/incidents", incidentRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/metrics", metricsRoutes);