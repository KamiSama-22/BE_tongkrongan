import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

interface LoginDTO {
  email: string;
  password: string;
}

interface RegisterDTO {
  username: string;
  email: string;
  password: string;
  role: Role;
}

class AuthService {
  
  // ===================================
  // FUNGSI REGISTER YANG HILANG
  // ===================================
  async register(data: RegisterDTO) {
    const { username, email, password, role } = data;

    // 1. Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email sudah terdaftar!");
    }

    // 2. Hash password (enkripsi)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Simpan user baru ke database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role || "PENGGUNA", // Default jika role tidak dikirim
      },
    });

    // Hilangkan password dari response demi keamanan
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  // ===================================
  // FUNGSI LOGIN
  // ===================================
  async login(credentials: LoginDTO) {
    const { email, password } = credentials;

    // 1. Cari user di database beserta relasi ke tenant-nya
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { tenant: true } // Mengambil relasi tenant
    });

    if (!user) throw new Error("Email tidak terdaftar");

    // 2. Verifikasi password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Password salah");

    // 3. Ambil tenantId secara dinamis
    const tenantId = user.role === 'SUPER_ADMIN' ? null : (user as any).tenant?.id || null;

    // 4. Generate Token
    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role, 
        tenantId: tenantId 
      },
      "rahasia123",
      { expiresIn: "24h" }
    );

    return { 
      token, 
      user: { 
        id: user.id, 
        username: user.username, 
        role: user.role,
        tenantId: tenantId 
      } 
    };
  }
}

export default new AuthService();