import { Request, Response } from "express";
import { CourseService } from "../services/CourseService";
import { ICourse, IRequestCourse } from "../interfaces/ICourse";
import { CourseRepository } from "../repositories/CourseRepository";
import { Like } from "typeorm";


export class CourseController {
  private courseService: CourseService;
  private courseRepository: CourseRepository;

  constructor() {
    this.courseService = new CourseService();
    this.courseRepository = new CourseRepository();
  }

  async create(request: Request, response: Response): Promise<Response> {
    const courseData: IRequestCourse = request.body;
    const course = await this.courseService.createCourse(courseData);
    return response.status(201).json(course);
  }

  async findById(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const course = await this.courseService.getCourseById(Number(id));
    return response.json(course);
  }

  async findByTitle(req: Request, res: Response) {
    const search = req.query.search as string;
  
    if (!search) {
      return res.status(400).json({ message: "Search term is required." });
    }
  
    const courses = await this.courseRepository.findByTitle(search);
  
    return res.json(courses);
  }
  


  async findAll(request: Request, response: Response): Promise<Response> {
    const courses = await this.courseService.getAllCourses();
    return response.json(courses);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const courseData: IRequestCourse = request.body;
    const course = await this.courseService.updateCourse(
      Number(id),
      courseData
    );
    return response.json(course);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    await this.courseService.deleteCourse(Number(id));
    return response.status(204).send();
  }
}
