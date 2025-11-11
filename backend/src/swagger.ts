import path from "node:path";
import { fileURLToPath } from "node:url";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc, { Options } from "swagger-jsdoc";

// root
const __dirname_esm = process.cwd();

// Em produção (Vercel),  varrer apenas .js.
const apisGlobs =
  process.env.NODE_ENV === "production"
    ? [
        path.join(__dirname_esm, "routes/**/*.js"),
        path.join(__dirname_esm, "controllers/**/*.js"),
      ]
    : [
        path.join(process.cwd(), "src/routes/**/*.ts"),
        path.join(process.cwd(), "src/controllers/**/*.ts"),
        path.join(__dirname_esm, "routes/**/*.js"),
        path.join(__dirname_esm, "controllers/**/*.js"),
      ];

const options: Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "FitTrack API",
      version: "1.0.0",
      description: "API de exercícios, dias e sessões de treino",
    },
    servers: [{ url: process.env.PUBLIC_API_URL || "http://localhost:3000" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
  },
  apis: apisGlobs,
};

export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };