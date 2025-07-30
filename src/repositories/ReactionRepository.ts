import { In, Repository } from "typeorm";
import { Reaction } from "../models/Reaction";
import { AppDataSource } from "../database/connection";
import { IReaction } from "../interfaces/IReaction";
import { AppError } from "../utils/AppError";


export class ReactionRepository{
    private repository: Repository<Reaction>

    constructor(){
        this.repository = AppDataSource.getRepository(Reaction);
    }

    async create(data:IReaction):Promise<Reaction>{
        const reaction = this.repository.create(data);
        await this.repository.save(reaction);
        return reaction
    }

    async findById(id:number): Promise<Reaction | null>{
        return await this.repository.findOne({
            where: { id },
            relations: ["classes, user, course"]
        })
    }

    async findByIds(ids: number[]):Promise<Reaction[]>{
        return await this.repository.find({
            where:{
                id: In([ids])
            },
            relations: ["classes, user, course"]
        })
    }

    /**
   * 
   * @returns Retorna todas as Reactions e suas relações.
   */
    async findAll():Promise<IReaction[]>{
        return await this.repository.find({
            relations: ["classes, user, course"]
        })
    }

    async update(id: number, data: IReaction):Promise<IReaction>{
        const result = await this.repository.update(id, data);
        if (result.affected === 0) {
            throw new AppError("Course not found", 404);
          }
        
        const updatedReaction = await this.findById(id);

        if (!updatedReaction) {
            throw new AppError("Error retrieving updated reaction", 500);
        }

        return updatedReaction;
    }

    async delete(id:number): Promise<void> {
        const result = await this.repository.delete(id);
        if(result.affected === 0) 
        throw new AppError("Reaction not found", 404);
    }
}