"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfiguracionLandingSchema = void 0;
const zod_1 = require("zod");
exports.ConfiguracionLandingSchema = zod_1.z.object({
    id: zod_1.z.number().optional(),
    logo: zod_1.z.string().optional(),
    businessName: zod_1.z.string().optional(),
    heroBackground: zod_1.z.string().optional(),
    servicesBackground: zod_1.z.string().optional(),
    service1Image: zod_1.z.string().optional(),
    service2Image: zod_1.z.string().optional(),
    service3Image: zod_1.z.string().optional(),
    service4Image: zod_1.z.string().optional(),
    aboutBackground: zod_1.z.string().optional(),
    heroTitle: zod_1.z.string().optional(),
    heroSubtitle: zod_1.z.string().optional(),
    heroDescription: zod_1.z.string().optional(),
    aboutTitle: zod_1.z.string().optional(),
    aboutDescription1: zod_1.z.string().optional(),
    aboutDescription2: zod_1.z.string().optional(),
    yearsExperience: zod_1.z.string().optional(),
    happyClients: zod_1.z.string().optional(),
    contactAddress: zod_1.z.string().optional(),
    contactPhone: zod_1.z.string().optional(),
    contactEmail: zod_1.z.string().optional(),
    fecha_creacion: zod_1.z.date().optional(),
    fecha_actualizacion: zod_1.z.date().optional(),
});
