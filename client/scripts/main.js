/**
*   Main Configuration
*/

'use strict';

require([
		'FacebookHelper', 
		'PopupFriendList', 
		'DebtsCredits', 
		'PageLogin',
		'PageHome',
		'PageDetail',
		'PageFormSecond'
	], function(fbh, pfl, dc, pageLogin, pageHome, pageDetail, pageFormSecond){
	
	var $$ = Dom7, _sgd = (window.sgd) ? window.sgd : {};

	_sgd.accessToken = window.localStorage.getItem('at');
	_sgd.userUID = window.localStorage.getItem('uid');
	_sgd.framework7 = new Framework7();
	_sgd.mainView = _sgd.framework7.addView('.view-main', { domCache: true });

	_sgd.resetForm = function(){
		$('#otherUserID').val('');
		$('#otherUserName').val('');
		$("#debtForm input[name=itemid]").val('');
		$("#debtForm input[name=callback]").val('');
		$('#debtForm')[0].reset();
	};

	_sgd.changeSection = function(pPath, pParam){
		if(_sgd.pageList[pPath]) {
			_sgd.pageList[pPath].onShow(pParam, function(){
				_sgd.mainView.router.load({ pageName: pPath, query: pParam });
			});
		} else {
			_sgd.mainView.router.load({ pageName: pPath, query: pParam });
		}
	};
	_sgd.framework7.onPageAfterAnimation('*', function(page){
		var path = page.name;
		if(_sgd.pageList[path]) _sgd.pageList[path].afterShow(page);
	});
	_sgd.framework7.onPageBeforeAnimation('*', function(page){
		var path = page.name;
		var from = page.fromPage.name;
		if(_sgd.pageList[from]) _sgd.pageList[from].hide(page);
		if(_sgd.pageList[path]) _sgd.pageList[path].beforeShow(page);
	});

	_sgd.popupFriendList = new pfl({
		wrapper: '#friendList',
		inviteTarget: '#nonRegFriend',
		friendTarget: '#regFriend',
		getFriendHandler: function(pCallback){
			_sgd.facebookHelper.getFriendList(pCallback);
		},
		getInvitableHandler: function(pCallback){
			_sgd.facebookHelper.getInvitableList(pCallback);
		}
	});
	_sgd.facebookHelper = new fbh(function(){
		_sgd.debtsCredits.credits.fetchDatas();
	});
	_sgd.submitDebt = function(){
		var _q = {
			isCreatorDebt: $('.debtType .middle').hasClass('creatorDebt'),
			price: parseFloat($('#debtForm input[name=price]').val()) || 0,
			desc: $('#debtForm input[name=desc]').val(),
			otherUserID: $('#otherUserID').val(),
			otherUserName: $('#otherUserName').val(),
			itemid: $("#debtForm input[name=itemid]").val(),
			curUser: sgd.userUID
		};
		if(_q.price != ''){
			$.ajax({
				url: _sgd.apiPrefix + '/api/debtsSubmit',
				dataType: 'jsonp',
				data: _q,
				success: function (data) {
					if(data.status){
						if($('#debtForm input[name=callback]').val() != ''){
							_sgd.debtsCredits.credits.fetchDatas();
							Backbone.history.loadUrl(Backbone.history.fragment);
							_sgd.resetForm();
						} else {
							_sgd.changeSection('home');
						}
					}
				}
			});
		} else {
			sgd.framework7.alert('Please fill in an amount', ['Amount missing']);
		}
	};
	
	_sgd.pageList = {
		login: new pageLogin(),
		home: new pageHome(),
		detail: new pageDetail(),
		'form-second': new pageFormSecond()
	};

	if(_sgd.accessToken && _sgd.userUID){
		_sgd.debtsCredits = new dc();
		$('.userImageContain').html('<img src="http://graph.facebook.com/' + _sgd.userUID + '/picture" height="50" alt="" />');
	} else {
		window.location.href = "index.html";
	}

	$$('.menu-link').on('click', function () {
		var buttons = [
			{
				text: 'Invite friend',
				onClick: function () {
					facebookConnectPlugin.showDialog({
						method: 'apprequests',
						title : 'wooishui',
						message: 'Lets use wooishui to maintain your debts!',
						filters: ['app_non_users']
					}, function(response){
						
					});
				}
			},
			{
				text: 'Sign Out',
				onClick: function () {
					facebookConnectPlugin.logout(function(){
						window.localStorage.setItem("at", '');
						window.localStorage.setItem("uid", '');
						window.location.href = 'index.html';
					}, function(){
						_sgd.framework7.alert('Logout fail', ['Please try again']);
					});
				}
			}
		];
		_sgd.framework7.actions(buttons);
	});
	$("#dataListDetailWrap .icon-plus").on('click', function(){
		var _userUID = $(this).data('uid');
		var _userData = _sgd.debtsCredits.getUserByUID($(this).data('uid')).toJSON();
		var _userName = (_userData.debtorsUID === _userUID) ? _userData.debtorsName : _userData.creditorName;
		$('input#otherUserName').val(_userName);
		$('input#otherUserID').val(_userUID);
		_sgd.changeSection('form-second');
	});
	$('.debtType .left').on('click', function(){
		$('.debtType .middle').addClass('creatorDebt');
	});
	$('.debtType .right').on('click', function(){
		$('.debtType .middle').removeClass('creatorDebt');
	});
	$('.debtType .middle').on('click', function(){
		if($(this).hasClass('creatorDebt'))
			$(this).removeClass('creatorDebt');
		else 
			$(this).addClass('creatorDebt');
	});
	$('#menu a.internal').on('click', function(){
		_sgd.changeSection($(this).attr('href'));
		_sgd.framework7.closePanel();
		return false;
	});
	$('#inviteFriend').on('opened', function () {
		_sgd.popupFriendList.startLoading();
	});
	$('#friendList').on('opened', function () {
		_sgd.popupFriendList.startLoading();
	});
	$('.friendListSearch').on('input', function(){
		var curText = $(this).val();
		var target = $(this).data('target');
		if(curText != ''){
			var filtered = $(target + ' .item-content').filter(function(pIndex, pEl){
				return $(pEl).find('.item-title').text().indexOf(curText) > -1;
			});
			$(target + ' .item-content').hide();
			filtered.show();
		} else {
			$(target + ' .item-content').show();
		}
	});
});