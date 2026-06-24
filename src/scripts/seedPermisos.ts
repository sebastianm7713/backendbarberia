import { seedDefaultPermisos } from '../modules/permisos/permisos.service';

(async () => {
  try {
    console.log('Starting seed of default permisos...');
    const inserted = await seedDefaultPermisos();
    console.log(`Inserted/ensured ${inserted.length} permisos.`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding permisos:', err);
    process.exit(1);
  }
})();
