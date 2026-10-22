const express = require("express");
const { Like } = require("typeorm");

const { AppDataSource } = require("../data-source");
const { Categoria } = require("../entities/Categoria");

const router = express.Router();

/* * CRUD: CREATE, READ, UPDATE, DELETE  */

// CONSULTAR TODAS LAS CATEGORIAS
router.get("/", async (req, res) => {

    try {

        const categoriaRepository =
            AppDataSource.getRepository(Categoria);

        const categorias =
            await categoriaRepository.find();

        res.json(categorias);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al consultar las categorías"
        });

<<<<<<< HEAD
    }
=======
  } catch (error) {

      console.error(error);

      res.status(500).json({
          mensaje: "Error al consultar categorías",
          error: error
      });

  }
>>>>>>> 17c6afc77f01d76e86800ee0b34520a6cd4701b2

});


// consulta por ID
router.get("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const categoriaRepository =
            AppDataSource.getRepository(Categoria);

        // Prepared Statements
        const categoria =
            await categoriaRepository.findOne({

                where: {
                    idCat: Number(id)
                }

            });


        if (!categoria) {

            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });

        }


        res.json({

            ID: categoria.idCat,

            Nombre: categoria.nmCat,

            Activo:
                categoria.actvCat
                    ? "Si"
                    : "No"

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al consultar la categoría"
        });

    }

});


// Agregar
router.post("/", async (req, res) => {

    try {

        const { nombre } = req.body;


        if (!nombre || nombre.trim() === "") {

            return res.status(400).json({
                mensaje: "El nombre de la categoría es obligatorio"
            });

        }


        const categoriaRepository =
            AppDataSource.getRepository(Categoria);


        const nuevaCategoria =
            categoriaRepository.create({

                nmCat: nombre,

                actvCat: true

            });


        const resultado =
            await categoriaRepository.save(
                nuevaCategoria
            );


        res.status(201).json({

            mensaje:
                "Categoría creada correctamente",

            id_categoria:
                resultado.idCat

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al crear la categoría"
        });

    }

});


// Actualizar
router.put("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const { nombre } = req.body;


        if (!nombre || nombre.trim() === "") {

            return res.status(400).json({
                mensaje: "El nombre de la categoría es obligatorio"
            });

        }


        const categoriaRepository =
            AppDataSource.getRepository(Categoria);


        const resultado =
            await categoriaRepository.update(

                Number(id),

                {
                    nmCat: nombre
                }

            );


        if (resultado.affected === 0) {

            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });

        }


        res.json({

            mensaje:
                `Categoría modificada correctamente en ${id}`

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al modificar la categoría"
        });

    }

});


// Borrar, inactivar, deshabilitar, inhabilitar, quitar.... etc...
router.delete("/:id", async (req, res) => {

    try {

        const { id } = req.params;


        const categoriaRepository =
            AppDataSource.getRepository(Categoria);


        const resultado =
            await categoriaRepository.update(

                Number(id),

                {
                    actvCat: false
                }

            );


        if (resultado.affected === 0) {

            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });

        }


        res.json({

            mensaje:
                "Categoría eliminada correctamente",

            idModificado: id

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al eliminar la categoría"
        });

    }

});


// Buscar en Categorias
router.post("/buscar", async (req, res) => {

    try {

        const { nombre } = req.body;


        if (!nombre || nombre.trim() === "") {

            return res.status(400).json({
                mensaje: "Debe proporcionar un nombre para buscar"
            });

        }


        const categoriaRepository =
            AppDataSource.getRepository(Categoria);


        const resultado =
            await categoriaRepository.find({

                where: {

                    nmCat:
                        Like(`%${nombre}%`)

                }

            });


        const respuesta: object[] = [];


        for (const categoria of resultado) {

            respuesta.push({

                ID:
                    categoria.idCat,

                Nombre:
                    categoria.nmCat,

                Activo:
                    categoria.actvCat
                        ? "Si"
                        : "No"

            });

        }


        res.json(respuesta);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al buscar categorías"
        });

    }

});


// Revivir un registro inactivo // Actualizar actvCat
router.put("/activar/:id", async (req, res) => {

    try {

        const { id } = req.params;


        const categoriaRepository =
            AppDataSource.getRepository(Categoria);


        const resultado =
            await categoriaRepository.update(

                Number(id),

                {
                    actvCat: true
                }

            );


        if (resultado.affected === 0) {

            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });

        }


        res.json({

            mensaje:
                `Categoría modificada correctamente en ${id}`

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al activar la categoría"
        });

    }

});

module.exports = router;