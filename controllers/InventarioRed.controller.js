const Red = require("../models/inventarioRed.model.js");

exports.getAll = (req, res) => {
    const title = req.query.title;
    // console.log(req.query)

    Red.getAll(title, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Ha ocurrido un error mientras retornaba la información."
        });
      else res.send(data);
    });
};



exports.findById = (req, res) => {
  Red.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No se encontró la información con id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Ha ocurrido retornando la información con id " + req.params.id
        });
      }
    } else res.send(data);
  });
};


exports.update = (req, res) => {
  // Validate Request
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).send({
      message: "Contenido no puede ser vacío!"
    });
  }

  Red.updateById(
    req.params.id,
    new Red(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No se encontró la Red con id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error actualizando la Red con id " + req.params.id + ' ' + err
          });
        }
      } else res.send(data);
    }
  );
};

exports.create = (req, res) => {

    // Valida el cuerpo del mensaje
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).send({
        message: "El contenido no puede ser vacío!"
      });
    }    

    // Create la Red
    const red = new Red({
      idSerial : req.body.idSerial,
      idFilial : req.body.idFilial,
      idCriticidad : req.body.idCriticidad,
      idTipoEquipo : req.body.idTipoEquipo,
      idPropieatarioFilial : req.body.idPropieatarioFilial,
      idFilialPago : req.body.idFilialPago,
      marca : req.body.marca,
      modelo : req.body.modelo,
      nombreEquipo : req.body.nombreEquipo,
      direccionIp : req.body.direccionIp,
      tipoRed : req.body.tipoRed,
      pais : req.body.pais,
      sede : req.body.sede,
      edificio : req.body.edificio,
      piso : req.body.piso,
      ubicacion : req.body.ubicacion,
      tipoServicio : req.body.tipoServicio,
      detalleServicio : req.body.detalleServicio,
      administrable : req.body.administrable,
      fechaSoporte : req.body.fechaSoporte,
      soporteDetalle : req.body.soporteDetalle,
      fechaGarantia : req.body.fechaGarantia,
      garantiaDetalle : req.body.garantiaDetalle,
      fechaEoL : req.body.fechaEoL,
      eolDetalle : req.body.eolDetalle,
      vrsFirmware : req.body.vrsFirmware,
      numPuertos : req.body.numPuertos,
      idEstado : req.body.idEstado,
      fechaIngreso : req.body.fechaIngreso,
      fechaModificacion : req.body.fechaModificacion,
      comentario : req.body.comentario,
      conectado : req.body.conectado,
      inStock : req.body.inStock
  });
  
    // Guarda la Red en la base de datos
    Red.create(red, (err, data) => {
      if (err)
          res.status(500).send({
              message:
                err.message || "Algún error ha ocurrido mientras se crea la Red."
          });
      else res.send(data);
    });
};

exports.delete = (req, res) => {
  Red.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No se encontró la Red con id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "No se puede eliminar la Red con id " + req.params.id + ' ' + err
        });
      }
    } else res.send({ message: `La Red con id ${req.params.id} fue eliminada satisfactoriamente!` });
  });
};