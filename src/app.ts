import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Habilitar CORS con credenciales para autenticación por cookies
app.use(cors({
  origin: function (origin, callback) {
    // Permitir:
    // - localhost con cualquier puerto (desarrollo)
    // - undefined (requests sin origen, como Postman)
    if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Parse cookies for cookie-based authentication
app.use(cookieParser());

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;