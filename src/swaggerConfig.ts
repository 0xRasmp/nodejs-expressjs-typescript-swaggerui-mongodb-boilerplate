import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Coreum NFT Marketplace API',
      version: '1.0.0',
      description: 'API documentation for Coreum NFT Marketplace',
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec; 