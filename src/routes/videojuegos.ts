import express from "express";
import { Like } from "typeorm";
import { AppDataSource } from "../data-source";
import { Videojuego } from "../entities/Videojuego";
import { VideojuegoCategoria } from "../entities/VideojuegoCategoria";
import { VideojuegoPlataforma } from "../entities/VideojuegoPlataforma";

const router = express.Router();


/* * CRUD: CREATE, READ, UPDATE, DELETE  */
// * Consulta General de todos los videojuegos
router.get("/", async (req, res) => {

    try {
        const videojuegoRepository = AppDataSource.getRepository( Videojuego );
        const videojuegos = await videojuegoRepository.find({
            where: {
                actvVid: true
            },
            relations: {
                plataformasRelacion: {
                    plataforma: true
                },
                categoriasRelacion: {
                    categoria: true
                }
            }
        });


        const resultado: object[] = [];
        for (const videojuego of videojuegos) {

            const plataformas: string[] = [];
            for (
                const relacion of videojuego.plataformasRelacion
            ) {
                if (relacion.plataforma) {
                    plataformas.push(
                        relacion.plataforma.nmPlat
                    );
                }
            }
            const plataformasUnicas = [...new Set(plataformas)] .sort();

            const categorias: string[] = [];
            for (
            const relacion
                of videojuego.categoriasRelacion
            ) {

                if (relacion.categoria) {

                    categorias.push(
                        relacion.categoria.nmCat
                    );

                }

            }
            const categoriasUnicas = [...new Set(categorias)] .sort();


            resultado.push({
                ID: videojuego.idVid,
                Nombre: videojuego.nmVid,
                "Descripción": videojuego.descVid,
                Lanzamiento: videojuego.dateVid,
                plataformas: plataformasUnicas.length > 0 ? plataformasUnicas.join(", ") : null,
                categorias: categoriasUnicas.length > 0 ? categoriasUnicas.join(", ") : null,
            });

        }
        res.json(resultado);

    } catch (error: any) {
        console.error( "Error al consultar los videojuegos: ", error );
        res.status(500).json({
            mensaje: "Error al consultar los videojuegos",
            error: error,
            codigo: error.code,
            stack: error.stack
        });
    }
});


// * Consulta de un videojuego por ID
router.get("/:id", async (req, res) => {

    try {
        const { id } = req.params;
        const videojuegoRepository = AppDataSource.getRepository(
            Videojuego
        );

        const videojuego = await videojuegoRepository.findOne({
            where: {
                idVid: Number(id)
            },

            relations: {
                plataformasRelacion: {
                    plataforma: true
                },
                categoriasRelacion: {
                    categoria: true
                }
            }
        });


        if (!videojuego) {
            return res.status(404).json({
                mensaje: "Videojuego no encontrado"
            });
        }


        const plataformas: string[] = [];
        for ( const relacion of videojuego.plataformasRelacion ) {
            if (relacion.plataforma) {
                plataformas.push(
                    relacion.plataforma.nmPlat
                );
            }
        }
        const plataformasUnicas = [...new Set(plataformas)] .sort();

        const categorias: string[] = [];
        for ( const relacion of videojuego.categoriasRelacion ) {
            if (relacion.categoria) {
                categorias.push(
                    relacion.categoria.nmCat
                );
            }
        }
        const categoriasUnicas = [...new Set(categorias)] .sort();
        res.json({
            ID: videojuego.idVid,
            Nombre: videojuego.nmVid,
            "Descripción": videojuego.descVid,
            Lanzamiento: videojuego.dateVid,
            plataformas: plataformasUnicas.length > 0 ? plataformasUnicas.join(", ") : null,
            categorias: categoriasUnicas.length > 0 ? categoriasUnicas.join(", ") : null
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al consultar videojuego",
            error: error,
            codigo: error.code,
            stack: error.stack
        });
    }
});


