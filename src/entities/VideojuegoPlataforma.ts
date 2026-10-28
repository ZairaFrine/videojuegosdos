import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";

import { Videojuego } from "./Videojuego";
import { Plataforma } from "./Plataforma";


@Entity("int_vidplat")
export class VideojuegoPlataforma {

    @PrimaryGeneratedColumn({
        name: "idVidPlat"
    })
    idVidPlat: number;


    @Column({
        name: "idVid",
        type: "int"
    })
    idVid: number;


    @Column({
        name: "idPlat",
        type: "int"
    })
    idPlat: number;


    @Column({
        name: "actvVidPlat",
        type: "boolean",
        default: true
    })
    actvVidPlat: boolean;


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


    @ManyToOne(
        () => Videojuego,
        videojuego => videojuego.plataformasRelacion
    )
    @JoinColumn({
        name: "idVid"
    })
    videojuego: Videojuego;


    @ManyToOne(
        () => Plataforma
    )
    @JoinColumn({
        name: "idPlat"
    })
    plataforma: Plataforma;

}