"use strict";
var log = require("util").log;
var path = require("path");
var fs = require("fs");

global.basedir = path.normalize(__dirname);
process.chdir(global.basedir);
var TAG = "MergingService::";

var MergingService = function() {
    var readJSONFiles = function() {
        var path = global.basedir + "/Areas/SettingsApp/Widgets/CC/Resources/10.4Dark/";
        log(TAG, path);
        var fileArray = fs.readdirSync(path);
        var styles = {};
        var stylePath = "";
        for (var i = 0; i < fileArray.length; i++) {
            if (fileArray[i].match(/\.json/) === null) {
                log(TAG, fileArray[i]);
                continue;
            }
            stylePath = path + fileArray[i];
            var str = fs.readFileSync(stylePath, "utf-8");
            styles[fileArray[i].split(".")[0]] = JSON.parse(str);
        }
        var data = JSON.stringify(styles);
        log(TAG, data);
        fs.writeFileSync(path + "mergedJsons.json", data, "utf-8");
        log(TAG, "write file over");
    };
    readJSONFiles();
    log(TAG, "hello ");

};

MergingService();