//* Agregar un nuevo videojuego
router.post("/", async (req, res) => {

    const { nombre, descripcion, lanzamiento, categorias, plataformas } = req.body;
    try {
        if (!nombre || !categorias) {
            return res.status(400).json({
                mensaje: "Nombre y categoría son obligatorios"
            });
        }

        const videojuegoRepository = AppDataSource.getRepository(
            Videojuego
        );

        const videojuegoCategoriaRepository = AppDataSource.getRepository(
            VideojuegoCategoria
        );

        const videojuegoPlataformaRepository = AppDataSource.getRepository(
            VideojuegoPlataforma
        );

        const nuevoVideojuego = videojuegoRepository.create({
            nmVid: nombre,
            descVid: descripcion,
            dateVid: lanzamiento,
            actvVid: true
        });

        const resultado = await videojuegoRepository.save(
            nuevoVideojuego
        );

        const idVideojuego = resultado.idVid;


        if ( Array.isArray(plataformas) && plataformas.length > 0 ) {
            const relacionesPlataformas: VideojuegoPlataforma[] = [];
            for ( const plataforma of plataformas ) {
                const nuevaRelacion = videojuegoPlataformaRepository
                        .create({
                            idVid: idVideojuego,
                            idPlat: Number(plataforma),
                            actvVidPlat: true
                        });
                relacionesPlataformas.push( nuevaRelacion );
            }


            await videojuegoPlataformaRepository
            .save(
                relacionesPlataformas
            );            // * INSERT INTO int_vidplat (idVid, idPlat) VALUES (10, 1),(10, 2), (10, 4);

        }


        if ( Array.isArray(categorias) && categorias.length > 0 ) {

            const relacionesCategorias: VideojuegoCategoria[] = [];

            for ( const categoria of categorias ) {
                const nuevaRelacion = videojuegoCategoriaRepository
                .create({
                    idVid: idVideojuego,
                    idCat: Number(categoria),
                    actvVidCat: true
                });

                relacionesCategorias.push( nuevaRelacion );
            }


            await videojuegoCategoriaRepository
            .save(
                relacionesCategorias
            ); // * INSERT INTO int_vidcat (idVid, idCat) VALUES (10, 1),(10, 2), (10, 4);

        }


        res.status(201).json({
            mensaje: "Videojuego creado correctamente",
            id_videojuego: idVideojuego,
            nombre: nombre,
            descripcion: descripcion,
            lanzamiento: lanzamiento
        });


    } catch (error: any) {

        console.error(error);
        res.status(500).json({
            mensaje: "Error al crear videojuego",
            nombre: nombre,
            error: error,
            codigo: error.code,
            stack: error.stack
        });
    }
});


