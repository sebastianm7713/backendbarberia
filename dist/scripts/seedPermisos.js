"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const permisos_service_1 = require("../modules/permisos/permisos.service");
(async () => {
    try {
        console.log('Starting seed of default permisos...');
        const inserted = await (0, permisos_service_1.seedDefaultPermisos)();
        console.log(`Inserted/ensured ${inserted.length} permisos.`);
        process.exit(0);
    }
    catch (err) {
        console.error('Error seeding permisos:', err);
        process.exit(1);
    }
})();
