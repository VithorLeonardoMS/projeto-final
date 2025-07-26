import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinTable,
  ManyToOne,
} from "typeorm";
import { ICourse } from "../interfaces/ICourse";
import { IClasses } from "../interfaces/IClasses";
import { Classes } from "./Classes";
import { Reaction } from "./Reaction";
import { User } from "./User";
import { IUser } from "../interfaces/IUser";
import { IReaction } from "../interfaces/IReaction";

@Entity("courses")
export class Course implements ICourse {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => Classes, (classes) => classes.courses)
  @JoinTable() // Associa tabela para gerenciar a relação muitos-para-muitos
  classes: IClasses[]; // Relacionamento muitos-para-muitos com aulas

  @Column()
  title: string;

  @Column("text")
  description: string;

  @Column()
  imageUrl: string;

  @Column({ nullable: true })
  externalLink?: string;
}
