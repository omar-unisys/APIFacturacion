module.exports = {
  HOST: process.env.REACT_APP_SQL_HOST || "10.3.1.4",
  USER: process.env.REACT_APP_SQL_USER || "usr_facturacion",
  PASSWORD: process.env.REACT_APP_SQL_PASSWORD || "usr_facturacion",
  DB: process.env.REACT_APP_SQL_DB || "bd_facturacion",
  PORT: process.env.REACT_APP_SQL_PORT || 3306
};