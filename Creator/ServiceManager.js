"use strict";
var lang = require("caf/core/lang");
var Event = require("caf/core/Event");
var fs = require("fs");

var ServiceManager = lang.extend(Event, {
    constructor: function() {
        this._services = [];
        this._config = null;
        ServiceManager.superclass.constructor.apply(this);
        this._loadConfig();
        this.initialize();
        return this;
    },
    initialize: function() {
        for (var i = 0; i < this._config.services.length; i++) {
            var config = this._config.services[i];
            try {
                var Service = require("../" + config.path);
                var instance = null;
                if (config.scope && config.scope === "singleton") {
                    instance = new Service();
                }
                this._services.push({
                    "name": config.name,
                    "scope": config.scope,
                    "class": Service,
                    "instance": instance
                });
            } catch (e) {
                console.log("######Error:: when initialize service:" + config.name + ":", e);
            }

        }
    },
    _loadConfig: function() {
        try {
            var configStr = fs.readFileSync("../service.json", "utf-8");
            this._config = JSON.parse(configStr);
        } catch (e) {
            throw new Error("######Error:: when load service config file:" + e.toString());
        }
    },
    get: function(serviceName) {
        var services = this._services.filter(function(e) {
            return e.name === serviceName;
        });
        if (services.length != 0) {
            if (services[0].scope === "singleton") {
                return services[0].instance;
            } else {
                return new services[0].class();
            }

        } else {
            throw new Error("Error: service do not exist!");
        }
    }
});

module.exports = ServiceManager;
