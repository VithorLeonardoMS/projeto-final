import { Request, Response } from "express";
import { AppDataSource } from "../database/connection";
import { User } from "../models/User";
import bcryptjs from "bcryptjs";
import { UserService } from "../services/UserService";
import { IRequestUser } from "../interfaces/IUser";
import { AppError } from "../utils/AppError";

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService();

export class UserController {
  constructor() {}

  /**
   * @param req
   * @param res
   * @returns -> Retorna o usuario criado
   */

  async create(req: Request, res: Response): Promise<Response> {
    const userData: IRequestUser = req.body;

    const user = await userService.createUser(userData);

    return res.status(201).json(user);
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    const users = await userService.getAllUsers();
    return res.json(users);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Usuário e senha devem ser informados", 400);
    }

    const user = await userRepository.findOneBy({ email });

    if (!user) {
      throw new AppError("Usuario não encontrado", 404);
    }

    // const isValid = await bcryptjs.compare(password, user.password);

    if (user.password !== password) {
      throw new AppError("Senha inválida", 401);
    }

    return res.status(200).json({
      message: "Login bem-sucedido",
      id: user.id, // ESSENCIAL para salvar no localStorage
      user,
    });
  }

  // Buscar usuário por ID
  async findById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const user = await userService.getUserById(Number(id));
    return res.json(user);
  }

  // Atualizar usuário
  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const courseData: IRequestUser = req.body;
    const course = await userService.updateUser(Number(id), courseData);
    return res.json(course);
  }

  // Deletar usuário
  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    await userService.deleteUser(Number(id));
    return res.status(204).send();
  }
}
