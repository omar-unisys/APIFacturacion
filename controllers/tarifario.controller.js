const multer = require("multer");
const Tarifario = require("../models/lineaBase.model.js");

//Funcion para llamar al modelo que crea registos  en la tabla Tarifario
exports.create = async (req, res) => {
    try {
        // Validar el cuerpo del mensaje
        const { TipoDispositivo, Criticidad, ValorUnitario, SLA, CantidadBaseContrato } = req.body;

        if (!TipoDispositivo) {
            return res.status(400).send({ message: "El campo 'TipoDispositivo' no puede estar vacío." });
        }
        if (!Criticidad) {
            return res.status(400).send({ message: "El campo 'Criticidad' no puede estar vacío." });
        }
        if (ValorUnitario === null) {
            return res.status(400).send({ message: "El campo 'ValorUnitario' no puede estar vacío." });
        }
        if (!SLA) {
            return res.status(400).send({ message: "El campo 'SLA' no puede estar vacío." });
        }
        if (CantidadBaseContrato == null) {
            return res.status(400).send({ message: "El campo 'CantidadBaseContrato' no puede estar vacío." });
        }

        // Crear Tarifario
        const tarifario = new Tarifario({ TipoDispositivo, Criticidad, ValorUnitario, SLA, CantidadBaseContrato});

        // Guardar el Tarifario en la base de datos
        Tarifario.create(tarifario, (err, data) => {
            if (err) {
                return res.status(500).send({
                    message: err.message || "Ocurrió un error mientras se insertaban datos en la tabla Tarifario."
                });
            }
            return res.status(201).send(data);
        });
    } catch (error) {
        console.error("Error al crear el Tarifario:", error);
        return res.status(500).send({ message: "Ocurrió un error interno del servidor." });
    }
};

//Funcion para llamar al modelo que consulta los registos de la tabla Tarifario
exports.getTarifario = (req, res) => {
    const title = req.query.title;
    // console.log(req.query)

    Tarifario.getTarifario(title, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Ha ocurrido un error mientras retornaba la información de la Línea Base."
        });
      else res.send(data);
    });
};