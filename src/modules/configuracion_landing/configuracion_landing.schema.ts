import { z } from 'zod';

export const ConfiguracionLandingSchema = z.object({
  id: z.number().optional(),
  logo: z.string().optional(),
  businessName: z.string().optional(),
  heroBackground: z.string().optional(),
  servicesBackground: z.string().optional(),
  service1Image: z.string().optional(),
  service2Image: z.string().optional(),
  service3Image: z.string().optional(),
  service4Image: z.string().optional(),
  aboutBackground: z.string().optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroDescription: z.string().optional(),
  aboutTitle: z.string().optional(),
  aboutDescription1: z.string().optional(),
  aboutDescription2: z.string().optional(),
  yearsExperience: z.string().optional(),
  happyClients: z.string().optional(),
  contactAddress: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().optional(),
  fecha_creacion: z.date().optional(),
  fecha_actualizacion: z.date().optional(),
});

export type ConfiguracionLanding = z.infer<typeof ConfiguracionLandingSchema>;
export type CreateConfiguracionLanding = Omit<ConfiguracionLanding, 'id'>;