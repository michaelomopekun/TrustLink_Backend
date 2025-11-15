import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";


const isForwarded = process.env.FORWARDED === "true" || process.env.FORWARDED === "1";

const serverUrl = process.env.HOST;

const options = 
{
    definition: 
    {
        openapi: "3.0.0",
        info:
        {
            title: "TrustLink Backend API",
            version: "1.0.0",
            description: "API documentation for TrustLink Backend"
        },
        servers:[
            {
                url: isForwarded ? serverUrl : `http://localhost:${process.env.PORT || 5001}`,
                description: "Development server"
            }
        ],
        components: 
        {
            securitySchemes:
            {
                bearerAuth:
                {
                    type:"http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter your JWT token ",
                }
            }
        },
        security:[
            {
                bearerAuth: [],
            }
        ],
    },
    apis: ["./index.ts","./src/routes/*.ts", "./src/docs/*.ts"]
};

const specs = swaggerJsdoc(options);

export const swaggerDocs = (app: any, port: number) => {
    app.use("/apis", swaggerUi.serve, swaggerUi.setup(specs));
    console.log(`🚀 Swagger docs available at http://localhost:${port}/api-docs`);
}