"use strict";

var lang = require("caf/core/lang");
var View = require("caf/ui/View");

var TAG = "FreestyleLayout::";
/**
 * Auto update a view's Layout
 * @author mayage
 *
 * FreestyleLayout
 * -when height is defined
 * --subviews will be added top-bottom-left-right
 * --the total width is calculated
 * -when width is defined
 * --subviews will be added left-right-top-bottom
 * --the total height is calculated
 */

var FreestyleLayout = lang.extend(View, {
    /* @private */
    __defaultOptions: {
        implicitWidth: 0,
        implicitHeight: 0,
        background: "red"
    },
    /* @private */
    constructor: function() {
        this.subViews = [];
        this._rowSpacing = null;
        this._columnSpacing = null;
        this._spacings = null;
        this._flow = null;
        this._rows = null;
        this._columns = null;
        this.fixedWidth = false;
        this.fixedHeight = false;
        FreestyleLayout.superclass.constructor.apply(this, arguments);
        return this;
    },
    onCreate: function() {
        FreestyleLayout.superclass.onCreate.apply(this, arguments);
        logger.D(TAG, "onCreate");
    },

    /* @interface */

    set rows(value) {
        if (value > 0 && isInteger(value)) {
            this._rows = value;
        } else {
            throw new Error("FreestyleLayout::rows must be integer and larger than 0");
        }
    },
    get rows() {
        return this._rows || 0;
    },

    set columns(value) {
        if (value > 0 && isInteger(value)) {
            this._columns = value;
        } else {
            throw new Error("FreestyleLayout::columns must be integer and larger than 0");
        }
    },
    get columns() {
        return this._columns || 0;
    },

    set flow(value) {
        if (value >= 0 && value <= 1 && isInteger(value)) {
            this._flow = value;
        } else {
            throw new Error("FreestyleLayout::flow support Horizontal and Vertical and should be integer");
        }
    },
    get flow() {
        return this._flow || FreestyleLayout.FlowDirection.Horizontal;
    },

    set rowSpacing(value) {
        if (value >= 0 && isInteger(value)) {
            this._rowSpacing = value;
        } else {
            throw new Error("FreestyleLayout::rowSpacing should be a positive integer");
        }
    },
    get rowSpacing() {
        return this._rowSpacing || 1;
    },

    set columnSpacing(value) {
        if (value >= 0 && isInteger(value)) {
            this._columnSpacing = value;
        } else {
            throw new Error("FreestyleLayout::columnSpacing should be a positive integer");
        }
    },
    get columnSpacing() {
        return this._columnSpacing || 1;
    },

    set spacings(value) {
        if (value >= 0 && isInteger(value)) {
            this._spacings = value;
            this._rowSpacing = value;
            this._columnSpacing = value;
        } else {
            throw new Error("FreestyleLayout::spacings should be a positive integer");
        }
    },
    get spacings() {
        return this._spacings || 1;
    },


    /* @public methods */
    /**
     * add animations for child views asynchronously
     * @return null
     */
    initialize: function() {
        this.subViews = this.getChildViews();
        this.checkingConfig();
    },
    updateLayout: function() {
        this.lastRowHeight = 0;
        this.lastColumnWidth = 0;
        for (var i = 0; i < this.subViews.length; i++) {
            if (this.fixedWidth) {
                if (this.subViews[i].width > this.width) {
                    logger.D(TAG, "subview's width larger than container's width");
                    throw new Error("subview's width larger than container's width");
                }
            } else if (this.fixedHeight) {
                if (this.subViews[i].height > this.height) {
                    logger.D(TAG, "subview's height larger than container's height");
                    throw new Error("subview's height larger than container's height");
                }
            }

            if (i === 0) {
                this.subViews[0].x = 0;
                this.subViews[0].y = 0;
                if (this.fixedWidth) {
                    this.lastRowHeight = this.subViews[0].height;
                } else if (this.fixedHeight) {
                    this.lastColumnWidth = this.subViews[0].width;
                }
            } else {
                this.subViews[i].x = 0;
                this.subViews[i].y = 0;
                this.subViews[i].left = null;
                this.subViews[i].top = null;
                if (this.fixedWidth) {
                    if (this.subViews[i].width + this.subViews[i - 1].x + this.subViews[i - 1].width + this.columnSpacing < this.width) {
                        // i & i-1 are in the same row
                        this.subViews[i].top = this.subViews[i - 1].top;
                        this.subViews[i].left = this.subViews[i - 1].right;
                        this.subViews[i].marginLeft = this.columnSpacing;
                        if (this.subViews[i].height > this.lastRowHeight) {
                            // i's height is the largest in this row
                            this.lastRowHeight = this.subViews[i].height;
                        }
                    } else {
                        // i & i-1 are in the different rows
                        // one row's height change should not affect another
                        this.subViews[i].y = this.subViews[i - 1].y + this.lastRowHeight + this.rowSpacing;
                        this.subViews[i].x = this.subViews[0].x;
                        this.lastRowHeight = this.subViews[i].height;
                    }
                } else if (this.fixedHeight) {
                    if (this.subViews[i].height + this.subViews[i - 1].y + this.subViews[i - 1].height + this.rowSpacing < this.height) {
                        // i & i-1 are in the same column
                        this.subViews[i].left = this.subViews[i - 1].left;
                        this.subViews[i].top = this.subViews[i - 1].bottom;
                        this.subViews[i].marginTop = this.rowSpacing;
                        if (this.subViews[i].width > this.lastColumnWidth) {
                            // i's width is the largest in this column
                            this.lastColumnWidth = this.subViews[i].width;
                        }
                    } else {
                        // i & i-1 are in the different columns
                        // one column's width change should not affect another
                        this.subViews[i].x = this.subViews[i - 1].x + this.lastColumnWidth + this.columnSpacing;
                        this.subViews[i].y = this.subViews[0].y;
                        this.lastColumnWidth = this.subViews[i].width;
                    }
                }
            }
        }
        if (this.fixedWidth) {
            this.height = this.childrenRect[3];
        } else if (this.fixedHeight) {
            this.width = this.subViews[this.subViews.length - 1].x + this.subViews[this.subViews.length - 1].width;
        }

    },
    transitionEnabled: function() {

    },
    PreAnimation: function() {

    },
    DuringAnimation: function() {

    },
    EndAnimation: function() {

    },
    checkingConfig: function() {
        if (this.width > 0) {
            logger.D(TAG, "configered as fixed width layout");
            this.fixedWidth = true;
        } else if (this.height > 0) {
            logger.D(TAG, "configered as fixed width layout");
            this.fixedHeight = true;
        } else {
            logger.D(TAG, "meaninglessly configuration");
            throw new Error("meaninglessly configuration");
        }
        var i;
        var sizeChange = function(event) {
            logger.D(TAG, event);
            if (!this.timeID) {
                this.timeID = setTimeout(function() {
                            logger.D(TAG, "on setTimeout call");
                            clearTimeout(this.timeID);
                            this.timeID = null;
                            this.updateLayout.call(this);
                        }.bind(this), 200);
            }
        };
        if (this.fixedWidth) {
            logger.D(TAG, "binding widthchange");
            for (i = 0; i < this.subViews.length; i++) {
                this.subViews[i].on("widthchange", sizeChange.bind(this, "widthchange"));
            }
        } else if (this.fixedHeight) {
            logger.D(TAG, "binding heightchange");
            for (i = 0; i < this.subViews.length; i++) {
                this.subViews[i].on("heightchange", sizeChange.bind(this, "heightchange"));
            }
        }
    }

});


var isInteger = function(obj) {
    return (obj | 0) === obj;
};

FreestyleLayout.FlowDirection = {
    Horizontal: 0,
    Vertical: 1
};
module.exports = FreestyleLayout;
