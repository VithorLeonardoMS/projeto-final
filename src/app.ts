import "reflect-metadata";
import "express-async-errors";
import express from "express";
import cors from "cors";
import path from "path";
import { routes } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { initializeDatabase } from "./database/connection";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    this.errorHandling();
    this.database();
  }

  private middlewares(): void {
    this.app.use(express.json());
    this.app.use(cors());
    // Serve static files from the 'src/view' directory
    this.app.use(express.static(path.join(__dirname, "view")));
    this.app.use(
      "/uploads",
      express.static(path.join(__dirname, "..", "uploads"))
    );
  }

  private routes(): void {
    this.app.use(routes);
  }

  private errorHandling(): void {
    this.app.use(errorHandler);
  }

  private async database(): Promise<void> {
    await initializeDatabase();
  }
}

export default new App().app;
