/**
*   Application Logic
*/

define(function(require) {
    'use strict';

    var app = function(options) {
        this.defaults = {
 			deviceReady: function(){}
        };
        this.options = $.extend(this.defaults, options);
    };
 
    app.fn = app.prototype;
    
    app.fn.init = function(){
        var _this = this;
		document.addEventListener('deviceready', function(){
            _this.onDeviceReady();
        }, false);
    };

    app.fn.onDeviceReady = function() {
		this.options.deviceReady();
	};

    return app;
});
