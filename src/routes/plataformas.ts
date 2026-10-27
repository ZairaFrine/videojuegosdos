export {};
const express = require("express");
const { Like } = require("typeorm");

const { AppDataSource } = require("../data-source");
const { Plataforma } = require("../entities/Plataforma");

const router = express.Router();

/* * CRUD: CREATE, READ, UPDATE, DELETE  */

/*//Consultar todas las plataformas*/
router.get("/", async (req, res) => {
    try {
      const plataformaRepository = AppDataSource.getRepository(Plataforma);
      const plataformas = await plataformaRepository.find();
      res.json(plataformas);

    } catch (error) {
      console.error(error);
      res.status(500).json({
        mensaje: "Error al consultar las plataformas",
        error: error
      });
    }
});


/*// consulta por ID*/
router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const plataformaRepository = AppDataSource.getRepository(Plataforma);
      const plataforma = await plataformaRepository.findOne({
        where: {
          idPlat: Number(id)
        }
      });

      if (!plataforma) {
        return res.status(404).json({ 
          mensaje: "Plataforma no encontrada"
        });
      }

      res.json({
        ID: plataforma.idPlat,
        Nombre: plataforma.nmPlat,
        Activo: plataforma.actvPlat ? "Si" : "No"
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        mensaje: "Error al consultar la plataforma",
        error: error
      });
    }
});


/*// Agregar*/
router.post("/", async (req, res) => {

    try {
      const { nombre } = req.body;
      if (!nombre || nombre.trim() === "") {
        return res.status(400).json({
          mensaje: "El nombre de la plataforma es obligatorio"
        });
      }

      const plataformaRepository = AppDataSource.getRepository(Plataforma);
      const nuevaPlataforma =
      plataformaRepository.create({
        nmPlat: nombre,
        actvPlat: true
      });

      const resultado = await plataformaRepository.save(
        nuevaPlataforma
      );

      res.status(201).json({
        mensaje: "Plataforma creada correctamente",
        id_plataforma: resultado.idPlat
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        mensaje: "Error al crear la plataforma",
        error: error
      });
    }
});


/*// Actualizar*/
router.put("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre } = req.body;
      if (!nombre || nombre.trim() === "") {
        return res.status(400).json({
          mensaje: "El nombre de la plataforma es obligatorio"
        });
      }

      const plataformaRepository = AppDataSource.getRepository(Plataforma);
      const resultado =
      await plataformaRepository.update(
        Number(id),
        {
          nmPlat: nombre
        }
      );

      if (resultado.affected === 0) {
        return res.status(404).json({
            mensaje: "Plataforma no encontrada"
        });
      }

      res.json({
          mensaje: "Plataforma actualizada correctamente",
          id_plataforma: id
      });


    } catch (error) {
      console.error(error);
      res.status(500).json({
        mensaje: "Error al actualizar la plataforma",
        error: error
      });
    }
});


/*// Eliminar (desactivar)*/
router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const plataformaRepository = AppDataSource.getRepository(Plataforma);
      const resultado = await plataformaRepository.update(
        Number(id),
        {
          actvPlat: false
        }
      );

      if (resultado.affected === 0) {
        return res.status(404).json({
          mensaje: "Plataforma no encontrada"
        });
      }

      res.json({
        mensaje: "Plataforma desactivada correctamente",
        id_plataforma: id
      });

    } catch (error) {

      console.error(error);
      res.status(500).json({
        mensaje: "Error al desactivar la plataforma",
        error: error
      });
    }
});


/*//Buscar por nombre*/
router.get("/buscar/:nombre", async (req, res) => {

    try {
      const { nombre } = req.params;
      if (!nombre || nombre.trim() === "") {
        return res.status(400).json({
          mensaje: "El nombre para buscar es obligatorio"
        });
      }

      const plataformaRepository = AppDataSource.getRepository(Plataforma);
      const plataformas = await plataformaRepository.find({
        where: {
          nmPlat: Like(`%${nombre}%`)
        }
      });

      const resultado: object[] = [];
      for (const plataforma of plataformas) {
        resultado.push({
          ID: plataforma.idPlat,
          Nombre: plataforma.nmPlat,
          Activo: plataforma.actvPlat ? "Si" : "No"
        });
      }

      res.json(resultado);

    } catch (error) {

        console.error(error);
        res.status(500).json({
          mensaje: "Error al buscar plataformas",
          error: error
        });
    }
});


/*// Revivir un registro inactivo*/
router.put("/activar/:id", async (req, res) => {

    try {
      const { id } = req.params;
      const plataformaRepository = AppDataSource.getRepository(Plataforma);
      const resultado = await plataformaRepository.update(
        Number(id),
        {
          actvPlat: true
        }
      );


      if (resultado.affected === 0) {
        return res.status(404).json({
          mensaje: "Plataforma no encontrada"
        });
      }

      res.json({
        mensaje: "Plataforma activada correctamente",
        id_plataforma: id
      });

    } catch (error) {

      console.error(error);
      res.status(500).json({
        mensaje: "Error al activar la plataforma",
        error: error
      });
    }
});

module.exports = router;