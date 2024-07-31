module.exports = app => {
  const empresas = require("../controllers/empresas.controller.js");

  let router = require("express").Router();

  // Retorna una aplicación
  router.get("/empresas/", empresas.getAll);

  // Retorna una aplicación con id
  router.get("/empresas/:id", empresas.findById);

  // Retorna una aplicación con id
  router.post("/empresas/", empresas.create);

  // Retorna una aplicación con id
  router.put("/empresas/:id", empresas.update);

  // Retorna una aplicación con id
  router.delete("/empresas/:id", empresas.delete);

  app.use('/api/v1/facturacion', router);
  
};