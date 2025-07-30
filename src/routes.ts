import { Router } from "express";
import { CourseController } from "./controllers/CourseController";
import { ClassesController } from "./controllers/ClassesController"; // Importa o novo controlador
import { UserController } from "./controllers/userController";
import { upload } from "./services/UserService"; // Import the upload middleware
import { ReactionController } from "./controllers/ReactionController";

const routes = Router();
const courseController = new CourseController();
const classesController = new ClassesController(); // Cria uma instância do controlador de aulas
const userController = new UserController();
const reactionController = new ReactionController();

routes.get("/users", userController.findAll);
routes.post("/users", upload.single("profileImage"), userController.create); // Add upload middleware
routes.get("/users/:id", userController.findById);
routes.put("/users/:id", upload.single("profileImage"), userController.update); // Add upload middleware
routes.delete("/users/:id", userController.delete);
routes.post("/usersLogin", userController.login);

// Rotas para cursos
routes.post("/cursos", (req, res) => courseController.create(req, res));
routes.get("/cursos/:id", (req, res) => courseController.findById(req, res));
routes.put("/cursos/:id", (req, res) => courseController.update(req, res));
routes.delete("/cursos/:id", (req, res) => courseController.delete(req, res));

// Busca e listagem geral em uma mesma rota
routes.get("/cursos", async (req, res) => {
  const { search } = req.query;
  if (search) {
    return courseController.findByTitle(req, res);
  } else {
    return courseController.findAll(req, res);
  }
});

  


// Rotas para aulas
routes.post("/aulas", (req, res) => classesController.create(req, res)); // Criar aula
routes.get("/aulas/:id", (req, res) => classesController.findById(req, res)); // Obter aula por ID
routes.get("/aulas", (req, res) => classesController.findAll(req, res)); // Obter todas as aulas
routes.put("/aulas/:id", (req, res) => classesController.update(req, res)); // Atualizar aula
routes.delete("/aulas/:id", (req, res) => classesController.delete(req, res)); // Deletar aula

export { routes };


//Rotas para Reaction
routes.post("/reaction", (req, res) => reactionController.create(req,res))
routes.get("/reaction", (req, res) => reactionController.findById(req,res))

