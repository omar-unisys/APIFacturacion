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
      idPropietarioFilial : req.body.idPropietarioFilial,
      idFilialPago : req.body.idFilialPago,
      Marca : req.body.Marca,
      Modelo : req.body.Modelo,
      NombreEquipo : req.body.NombreEquipo,
      DireccionIp : req.body.DireccionIp,
      TipoRed : req.body.TipoRed,
      Pais : req.body.Pais,
      Sede : req.body.Sede,
      Edificio : req.body.Edificio,
      Piso : req.body.Piso,
      Ubicacion : req.body.Ubicacion,
      TipoServicio : req.body.TipoServicio,
      DetalleServicio : req.body.DetalleServicio,
      Administrable : req.body.Administrable,
      FechaSoporte : req.body.FechaSoporte,
      SoporteDetalle : req.body.SoporteDetalle,
      FechaGarantia : req.body.FechaGarantia,
      GarantiaDetalle : req.body.GarantiaDetalle,
      FechaEoL : req.body.FechaEoL,
      EolDetalle : req.body.EolDetalle,
      VrsFirmware : req.body.VrsFirmware,
      NumPuertos : req.body.NumPuertos,
      idEstado : req.body.idEstado,
      FechaIngreso : req.body.FechaIngreso,
      FechaModificacion : req.body.FechaModificacion,
      Comentario : req.body.Comentario,
      Conectado : req.body.Conectado,
      InStock : req.body.InStock,
      FechaInStock: req.body.FechaInStock
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

exports.createHistorico = (req, res) => {

  // Valida el cuerpo del mensaje
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).send({
      message: "El contenido no puede ser vacío!"
    });
  }
  
  // Guarda el historico de Red en la base de datos
  Red.createHistorico(req.body, (err, data) => {
    if (err)
        res.status(500).send({
            message:
              err.message || "Algún error ha ocurrido mientras se crea el historico de Red."
        });
        else {
          // actualizamos los datos dados en la tabla de inventario
          Red.updateById(
            req.body.idSerial,
            new Red(req.body),
            (err, data) => {
              if (err) {
                if (err.kind === "not_found") {
                  res.status(404).send({
                    message: `No se encontró la Red con id ${req.body.idSerial}.`
                  });
                } else {
                  res.status(500).send({
                    message: "Error actualizando la Red con id " + req.body.idSerial + ' ' + err
                  });
                }
              } else res.send(data);
            }
          );
        }
  });
};


exports.getxTipoHistorico = (req, res) => {
  Red.findAllxTipoHistorico(req.params.id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Ha ocurrido un error mientras retornaba la información."
      });
    else res.send(data);
  });
};

exports.findByIdxHistorico = (req, res) => {
Red.findByIdxHistorico(req.params.id, (err, data) => {
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