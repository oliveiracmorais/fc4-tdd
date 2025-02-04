import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";

export class PropertyMapper {
  static toDomain(entity: PropertyEntity): Property {
    if (!entity.id) {
      throw new Error("O ID da propriedade é obrigatório.");
    }
    if (!entity.name) {
      throw new Error("O nome é obrigatório.");
    }
    if (!entity.description) {
      throw new Error("A descrição é obrigatória.");
    }
    if (!entity.maxGuests) {
      throw new Error("O número máximo de hóspedes é obrigatório.");
    }
    if (entity.basePricePerNight <= 0) {
      throw new Error("O preço por noite é obrigatório.");
    }
    return new Property(
      entity.id,
      entity.name,
      entity.description,
      entity.maxGuests,
      Number(entity.basePricePerNight)
    );

  }

  static toPersistence(domain: Property): PropertyEntity {
    if (!domain.getId()) {
      throw new Error("O ID da propriedade é obrigatório.");
    }
    if (!domain.getName()) {
      throw new Error("O nome é obrigatório.");
    }
    if (!domain.getDescription()) {
      throw new Error("A descrição é obrigatória.");
    }

    if (domain.getMaxGuests() <= 0) {
      throw new Error("O número máximo de hóspedes deve ser maior que zero");
    }

    if (domain.getBasePricePerNight() <= 0) {
      throw new Error("o preço base por noite deve ser maior do que zero");
    }

    const persistence = new PropertyEntity();
    persistence.id = domain.getId();
    persistence.name = domain.getName();
    persistence.description = domain.getDescription();
    persistence.maxGuests = domain.getMaxGuests();
    persistence.basePricePerNight = domain.getBasePricePerNight();
    return persistence;
  }
}
