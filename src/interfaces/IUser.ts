import { Course } from "../models/Course";
import { IClasses } from "./IClasses";
import { Reaction } from "../models/Reaction";
import { ICourse } from "./ICourse";
import { IReaction } from "./IReaction";

export interface IUser {
  id?: number;
  name: string;
  email: string;
  password: string;
  profileUrl?: string;
  // createdCourses?: ICourse[];
  // reactions: IReaction[];
}

export interface IRequestUser {
  id?: number;
  name: string;
  email: string;
  password: string;
  profileUrl?: string;
  // createdCoursesIds: number[];
  // reactionsIds: number[];
}

export interface IUserRepository {
  create(data: IUser): Promise<IUser>;
  findById(id: number): Promise<IUser | null>;
  update(id: number, data: IUser): Promise<IUser>;
  delete(id: number): Promise<void>;
  //getReactions()            |
  //getReactionById()         |
  //getAllCreatedCourses()    |
  //getCreatedCourseById()    | Implementar
}
