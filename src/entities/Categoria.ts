import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("cat_categoria")
export class Categoria {

    @PrimaryGeneratedColumn({
        name: "idCat"
    })
    idCat: number;


    @Column({
        name: "nmCat",
        type: "varchar",
        length: 100
    })
    nmCat: string;

    @Column({
        name: "actvCat",
        type: "boolean",
        default: true
    })
    actvCat: boolean;


    @CreateDateColumn({
        name: "created_at",
        type: "datetime"
    })
    created_at: Date;


    @UpdateDateColumn({
        name: "updated_at",
        type: "datetime"
    })
    updated_at: Date;
}