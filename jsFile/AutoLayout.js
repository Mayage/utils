"use strict";

var lang = require("caf/core/lang");
var View = require("caf/ui/View");


var TAG = "AutoLayout::";
/**
 * Auto update a view's Layout
 * @author mayage
 *
 *
 * abandon GridView's method
 *  -GridView(150) extended from AdapterView
 *  -AdapterView(1000) extended from Flickable
 *
 * View's childrenRec
 * simply a view to fullfill the layout
 * -needs childview's added time;
 * -needs childviews' size info;
 * -needs childviews' animation;
 * -needs on childviews' size changed function;
 * -needs getChildViews
 *
 * extend method for all childviews to atract
 *
 * row-column with height-width
 *
 * when row or column Layout:
 * -animation is defined by subview itself;
 * -this AutoLayout's total width(row) or height(column) is calculated
 * -but AutoLayout's total height(row) or width(column) should be defined
 * -when subViews's size changed, AutoLayout's size is changed to
 */

/**
 * onadd a child view
 * define the child views's position and record it in a list;
 *
 */

var AutoLayout = lang.extend(View, {
    /* @private */
    __defaultOptions: {
        implicitWidth: 100,
        implicitHeight: 100,
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
        this.singleRow = false;
        this.singleColumn = false;
        this.multiRow = false;
        this.multiColumn = false;
        AutoLayout.superclass.constructor.apply(this, arguments);
        return this;
    },
    onCreate: function() {
        AutoLayout.superclass.onCreate.apply(this, arguments);
        logger.D(TAG, "onCreate");
    },

    /* @interface */

    set rows(value) {
        if (value > 0 && isInteger(value)) {
            this._rows = value;
        } else {
            throw new Error("AutoLayout::rows must be integer and larger than 0");
        }
    },
    get rows() {
        return this._rows || 0;
    },

    set columns(value) {
        if (value > 0 && isInteger(value)) {
            this._columns = value;
        } else {
            throw new Error("AutoLayout::columns must be integer and larger than 0");
        }
    },
    get columns() {
        return this._columns || 0;
    },

    set flow(value) {
        if (value >= 0 && value <= 1 && isInteger(value)) {
            this._flow = value;
        } else {
            throw new Error("AutoLayout::flow support Horizontal and Vertical and should be integer");
        }
    },
    get flow() {
        return this._flow || AutoLayout.FlowDirection.Horizontal;
    },

    set rowSpacing(value) {
        if (value >= 0 && isInteger(value)) {
            this._rowSpacing = value;
        } else {
            throw new Error("AutoLayout::rowSpacing should be a positive integer");
        }
    },
    get rowSpacing() {
        return this._rowSpacing || 1;
    },

    set columnSpacing(value) {
        if (value >= 0 && isInteger(value)) {
            this._columnSpacing = value;
        } else {
            throw new Error("AutoLayout::columnSpacing should be a positive integer");
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
            throw new Error("AutoLayout::spacings should be a positive integer");
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

        for (var i = 0; i < this.subViews.length; i++) {
            if (i === 0) {
                this.subViews[0].x = 0;
                this.subViews[0].y = 0;
            } else {
                if (this.flow === AutoLayout.FlowDirection.Vertical) {
                    if (this.singleColumn) {
                        this.subViews[i].left = this.subViews[i - 1].left;
                        this.subViews[i].top = this.subViews[i - 1].bottom;
                        this.subViews[i].marginTop = this.rowSpacing;
                    } else if (this.multiRow) {
                        if (i % this.rows !== 0) {
                            if (i / this.rows < 1) {
                                this.subViews[i].left = this.subViews[i - 1].left;
                            } else {

                                this.subViews[i].left = this.subViews[i - this.rows].right;
                                this.subViews[i].marginLeft = this.columnSpacing;
                            }
                            this.subViews[i].top = this.subViews[i - 1].bottom;
                            this.subViews[i].marginTop = this.rowSpacing;
                        } else {
                            this.subViews[i].left = this.subViews[i - this.rows].right;
                            this.subViews[i].top = this.subViews[i - this.rows].top;
                            this.subViews[i].marginLeft = this.columnSpacing;
                        }
                    }

                } else if (this.flow === AutoLayout.FlowDirection.Horizontal) {
                    if (this.singleRow) {
                        this.subViews[i].top = this.subViews[i - 1].top;
                        this.subViews[i].left = this.subViews[i - 1].right;
                        this.subViews[i].marginLeft = this.columnSpacing;
                    } else if (this.multiColumn) {
                        if (i % this.columns !== 0) {
                            if (i / this.columns < 1) {
                                this.subViews[i].top = this.subViews[i - 1].top;
                            } else {
                                this.subViews[i].top = this.subViews[i - this.columns].bottom;
                                this.subViews[i].marginTop = this.rowSpacing;
                            }
                            this.subViews[i].left = this.subViews[i - 1].right;
                            this.subViews[i].marginLeft = this.columnSpacing;
                        } else {
                            this.subViews[i].left = this.subViews[i - this.columns].left;
                            this.subViews[i].top = this.subViews[i - this.columns].bottom;
                            this.subViews[i].marginTop = this.rowSpacing;
                        }
                    }
                }
            }
        }
        this.width = this.childrenRect[2] + 10;
        this.height = this.childrenRect[3] ;

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
        if (this.rows === 0 && this.columns === 1) {
            this.flow = AutoLayout.FlowDirection.Vertical;
            logger.D(TAG, "configered as column layout");
            this.singleColumn = true;
        } else if (this.rows === 1 && this.columns === 0) {
            this.flow = AutoLayout.FlowDirection.Horizontal;
            logger.D(TAG, "configered as row layout");
            this.singleRow = true;
        } else if (this.rows === 0 && this.columns > 1) {
            this.flow = AutoLayout.FlowDirection.Horizontal;
            logger.D(TAG, "configered as row layout with multi columns");
            this.multiColumn = true;
        } else if (this.rows > 1 && this.columns === 0) {
            this.flow = AutoLayout.FlowDirection.Vertical;
            logger.D(TAG, "configered as column layout with multi rows");
            this.multiRow = true;
        } else if (this.rows > 1 && this.columns > 1) {
            logger.D(TAG, "configered as multi column and multi rows layout");
        } else {
            logger.D(TAG, "configered failure");
            throw new Error("AutoLayout checkingConfig failure");
        }
        var i;
        if (this.singleRow || this.multiRow) {
            logger.D(TAG, "binding widthchange");
            for (i = 0; i < this.subViews.length; i++) {
                this.subViews[i].on("widthchange", this.AdaptViewSize.bind(this));
            }
        } else if (this.singleColumn || this.multiColumn) {
            logger.D(TAG, "binding heightchange");
            for (i = 0; i < this.subViews.length; i++) {
                this.subViews[i].on("heightchange", this.AdaptViewSize.bind(this));
            }
        }
    },
    AdaptViewSize: function() {
        logger.D(TAG, "AdaptViewSize");
        var len = this.subViews.length;
        var i;
        if (this.singleRow) {
            this.width = this.subViews[len - 1].x + this.subViews[len - 1].width;
        } else if (this.singleColumn) {
            this.height = this.subViews[len - 1].y + this.subViews[len - 1].height;
        } else if (this.multiRow) {
            this.width = this.subViews[len - 1].x + this.subViews[len - 1].width;
            var w = 0;
            for (i = 1; i < this.rows; i++) {
                w = this.subViews[len - 1 - i].x + this.subViews[len - 1 - i].width;
                if (w > this.width) {
                    this.width = w;
                }
            }
        } else if (this.multiColumn) {
            this.height = this.subViews[len - 1].y + this.subViews[len - 1].height;
            var h = 0;
            for (i = 1; i < this.columns; i++) {
                h = this.subViews[len - 1 - i].y + this.subViews[len - 1 - i].height;
                if (h > this.height) {
                    this.height = h;
                }
            }
        }
    }
});


var isInteger = function(obj) {
    return (obj | 0) === obj;
};

AutoLayout.FlowDirection = {
    Horizontal: 0,
    Vertical: 1
};
module.exports = AutoLayout;
