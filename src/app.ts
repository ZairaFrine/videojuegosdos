import express from "express";
import { AppDataSource } from "./data-source";

import categoriasRoutes from "./routes/categorias";
import plataformasRoutes from "./routes/plataformas";
import videojuegosRoutes from "./routes/videojuegos";

const app = express();
app.use(express.json());

app.use("/api/categorias", categoriasRoutes);
app.use( "/api/plataformas", plataformasRoutes );
app.use( "/api/videojuegos", videojuegosRoutes );

AppDataSource.initialize()
.then(() => {
    console.log( "All Systems Go" );
    app.listen(3000, () => {
        console.log( "Servidor en http://localhost:3000" );
    });
})
.catch((error) => {
    console.error( "Error de conexión: ", error );
});


