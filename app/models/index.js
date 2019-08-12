import fs from "fs";
import path from "path";
import Sequelize from "sequelize";

const config = require(path.join(__dirname, "..", "config", "config.json"))[env];
const sequelize = new Sequelize(config.database, config.username, config.password, config);
const db = {};
const env = process.env.NODE_ENV;

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });
 
Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});
 
db.sequelize = sequelize;
db.Sequelize = Sequelize;
 
module.exports = db;