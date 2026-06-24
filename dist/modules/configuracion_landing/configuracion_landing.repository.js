"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuracionLandingRepository = void 0;
const database_1 = require("../../config/database");
exports.configuracionLandingRepository = {
    async getById(id) {
        try {
            const request = database_1.pool.request();
            request.input('id', id);
            const result = await request.query('SELECT * FROM ConfiguracionLanding WHERE id = @id');
            return result.recordset[0] || null;
        }
        catch (error) {
            console.error('Repository getById error:', error);
            throw new Error(`Error al obtener configuración: ${error.message}`);
        }
    },
    async create(data) {
        try {
            const request = database_1.pool.request();
            request.input('logo', data.logo ?? null);
            request.input('businessName', data.businessName ?? null);
            request.input('heroBackground', data.heroBackground ?? null);
            request.input('servicesBackground', data.servicesBackground ?? null);
            request.input('service1Image', data.service1Image ?? null);
            request.input('service2Image', data.service2Image ?? null);
            request.input('service3Image', data.service3Image ?? null);
            request.input('service4Image', data.service4Image ?? null);
            request.input('aboutBackground', data.aboutBackground ?? null);
            request.input('heroTitle', data.heroTitle ?? null);
            request.input('heroSubtitle', data.heroSubtitle ?? null);
            request.input('heroDescription', data.heroDescription ?? null);
            request.input('aboutTitle', data.aboutTitle ?? null);
            request.input('aboutDescription1', data.aboutDescription1 ?? null);
            request.input('aboutDescription2', data.aboutDescription2 ?? null);
            request.input('yearsExperience', data.yearsExperience ?? null);
            request.input('happyClients', data.happyClients ?? null);
            request.input('contactAddress', data.contactAddress ?? null);
            request.input('contactPhone', data.contactPhone ?? null);
            request.input('contactEmail', data.contactEmail ?? null);
            const query = `
        INSERT INTO ConfiguracionLanding (
          logo, businessName, heroBackground, servicesBackground, service1Image, service2Image, service3Image, service4Image, aboutBackground,
          heroTitle, heroSubtitle, heroDescription, aboutTitle, aboutDescription1, aboutDescription2,
          yearsExperience, happyClients, contactAddress, contactPhone, contactEmail
        ) VALUES (
          @logo, @businessName, @heroBackground, @servicesBackground, @service1Image, @service2Image, @service3Image, @service4Image, @aboutBackground,
          @heroTitle, @heroSubtitle, @heroDescription, @aboutTitle, @aboutDescription1, @aboutDescription2,
          @yearsExperience, @happyClients, @contactAddress, @contactPhone, @contactEmail
        );
        SELECT SCOPE_IDENTITY() AS id;
      `;
            console.log('Repository create - Inserting data:', data);
            const result = await request.query(query);
            const insertedId = result.recordset[0].id;
            console.log('Created record with ID:', insertedId);
            return { id: insertedId, ...data };
        }
        catch (error) {
            console.error('Repository create error:', error);
            throw new Error(`Error al crear configuración: ${error.message}`);
        }
    },
    async update(data) {
        try {
            const existingConfig = await this.getById(data.id);
            if (!existingConfig) {
                throw new Error('Configuración de landing no encontrada');
            }
            const mergedData = {
                ...existingConfig,
                ...data,
            };
            const request = database_1.pool.request();
            request.input('id', mergedData.id);
            request.input('logo', mergedData.logo ?? null);
            request.input('businessName', mergedData.businessName ?? null);
            request.input('heroBackground', mergedData.heroBackground ?? null);
            request.input('servicesBackground', mergedData.servicesBackground ?? null);
            request.input('service1Image', mergedData.service1Image ?? null);
            request.input('service2Image', mergedData.service2Image ?? null);
            request.input('service3Image', mergedData.service3Image ?? null);
            request.input('service4Image', mergedData.service4Image ?? null);
            request.input('aboutBackground', mergedData.aboutBackground ?? null);
            request.input('heroTitle', mergedData.heroTitle ?? null);
            request.input('heroSubtitle', mergedData.heroSubtitle ?? null);
            request.input('heroDescription', mergedData.heroDescription ?? null);
            request.input('aboutTitle', mergedData.aboutTitle ?? null);
            request.input('aboutDescription1', mergedData.aboutDescription1 ?? null);
            request.input('aboutDescription2', mergedData.aboutDescription2 ?? null);
            request.input('yearsExperience', mergedData.yearsExperience ?? null);
            request.input('happyClients', mergedData.happyClients ?? null);
            request.input('contactAddress', mergedData.contactAddress ?? null);
            request.input('contactPhone', mergedData.contactPhone ?? null);
            request.input('contactEmail', mergedData.contactEmail ?? null);
            const query = `
        UPDATE ConfiguracionLanding SET
          logo = @logo,
          businessName = @businessName,
          heroBackground = @heroBackground,
          servicesBackground = @servicesBackground,
          service1Image = @service1Image,
          service2Image = @service2Image,
          service3Image = @service3Image,
          service4Image = @service4Image,
          aboutBackground = @aboutBackground,
          heroTitle = @heroTitle,
          heroSubtitle = @heroSubtitle,
          heroDescription = @heroDescription,
          aboutTitle = @aboutTitle,
          aboutDescription1 = @aboutDescription1,
          aboutDescription2 = @aboutDescription2,
          yearsExperience = @yearsExperience,
          happyClients = @happyClients,
          contactAddress = @contactAddress,
          contactPhone = @contactPhone,
          contactEmail = @contactEmail
        WHERE id = @id
      `;
            console.log('Repository update - Data:', mergedData);
            await request.query(query);
            console.log('Repository update - Success for ID:', mergedData.id);
            return mergedData;
        }
        catch (error) {
            console.error('Repository update error:', error);
            throw new Error(`Error al actualizar configuración: ${error.message}`);
        }
    },
    async delete(id) {
        try {
            const request = database_1.pool.request();
            request.input('id', id);
            await request.query('DELETE FROM ConfiguracionLanding WHERE id = @id');
        }
        catch (error) {
            console.error('Repository delete error:', error);
            throw new Error(`Error al eliminar configuración: ${error.message}`);
        }
    },
};
