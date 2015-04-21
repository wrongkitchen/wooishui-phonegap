'use strict';

define([], function(){
	return Backbone.Model.extend({

		initialize: function(){
			var sgd = (window.sgd) ? window.sgd : {};
			if(sgd.fbAppID){
				window.fbAsyncInit = function() {
					FB.init({
						appId      : sgd.fbAppID,
						xfbml      : true,
						version    : 'v2.2'
					});
					FB.getLoginStatus();
				};

				(function(d, s, id){
					var js, fjs = d.getElementsByTagName(s)[0];
					if (d.getElementById(id)) {return;}
					js = d.createElement(s); js.id = id;
					js.src = "https://connect.facebook.net/en_US/sdk.js";
					fjs.parentNode.insertBefore(js, fjs);
				}(document, 'script', 'facebook-jssdk'));
			}
		},

		getFriendList: function(pCallback){
			FB.api('/me/friends', {
				access_token : sgd.accessToken
			}, function(response) {
 				pCallback(response);
			});
		},
		getInvitableList: function(pCallback){
			FB.api('/me/taggable_friends', {
					access_token : sgd.accessToken
				}, function(response) {
 				pCallback(response);
			});
		}
	});
});