import { cleanupDuplicatePermisos } from '../modules/permisos/permisos.service';

(async () => {
  try {
    console.log('Starting cleanup of duplicate permisos...');
    const result = await cleanupDuplicatePermisos();
    console.log(`Duplicate groups cleaned: ${result.duplicateGroups}, permisos removed: ${result.cleaned}`);
    process.exit(0);
  } catch (err) {
    console.error('Error cleaning permisos:', err);
    process.exit(1);
  }
})();
