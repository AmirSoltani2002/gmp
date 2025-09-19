import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { DatabaseService } from 'src/database/database.service';
export declare class ContactService {
    private readonly db;
    constructor(db: DatabaseService);
    create(createContactDto: CreateContactDto): import("@prisma/client").Prisma.Prisma__contactClient<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        companyId: number;
        value: string;
        is_primary: boolean;
        cityCode: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        company: {
            nameFa: string;
            nationalId: string | null;
            img: string | null;
            nameEn: string | null;
            country: string | null;
            mainAddress: string | null;
            website: string | null;
            province: string | null;
            postalCode: string | null;
            city: string | null;
            registrationData: Date | null;
            registrationNumber: number | null;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        companyId: number;
        value: string;
        is_primary: boolean;
        cityCode: string;
    })[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__contactClient<{
        company: {
            nameFa: string;
            nationalId: string | null;
            img: string | null;
            nameEn: string | null;
            country: string | null;
            mainAddress: string | null;
            website: string | null;
            province: string | null;
            postalCode: string | null;
            city: string | null;
            registrationData: Date | null;
            registrationNumber: number | null;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        companyId: number;
        value: string;
        is_primary: boolean;
        cityCode: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateContactDto: UpdateContactDto): import("@prisma/client").Prisma.Prisma__contactClient<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        companyId: number;
        value: string;
        is_primary: boolean;
        cityCode: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__contactClient<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        companyId: number;
        value: string;
        is_primary: boolean;
        cityCode: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
