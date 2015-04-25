"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var config    = require(__dirname + '/../config/config.json');
var sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, config.db);
var db        = {};

console.log(__dirname );

var sequelize_fixtures = require('sequelize-fixtures'),
    models = {
      Cliente: require('./cliente')
    };

sequelize.sync();

sequelize_fixtures.loadFile(__dirname + '/../fixtures/data.json', models).then(function(){
  console.log("Fixtures loaded!");
});


fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.match('\\.js')=='.js' && (file !== "index.js"));
    })
    .forEach(function(file) {
        var model = sequelize["import"](path.join(__dirname, file));
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
