import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Helper function to generate random Persian text
const persianWords = [
  'شرکت', 'داروسازی', 'تولید', 'کیفیت', 'بازرسی', 'مدیریت', 'فناوری',
  'پژوهش', 'توسعه', 'آزمایشگاه', 'استاندارد', 'محصول', 'دارو', 'سلامت'
];

const persianNames = [
  'علی', 'محمد', 'حسین', 'رضا', 'احمد', 'مهدی', 'سعید', 'امیر',
  'فاطمه', 'زهرا', 'مریم', 'سارا', 'نرگس', 'الهام', 'نیلوفر', 'سمیرا'
];

const persianFamilyNames = [
  'احمدی', 'محمدی', 'رضایی', 'حسینی', 'علوی', 'کریمی', 'نوری', 'صادقی',
  'موسوی', 'جعفری', 'اکبری', 'رحمانی', 'نجفی', 'حیدری', 'یوسفی', 'کاظمی'
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPersianText(wordCount: number = 3): string {
  return Array.from({ length: wordCount }, () => randomElement(persianWords)).join(' ');
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function clearDatabase() {
  console.log('🗑️  Clearing existing data...');
  
  // Delete in reverse order of dependencies
  await prisma.pqrAnswer.deleteMany();
  await prisma.pqrItem.deleteMany();
  await prisma.pqrSection.deleteMany();
  await prisma.inspectionInspector.deleteMany();
  await prisma.inspection.deleteMany();
  await prisma.request126History.deleteMany();
  await prisma.request126Document.deleteMany();
  await prisma.request126.deleteMany();
  await prisma.companyDrug.deleteMany();
  await prisma.drug.deleteMany();
  await prisma.machine.deleteMany();
  await prisma.machineType.deleteMany();
  await prisma.lineDosage.deleteMany();
  await prisma.dosage.deleteMany();
  await prisma.lineDocument.deleteMany();
  await prisma.line.deleteMany();
  await prisma.siteDocument.deleteMany();
  await prisma.site.deleteMany();
  await prisma.companyDocument.deleteMany();
  await prisma.document.deleteMany();
  await prisma.companyPerson.deleteMany();
  await prisma.person.deleteMany();
  await prisma.company.deleteMany();
  await prisma.quickReport.deleteMany();
  
  console.log('✅ Database cleared');
}

async function seedPersons() {
  console.log('👥 Seeding persons...');
  
  const persons: any[] = [];
  const roles = ['system', 'QRP', 'ifdaUser', 'ifdaManager', 'companyOther'];
  
  // Create system admin
  persons.push(await prisma.person.create({
    data: {
      username: 'admin',
      passwordHash: await bcrypt.hash('admin123', 10),
      name: 'مدیر',
      familyName: 'سیستم',
      role: 'system',
      email: 'admin@gmp.ir',
      phone: '09121234567',
      nationalId: '0123456789',
    }
  }));
  
  // Create users for each role
  for (let i = 0; i < 20; i++) {
    persons.push(await prisma.person.create({
      data: {
        username: `user${i + 1}`,
        passwordHash: await bcrypt.hash('password123', 10),
        name: randomElement(persianNames),
        familyName: randomElement(persianFamilyNames),
        role: randomElement(roles),
        email: `user${i + 1}@example.com`,
        phone: `0912${randomInt(1000000, 9999999)}`,
        nationalId: `${randomInt(1000000000, 9999999999)}`,
        nezamCode: randomInt(10000, 99999).toString(),
        birthDate: randomDate(new Date('1970-01-01'), new Date('2000-12-31')),
      }
    }));
  }
  
  console.log(`✅ Created ${persons.length} persons`);
  return persons;
}

async function seedCompanies(persons: any[]) {
  console.log('🏢 Seeding companies...');
  
  const companies: any[] = [];
  
  for (let i = 0; i < 10; i++) {
    const company = await prisma.company.create({
      data: {
        nameFa: `شرکت ${randomPersianText(2)} ${i + 1}`,
        nameEn: `Pharmaceutical Company ${i + 1}`,
        nationalId: `${randomInt(1000000000, 9999999999)}`,
        description: randomPersianText(8),
        country: 'ایران',
        province: randomElement(['تهران', 'اصفهان', 'خراسان', 'فارس', 'گیلان']),
        city: randomElement(['تهران', 'اصفهان', 'مشهد', 'شیراز', 'رشت']),
        mainAddress: randomPersianText(10),
        website: `https://company${i + 1}.ir`,
        email: `info@company${i + 1}.ir`,
        contact: `021${randomInt(10000000, 99999999)}`,
        postalCode: `${randomInt(1000000000, 9999999999)}`,
        registrationNumber: `${randomInt(100000, 999999)}`,
        registrationDate: randomDate(new Date('2000-01-01'), new Date('2023-12-31')),
      }
    });
    companies.push(company);
    
    // Create company-person relationships
    const companyPersons = persons.filter(p => p.role === 'companyOther').slice(0, 3);
    for (const person of companyPersons) {
      await prisma.companyPerson.create({
        data: {
          companyId: company.id,
          personId: person.id,
          licenseNumber: `LIC-${randomInt(10000, 99999)}`,
          licenseDate: randomDate(new Date('2020-01-01'), new Date()).toISOString(),
        }
      });
    }
  }
  
  console.log(`✅ Created ${companies.length} companies`);
  return companies;
}

async function seedSites(companies: any[]) {
  console.log('🏭 Seeding sites...');
  
  const sites: any[] = [];
  
  for (const company of companies) {
    const siteCount = randomInt(1, 3);
    for (let i = 0; i < siteCount; i++) {
      sites.push(await prisma.site.create({
        data: {
          companyId: company.id,
          name: `کارخانه ${i + 1} - ${company.nameFa}`,
          country: 'ایران',
          province: randomElement(['تهران', 'اصفهان', 'خراسان']),
          city: randomElement(['تهران', 'اصفهان', 'مشهد']),
          address: randomPersianText(8),
          gpsLat: 35.6892 + (Math.random() - 0.5) * 5,
          gpsLng: 51.3890 + (Math.random() - 0.5) * 5,
          GLN: `${randomInt(1000000000000, 9999999999999)}`,
        }
      }));
    }
  }
  
  console.log(`✅ Created ${sites.length} sites`);
  return sites;
}

async function seedLines(sites: any[]) {
  console.log('⚙️  Seeding production lines...');
  
  const lines: any[] = [];
  
  for (const site of sites) {
    const lineCount = randomInt(2, 4);
    for (let i = 0; i < lineCount; i++) {
      lines.push(await prisma.line.create({
        data: {
          siteId: site.id,
          nameFa: `خط تولید ${i + 1}`,
          nameEn: `Production Line ${i + 1}`,
          isActive: Math.random() > 0.2,
          capacity: randomInt(1000, 50000),
          actual: randomInt(500, 40000),
          OEB: randomInt(1, 5),
          isSterile: Math.random() > 0.5,
          startFrom: randomDate(new Date('2015-01-01'), new Date('2023-12-31')).toISOString(),
          opensDate: randomDate(new Date('2015-01-01'), new Date('2023-12-31')),
        }
      }));
    }
  }
  
  console.log(`✅ Created ${lines.length} lines`);
  return lines;
}

async function seedDosages() {
  console.log('💊 Seeding dosages...');
  
  const dosageForms: any[] = [
    { emaCode: 'TAB', category: 'Solid', labelEn: 'Tablet', labelFa: 'قرص' },
    { emaCode: 'CAP', category: 'Solid', labelEn: 'Capsule', labelFa: 'کپسول' },
    { emaCode: 'SYR', category: 'Liquid', labelEn: 'Syrup', labelFa: 'شربت' },
    { emaCode: 'INJ', category: 'Injectable', labelEn: 'Injection', labelFa: 'آمپول' },
    { emaCode: 'CRE', category: 'Topical', labelEn: 'Cream', labelFa: 'کرم' },
    { emaCode: 'OIN', category: 'Topical', labelEn: 'Ointment', labelFa: 'پماد' },
    { emaCode: 'DROP', category: 'Liquid', labelEn: 'Drops', labelFa: 'قطره' },
    { emaCode: 'SUP', category: 'Solid', labelEn: 'Suppository', labelFa: 'شیاف' },
  ];
  
  const dosages: any[] = [];
  for (const form of dosageForms) {
    dosages.push(await prisma.dosage.create({ data: form }));
  }
  
  console.log(`✅ Created ${dosages.length} dosages`);
  return dosages;
}

async function seedDrugs() {
  console.log('🧬 Seeding drugs...');
  
  const drugNames: any[] = [
    { name: 'Paracetamol', generic: 'Acetaminophen', code: 'N02BE01', atc: 'N02BE01' },
    { name: 'Ibuprofen', generic: 'Ibuprofen', code: 'M01AE01', atc: 'M01AE01' },
    { name: 'Amoxicillin', generic: 'Amoxicillin', code: 'J01CA04', atc: 'J01CA04' },
    { name: 'Metformin', generic: 'Metformin', code: 'A10BA02', atc: 'A10BA02' },
    { name: 'Omeprazole', generic: 'Omeprazole', code: 'A02BC01', atc: 'A02BC01' },
    { name: 'Losartan', generic: 'Losartan', code: 'C09CA01', atc: 'C09CA01' },
    { name: 'Atorvastatin', generic: 'Atorvastatin', code: 'C10AA05', atc: 'C10AA05' },
    { name: 'Cetirizine', generic: 'Cetirizine', code: 'R06AE07', atc: 'R06AE07' },
  ];
  
  const drugs: any[] = [];
  for (const drug of drugNames) {
    drugs.push(await prisma.drug.create({
      data: {
        drugIndexName: drug.name,
        genericName: drug.generic,
        genericCode: drug.code,
        ATC: drug.atc,
      }
    }));
  }
  
  console.log(`✅ Created ${drugs.length} drugs`);
  return drugs;
}

async function seedMachineTypes() {
  console.log('🔧 Seeding machine types...');
  
  const machineTypes: any[] = [
    { nameEn: 'Tablet Press', nameFa: 'دستگاه قرص‌ساز', scope: 'Solid' },
    { nameEn: 'Coating Machine', nameFa: 'دستگاه پوشش‌دهی', scope: 'Solid' },
    { nameEn: 'Blister Packing', nameFa: 'دستگاه بلیستر', scope: 'Packaging' },
    { nameEn: 'Filling Machine', nameFa: 'دستگاه پرکن', scope: 'Liquid' },
    { nameEn: 'Capsule Filler', nameFa: 'دستگاه کپسول‌ساز', scope: 'Solid' },
    { nameEn: 'Mixer', nameFa: 'میکسر', scope: 'Processing' },
  ];
  
  const types: any[] = [];
  for (const type of machineTypes) {
    types.push(await prisma.machineType.create({ data: type }));
  }
  
  console.log(`✅ Created ${types.length} machine types`);
  return types;
}

async function seedMachines(sites: any[], lines: any[], machineTypes: any[]) {
  console.log('🏭 Seeding machines...');
  
  const machines: any[] = [];
  const brands = ['Fette', 'Korsch', 'Bosch', 'IMA', 'Uhlmann'];
  const countries = ['Germany', 'Italy', 'Switzerland', 'USA'];
  
  for (const line of lines) {
    const machineCount = randomInt(3, 6);
    for (let i = 0; i < machineCount; i++) {
      machines.push(await prisma.machine.create({
        data: {
          lineId: line.id,
          siteId: line.siteId,
          machineTypeId: randomElement(machineTypes).id,
          country: randomElement(countries),
          brand: randomElement(brands),
          model: `Model-${randomInt(100, 999)}`,
          manufactureDate: randomDate(new Date('2010-01-01'), new Date('2022-12-31')),
          installationDate: randomDate(new Date('2015-01-01'), new Date('2023-12-31')),
          nominalCapacity: randomInt(5000, 50000),
          actualCapacity: randomInt(4000, 45000),
          DQ: Math.random() > 0.3,
          IQ: Math.random() > 0.2,
          OQ: Math.random() > 0.2,
          PQ: Math.random() > 0.3,
        }
      }));
    }
  }
  
  console.log(`✅ Created ${machines.length} machines`);
  return machines;
}

async function seedCompanyDrugs(companies: any[], drugs: any[], lines: any[]) {
  console.log('💼 Seeding company drugs...');
  
  const companyDrugs: any[] = [];
  const statuses = ['active', 'pending', 'suspended', 'approved'];
  
  for (const company of companies) {
    const drugCount = randomInt(3, 8);
    const selectedDrugs = drugs.slice(0, drugCount);
    
    for (const drug of selectedDrugs) {
      const line = randomElement(lines.filter(l => l.siteId === company.sites?.[0]?.id)) || randomElement(lines);
      
      companyDrugs.push(await prisma.companyDrug.create({
        data: {
          drugId: drug.id,
          brandOwnerId: company.id,
          supplierId: company.id,
          lineId: line?.id,
          IRC: `IRC-${randomInt(100000, 999999)}`,
          brandNameEn: `${drug.drugIndexName} Brand`,
          brandNameFa: `${drug.genericName} برند`,
          packageCount: randomInt(10, 100),
          isBulk: Math.random() > 0.7,
          isTemp: Math.random() > 0.8,
          status: randomElement(statuses),
          GTIN: `${randomInt(1000000000000, 9999999999999)}`,
        }
      }));
    }
  }
  
  console.log(`✅ Created ${companyDrugs.length} company drugs`);
  return companyDrugs;
}

async function seedRequest126(companies: any[], lines: any[], drugs: any[], persons: any[]) {
  console.log('📋 Seeding request126...');
  
  const requests: any[] = [];
  const types = ['safety-assessment', 'quality-check', 'facility-inspection', 'product-review'];
  
  for (let i = 0; i < 15; i++) {
    const company = randomElement(companies);
    const line = randomElement(lines);
    const drug = randomElement(drugs);
    
    requests.push(await prisma.request126.create({
      data: {
        type: randomElement(types),
        companyId: company.id,
        lineId: line.id,
        drugId: drug.id,
        drugOEB_declared: randomInt(1, 5),
        drugOEL_declared: parseFloat((Math.random() * 10).toFixed(2)),
        closedAt: Math.random() > 0.5 ? randomDate(new Date('2024-01-01'), new Date()) : null,
      }
    }));
  }
  
  console.log(`✅ Created ${requests.length} requests`);
  return requests;
}

async function seedRequest126History(requests: any[], persons: any[]) {
  console.log('📜 Seeding request126 history...');
  
  const histories: any[] = [];
  const actions = ['create', 'submit', 'assign', 'review', 'approve', 'reject'];
  const statuses = ['nowhere', 'draft', 'pendingAssign', 'pendingReview', 'approved', 'rejected'];
  
  for (const request of requests) {
    const historyCount = randomInt(2, 5);
    for (let i = 0; i < historyCount; i++) {
      const actor = randomElement(persons.filter(p => ['system', 'ifdaManager', 'QRP'].includes(p.role)));
      const assignee = randomElement(persons.filter(p => ['ifdaUser', 'ifdaManager'].includes(p.role)));
      
      histories.push(await prisma.request126History.create({
        data: {
          requestId: request.id,
          actorId: actor.id,
          action: randomElement(actions) as any,
          fromStatus: randomElement(statuses) as any,
          toStatus: randomElement(statuses) as any,
          toAssigneeId: assignee.id,
          message: randomPersianText(6),
          endedAt: Math.random() > 0.5 ? randomDate(new Date('2024-01-01'), new Date()) : null,
        }
      }));
    }
  }
  
  console.log(`✅ Created ${histories.length} history entries`);
  return histories;
}

async function seedInspections(companies: any[], lines: any[]) {
  console.log('🔍 Seeding inspections...');
  
  const inspections: any[] = [];
  
  for (let i = 0; i < 20; i++) {
    const company = randomElement(companies);
    const line = randomElement(lines.filter(l => companies.some(c => c.id === company.id)));
    
    inspections.push(await prisma.inspection.create({
      data: {
        companyId: company.id,
        lineId: line?.id || randomElement(lines).id,
        critical: randomInt(0, 5),
        major: randomInt(0, 15),
        minor: randomInt(0, 30),
      }
    }));
  }
  
  console.log(`✅ Created ${inspections.length} inspections`);
  return inspections;
}

async function seedInspectionInspectors(inspections: any[], persons: any[]) {
  console.log('👨‍🔬 Seeding inspection inspectors...');
  
  const assignments: any[] = [];
  const inspectors = persons.filter(p => ['ifdaUser', 'ifdaManager', 'QRP'].includes(p.role));
  
  for (const inspection of inspections) {
    const inspectorCount = randomInt(1, 3);
    const selectedInspectors = inspectors.slice(0, inspectorCount);
    
    for (const inspector of selectedInspectors) {
      assignments.push(await prisma.inspectionInspector.create({
        data: {
          inspectionId: inspection.id,
          personId: inspector.id,
        }
      }));
    }
  }
  
  console.log(`✅ Created ${assignments.length} inspector assignments`);
  return assignments;
}

async function seedPqrSections() {
  console.log('📑 Seeding PQR sections...');
  
  const sections: any[] = [
    { titleFa: 'مدیریت کیفیت', order: 1 },
    { titleFa: 'پرسنل', order: 2 },
    { titleFa: 'تولید', order: 3 },
    { titleFa: 'کنترل کیفیت', order: 4 },
    { titleFa: 'انبارداری و توزیع', order: 5 },
  ];
  
  const createdSections: any[] = [];
  for (const section of sections) {
    createdSections.push(await prisma.pqrSection.create({ data: section }));
  }
  
  console.log(`✅ Created ${createdSections.length} PQR sections`);
  return createdSections;
}

async function seedPqrItems(sections: any[]) {
  console.log('❓ Seeding PQR items...');
  
  const items: any[] = [];
  const questions = [
    'آیا شرکت دارای مجوز تولید است؟',
    'آیا سیستم مدیریت کیفیت مستند شده است؟',
    'آیا پرسنل آموزش دیده‌اند؟',
    'آیا تجهیزات کالیبره شده‌اند؟',
    'آیا شرایط نگهداری مناسب است؟',
    'آیا سوابق تولید کامل است؟',
    'آیا کنترل‌های کیفیت انجام می‌شود؟',
    'آیا رویه‌های مستند وجود دارد؟',
  ];
  
  for (const section of sections) {
    const itemCount = randomInt(5, 10);
    for (let i = 0; i < itemCount; i++) {
      items.push(await prisma.pqrItem.create({
        data: {
          sectionId: section.id,
          questionFa: randomElement(questions),
          order: i + 1,
        }
      }));
    }
  }
  
  console.log(`✅ Created ${items.length} PQR items`);
  return items;
}

async function seedPqrAnswers(items: any[]) {
  console.log('✅ Seeding PQR answers...');
  
  const answers: any[] = [];
  const answerOptions = ['بله', 'خیر', 'تا حدودی', 'در حال بررسی'];
  
  // Create 10 forms
  for (let formId = 1; formId <= 10; formId++) {
    // Answer subset of items
    const itemCount = randomInt(10, items.length);
    const selectedItems = items.slice(0, itemCount);
    
    for (const item of selectedItems) {
      answers.push(await prisma.pqrAnswer.create({
        data: {
          formId,
          itemId: item.id,
          answer: randomElement(answerOptions),
          details: Math.random() > 0.5 ? randomPersianText(8) : null,
        }
      }));
    }
  }
  
  console.log(`✅ Created ${answers.length} PQR answers`);
  return answers;
}

async function main() {
  try {
    console.log('🚀 Starting database seeding...\n');
    
    await clearDatabase();
    
    const persons = await seedPersons();
    const companies = await seedCompanies(persons);
    const sites = await seedSites(companies);
    const lines = await seedLines(sites);
    const dosages = await seedDosages();
    const drugs = await seedDrugs();
    const machineTypes = await seedMachineTypes();
    await seedMachines(sites, lines, machineTypes);
    await seedCompanyDrugs(companies, drugs, lines);
    const requests = await seedRequest126(companies, lines, drugs, persons);
    await seedRequest126History(requests, persons);
    const inspections = await seedInspections(companies, lines);
    await seedInspectionInspectors(inspections, persons);
    const sections = await seedPqrSections();
    const items = await seedPqrItems(sections);
    await seedPqrAnswers(items);
    
    console.log('\n✨ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - ${persons.length} persons`);
    console.log(`   - ${companies.length} companies`);
    console.log(`   - ${sites.length} sites`);
    console.log(`   - ${lines.length} production lines`);
    console.log(`   - ${requests.length} request126s`);
    console.log(`   - ${inspections.length} inspections`);
    console.log(`   - ${sections.length} PQR sections`);
    console.log(`   - ${items.length} PQR items`);
    console.log('\n🔑 Default login: username=admin, password=admin123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
