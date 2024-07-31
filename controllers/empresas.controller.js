const Empresas = require("../models/empresas.model.js");

exports.getAll = (req, res) => {
    const title = req.query.title;
    // console.log(req.query)

    Empresas.getAll(title, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Ha ocurrido un error mientras retornaba la información."
        });
      else res.send(data);
    });
};

exports.findById = (req, res) => {
  Empresas.findById(req.params.id, (err, data) => {
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

  Empresas.updateById(
    req.params.id,
    new Empresas(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No se encontró la empresa con id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error actualizando la empresa con id " + req.params.id + ' ' + err
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

    // Create la empresa
    const empresa = new Empresas({
      id: req.body.id,
      nombre: req.body.nombre,
      horasasignadas: req.body.horasasignadas
    });

    // Guarda la Empresa en la base de datos
    Empresas.create(empresa, (err, data) => {
      if (err)
          res.status(500).send({
              message:
                err.message || "Algún error ha ocurrido mientras se crea la empresa."
          });
      else res.send(data);
    });
};

exports.delete = (req, res) => {
  Empresas.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No se encontró la empresa con id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "No se puede eliminar la empresa con id " + req.params.id + ' ' + err
        });
      }
    } else res.send({ message: `La empresa con id ${req.params.id} fue eliminada satisfactoriamente!` });
  });
};