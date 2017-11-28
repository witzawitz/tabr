module.exports = function (grunt) {
	grunt.initConfig({
		pkg   : grunt.file.readJSON('package.json'),
		copy  : {
			css    : {
				files : [
					{
						expand  : true,
						flatten : true,
						src     : [
							'jquery-ui/jquery-ui.min.css',
							'node_modules/gridstack/dist/gridstack.min.css',
							'node_modules/bootstrap/dist/css/bootstrap.min.css'
						],
						dest    : '../css/'
					}
				]
			},
			js_lib : {
				files : [
					{
						expand  : true,
						flatten : true,
						src     : [
							'jquery-ui/jquery-ui.min.js',
							'node_modules/jquery/dist/jquery.min.js',
							'node_modules/lodash/lodash.min.js',
							'node_modules/gridstack/dist/gridstack.all.js',
							'node_modules/bootstrap/dist/js/bootstrap.min.js'
						],
						dest    : '../js/'
					}
				]
			},
			js     : {
				files : [
					{
						expand  : true,
						flatten : true,
						src     : [
							'js/*.js'
						],
						dest    : '../js/'
					}
				]
			}
		},
		less  : {
			tabr : {
				options : {
					paths        : [ "node_modules" ],
					cleancss     : true,
					compress     : true,
					yuicompress  : true,
					optimization : 2
				},
				files   : { "../css/tabr.min.css" : "less/tabr.less" }
			}
		},
		watch : {
			less    : {
				files : [ 'less/**/*.less' ],
				tasks : [ 'less' ]
			},
			scripts : {
				files : [ 'js/*.js' ],
				tasks : [ 'copy:js' ]
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', [ 'copy', 'less', 'watch' ]);
	grunt.registerTask('production', [ 'copy', 'less' ]);
};
