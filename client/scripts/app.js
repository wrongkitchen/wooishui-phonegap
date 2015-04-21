/**
*   Application Logic
*/

'use strict';

define(function(require) {

    var app = function(options) {
        this.defaults = {
 			deviceReady: function(){}
        };
        this.options = $.extend(this.defaults, options);
    };
 
    app.fn = app.prototype;
    
    app.fn.init = function(){
        var _this = this;
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
    		
            document.addEventListener('deviceready', function(){
                _this.onDeviceReady();
            }, false);
        
        } else {
            $(".facebookLogin").on('click', function(){
                window.location.href = 'main.html?accessToken=CAATsZC95ci0sBALFOpH9R49q2eTKqPUR0aY3fv0cOF2eSI121JPUtmaNrOdYay7YOLAecogqCMOnzZCsBqKkEEZBmA5FcqUZBHPz4mqdxGz82osRPfQnUb6fRI6Emy3GQvjRMtg7xuxIkQlZCsGVHHCKiRhL4H3KikqYxZATCjIheffLlPJBtdRZChm3ZB0pJ4ZBSiFjZBhJBD9v68DcCIKGCdZAa0ZCeRLfEdaBylFhSv8cb8UPLL9QZBpYI&uid=10152697962588581';
            });
        }
    };

    app.fn.onDeviceReady = function() {
		this.options.deviceReady();
	};

    return app;
});
