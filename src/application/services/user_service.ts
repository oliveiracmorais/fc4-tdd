import { User } from "../../domain/entities/user";
import { UserRepository } from "../../domain/repositories/user_repository";
import { createUserDTO } from "../dtos/create_user_dto";

export class UserService {
  private readonly userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }
  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async createUser(dto: createUserDTO): Promise<User> {
    const user = new User(dto.id, dto.name);
    await this.userRepository.save(user);
    return user;
  }

}
