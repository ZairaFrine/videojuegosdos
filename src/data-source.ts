import "reflect-metadata";
import { DataSource } from "typeorm";
import { Categoria } from "./entities/Categoria";
import { Plataforma } from "./entities/Plataforma";

export const AppDataSource =
    new DataSource({
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        //password: "",
        password: "12qwaszx",
        database: "videojuegos",
        entities: [
            Categoria,
            Plataforma
        ],
        synchronize: false, //La BD manda. Las Entities deben representar la BD existente.
        logging: true // modo developer
    });