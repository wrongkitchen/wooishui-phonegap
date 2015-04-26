/**
 * Configuration for Require task(s)
 */
'use strict';

var taskConfig = function(grunt) {

    grunt.config.set('requirejs', {
        dist: {
            options: {
                baseUrl: '<%= yeogurt.client %>/scripts/',
                mainConfigFile: '<%= yeogurt.client %>/scripts/main.js',
                dir: '<%= yeogurt.dist %>/scripts/',
                
                generateSourceMaps: false,
                preserveLicenseComments: false,
                modules: [
                    { name: 'main' },
                    { name: 'beforeLogin' }
                ]
            }
        }
    });

};
// optimize: 'uglify2',
// name: 'main',
// out: '<%= yeogurt.dist %>/scripts/main.js',
module.exports = taskConfig;