// Mayage utils

annualInspection: function(plateDate, lastInspection) {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        logger.D("year,month,day", year, month, day);

        var nowID = parseInt(year.toString() + (month < 9 ? ("0" + month) : month.toString()) + (day < 9 ? ("0" + day) : day.toString()));
        var plateID = parseInt(plateDate.year.toString() + (plateDate.month < 9 ? ("0" + plateDate.month) : plateDate.month.toString()) + (plateDate.day < 9 ? ("0" + plateDate.day) : plateDate.day.toString()));
        logger.D("plateID", plateID);
        // compare nowID & plateID;
    },


    
    readPersist: function() {
        var keyplan = "maintainplan";
        var value = sysprop.get(keyplan, "N");
        if (value !== "N") {
            try {
                var plan = JSON.parse(value);
                this.bindMaintainingPLanProperties(plan);
            } catch (e) {
                log.D(TAG, "readPersist error");
                log.D(TAG, e);
            }
        }

        var keyScore = "persist.mycar.maintainscore";
        var valueScore = sysprop.get(keyScore, "N");
        if (valueScore !== "N") {
            try {
                var score = JSON.parse(valueScore);
                this.bindMaintainingScoreProperties(score);
            } catch (e) {
                log.D(TAG, "readPersist error");
                log.D(TAG, e);
            }
        }
    },

    readFile: function(file, callback) {
        cloudfs.readFile(file, "utf-8", function(err, data) {
            if (err) {
                log.D(TAG, err.message);
            } else {
                try {
                    var value = JSON.parse(data);
                    callback(value);
                } catch (e) {
                    log.D(TAG, e.message);
                }
            }
        });
    },

    writeFile: function(file, data) {
        try {
            cloudfs.writeFile(file, data, "utf-8");
        } catch (e) {
            log.D(TAG, e.message);
        }
    }

    function isEmptyObject(obj) {
    for (var n in obj) {
        if (obj.hasOwnProperty(n)) {
            return false;
        }
    }
    return true;
}