import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";


@Entity("cat_plataforma")
export class Plataforma {

    @PrimaryGeneratedColumn({
        name: "idPlat"
    })
    idPlat: number;


    @Column({
        name: "nmPlat",
        type: "varchar",
        length: 100
    })
    nmPlat: string;


    @Column({
        name: "actvPlat",
        type: "boolean",
        default: true
    })
    actvPlat: boolean;


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

}