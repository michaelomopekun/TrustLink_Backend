import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";


// let isForwarded: boolean = process.env.FORWARDED === "true" || process.env.FORWARDED === "1";

const forwardedServerUrl = "https://5fc8fpjp-5001.use2.devtunnels.ms";
const localServerUrl = "http://localhost:5001";

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
                url: forwardedServerUrl,
                description: "Development server"
            },
            {
                url: localServerUrl,
                description: "Local server"
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