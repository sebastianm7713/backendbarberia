"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const permisos_service_1 = require("../modules/permisos/permisos.service");
(async () => {
    try {
        console.log('Starting cleanup of duplicate permisos...');
        const result = await (0, permisos_service_1.cleanupDuplicatePermisos)();
        console.log(`Duplicate groups cleaned: ${result.duplicateGroups}, permisos removed: ${result.cleaned}`);
        process.exit(0);
    }
    catch (err) {
        console.error('Error cleaning permisos:', err);
        process.exit(1);
    }
})();
