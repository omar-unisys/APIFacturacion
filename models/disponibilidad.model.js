const db = require("./db.js");

// constructor
const Disponibilidad = function(reportedisponibilidad) {
    this.Client = reportedisponibilidad.Client;
    this.Host = reportedisponibilidad.Host;
    this.Start_Date = reportedisponibilidad.Start_Date;
    this.End_Date = reportedisponibilidad.End_Date;
    this.Days = reportedisponibilidad.Days;
    this.Testname = reportedisponibilidad.Testname;
    this.Availability = reportedisponibilidad.Availability;
    this.Downtime = reportedisponibilidad.Downtime;
    this.Type = reportedisponibilidad.Type;
    this.Page = reportedisponibilidad.Page;
    this.Group = reportedisponibilidad.Group;
    this.Comment = reportedisponibilidad.Comment;
    this.Name_Alias = reportedisponibilidad.Name_Alias;
    this.Description_1 = reportedisponibilidad.Description_1;
    this.Description_2 = reportedisponibilidad.Description_2;
    this.Description_3 = reportedisponibilidad.Description_3;
};


Disponibilidad.getDisponibilidad = async (req, result) => {
    try {
        db.query('SELECT * FROM tbl_reportedisponibilidad;', (err, res) => {
            if (err) {
                result( err.message, null);
                return;
            }
            result(null, res);
        });
    } catch (error) {
        console.error('Error al consultar: ', error);
        result(error, null);
    }
};

Disponibilidad.readReporteDisponibilidadExcel = async (filteredData, result) => {
    const query = `
        INSERT INTO tbl_reportedisponibilidad 
        (Client, Host, Start_Date, End_Date, Days, Testname, Availability, Downtime, Type, Page, \`Group\`, Comment, Name_Alias, Description_1, Description_2, Description_3)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Utiliza un Promise para manejar las inserciones
    const promises = filteredData.map(row => {
        const values = [
            row.Client, 
            row.Host, 
            new Date(row['Start Date']), 
            new Date(row['End Date']), 
            row.Days, 
            row.Testname, 
            row['Availability(%)'], 
            row['Downtime (h:m:s)'], 
            row.Type, 
            row.Page, 
            row.Group, 
            row.Comment, 
            row.Name || row.Alias, 
            row['Description 1'], 
            row['Description 2'], 
            row['Description 3']
        ];

        return new Promise((resolve, reject) => {
            db.query(query, values, (err, res) => {
                if (err) {
                    console.log('Error al insertar en la base de datos:', err);
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    });

    // Ejecutar todas las promesas de inserción
    Promise.all(promises)
        .then(() => {
            result(null, { message: "Datos subidos correctamente." });
        })
        .catch(err => {
            result(err, null);
        });
};

module.exports = Disponibilidad;