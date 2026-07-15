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
import galeriRoutes from "./routes/galeriRoutes";
import fasilitasRoutes from "./routes/fasilitasRoutes";
import kepemilikanRoutes from "./routes/kepemilikanRoutes";
import tenantNilaiRoutes from "./routes/tenantnilaiRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import path from "path";
import spkRoutes from "./routes/spkRoutes";
import menuRoute from "./routes/menuRoutes";
import prisma from "./config/prisma";



dotenv.config();

const app = express();
app.use((req, res, next) => {
  console.log(`[LOG] Masuk request: ${req.method} ${req.url}`);
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/api/public/tenants", async (req, res) => {
  try {
    const data = await prisma.tenant.findMany(); // Ambil semua tenant dari database
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal ambil data" });
  }
});

// Tambahkan kode ini di bawah route /public/tenants yang sudah ada
// Ganti bagian app.get("/public/tenants/:id", ...) dengan ini:
app.get("/api/public/tenants/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await prisma.tenant.findUnique({
      where: { id: parseInt(id) },
      include: {
        menus: true, // Relasi langsung
        kepemilikan: { // Relasi melalui tabel join
          include: {
            fasilitas: true // Mengambil data fasilitas dari join table
          }
        },
        reviews: true // Relasi langsung
      }
    });

    if (!data) return res.status(404).json({ message: "Tenant tidak ditemukan" });
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.use("/", routes);
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/kategori", kategoriRoutes);
app.use("/api/sub-kategori", subKategoriRoutes);
app.use("/api/menus", menuRoute);
app.use("/api/galeris", galeriRoutes);
app.use("/api/fasilitas", fasilitasRoutes);
app.use("/api/kepemilikan", kepemilikanRoutes);
app.use("/api/tenant-nilai", tenantNilaiRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/spk", spkRoutes);

export default app;