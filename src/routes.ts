import { Router } from "express";
import { CourseController } from "./controllers/CourseController";
import { ClassesController } from "./controllers/ClassesController"; // Importa o novo controlador
import { UserController } from "./controllers/UserController";

const routes = Router();
const courseController = new CourseController();
const classesController = new ClassesController(); // Cria uma instância do controlador de aulas
const userController = new UserController();

routes.get("/users", userController.findAll);
routes.post("/users", userController.create);
routes.get("/users/:id", userController.findById);
routes.put("/users/:id", userController.update);
routes.delete("/users/:id", userController.delete);
routes.post("/usersLogin", userController.login);

// Rotas para cursos
routes.post("/cursos", (req, res) => courseController.create(req, res));
routes.get("/cursos/:id", (req, res) => courseController.findById(req, res));
routes.get("/cursos", (req, res) => courseController.findAll(req, res));
routes.put("/cursos/:id", (req, res) => courseController.update(req, res));
routes.delete("/cursos/:id", (req, res) => courseController.delete(req, res));

// Rotas para aulas
routes.post("/aulas", (req, res) => classesController.create(req, res)); // Criar aula
routes.get("/aulas/:id", (req, res) => classesController.findById(req, res)); // Obter aula por ID
routes.get("/aulas", (req, res) => classesController.findAll(req, res)); // Obter todas as aulas
routes.put("/aulas/:id", (req, res) => classesController.update(req, res)); // Atualizar aula
routes.delete("/aulas/:id", (req, res) => classesController.delete(req, res)); // Deletar aula

export { routes };
