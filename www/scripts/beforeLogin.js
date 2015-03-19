/**
*   Main Configuration
*/

'use strict';

require(['app'], function (_app) {
	// var app = new _app({
	// 	deviceReady: function(){
			var getRedirectURL = function(pObj){
				return 'main.html?accessToken=CAATsZC95ci0sBACFfr55fWWNvyYvpXjgMlo1zERib5kPMgM7hjVvFhsJnUnYiZCX8LGBqLWV6jhHozFEycDnII6HlVHc6C6L8gvSZA32hApp9l9jEe0boLV1QiDmyKoGuQHUv0ia11EUxtDgMk7fKvunZA2rj4coGiFy6Cm6CCdf1bZB3zwWfEf7TuUFTWYxlbZAfFZCpH0urOI9iKOwcROZBZC8ElJi3sANhtuVmvCXaBQZDZD&uid=10152697962588581';
				// return "main.html?accessToken=" + pObj.authResponse.accessToken + "&uid=" + pObj.authResponse.userID;
			};
			window.location.href = getRedirectURL();
			// facebookConnectPlugin.getLoginStatus(function(data){
			// 	if(data.status === "connected"){
					// window.location.href = getRedirectURL(data);
			// 	}
			// });
			// $(".facebookLogin").on('click', function(){
			// 	facebookConnectPlugin.login(["public_profile, user_friends"],
			// 		function (userData) {
			// 			if(userData.status === "connected"){
			// 				window.location.href = getRedirectURL(userData);
			// 			}
			// 		},
			// 		function (error) { alert("" + error) }
			// 	);
			// });
	// 	}
	// });
	// app.init();
});
