import { Request, Response } from "express";
import userService from "../services/userService";

class UserController {
  async getAll(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();

      return res.json({
        success: true,
        data: users,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const user = await userService.getUserById(Number(req.params.id));

      return res.json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const result = await userService.deleteUser(Number(req.params.id));

      return res.json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new UserController();