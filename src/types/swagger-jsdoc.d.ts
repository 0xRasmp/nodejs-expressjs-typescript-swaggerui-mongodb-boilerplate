declare module 'swagger-jsdoc' {
  interface Options {
    definition: object;
    apis: string[];
  }

  export default function swaggerJSDoc(options: Options): object;
} 