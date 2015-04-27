'use strict';

define(function(){
	return Backbone.View.extend({
		el: '#dataList',
		mainListTemplate: _.template($("#mainListTmpl").html()),
		events: {
			'click .item-content' : 'showDetail'
		},
		initialize: function(options){
			this.options = options;
			this.listenTo(this.options.credits, 'all', this.render);
		},
		render: function(){
			var _view = this;
			var _credits = _view.options.credits;
			var allData = new Backbone.Collection();
				allData.comparator = 'name';
			var userUID = sgd.userUID;
			
			_view.$el.empty();
			if(_credits.length){
				_credits.each(function(credit){
					var obj = credit.toJSON();
					var checkDataModel = function(pObj, pIndexKey){
						var dataModel = allData.where(pObj);
						var _price = (pIndexKey == 'debtorsUID') ? obj.price : (obj.price * -1);
						if(dataModel.length<=0){
							var _name = (pIndexKey == 'debtorsUID') ? (obj.debtorsName) : (obj.creditorName);
							allData.add({ 
								id: obj[pIndexKey],
								name: _name,
								price: (obj.reject) ? 0 : _price,
								rejected: !!(obj.reject)
							});
						} else {
							var curPrice = dataModel[0].get('price');
							dataModel[0].set({ price: curPrice + ((obj.reject) ? 0 : _price) });
							if(obj.reject) dataModel[0].set({ rejected : true });
						}
					}
					if(obj.creditorUID == userUID){
						checkDataModel({ id: obj.debtorsUID }, 'debtorsUID');
					} else {
						checkDataModel({ id: obj.creditorUID }, 'creditorUID');
					}
				});
				allData.each(function(pModel){
					var obj = pModel.toJSON();
					_view.$el.append(_view.mainListTemplate(obj));
				});
				$('#dataListError').hide();
				$('#dataListWrap').show()
			} else {
				$('#dataListError').show();
				$('#dataListWrap').hide();
			}
		},
		showDetail: function(e){
			var cid = $(e.currentTarget).find('.cid').val();
			sgd.changeSection('detail', [cid]);
		}
	});
});