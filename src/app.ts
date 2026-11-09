import express from "express";
import cors from "cors"; //CORS
import { AppDataSource } from "./data-source";
import categoriasRoutes from "./routes/categorias";
import plataformasRoutes from "./routes/plataformas";
import videojuegosRoutes from "./routes/videojuegos";

const app = express();
const PORT =
    Number(
        process.env.PORT
    ) || 3000;
    

//CORS: Cross-Origin Resource Sharing para Angular
app.use(
    cors({
        origin: process.env.CORS_ORIGIN
    })
);

app.use("/api/categorias", categoriasRoutes);
app.use( "/api/plataformas", plataformasRoutes );
app.use( "/api/videojuegos", videojuegosRoutes );






app.use(express.json());

AppDataSource.initialize()
.then(() => {
    console.log( "All Systems Go" );
    app.listen(PORT, () => {
        console.log( "Servidor en http://localhost:" + PORT );
        console.log( "CORS_ORIGIN: ", process.env.CORS_ORIGIN );
    });
})
.catch((error) => {
    console.error( "Error de conexión: ", error );
});


