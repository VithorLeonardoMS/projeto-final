import { Repository } from "typeorm";
import { AppDataSource } from "../database/connection";
import { AppError } from "../utils/AppError";
import { IUser, IUserRepository } from "../interfaces/IUser";
import { User } from "../models/User";

export class UserRepository implements IUserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async create(data: IUser): Promise<IUser> {
    const course = this.repository.create(data);
    await this.repository.save(course);
    return course;
  }

  async findById(id: number): Promise<IUser | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async findAll(): Promise<IUser[]> {
    return await this.repository.find();
  }

  async update(id: number, data: IUser): Promise<IUser> {
    const result = await this.repository.update(id, data);
    return result as any;
  }

  async delete(id: number): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new AppError("User not found", 404);
    }
  }
}
