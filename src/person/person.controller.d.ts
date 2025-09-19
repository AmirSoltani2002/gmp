import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
export declare class PersonController {
    private readonly personService;
    constructor(personService: PersonService);
    create(createPersonDto: CreatePersonDto): import("@prisma/client").Prisma.Prisma__personClient<{
        id: number;
        name: string;
        username: string;
        passwordHash: string;
        familyName: string;
        currentCompanyId: number;
        role: string;
        phone: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        currentCompany: {
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
        id: number;
        name: string;
        username: string;
        passwordHash: string;
        familyName: string;
        currentCompanyId: number;
        role: string;
        phone: string;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__personClient<{
        currentCompany: {
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
        id: number;
        name: string;
        username: string;
        passwordHash: string;
        familyName: string;
        currentCompanyId: number;
        role: string;
        phone: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findOneByUserName(username: string): import("@prisma/client").Prisma.Prisma__personClient<{
        currentCompany: {
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
        id: number;
        name: string;
        username: string;
        passwordHash: string;
        familyName: string;
        currentCompanyId: number;
        role: string;
        phone: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findOneByProfile(req: any): import("@prisma/client").Prisma.Prisma__personClient<{
        currentCompany: {
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
        id: number;
        name: string;
        username: string;
        passwordHash: string;
        familyName: string;
        currentCompanyId: number;
        role: string;
        phone: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    updateOne(req: any, updatePersonDto: UpdatePersonDto): import("@prisma/client").Prisma.Prisma__personClient<{
        id: number;
        name: string;
        username: string;
        passwordHash: string;
        familyName: string;
        currentCompanyId: number;
        role: string;
        phone: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updatePersonDto: UpdatePersonDto): import("@prisma/client").Prisma.Prisma__personClient<{
        id: number;
        name: string;
        username: string;
        passwordHash: string;
        familyName: string;
        currentCompanyId: number;
        role: string;
        phone: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    removeByUsername(username: string): import("@prisma/client").Prisma.Prisma__personClient<{
        id: number;
        name: string;
        username: string;
        passwordHash: string;
        familyName: string;
        currentCompanyId: number;
        role: string;
        phone: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__personClient<{
        id: number;
        name: string;
        username: string;
        passwordHash: string;
        familyName: string;
        currentCompanyId: number;
        role: string;
        phone: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
