import express from "express";

import { AppDataSource } from "../data-source";
import { Categoria } from "../entities/Categoria";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categoriaRepository = AppDataSource.getRepository(Categoria);
    const categorias =
        await categoriaRepository.find({
            where: {
                actvCat: true
            }
        });
    res.json(categorias); //Misma salida en JSON

  } catch (error) {

      console.error(error);

      res.status(500).json({
          mensaje: "Error al consultar categorías"
      });

  }

});

export default router;