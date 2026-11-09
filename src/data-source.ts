import dotenv from "dotenv"; // .env
import { DataSource } from "typeorm";
import { Categoria } from "./entities/Categoria";
import { Plataforma } from "./entities/Plataforma";
import { Videojuego } from "./entities/Videojuego";
import { VideojuegoCategoria } from "./entities/VideojuegoCategoria";
import { VideojuegoPlataforma } from "./entities/VideojuegoPlataforma";

dotenv.config();// .env

export const AppDataSource =
new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number( process.env.DB_PORT ),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
        Categoria,
        Plataforma,
        Videojuego,
        VideojuegoCategoria,
        VideojuegoPlataforma
    ],
    synchronize: false, //La BD manda. Las Entities deben representar la BD existente.
    logging: true // modo developer
});