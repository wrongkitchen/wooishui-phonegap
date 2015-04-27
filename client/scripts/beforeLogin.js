/**
*   Main Configuration
*/

'use strict';

require([], function() {

	if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
			
		var setDataRedirect = function(pObj){
			window.localStorage.setItem("at", pObj.authResponse.accessToken);
			window.localStorage.setItem("uid", pObj.authResponse.userID);
			window.location.href = 'main.html';
		};

		document.addEventListener('deviceready', function(){

			if(window.localStorage.getItem('at') && window.localStorage.getItem('uid')){
				window.location.href = 'main.html';
			} else {
				facebookConnectPlugin.getLoginStatus(function(data){
					if(data.status === 'connected'){
						setDataRedirect(data);
					} else {
						$('#beforeLogin').fadeIn();
					}
				});
			}

			$('.facebookLogin').on('click', function(){
				facebookConnectPlugin.login(['public_profile, user_friends'],
					function (data) {
						if(data.status === 'connected'){
							setDataRedirect(data);
						}
					},
					function (error) { alert('' + error); }
				);
			});

		}, false);


	
	} else {

		$(document).ready(function(){

			$('#beforeLogin').fadeIn();

			$('.facebookLogin').on('click', function(){
				// Kenji Wong
				window.localStorage.setItem("at", 'CAATsZC95ci0sBALFOpH9R49q2eTKqPUR0aY3fv0cOF2eSI121JPUtmaNrOdYay7YOLAecogqCMOnzZCsBqKkEEZBmA5FcqUZBHPz4mqdxGz82osRPfQnUb6fRI6Emy3GQvjRMtg7xuxIkQlZCsGVHHCKiRhL4H3KikqYxZATCjIheffLlPJBtdRZChm3ZB0pJ4ZBSiFjZBhJBD9v68DcCIKGCdZAa0ZCeRLfEdaBylFhSv8cb8UPLL9QZBpYI');
				window.localStorage.setItem("uid", '10152697962588581');

				// Herman Tao
				// window.localStorage.setItem("at", '"CAATsZC95ci0sBACCLWZBURAwDWD5lP4quk7FXfvQsixIZBpQSVExupbfVcGfvgpFZA4xEYy1AYuWoVtgbc1NPfl7VSzPmrUAHMRE2TTLjztf9v0aDDkk5e6H6mpICjf65nYMqCwM2na51bWhMkCfw7HMPFAozbKu0oAVZCE9OktPS14ZBYanDg9n24oNeHKgeGYRthRPivzsOhJGeD7Q8q2TpZAlGQbpanWjupQQvASsGeZAm9cQXesf"');
				// window.localStorage.setItem("uid", '847120868686417');
				
				window.location.href = 'main.html';
			});
			
		});

	}


});
