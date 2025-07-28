import { IReaction, IReactionRepository, IRequestReaction } from "../interfaces/IReaction";
import { Classes } from "../models/Classes";
import { Course } from "../models/Course";
import { ClassesRepository } from "../repositories/ClassesRepository";
import { CourseRepository } from "../repositories/CourseRepository";
import { ReactionRepository } from "../repositories/ReactionRepository";
import { UserRepository } from "../repositories/UserRepository";
import { AppError } from "../utils/AppError";


export class CourseService {
  private courseRepository: CourseRepository;
  private classRepository: ClassesRepository;
  private userRepository: UserRepository;

  constructor() {
    this.courseRepository = new CourseRepository();
    this.classRepository = new ClassesRepository();
  }

  async createReaction(data: IRequestReaction): Promise<IReaction> {
    const localError = "Error in CourseService.createCourse()."
    this.validateReactionData(data);
    let classe;
    let course;

    if (data.classeId) {
        classe = await this.classRepository.findById(data.classeId);
        if(!classe){
            throw new AppError(`classe not found. classeId: ${data.classeId}`)
        }
    } else if(data.courseId){
        course = await this.classRepository.findById(data.courseId)
        if(!course){
            throw new AppError(`course not found. courseId: ${data.courseId}`)
        }
    } else{
        throw new AppError(`${localError}  Either courseId or classId is required`, 400);
    }

    let user = await this.userRepository.findById(data.userId);

    if(!user){
      throw new AppError(`${localError} User not found. userId: ${data.userId}`, 404)
    }

    const courseData:ICourse = {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      externalLink: data.externalLink,
      classes: classes, // Atribui as aulas encontradas ao curso
      userCreator: userCreator
    };
    return await this.courseRepository.create(courseData);
  }

  async getCourseById(id: number): Promise<ICourse> {
    const course = await this.courseRepository.findById(id);

    if (!course) {
      throw new AppError("Course not found", 404);
    }

    return course;
  }

  async getAllCourses(): Promise<ICourse[]> {
    return await this.courseRepository.findAll();
  }

  async updateCourse(id: number, data: IRequestCourse): Promise<ICourse> {
    this.validateReactionData(data);
    // Obtenha os IDs das aulas e busque as aulas correspondentes no banco
    let classes;
    if (data.classesId && data.classesId.length > 0) {
      classes = await this.classRepository.findByIds(data.classesId); // Supondo que exista um repositório para Classes
    }

    let userCreator = await this.userRepository.findById(data.userId)

    if(!userCreator){
      throw new AppError(`Error in CourseService.createCourse() -> User not found. userId: ${data.userId}`, 404)
    }

    const courseData:ICourse = {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      externalLink: data.externalLink,
      classes: classes, // Atribui as aulas encontradas ao curso
      userCreator: userCreator
    };
    return await this.courseRepository.update(id, courseData);
  }

  async deleteCourse(id: number): Promise<void> {
    await this.courseRepository.delete(id);
  }

  /**
   * Valida os dados do usuário, garantindo que estejam corretos.
   */
  private validateReactionData(data: IRequestReaction): void {
    if (!data.userId) {
      throw new AppError("userId is required", 400);
    }

    if (!data.reaction) {
      throw new AppError("reactionId is required", 400);
    }

    if (!data.courseId || !data.classeId) {
      throw new AppError("Either courseId or classId is required", 400);
    }

  }
}
