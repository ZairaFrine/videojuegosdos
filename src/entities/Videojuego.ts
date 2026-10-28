import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

import { VideojuegoCategoria } from "./VideojuegoCategoria";
import { VideojuegoPlataforma } from "./VideojuegoPlataforma";


@Entity("bd_videojuegos")
export class Videojuego {

    @PrimaryGeneratedColumn({
        name: "idVid"
    })
    idVid: number;


    @Column({
        name: "nmVid",
        type: "varchar",
        length: 150
    })
    nmVid: string;


    @Column({
        name: "descVid",
        type: "text",
        nullable: true
    })
    descVid: string;


    @Column({
        name: "dateVid",
        type: "date",
        nullable: true
    })
    dateVid: string;


    @Column({
        name: "actvVid",
        type: "boolean",
        default: true
    })
    actvVid: boolean;


    @CreateDateColumn({
        name: "created_at",
        type: "datetime",
        nullable: true
    })
    created_at: Date;


    @UpdateDateColumn({
        name: "updated_at",
        type: "datetime",
        nullable: true
    })
    updated_at: Date;


    @OneToMany(
        () => VideojuegoCategoria,
        relacion => relacion.videojuego
    )
    categoriasRelacion: VideojuegoCategoria[];


    @OneToMany(
        () => VideojuegoPlataforma,
        relacion => relacion.videojuego
    )
    plataformasRelacion: VideojuegoPlataforma[];

}