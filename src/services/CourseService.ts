import { ICourse, IRequestCourse } from "../interfaces/ICourse";
import { ClassesRepository } from "../repositories/ClassesRepository";
import { CourseRepository } from "../repositories/CourseRepository";
import { UserRepository } from "../repositories/UserRepository";
import { AppError } from "../utils/AppError";

/**
 * Permite separadamente um contrele maior de validação e tratamentos dos dados relacionados ao controller de forma organizada
 */
export class CourseService {
  private courseRepository: CourseRepository;
  private classRepository: ClassesRepository;
  private userRepository: UserRepository;

  constructor() {
    this.courseRepository = new CourseRepository();
    this.classRepository = new ClassesRepository();
  }

  async createCourse(data: IRequestCourse): Promise<ICourse> {
    this.validateCourseData(data);
    // Obtenha os IDs das aulas e busque as aulas correspondentes no banco

    const courseData: ICourse = {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      externalLink: data.externalLink,
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
    this.validateCourseData(data);
    // Obtenha os IDs das aulas e busque as aulas correspondentes no banco
    let classes;
    if (data.classesId && data.classesId.length > 0) {
      classes = await this.classRepository.findByIds(data.classesId); // Supondo que exista um repositório para Classes
    }

    const courseData: ICourse = {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      externalLink: data.externalLink,
    };
    return await this.courseRepository.update(id, courseData);
  }

  async deleteCourse(id: number): Promise<void> {
    await this.courseRepository.delete(id);
  }

  /**
   * Valida os dados do usuário, garantindo que estejam corretos.
   */
  private validateCourseData(data: IRequestCourse): void {
    if (!data.title || data.title.trim() === "") {
      throw new AppError("Title is required", 400);
    }

    if (!data.description || data.description.trim() === "") {
      throw new AppError("Description is required", 400);
    }

    if (!data.imageUrl || data.imageUrl.trim() === "") {
      throw new AppError("Image URL is required", 400);
    }
  }
}
