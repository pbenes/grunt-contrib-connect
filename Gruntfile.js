/*
 * grunt-contrib-connect
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function(grunt) {
  var testPath = path.join(__dirname, 'test');

  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    nodeunit: {
      tests: ['test/*_test.js']
    },

    connect: {
      custom_base: {
        options: {
          base: 'test',
        },
      },
      custom_port: {
        options: {
          port: 9000,
        },
      },
      custom_https: {
        options: {
          protocol:   'https',
          key:        fs.readFileSync(path.join(testPath, 'server.key')).toString(),
          cert:       fs.readFileSync(path.join(testPath, 'server.crt')).toString(),
          ca:         fs.readFileSync(path.join(testPath, 'ca.crt')).toString(),
          passphrase: 'grunt'
        }
      },
      custom_middleware: {
        options: {
          port: 9001,
          middleware: function(connect, options) {
            // Return array of whatever middlewares you want
            return [
              function(req, res, next) {
                res.end('Hello from port ' + options.port);
              }
            ];
          },
        },
      },
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-internal');

  grunt.registerTask('test', ['connect', 'nodeunit']);
  grunt.registerTask('default', ['jshint', 'test', 'build-contrib']);
};
