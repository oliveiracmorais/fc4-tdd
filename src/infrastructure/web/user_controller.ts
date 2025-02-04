import { createUserDTO } from "../../application/dtos/create_user_dto";
import { UserService } from "../../application/services/user_service";
import { Request, Response } from "express";

export class UserController {

    private userService: UserService

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async createUser(req: Request, res: Response): Promise<Response> {
        try {
            const dto: createUserDTO = {
                id: req.body.id,
                name: req.body.name
            }
            const user = await this.userService.createUser(dto);
            return res.status(201).json({
                message: "Usuário criado com sucesso.",
                usuario: {
                    id: user.getId(),
                    name: user.getName()
                }
            });
        } catch (error: any) {
            return res.status(400).json({ message: error.message || "Unexpected error." });
        }
    }
}