// Modificar Actualizar videojuego
router.put("/:id", async (req, res) => {

    const { id } = req.params;
    const { nombre, descripcion, lanzamiento, categorias, plataformas } = req.body;
    const queryRunner = AppDataSource.createQueryRunner();

    try {
        if ( !nombre || !Array.isArray(categorias) ) {
            return res.status(400).json({
                mensaje: "Nombre y categorías son obligatorios"
            });
        }

        await queryRunner.connect();
        await queryRunner.startTransaction();

        const videojuegoRepository = queryRunner.manager .getRepository( Videojuego );
        const videojuegoPlataformaRepository = queryRunner.manager.getRepository( VideojuegoPlataforma );
        const videojuegoCategoriaRepository = queryRunner.manager .getRepository( VideojuegoCategoria );

        const resultado = await videojuegoRepository.update(
            Number(id),
            {
                nmVid: nombre,
                descVid: descripcion,
                dateVid: lanzamiento
            }
        );

        if (resultado.affected === 0) {
            await queryRunner .rollbackTransaction();
            return res.status(404).json({
                mensaje: "Videojuego no encontrado"
            });
        }


        //Eliminar las plataformas anteriores
        await videojuegoPlataformaRepository.delete({ idVid: Number(id) });

        if ( Array.isArray(plataformas) && plataformas.length > 0 ) {
            const relacionesPlataformas: VideojuegoPlataforma[] = [];
            for ( const plataforma of plataformas ) {
                const nuevaRelacion = videojuegoPlataformaRepository
                .create({
                    idVid: Number(id),
                    idPlat: Number(plataforma),
                    actvVidPlat: true
                });

                relacionesPlataformas.push( nuevaRelacion );
            }

            await videojuegoPlataformaRepository .save( relacionesPlataformas );
        }


        //Eliminar las categorías anteriores

        await videojuegoCategoriaRepository
        .delete({

            idVid:
                Number(id)
        });

        if ( Array.isArray(categorias) && categorias.length > 0 ) {
            const relacionesCategorias: VideojuegoCategoria[] = [];

            for ( const categoria of categorias ) {
                const nuevaRelacion = videojuegoCategoriaRepository
                .create({
                    idVid: Number(id),
                    idCat: Number(categoria),
                    actvVidCat: true
                });
                relacionesCategorias.push( nuevaRelacion );
            }

            await videojuegoCategoriaRepository .save( relacionesCategorias );
        }
        await queryRunner .commitTransaction();


        res.json({
            mensaje: "Videojuego modificado correctamente",
            id_videojuego: id,
            nombre: nombre,
            descripcion: descripcion,
            lanzamiento: lanzamiento,
            categorias: categorias,
            plataformas: plataformas
        });

    } catch (error: any) {
        if ( queryRunner.isTransactionActive ) {
            await queryRunner .rollbackTransaction();
        }

        console.error(error);

        res.status(500).json({
            mensaje: "Error al modificar videojuego",
            id_videojuego: id,
            nombre: nombre,
            error: error,
            codigo: error.code,
            stack: error.stack
        });

    } finally {
        await queryRunner.release();
    }

});


//Borrado logico de un videojuego
router.delete("/:id", async (req, res) => {

    const { id } = req.params;
    const queryRunner = AppDataSource.createQueryRunner();

    let nombre: string | null = null;

    try {
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const videojuegoRepository = queryRunner.manager
        .getRepository(
            Videojuego
        );

        const videojuegoPlataformaRepository = queryRunner.manager
        .getRepository(
            VideojuegoPlataforma
        );

        const videojuegoCategoriaRepository = queryRunner.manager
        .getRepository(
            VideojuegoCategoria
        );

        const videojuego = await videojuegoRepository.findOne({
            where: {
                idVid: Number(id)
            }
        });


        if (!videojuego) {
            await queryRunner .rollbackTransaction();
            return res.status(404).json({
                mensaje: "Videojuego no encontrado"
            });
        }

        nombre = videojuego.nmVid;

        const resultado = await videojuegoRepository.update(
            Number(id),
            {
                actvVid: false
            }
        );


        if (resultado.affected === 0) {
            await queryRunner .rollbackTransaction();
            return res.status(404).json({
                mensaje: "Videojuego no encontrado"
            });
        }

        //Eliminar logicamente las plataformas anteriores
        await videojuegoPlataformaRepository
            .update(
                {
                    idVid: Number(id)
                },
                {
                    actvVidPlat: false
                }
        );


        //Eliminar logicamente las categorías anteriores
        await videojuegoCategoriaRepository
            .update(
                {
                    idVid: Number(id)
                },
                {
                    actvVidCat: false
                }
            );


        await queryRunner.commitTransaction();


        res.json({
            mensaje: "Videojuego eliminado correctamente",
            id_videojuego: id,
            nombre: nombre
        });


    } catch (error: any) {
        if ( queryRunner.isTransactionActive ) {
            await queryRunner .rollbackTransaction();
        }

        console.error(error);

        res.status(500).json({
            mensaje:"Error al eliminar videojuego",
            id_videojuego: id,
            nombre: nombre,
            error: error,
            codigo: error.code,
            stack: error.stack
        });


    } finally {
        await queryRunner.release();
    }

});


