$(function () {
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
			$("#tabr-save").removeClass("hidden");
			$('#tabr-container').addClass("active");
			TABR._grid.enable();
		}
		else {
			m.data("mode", "view");
			$("#tabr-edit").removeClass("hidden");
			$("#tabr-add").addClass("hidden");
			$("#tabr-save").addClass("hidden");
			$('#tabr-container').removeClass("active");
			TABR._grid.disable();
		}
	};

	var TABR = {
		_grid       : null,
		_data       : [],
		_storage    : browser.storage.sync,
		_widgetHtml : $("#tabr-item").html(),
		add         : function (url, title) {
			var w = $(this._widgetHtml);
			w.find(".tabr-title").html(title);
			w.find(".tabr-url").html(url);
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
	TABR.init();

	$("#tabr-edit, #tabr-save").click(function () {
		toggleMode();
	});
	$("#tabr-form-save").click(function () {
		TABR.add($("#tabr-form-url").val(), $("#tabr-form-title").val());
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