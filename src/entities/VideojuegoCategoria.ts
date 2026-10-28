import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";

import { Videojuego } from "./Videojuego";
import { Categoria } from "./Categoria";


@Entity("int_vidcat")
export class VideojuegoCategoria {

    @PrimaryGeneratedColumn({
        name: "idVidCat"
    })
    idVidCat: number;


    @Column({
        name: "idVid",
        type: "int"
    })
    idVid: number;


    @Column({
        name: "idCat",
        type: "int"
    })
    idCat: number;


    @Column({
        name: "actvVidCat",
        type: "boolean",
        default: true
    })
    actvVidCat: boolean;


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
        videojuego => videojuego.categoriasRelacion
    )
    @JoinColumn({
        name: "idVid"
    })
    videojuego: Videojuego;


    @ManyToOne(
        () => Categoria
    )
    @JoinColumn({
        name: "idCat"
    })
    categoria: Categoria;

}