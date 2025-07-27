import { IUser, IRequestUser } from "../interfaces/IUser";
import { UserRepository } from "../repositories/UserRepository";
import { AppError } from "../utils/AppError";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, "..", "..", "uploads");

    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename using timestamp and original name
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
  },
});

// File filter function to validate file types
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.")
    );
  }
};

// Create multer upload instance
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB size limit
  },
});

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(
    data: IRequestUser,
    profileImage?: Express.Multer.File
  ): Promise<IUser> {
    this.validateUserData(data);

    const userData: IUser = {
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      profileUrl: profileImage
        ? `/uploads/${profileImage.filename}`
        : data.profileUrl,
    };
    return await this.userRepository.create(userData);
  }

  async uploadProfilePicture(
    userId: number,
    file: Express.Multer.File
  ): Promise<IUser> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Delete old profile picture if exists
    if (user.profileUrl && user.profileUrl.startsWith("/uploads/")) {
      const oldProfilePath = path.join(__dirname, "..", "..", user.profileUrl);
      if (fs.existsSync(oldProfilePath)) {
        fs.unlinkSync(oldProfilePath);
      }
    }

    // Update user with new profile picture URL
    const updatedUser = await this.userRepository.update(userId, {
      ...user,
      profileUrl: `/uploads/${file.filename}`,
    });

    return updatedUser;
  }

  async getUserById(id: number): Promise<IUser> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  async getAllUsers(): Promise<IUser[]> {
    return await this.userRepository.findAll();
  }

  async updateUser(
    id: number,
    data: IRequestUser,
    profileImage?: Express.Multer.File
  ): Promise<IUser> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    this.validateUpdateUserData(data);

    // Handle profile image if provided
    let profileUrl = data.profileUrl;
    if (profileImage) {
      console.log("AQUI", user);

      // Delete old profile image if exists
      if (user.profileUrl && user.profileUrl.startsWith("/uploads/")) {
        const oldProfilePath = path.join(
          __dirname,
          "..",
          "..",
          user.profileUrl
        );
        if (fs.existsSync(oldProfilePath)) {
          fs.unlinkSync(oldProfilePath);
        }
      }
      profileUrl = `/uploads/${profileImage.filename}`;
    }

    const userData: IUser = {
      name: data.name,
      email: data.email,
      password: data.password,
      profileUrl: profileUrl,
    };

    return await this.userRepository.update(id, userData);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Delete user's profile picture if exists
    if (user.profileUrl && user.profileUrl.startsWith("/uploads/")) {
      const profilePath = path.join(__dirname, "..", "..", user.profileUrl);
      if (fs.existsSync(profilePath)) {
        fs.unlinkSync(profilePath);
      }
    }

    await this.userRepository.delete(id);
  }

  /**
   * Valida os dados do usuário, garantindo que estejam corretos.
   */
  private validateUserData(data: IRequestUser): void {
    if (!data.name || data.name.trim() === "") {
      throw new AppError("Name is required", 400);
    }

    if (!data.email || data.email.trim() === "") {
      throw new AppError("Email is required", 400);
    }

    if (!data.password || data.password.trim() === "") {
      throw new AppError("Password is required", 400);
    }
  }

  private validateUpdateUserData(data: IRequestUser): void {
    if (!data.name || data.name.trim() === "") {
      throw new AppError("Name is required", 400);
    }

    if (!data.email || data.email.trim() === "") {
      throw new AppError("Email is required", 400);
    }

    if (!data.password || data.password.trim() === "") {
      throw new AppError("Password is required", 400);
    }
  }
}
