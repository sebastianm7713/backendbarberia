import { pool } from "./src/config/database";

async function checkPassword() {
  try {
    const result = await pool.request()
      .input("email", "juanperez@barber.com")
      .query("SELECT email, contrasena FROM usuarios WHERE email = @email");

    console.log("User:", result.recordset[0]);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    pool.close();
  }
}

checkPassword();