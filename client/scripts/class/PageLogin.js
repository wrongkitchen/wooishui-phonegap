'use strict';

define('PageLogin', ['PageBase'], function(pb){

	var _sgd = (window.sgd) ? window.sgd : {};
	var pushNotification = cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");

	return pb.extend({
		initialize: function(){

			if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
				
				var beforeLogin = function(pObj){
					pushNotification.registerDevice(
						function(status) {
							var deviceToken = status['deviceToken'];
							console.warn('registerDevice: ' + deviceToken);
						},
						function(status) {
							console.warn('failed to register : ' + JSON.stringify(status));
							alert(JSON.stringify(['failed to register ', status]));
						}
					);
					 
					pushNotification.setApplicationIconBadgeNumber(0);

					window.localStorage.setItem("at", pObj.authResponse.accessToken);
					window.localStorage.setItem("uid", pObj.authResponse.userID);
					_sgd.changeSection('home');
				};

				document.addEventListener('deviceready', function(){

					document.addEventListener('push-notification', function(event) {
						var notification = event.notification;
						alert(notification.aps.alert);
						pushNotification.setApplicationIconBadgeNumber(0);
					});

					pushNotification.onDeviceReady({ pw_appid:"01C24-D0542" });
					 
					if(window.localStorage.getItem('at') && window.localStorage.getItem('uid')){
						_sgd.changeSection('home');
					} else {
						facebookConnectPlugin.getLoginStatus(function(data){
							if(data.status === 'connected'){
								beforeLogin(data);
							}
						});
					}

					$('.facebookLogin').on('click', function(){
						facebookConnectPlugin.login(['public_profile, user_friends'],
							function (data) {
								if(data.status === 'connected'){
									beforeLogin(data);
								}
							},
							function (error) { alert('' + error); }
						);
					});

				}, false);


			
			} else {
				$('.facebookLogin').on('click', function(){
					// Kenji Wong
					window.localStorage.setItem("at", 'CAATsZC95ci0sBALFOpH9R49q2eTKqPUR0aY3fv0cOF2eSI121JPUtmaNrOdYay7YOLAecogqCMOnzZCsBqKkEEZBmA5FcqUZBHPz4mqdxGz82osRPfQnUb6fRI6Emy3GQvjRMtg7xuxIkQlZCsGVHHCKiRhL4H3KikqYxZATCjIheffLlPJBtdRZChm3ZB0pJ4ZBSiFjZBhJBD9v68DcCIKGCdZAa0ZCeRLfEdaBylFhSv8cb8UPLL9QZBpYI');
					window.localStorage.setItem("uid", '10152697962588581');

					// Herman Tao
					// window.localStorage.setItem("at", '"CAATsZC95ci0sBACCLWZBURAwDWD5lP4quk7FXfvQsixIZBpQSVExupbfVcGfvgpFZA4xEYy1AYuWoVtgbc1NPfl7VSzPmrUAHMRE2TTLjztf9v0aDDkk5e6H6mpICjf65nYMqCwM2na51bWhMkCfw7HMPFAozbKu0oAVZCE9OktPS14ZBYanDg9n24oNeHKgeGYRthRPivzsOhJGeD7Q8q2TpZAlGQbpanWjupQQvASsGeZAm9cQXesf"');
					// window.localStorage.setItem("uid", '847120868686417');
					
					_sgd.changeSection('home', { 
						at: 'CAATsZC95ci0sBALFOpH9R49q2eTKqPUR0aY3fv0cOF2eSI121JPUtmaNrOdYay7YOLAecogqCMOnzZCsBqKkEEZBmA5FcqUZBHPz4mqdxGz82osRPfQnUb6fRI6Emy3GQvjRMtg7xuxIkQlZCsGVHHCKiRhL4H3KikqYxZATCjIheffLlPJBtdRZChm3ZB0pJ4ZBSiFjZBhJBD9v68DcCIKGCdZAa0ZCeRLfEdaBylFhSv8cb8UPLL9QZBpYI',
						uid: '10152697962588581'
					});
				});
			}

		}
	});

});
