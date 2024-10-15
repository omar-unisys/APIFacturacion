const xlsx = require('xlsx');
const multer = require('multer');
const path = require('path');
const ReporteDisponibilidad = require('../models/inventarioFactura.model.js');
const InventarioFactura = require("../models/inventarioFactura.model.js");

exports.getInventarioFactura = (req, res) => {
    const title = req.query.title; // Si necesitas algún filtro
  
    InventarioFactura.getAll(title, (err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || "Ha ocurrido un error mientras retornaba la información."
            });
        } else {
            res.send(data);
        }
    });
};

// Función en el controlador para actualizar ValorUnitarioUSD en tbl_facturasinventariored
exports.actualizarValorUnitario = (req, res) => {
    console.log('estoy en el controlador de la API valor unitario');
    InventarioFactura.updateValorUnitarioUSD((err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Ha ocurrido un error durante la actualización de los datos."
            });
        } else {
            res.send(data);
        }
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

            // Llamar al modelo para insertar los datos filtrados
            ReporteDisponibilidad.readReporteDisponibilidadExcel(filteredData, (err, data) => {
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