// Revivir un registro inactivo // Actualizar actvVid
router.put("/activar/:id", async (req, res) => {
    const { id } = req.params;
    const queryRunner = AppDataSource.createQueryRunner();

    let nombre: string | null = null;

    try {
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const videojuegoRepository = queryRunner.manager
        .getRepository(
            Videojuego
        );

        const videojuegoPlataformaRepository = queryRunner.manager
        .getRepository(
            VideojuegoPlataforma
        );

        const videojuegoCategoriaRepository = queryRunner.manager
        .getRepository(
            VideojuegoCategoria
        );

        const videojuego = await videojuegoRepository.findOne({
            where: {
                idVid: Number(id)
            }
        });

        if (!videojuego) {
            await queryRunner .rollbackTransaction();
            return res.status(404).json({
                mensaje: "Videojuego no encontrado"
            });
        }

        nombre = videojuego.nmVid;

        const resultado =
            await videojuegoRepository.update(
                Number(id),
                {
                    actvVid: true
                }
            );


        if (resultado.affected === 0) {
            await queryRunner .rollbackTransaction();
            return res.status(404).json({
                mensaje: "Videojuego no encontrado"
            });
        }


        //Activar logicamente las plataformas anteriores
        await videojuegoPlataformaRepository
            .update(
                {
                    idVid: Number(id)
                },
                {
                    actvVidPlat: true
                }
            );


        //Activar logicamente las categorías anteriores
        await videojuegoCategoriaRepository
            .update(
                {
                    idVid: Number(id)
                },
                {
                    actvVidCat: true
                }
            );


        await queryRunner.commitTransaction();


        res.json({
            mensaje: "Videojuego activado correctamente",
            id_videojuego: id,
            nombre: nombre
        });

    } catch (error: any) {
        if (
            queryRunner.isTransactionActive
        ) {
            await queryRunner.rollbackTransaction();
        }

        console.error(error);

        res.status(500).json({
            mensaje: "Error al activar videojuego",
            id_videojuego: id,
            nombre: nombre,
            error: error,
            codigo: error.code,
            stack: error.stack
        });


    } finally {
        await queryRunner.release();
    }


});


//Buscar videojuegos por nombre
router.post("/buscarNm", async (req, res) => {
    const { nombre } = req.body;
    if ( !nombre || nombre.trim() === "" ) {
        return res.status(400).json({
            mensaje: "Nombre es obligatorio para buscar videojuegos"
        });
    }

    try {
        const videojuegoRepository = AppDataSource.getRepository( Videojuego );
        const videojuegos =
            await videojuegoRepository.find({
                where: {
                    nmVid:Like(`%${nombre.trim()}%`)
                },
                relations: {
                    plataformasRelacion: {
                        plataforma: true
                    },
                    categoriasRelacion: {
                        categoria: true
                    }
                }
            });


        const resultado: object[] = [];
        for ( const videojuego of videojuegos ) {
            const plataformas: string[] = [];
            for ( const relacion of videojuego .plataformasRelacion ) {
                if ( relacion.plataforma ) {
                    plataformas.push(
                        relacion.plataforma.nmPlat
                    );
                }
            }

            const plataformasUnicas =[...new Set(plataformas)].sort();

            const categorias: string[] = [];
            for (
            const relacion
                of videojuego.categoriasRelacion
            ) {

                if (relacion.categoria) {

                    categorias.push(
                        relacion.categoria.nmCat
                    );

                }

            }
            const categoriasUnicas = [...new Set(categorias)] .sort();

            resultado.push({
                ID: videojuego.idVid,
                Nombre: videojuego.nmVid,
                "Descripción": videojuego.descVid,
                Lanzamiento: videojuego.dateVid,
                plataformas: plataformasUnicas.length > 0 ? plataformasUnicas.join(", ") : null,
                categorias: categoriasUnicas.length > 0 ? categoriasUnicas.join(", ") : null
            });
        }

        res.json(resultado);

    } catch (error: any) {
        console.error(
            "Error al consultar los videojuegos:", error
        );

        res.status(500).json({
            mensaje: "Error al consultar los videojuegos",
            error: error,
            codigo: error.code,
            stack: error.stack
        });
    }
});

export default router;