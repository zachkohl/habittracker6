import { builtinModules } from "module";

var sqlite3 = require("sqlite3").verbose();

export function write(sql, params) {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database("./database.db", (err) => {
      if (err) {
        console.error(err.message);
      }
    });

    db.run(sql, params, function (err, rows) {
      console.log(err);
      if (err) {
        console.log(err);
        //   throw err;
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });

    // close the database connection
    db.close();
  });
}

export function read(sql, params) {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database("./database.db", (err) => {
      if (err) {
        console.error(err.message);
      }
    });

    db.all(sql, params, (err, rows) => {
      if (err) {
        console.log(err);
        //   throw err;
        reject(err);
      }
      if (rows) {
        resolve(rows);
      } else {
        resolve(null);
      }
    });

    // close the database connection
    db.close();
  });
}

export function parallel(params) {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database("./database.db", (err) => {
      if (err) {
        console.error(err.message);
      }
    });

    db.parallelize(() => {
      for (let i = 0; i < params.length; i++) {
        db.run(params[i].sql, params[i].params, (err, rows) => {
          if (err) {
            console.log(err);
            //   throw err;
            reject(err);
          }
        });
      }
    });

    // close the database connection
    db.close();
  });
}
