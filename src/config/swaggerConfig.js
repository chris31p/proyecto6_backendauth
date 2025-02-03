const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require('path');
const express = require('express');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Comercio Electrónico",
      version: "1.0.0",
      description: "Documentación de la API para manejar la autenticación y autorización de usuarios y gestionar productos y carrito de compras",
    },
    servers: [{ url: "https://proyecto6-backendauth.onrender.com" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
  // Servir archivos estáticos desde swagger-ui-dist
  app.use('/swagger-ui', express.static(path.join(__dirname, '..', 'node_modules', 'swagger-ui-dist')));

  // Documentación de Swagger en /api-docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerDocs;

