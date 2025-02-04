import { UserMapper } from "./user_mapper";
import { PropertyMapper } from "./property_mapper";
import { BookingMapper } from "./booking_mapper";
import { User } from "../../../domain/entities/user";
import { UserEntity } from "../entities/user_entity";
import { Property } from "../../../domain/entities/property";
import { Booking } from "../../../domain/entities/booking";
import { BookingEntity } from "../entities/booking_entity";
import { PropertyEntity } from "../entities/property_entity";
import { DateRange } from "../../../domain/value_objects/date_range";


describe("Booking Mapper", () => {
    jest.mock("../../../domain/entities/user");
    jest.mock("../../../domain/entities/property");
    jest.mock("../../../domain/entities/booking");


    let mockUser: jest.Mocked<User>;
    let mockProperty: jest.Mocked<Property>;
    let userEntity: UserEntity;
    let propertyEntity: PropertyEntity;
    let bookingEntity: BookingEntity;


    beforeEach(async () => {
        userEntity = {
            id: "1",
            name: "Carlos"
        } as any

        propertyEntity = {
            id: "1",
            name: "Casa na Praia",
            description: "Vista para o mar",
            maxGuests: 6,
            basePricePerNight: 200
        } as any

        mockUser = {
            getId: jest.fn().mockReturnValue("1"),
            getName: jest.fn().mockReturnValue("Carlos")
        } as any
        mockProperty = {
            getId: jest.fn().mockReturnValue("1"),
            getName: jest.fn().mockReturnValue("Casa na Praia"),
            getDescription: jest.fn().mockReturnValue("Vista para o mar"),
            getMaxGuests: jest.fn().mockReturnValue(6),
            getBasePricePerNight: jest.fn().mockReturnValue(200),
            validateGuestCount: jest.fn(),
            validateTotalPrice: jest.fn().mockReturnValue(true),
            isAvailable: jest.fn().mockReturnValue(true),
            calculateTotalPrice: jest.fn().mockReturnValue(1200),
            addBooking: jest.fn()
        } as any

    });

    it("deve converter BookingEntity em Booking corretamente", () => {

        bookingEntity = {
            id: "1",
            property: propertyEntity,
            guest: userEntity,
            startDate: new Date("2024-12-20"),
            endDate: new Date("2024-12-25"),
            guestCount: 4,
            totalPrice: 1000,
            status: "CONFIRMED"
        } as any

        UserMapper.toDomain = jest.fn().mockReturnValue(mockUser);
        PropertyMapper.toDomain = jest.fn().mockReturnValue(mockProperty);
        const booking = BookingMapper.toDomain(bookingEntity);
        expect(UserMapper.toDomain).toHaveBeenCalledTimes(1);
        expect(PropertyMapper.toDomain).toHaveBeenCalledTimes(1);
        expect(booking.getId()).toBe("1");
        expect(booking.getProperty().getId()).toBe("1");
        expect(booking.getGuest().getId()).toBe("1");
        expect(booking.getDateRange().getStartDate()).toEqual(new Date("2024-12-20"));
        expect(booking.getDateRange().getEndDate()).toEqual(new Date("2024-12-25"));
        expect(booking.getGuestCount()).toBe(4);
        expect(booking.getTotalPrice()).toBe(1000);
        expect(booking.getStatus()).toBe("CONFIRMED");
    });

    it("deve lançar erro de validação ao faltar o ID no BookingEntity", () => {

        bookingEntity = {
            id: null,
            property: propertyEntity,
            guest: userEntity,
            startDate: new Date("2024-12-20"),
            endDate: new Date("2024-12-25"),
            guestCount: 4,
            totalPrice: 1000,
            status: "CONFIRMED"
        } as any

        expect(() => {
            BookingMapper.toDomain(bookingEntity, mockProperty);
        }).toThrow("O ID do BookingEntity é obrigatório.");
    });


    it("deve lançar erro de validação se a propriedade não for informada", () => {
        bookingEntity = {
            id: "1",
            property: null,
            guest: userEntity,
            startDate: new Date("2024-12-20"),
            endDate: new Date("2024-12-25"),
            guestCount: 4,
            totalPrice: 1000,
            status: "CONFIRMED"
        } as any
        userEntity.id = "0";

        expect(() => {
            BookingMapper.toDomain(bookingEntity)
        }).toThrow("A propriedade é obrigatória.");
    });

    it("deve lançar erro de validação se o usuario não for informado", () => {
        bookingEntity = {
            id: "1",
            property: propertyEntity,
            guest: null,
            startDate: new Date("2024-12-20"),
            endDate: new Date("2024-12-25"),
            guestCount: 4,
            totalPrice: 1000,
            status: "CONFIRMED"
        } as any
        userEntity.id = "0";

        expect(() => {
            BookingMapper.toDomain(bookingEntity)
        }).toThrow("O usuário é obrigatório.");
    });


    it("deve lançar erro de validação se a data de inicio da reserva nao for informada", () => {
        bookingEntity = {
            id: "1",
            property: propertyEntity,
            guest: userEntity,
            startDate: null,
            endDate: new Date("2024-12-25"),
            guestCount: 4,
            totalPrice: 1000,
            status: "CONFIRMED"
        } as any
        userEntity.id = "0";

        expect(() => {
            BookingMapper.toDomain(bookingEntity)
        }).toThrow("A data de ínicio da reserva é obrigatória.");
    });

    it("deve lançar erro de validação se a data de término da reserva nao for informada", () => {
        bookingEntity = {
            id: "1",
            property: propertyEntity,
            guest: userEntity,
            startDate: new Date("2024-12-20"),
            endDate: null,
            guestCount: 4,
            totalPrice: 1000,
            status: "CONFIRMED"
        } as any
        userEntity.id = "0";

        expect(() => {
            BookingMapper.toDomain(bookingEntity)
        }).toThrow("A data de término da reserva é obrigatória.");
    });


    it("deve lançar erro de validação se a quantidade de hóspedes nao for informada", () => {
        bookingEntity = {
            id: "1",
            property: propertyEntity,
            guest: userEntity,
            startDate: new Date("2024-12-20"),
            endDate: new Date("2024-12-25"),
            guestCount: 0,
            totalPrice: 1000,
            status: "CONFIRMED"
        } as any
        userEntity.id = "0";

        expect(() => {
            BookingMapper.toDomain(bookingEntity)
        }).toThrow("A quantidade de hóspedes é obrigatória.");
    });

    it("deve lançar erro de validação se o preço total nao for informado", () => {
        bookingEntity = {
            id: "1",
            property: propertyEntity,
            guest: userEntity,
            startDate: new Date("2024-12-20"),
            endDate: new Date("2024-12-25"),
            guestCount: 4,
            totalPrice: 0,
            status: "CONFIRMED"
        } as any
        userEntity.id = "0";

        expect(() => {
            BookingMapper.toDomain(bookingEntity)
        }).toThrow("O preço total é obrigatório.");
    });


    it("deve converter Booking para BookingEntity corretamente", () => {

        const user = new User("1", "Carlos");
        const property = new Property("1", "Casa de Praia", "Uma bela casa na praia", 6, 200);
        const dateRange = new DateRange(new Date("2024-12-20"), new Date("2024-12-25"));
        const booking = new Booking("1", property, user, dateRange, 6);


        UserMapper.toPersistence = jest.fn().mockReturnValue(user);
        PropertyMapper.toPersistence = jest.fn().mockReturnValue(property);
        const bookingEntity = BookingMapper.toPersistence(booking);
        expect(UserMapper.toPersistence).toHaveBeenCalledTimes(1);
        expect(PropertyMapper.toPersistence).toHaveBeenCalledTimes(1);
        expect(bookingEntity.id).toBe("1");
        expect(bookingEntity.property).not.toBeNull();
        expect(bookingEntity.guest).not.toBeNull();
        expect(bookingEntity.startDate).toEqual(new Date("2024-12-20"));
        expect(bookingEntity.endDate).toEqual(new Date("2024-12-25"));
        expect(bookingEntity.guestCount).toBe(6);
        expect(bookingEntity.totalPrice).toBe(1000);
        expect(bookingEntity.status).toBe("CONFIRMED");
    });


});
