import { Request, Response, NextFunction } from "express"; // Import wajib
import { verifyToken } from "../config/jwt";

// Mendefinisikan AuthRequest agar tidak merah
export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  console.log("--- MIDDLEWARE AUTHENTICATE DIJALANKAN ---"); 
  console.log("Headers Authorization:", req.headers.authorization);
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  // Split untuk mengambil token setelah "Bearer "
  const token = authHeader.split(" ")[1];

  try {
    // Verifikasi token
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error: any) {
    console.log("Error Verifikasi:", error.message);
    // Jika masih 401 di sini, berarti kuncinya tidak cocok
    return res.status(401).json({ message: "Token tidak valid" });
  }
};