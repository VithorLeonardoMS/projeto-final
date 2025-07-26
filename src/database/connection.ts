import { DataSource } from "typeorm";
import { Course } from "../models/Course";
import path from "path";
import "dotenv/config";
import { Classes } from "../models/Classes";
import { User } from "../models/User";
import { Reaction } from "../models/Reaction";
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "courses_db",
  entities: [Course, Classes, User, Reaction],
  migrations: [path.join(__dirname, "./migrations/*.{js,ts}")],
  synchronize: true,
  // logging: process.env.NODE_ENV === "development",
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established successfully");
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }
};
