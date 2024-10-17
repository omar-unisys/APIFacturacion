const multer = require("multer");
const xlsx = require('xlsx');
const path = require('path');
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

// Configuración de multer para subir el archivo Excel
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('file');

// Función del controlador para leer el archivo Excel y subir los datos
exports.readReporteDisponibilidadExcel = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error('Error al subir el archivo:', err); // Agregar registro del error
            return res.status(500).send({ message: "Error subiendo el archivo." });
        }

        const file = req.file;
        console.log('Archivo recibido:', file);
        if (!file) {
            return res.status(400).send({ message: "No se ha proporcionado ningún archivo." });
        }

        try {
            // Leer el archivo Excel
            const workbook = xlsx.readFile(file.path, { bookVBA: true });
            const sheet_name = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheet_name];
            const jsonData = xlsx.utils.sheet_to_json(worksheet);

            // Filtrar datos donde Testname sea igual a 'conn'
            const filteredData = jsonData.filter(row => row.Testname === 'conn');

            if (filteredData.length === 0) {
                return res.status(400).send({ message: "No se encontraron datos con Testname = 'conn'." });
            }
            console.log("datos filtrados: ",filteredData);
            // Llamar al modelo para insertar los datos filtrados
            Disponibilidad.readReporteDisponibilidadExcel(filteredData, (err, data) => {
                if (err) {
                    console.error('Error al insertar datos en la base de datos:', err); // Agregar registro del error
                    return res.status(500).send({
                        message: err.message || "Ocurrió un error al insertar los datos en la base de datos."
                    });
                }

                res.send(data);
            });
        } catch (error) {
            console.error('Error al procesar el archivo:', error); // Agregar registro del error
            return res.status(500).send({ message: "Error al procesar el archivo." });
        }
    });
};
