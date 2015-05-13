'use strict';

define('RejectedView', function(){
	return Backbone.View.extend({
		el: '#rejectListDetail',
		wrapper: '#rejectListDetailWrap',
		detailTemplate: _.template($("#rejectedTmpl").html()),
		initialize: function(options){
			this.options = options;
			this.listenTo(this.options.credits, 'all', this.render);
		},
		events: {
			'click .rebornBtn' : 'rebornItem',
			'click .acceptBtn' : 'acceptItem'
		},
		rebornItem: function(e){
			var itemID = $(e.currentTarget).data('itemid');
			var _view  = this;
			var _credits = _view.options.credits;
			var _reborn = _credits.where({ _id:itemID });
			var _r = _reborn[0].toJSON();
			var isCreatorDebt = (_r.creatorUID === _r.debtorsUID);
			if(isCreatorDebt)
				$(".debtType .middle").addClass('creatorDebt');
			else
				$(".debtType .middle").removeClass('creatorDebt');
			$("#debtForm input[name=price]").val(_r.price);
			$("#debtForm input[name=desc]").val(_r.desc);
			$("#otherUserID").val((isCreatorDebt) ? _r.creditorUID : _r.debtorsUID);
			$("#otherUserName").val((isCreatorDebt) ? _r.creditorName : _r.debtorsName);
			$("#debtForm input[name=itemid]").val(itemID);
			$("#debtForm input[name=callback]").val((isCreatorDebt) ? _r.creditorUID : _r.debtorsUID);
			sgd.changeSection('form-second', [], true);
		},
		acceptItem: function(e){
			var itemID = $(e.currentTarget).data('itemid');
			var _view  = this;
			var _credits = _view.options.credits;
			$.ajax({
				url: sgd.apiPrefix + '/api/debtsAccept',
				dataType: 'jsonp',
				data: { itemid: itemID, uid: sgd.userUID },
				success: function (data) {
					if(data.status){
						var _remove = _credits.remove(_credits.where({ _id:itemID }));
							_remove[0].set({ reject : "" });
						
						_view.options.acceptItemCallback(_remove[0]);
					}
				}
			});
		},
		render: function(){
			var _view = this;
			var userUID = sgd.userUID;
			_view.$el.empty();
			if(_view.options.credits.length){
				_view.options.credits.each(function(credit){
					$(_view.wrapper).show();
					var obj = credit.toJSON();
					if(obj.creditorUID == userUID){
						obj.creatorName = (obj.creatorUID == userUID) ? obj.creditorName : obj.debtorsName;
					} else {
						obj.price *= -1;
						obj.creatorName = (obj.creatorUID == userUID) ? obj.debtorsName : obj.creditorName;
					}
					obj.creator = (obj.creatorUID == userUID) ? true : false;
					_view.$el.append(_view.detailTemplate(obj));
				});
			} else {
				$(_view.wrapper).hide();
			}
		}
	});
});