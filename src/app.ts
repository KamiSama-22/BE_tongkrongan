import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import routes from "./routes";
import authRoutes from "./routes/authRoutes";
import testRoutes from "./routes/testRoutes";
import userRoutes from "./routes/userRoutes";
import tenantRoutes from "./routes/tenantRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tenants", tenantRoutes);

export default app;