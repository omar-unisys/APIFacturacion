module.exports = app => {
  const empresas = require("../controllers/empresas.controller.js");

  let router = require("express").Router();

  // -------------Empresas---------------------
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

  // -------------INVENTARIO RED---------------------
  const red = require("../controllers/inventarioRed.controller.js");

  // Retorna lista de red
  router.get("/invred/", red.getAll);



  app.use('/api/v1/facturacion', router);
  
};