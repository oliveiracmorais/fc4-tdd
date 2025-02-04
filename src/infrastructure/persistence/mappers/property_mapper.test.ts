import { PropertyEntity } from "../entities/property_entity";
import { PropertyMapper } from "./property_mapper";
import { Property } from "../../../domain/entities/property";

describe("Property Mapper", () => {

    it("deve converter PropertyEntity em Property corretamente", () => {
        const propertyEntity = {
            id: '1',
            name: 'Casa de praia',
            description: "Uma casa no condomínio Maikai, na Barra dos Coqueiros (SE)",
            maxGuests: 6,
            basePricePerNight: 300
        } as PropertyEntity
        const property = PropertyMapper.toDomain(propertyEntity)
        expect(property.getId()).toBe("1");
        expect(property.getName()).toBe("Casa de praia");
        expect(property.getDescription()).toBe("Uma casa no condomínio Maikai, na Barra dos Coqueiros (SE)");
        expect(property.getMaxGuests()).toBe(6);
        expect(property.getBasePricePerNight()).toBe(300);
    })

    it("deve lançar erro de validação se o id da propriedade não for informado", () => {
        const propertEntity = new PropertyEntity();
        propertEntity.id = "";

        expect(() => {
            const property = PropertyMapper.toDomain(propertEntity);
        }).toThrow("O ID da propriedade é obrigatório.");
    })

    it("deve lançar erro de validação se o nome não for informado", () => {
        const propertEntity = new PropertyEntity();
        propertEntity.id = "1";
        propertEntity.name = "";

        expect(() => {
            PropertyMapper.toDomain(propertEntity);
        }).toThrow("O nome é obrigatório.");
    })

    it("deve lançar erro de validação se a descrição não for informada", () => {
        const propertEntity = new PropertyEntity();
        propertEntity.id = "1";
        propertEntity.name = "Casa de praia";
        propertEntity.description = "";

        expect(() => {
            PropertyMapper.toDomain(propertEntity);
        }).toThrow("A descrição é obrigatória.");
    })

    it("deve lançar erro de validação se o número máximo de hóspedes não for informado", () => {
        const propertEntity = new PropertyEntity();
        propertEntity.id = "1";
        propertEntity.name = "Casa de praia";
        propertEntity.description = "Uma casa no condomínio Maikai, na Barra dos Coqueiros (SE)";
        propertEntity.maxGuests = 0;
        expect(() => {
            PropertyMapper.toDomain(propertEntity);
        }).toThrow("O número máximo de hóspedes é obrigatório.");
    })

    it("deve lançar erro de validação se o preço por noite não for informado", () => {
        const propertEntity = new PropertyEntity();
        propertEntity.id = "1";
        propertEntity.name = "Casa de praia";
        propertEntity.description = "Uma casa no condomínio Maikai, na Barra dos Coqueiros (SE)";
        propertEntity.maxGuests = 6;
        propertEntity.basePricePerNight = 0;
        expect(() => {
            PropertyMapper.toDomain(propertEntity);
        }).toThrow("O preço por noite é obrigatório.");
    })


    it("deve converter Property para PropertyEntity corretamente", () => {
        const property = new Property("1", "Casa de Praia", "Uma bela casa na praia", 6, 200);
        const propertyEntity = PropertyMapper.toPersistence(property);
        expect(propertyEntity.id).toBe("1");
        expect(propertyEntity.name).toBe("Casa de Praia");
        expect(propertyEntity.description).toBe("Uma bela casa na praia");
        expect(propertyEntity.maxGuests).toBe(6);
        expect(propertyEntity.basePricePerNight).toBe(200);
    })
});



