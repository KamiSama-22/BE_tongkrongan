import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import routes from "./routes";
import authRoutes from "./routes/authRoutes";
import testRoutes from "./routes/testRoutes";
import userRoutes from "./routes/userRoutes";
import tenantRoutes from "./routes/tenantRoutes";
import kategoriRoutes from "./routes/kategoriRoutes";
import subKategoriRoutes from "./routes/subkategoriRoutes";
import menuRoutes from "./routes/menuRoutes";
import galeriRoutes from "./routes/galeriRoutes";
import fasilitasRoutes from "./routes/fasilitasRoutes";
import kepemilikanRoutes from "./routes/kepemilikanRoutes";
import tenantNilaiRoutes from "./routes/tenantnilaiRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import path from "path";
import spkRoutes from "./routes/spkRoutes";


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
app.use("/api/kategori", kategoriRoutes);
app.use("/api/sub-kategori", subKategoriRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/galeri", galeriRoutes);
app.use("/api/fasilitas", fasilitasRoutes);
app.use("/api/kepemilikan", kepemilikanRoutes);
app.use("/api/tenant-nilai", tenantNilaiRoutes);
app.use("/api/review", reviewRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/spk", spkRoutes);

export default app;