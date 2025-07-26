import { In, Repository } from "typeorm";
import { Classes } from "../models/Classes"; // Certifique-se de que o caminho esteja correto
import { AppDataSource } from "../database/connection"; // Ajuste conforme necessário
import { IClasses, IClassesRepository } from "../interfaces/IClasses";
import { AppError } from "../utils/AppError";

export class ClassesRepository implements IClassesRepository {
  private repository: Repository<Classes>;

  constructor() {
    this.repository = AppDataSource.getRepository(Classes); // Obtém o repositório para a entidade Classes
  }

  async create(data: IClasses): Promise<IClasses> {
    const classEntity = this.repository.create(data); // Cria uma nova entidade a partir dos dados
    await this.repository.save(classEntity); // Salva a entidade no banco de dados
    return classEntity;
  }

  async findById(id: number): Promise<IClasses | null> {
    return await this.repository.findOne({ where: { id } }); // Retorna a aula com o ID fornecido
  }

  async findByIds(ids: number[]): Promise<IClasses[]> {
    return await this.repository.findBy({
      id: In([ids])
    }); // Retorna as aulas correspondentes aos IDs fornecidos
  }

  async findAll(): Promise<IClasses[]> {
    return await this.repository.find(); // Retorna todas as aulas
  }

  async update(id: number, data: IClasses): Promise<IClasses> {
    const result = await this.repository.update(id, data); // Atualiza a aula com o ID fornecido

    if (result.affected === 0) {
      throw new Error("Class not found");
    }

    const updatedClasses = await this.findById(id);

    if (!updatedClasses) {
      throw new AppError("Error retrieving updated classes", 500);
    }

    return updatedClasses;
  }

  async delete(id: number): Promise<void> {
    const result = await this.repository.delete(id); // Deleta a aula com o ID fornecido

    if (result.affected === 0) {
      throw new Error("Class not found");
    }
  }
}
