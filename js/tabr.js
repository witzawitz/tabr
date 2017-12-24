$(document).ready(function () {
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
		_grid            : null,
		_data            : [],
		_db              : null,
		_storage         : browser.storage.sync,
		_widgetHtml      : $("#tabr-item").html().replace(/[\n|\t]/g, ""),
		add              : function (url, title, width, height, x, y) {
			var item = {
				id     : srandom(),
				title  : title,
				url    : url,
				width  : width || 2,
				height : height || 2,
				x      : x || 0,
				y      : y || 0
			};
			var auto = !(width && height && x && y) || true;

			var w = $(this._widgetHtml);
			w.find(".tabr-title").html(item.title);
			w.find(".tabr-url").html(item.url);

			var b = w.find(".tabr-block");
			b.data("id", item.id);
			b.data("url", item.url);
			b.on("click", function () {
				var mode = $("#tabr-manage").data("mode");
				if (mode === "view") {
					window.location = $(this).data("url");
				}
			});
			this._grid.addWidget(w, item.x, item.y, item.width, item.height, auto, 1, 2, 1, 2, item.id);
			var node    = this._getGridNodeById(item.id);
			item.height = node.height;
			item.width  = node.width;
			item.x      = node.x;
			item.y      = node.y;
			this._data.push(item);
			this._storage.set({
				data : this._data
			});
			return false;
		},
		init             : function () {
			var e = $("#tabr-container>.grid-stack");
			e.gridstack({
				float : true
			});
			this._grid = e.data('gridstack');

			this._storage.get("data").then(function (item) {
				if (typeof item.data !== "undefined") {
					var data = item.data;
					for (var i = 0; i < data.length; i++)
						TABR.add(data[ i ].url, data[ i ].title, data[ i ].width, data[ i ].height, data[ i ].x, data[ i ].y);
				}
			});

			this._db = new Dexie("Tabr");
		},
		_getGridNodeById : function (id) {
			var nodes = this._grid.grid.nodes;
			for (var i = 0; i < nodes.length; i++)
				if (nodes[ i ].id === id)
					return nodes[ i ];
			return null;
		},
		_makeScreenshot  : function (url) {
			var link = "https://www.googleapis.com/pagespeedonline/v1/runPagespeed?url=" + url + "&screenshot=true&callback=?";
			$.getJSON(link, function (json) {
				if (typeof json.screenshot !== "undefined" && typeof json.screenshot.data !== "undefined") {
					var t = json.screenshot.mime_type;
					var b = json.screenshot.data.replace(/_/g, "/").replace(/\-/g, "+");
					$("body").append($("<img/>").attr("src", "data:" + t + ";base64," + b));
				}
			}).fail(function (a, b, c) {
				console.log(a);
				console.log(b);
				console.log(c);
			});
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
			if (!$(this)[ 0 ].checkValidity()) {
				enable = false;
				$(this)[ 0 ].reportValidity();
			}
		});
		if (enable)
			$("#tabr-form-save").removeAttr("disabled");
		else
			$("#tabr-form-save").attr("disabled", "disabled");
	});

	TABR._makeScreenshot("https://mipt.lectoriy.ru");
});