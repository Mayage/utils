"use strict";
var ServiceManager = require("./ServiceManager");
var sm = new ServiceManager();

var power = sm.get("SystemPower");
power.DisplayPowerCtrl(0, 1);

