/**
*   Main Configuration
*/

'use strict';

require(['app'], function (_app) {
	var app = new _app({
		deviceReady: function(){
			var getRedirectURL = function(pObj){
				return "main.html?accessToken=" + pObj.authResponse.accessToken + "&uid=" + pObj.authResponse.userID;
			};
			facebookConnectPlugin.getLoginStatus(function(data){
				if(data.status === "connected"){
					window.location.href = getRedirectURL(data);
				}
			});
			$(".facebookLogin").on('click', function(){
				facebookConnectPlugin.login(["public_profile, user_friends"],
					function (userData) {
						if(userData.status === "connected"){
							window.location.href = getRedirectURL(userData);
						}
					},
					function (error) { alert("" + error) }
				);
			});
		}
	});
	app.init();
});
