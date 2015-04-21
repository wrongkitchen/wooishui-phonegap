'use strict';

define(function(){

	return Backbone.View.extend({
		
		el: '#dataListDetail',
		
		wrapper: '#dataListDetailWrap',
		
		detailTemplate: _.template($("#detailTmpl").html()),
		
		initialize: function(options){
			this.options = options;
			this.listenTo(this.options.credits, 'all', this.render);
		},
		
		events: {
			'click .removeBtn' : 'settleItem',
			'click .rejectBtn' : 'rejectItem'
		},
		
		render: function(){
			var _view = this;
			var _credits = _view.options.credits;

			_view.$el.empty();

			if(_credits.length){
				$(_view.wrapper).show();
				_credits.each(function(credit){
					var obj = credit.toJSON();
					if(obj.creditorUID == sgd.userUID){
						obj.creatorName = (obj.creatorUID == sgd.userUID) ? obj.creditorName : obj.debtorsName;
					} else {
						obj.price *= -1;
						obj.creatorName = (obj.creatorUID == sgd.userUID) ? obj.debtorsName : obj.creditorName;
					}
					obj.settlable = (obj.creatorUID == sgd.userUID) ? true : false;
					_view.$el.prepend(_view.detailTemplate(obj));
				});
			} else {
				$(_view.wrapper).hide();
			}
		},
		
		settleItem: function(e){
			var itemID = $(e.currentTarget).data('itemid');
			var _view  = this;
			var _credits = _view.options.credits;
			$.ajax({
				url: sgd.apiPrefix + '/api/debtsRemove',
				dataType: 'jsonp',
				data: { itemid: itemID, uid: sgd.userUID },
				success: function (data) {
					if(data.status){
						_credits.remove(_credits.where({ _id: itemID }));
						if(_credits.length <= 0)
							sgd.changeSection('home');
					}
				}
			});
		},
		
		rejectItem: function(e){
			var _view = this;
			var itemID = $(e.currentTarget).data('itemid');

			sgd.framework7.prompt('Why do u reject this debt?', 'Reject debt', function (value) {
				if(value != ""){
					$.ajax({
						url: sgd.apiPrefix + '/api/debtsReject',
						type: 'get',
						dataType: 'jsonp',
						data: { itemid: itemID, reason: value, uid: sgd.userUID },
						success: function (data) {
							if(data.status){
								sgd.framework7.swipeoutDelete("#item_" + itemID, function(a,b,c){
									var _item = _view.options.credits.where({ _id : itemID });
									var _removed = _view.options.credits.remove(_item);
									_removed[0].set({ reject:value });

									_view.options.rejectItemCallback(_removed[0]);
								
								});
							}
						}
					});
				}
			});
		}

	});
});