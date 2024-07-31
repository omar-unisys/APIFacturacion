const express = require("express");
const cors = require("cors");
// const router = require("./routes/aseguramiento.routes.js");
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

let corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

require("./routes/facturacion.routes.js")(app);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la API rest de Facturación." });
});


const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Servidor ejecutandose sobre el puerto ${PORT}.`);
});