"use strict";
var lang = require("caf/core/lang");
var Event = require("caf/core/Event");
var fs = require("fs");
var xml2js = require("xml2js");
var ejs = require("ejs");

var ServiceCreator = lang.extend(Event, {
    constructor: function() {
        this._services = [];
        this._config = null;
        this._template = null;
        ServiceCreator.superclass.constructor.apply(this);
        this._loadTemplate();
        this._loadConfig();
        this.initialize();
        return this;
    },
    initialize: function() {
        for (var i = 0; i < this._config.services.length; i++) {
            var name = this._config.services[i].name;
            this._services.push({
                "name": name,
                "isReady": false
            });
        }
        for (var i = 0; i < this._config.services.length; i++) {
            var con = this._config.services[i];
            this.parseService(con.name, con.busName, con.busPath, con.filePath);
        }
    },
    _loadConfig: function() {
        var configStr = fs.readFileSync("../creator.json", "utf-8");
        this._config = JSON.parse(configStr);
    },
    _loadTemplate: function() {
        this._template = fs.readFileSync(__dirname + "/template.ejs", "utf8");
    },
    parseService: function(name, busName, busPath, filePath) {
        var xmlString = fs.readFileSync("../Xml/" + filePath, "utf8");
        // In this region : new a xml2js parser and use it to parse .xml file
        var parser = new xml2js.Parser({
            mergeAttrs: false,
            explicitArray: true,
            charsAsChildren: true,
            async: true
        });
        // this.createCode is the callback function
        // callback binds this, takes name-busName-busPath as self defined parameter
        // callback takes err-result as callback function
        parser.parseString(xmlString, this.displayNode.bind(this));

        // parser.parseString(xmlString, this.createCode.bind(this, name, busName, busPath));
    },
    displayNode: function(err, result) {
        var fileName = "../Proxy/" + className + "Fake" + ".js"
        fs.writeFileSync(fileName, code, "utf8");
        console.log("Done");
    },
    createCode: function(className, busName, busPath, err, result) {

        result.node.busName = busName;
        result.node.busPath = busPath;
        result.node.className = className;
        var code = ejs.render(this._template, {
            node: result.node
        });
        var fileName = "../Proxy/" + className + ".js"
        fs.writeFileSync(fileName, code, "utf8");
        var service = this.services(className);
        service.isReady = true;
        if (this.isReady()) {
            this.emit("ready");
        }
        console.log("Done");
    },
    services: function(serviceName) {
        var services = this._services.filter(function(e) {
            return e.name === serviceName;
        });
        if (services.length != 0) {
            return services[0];
        } else {
            throw new Error("Error: service do not exist!");
        }
    },
    isReady: function() {
        return this._services.every(function(e) {
            return e.isReady === true;
        });
    }
});

module.exports = new ServiceCreator();