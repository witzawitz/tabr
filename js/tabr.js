$(function () {
	// var options = {
	// 	float : true
	// };
	// $('.grid-stack').gridstack(options);
	//
	// new function () {
	// 	this.grid = $('.grid-stack').data('gridstack');
	//
	// 	this.addNewWidget = function () {
	// 		var node = {
	// 			x      : 12 * Math.random(),
	// 			y      : 5 * Math.random(),
	// 			width  : 1 + 3 * Math.random(),
	// 			height : 1 + 3 * Math.random()
	// 		};
	// 		this.grid.addWidget($('<div><div class="grid-stack-item-content">123</div></div>'),
	// 			node.x, node.y, node.width, node.height);
	// 		return false;
	// 	}.bind(this);
	//
	// 	$('#tabr-add').click(this.addNewWidget);
	// };

	rand = function (min, max) {
		return Math.round(Math.random() * (max - min) + min);
	};

	srandom = function (length) {
		var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
		var n     = chars.length - 1;
		var s     = '';
		length    = length || 10;
		for (i = 0; i < length; i++)
			s += chars[ rand(0, n) ];
		return s;
	};

	toggleMode = function () {
		var m    = $("#tabr-manage");
		var mode = m.data("mode");
		if (mode === "view") {
			m.data("mode", "edit");
			$("#tabr-edit").addClass("hidden");
			$("#tabr-add").removeClass("hidden");
			$("#tabr-cancel").removeClass("hidden");
			$('#tabr-container').addClass("active");
			Collection._grid.enable();
		}
		else {
			m.data("mode", "view");
			$("#tabr-edit").removeClass("hidden");
			$("#tabr-add").addClass("hidden");
			$("#tabr-cancel").addClass("hidden");
			$('#tabr-container').removeClass("active");
			Collection._grid.disable();
		}
	};

	var Collection = {
		_grid       : null,
		_data       : [],
		_widgetHtml : '<div><div class="grid-stack-item-content"><div class="tabr-block"><div class="tabr-header"><div class="tabr-favicon"></div><div class="tabr-title"></div><div class="tabr-manage"></div></div><div class="tabr-content"></div><div class="tabr-footer"></div></div></div></div>',
		add         : function (url, title) {
			var w = $(this._widgetHtml);
			w.find(".tabr-title").html(title);
			var b = w.find(".tabr-block");
			b.data("id", srandom());
			b.data("url", url);
			b.on("click", function () {
				var mode = $("#tabr-manage").data("mode");
				if (mode === "view") {
					console.log($(this).data("url"));
				}
			});
			this._grid.addWidget(w, 0, 0, 2, 2, true);
			return false;
		},
		init        : function () {
			var e = $("#tabr-container>.grid-stack");
			e.gridstack({
				float : true
			});
			this._grid = e.data('gridstack');
		}
	};
	Collection.init();

	$("#tabr-edit, #tabr-cancel").click(function () {
		toggleMode();
	});
	$("#tabr-form-save").click(function () {
		Collection.add($("#tabr-form-url").val(), $("#tabr-form-title").val());
		$("#tabr-modal").modal("hide");
		$("#tabr-form-title").val("");
		$("#tabr-form-url").val("");
		$("#tabr-form-save").attr("disabled", "disabled");
	});
	$("#tabr-form-title, #tabr-form-url").on("keyup change", function () {
		var enable = true;
		$("#tabr-modal input").each(function () {
			if ($(this).val().length === 0)
				enable = false;
		});
		if (enable)
			$("#tabr-form-save").removeAttr("disabled");
		else
			$("#tabr-form-save").attr("disabled", "disabled");
	});
});