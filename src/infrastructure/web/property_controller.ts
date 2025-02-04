import { CreatePropertyDTO } from "../../application/dtos/create_property_dto";
import { PropertyService } from "../../application/services/property_service";
import { Request, Response } from "express";

export class PropertyController {

    private propertyService: PropertyService

    constructor(propertyService: PropertyService) {
        this.propertyService = propertyService
    }

    async createProperty(req: Request, res: Response): Promise<Response> {
        try {
            if (req.body.name === "") {
                return res.status(400).json({ message: "O nome da propriedade é obrigatório." });
            }
            if (+req.body.maxGuests <= 0) {
                return res.status(400).json({ message: "A capacidade máxima deve ser maior que zero." });
            }
            if (+req.body.basePricePerNight <= 0) {
                return res.status(400).json({ message: "O preço base por noite é obrigatório." });
            }
            const dto: CreatePropertyDTO = {
                id: req.body.id,
                name: req.body.name,
                description: req.body.description,
                maxGuests: req.body.maxGuests,
                basePricePerNight: req.body.basePricePerNight
            }
            const property = await this.propertyService.createProperty(dto);
            return res.status(201).json({
                message: "Propriedade criada com sucesso.",
                propriedade: {
                    id: property.getId(),
                    name: property.getName(),
                    description: property.getDescription(),
                    maxGuests: property.getMaxGuests(),
                    basePricePerNight: property.getBasePricePerNight(),
                }
            });
        } catch (error: any) {
            return res.status(400).json({ message: error.message || "Unexpected error." });
        }
    }

}
