import { Booking } from "../../../domain/entities/booking";
import { Property } from "../../../domain/entities/property";
import { DateRange } from "../../../domain/value_objects/date_range";
import { BookingEntity } from "../entities/booking_entity";
import { PropertyMapper } from "./property_mapper";
import { UserMapper } from "./user_mapper";

export class BookingMapper {
  static toDomain(entity: BookingEntity, property?: Property): Booking {

    if (!entity.id) {
      throw new Error("O ID do BookingEntity é obrigatório.");
    }

    if (!entity.property) {
      throw new Error("A propriedade é obrigatória.");
    }

    if (!entity.guest) {
      throw new Error("O usuário é obrigatório.");
    }

    if (!entity.startDate) {
      throw new Error("A data de ínicio da reserva é obrigatória.");
    }

    if (!entity.endDate) {
      throw new Error("A data de término da reserva é obrigatória.");
    }

    if (entity.guestCount == 0) {
      throw new Error("A quantidade de hóspedes é obrigatória.");
    }
    if (entity.totalPrice <= 0) {
      throw new Error("O preço total é obrigatório.");
    }

    const guest = UserMapper.toDomain(entity.guest);
    const dateRange = new DateRange(entity.startDate, entity.endDate);

    const booking = new Booking(
      entity.id,
      property || PropertyMapper.toDomain(entity.property),
      guest,
      dateRange,
      entity.guestCount
    );

    booking["totalPrice"] = Number(entity.totalPrice);
    booking["status"] = entity.status;

    return booking;
  }

  static toPersistence(domain: Booking): BookingEntity {
    if (!domain.getId()) {
      throw new Error("O ID do Booking não é válido.");
    }
    if (!domain.getGuest().getId() || isNaN(+domain.getGuest().getId()) || +domain.getGuest().getId() <= 0) {
      throw new Error("O ID do usuário não é válido.");
    }
    if (!domain.getProperty().getId() || isNaN(+domain.getProperty().getId()) || +domain.getProperty().getId() <= 0) {
      throw new Error("O ID da propriedade não é nválido.");
    }
    if (domain.getDateRange().getStartDate() > domain.getDateRange().getEndDate()) {
      throw new Error("A data de inicio da reserva não pode ser posterior à data final.");
    }
    if (domain.getGuestCount() <= 0) {
      throw new Error("A quantidade de hóspedes deve ser maior ou igual a 1.");
    }
    if (domain.getTotalPrice() <= 0) {
      throw new Error("O preco total deve ser maior que zero.");
    }

    const entity = new BookingEntity();
    entity.id = domain.getId();
    entity.property = PropertyMapper.toPersistence(domain.getProperty());
    entity.guest = UserMapper.toPersistence(domain.getGuest());
    entity.startDate = domain.getDateRange().getStartDate();
    entity.endDate = domain.getDateRange().getEndDate();
    entity.guestCount = domain.getGuestCount();
    entity.totalPrice = domain.getTotalPrice();
    entity.status = domain.getStatus();
    return entity;
  }
}
