const multer = require("multer");
const Disponibilidad = require("../models/disponibilidad.model.js");

//Funcionqpara llamar al modelo que crea registos  en la tabla Línea Base de la base de datos
exports.create = async (req, res) => {
    try {
        // Validar el cuerpo del mensaje
        const { Filial, Dispositivo, Criticidad, Cantidad } = req.body;

        if (!Filial) {
            return res.status(400).send({ message: "El campo 'Filial' no puede estar vacío." });
        }
        if (!Dispositivo) {
            return res.status(400).send({ message: "El campo 'Dispositivo' no puede estar vacío." });
        }
        if (!Criticidad) {
            return res.status(400).send({ message: "El campo 'Criticidad' no puede estar vacío." });
        }
        if (Cantidad == null) {
            return res.status(400).send({ message: "El campo 'Cantidad' no puede estar vacío." });
        }

        // Crear Linea Base
        const lb = new Disponibilidad({ Filial, Dispositivo, Criticidad, Cantidad });

        // Guardar la Linea Base en la base de datos
        Disponibilidad.create(lb, (err, data) => {
            if (err) {
                return res.status(500).send({
                    message: err.message || "Ocurrió un error mientras se creaba la Linea Base."
                });
            }
            return res.status(201).send(data);
        });
    } catch (error) {
        console.error("Error al crear la Linea Base:", error);
        return res.status(500).send({ message: "Ocurrió un error interno del servidor." });
    }
};

//Funcionqpara llamar al modelo que consulta los registos de la tabla Línea Base de la base de datos
exports.getDisponibilidad = (req, res) => {
    const title = req.query.title;
    // console.log(req.query)

    Disponibilidad.getDisponibilidad(title, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Ha ocurrido un error mientras retornaba la información de la Línea Base."
        });
      else res.send(data);
    });
};