module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadTasks('tools/grunt-tasks');

  grunt.initConfig({
    packageInfo: grunt.file.readJSON('package.json'),

    clean: ['build'],

    // minify and concat JS
    uglify: {
      dist: {
        files: {
          'build/app/js/all.js': [
            'app/js/help.js',
            'app/js/license.js',
            'app/js/main.js'
          ]
        }
      }
    },

    // minify and concat CSS
    cssmin: {
      dist: {
        files: {
          'build/app/css/all.css': [
            'app/css/main.css',
            'app/css/license.css',
            'app/css/help.css'
          ]
        }
      }
    },

    // copy assets and the index.html file to build/app/;
    // NB we rewrite index.html during copy to point at the
    // minified/concated js file all.js and minified/concated CSS file
    // all.css
    copy: {
      dist: {
        files: [
          { expand: true, cwd: '.', src: ['config.xml'], dest: 'build/app/' },
          { expand: true, cwd: '.', src: ['icon*.png'], dest: 'build/app/' },
          { expand: true, cwd: '.', src: ['README.txt'], dest: 'build/app/' },
          { expand: true, cwd: '.', src: ['app/**.html'], dest: 'build/' },
          { expand: true, cwd: '.', src: ['app/audio/**'], dest: 'build/' },
          { expand: true, cwd: '.', src: ['app/fonts/**'], dest: 'build/' },
          { expand: true, cwd: '.', src: ['app/images/**'], dest: 'build/' },
          { expand: true, cwd: '.', src: ['app/lib/**'], dest: 'build/' },
          { expand: true, cwd: '.', src: ['app/_locales/**'], dest: 'build/' }
        ],
        options: {
          // this rewrites the <script> tag in the index.html file
          // to point at the minified/concated js file all.js;
          // and the stylesheet tags to point at all.css;
          // it additionally strips out as much space and as many newlines
          // as possible from HTML files (NB this may be dangerous if
          // files are space-sensitive, but most HTML shouldn't be)
          processContent: function (content) {
            if (content.match(/DOCTYPE/)) {
              // remove comments
              content = content.replace(/.+\/\/.+?\n/g, '');
              content = content.replace(/<!--[\s\S]+?-->/g, '');

              // JS
              content = content.replace(/main\.js/, '!!!all.js!!!');
              content = content.replace(/<script src="js\/[^\!]+?"><\/script>\n/g, '');

              // CSS
              content = content.replace(/main\.css/, '!!!all.css!!!');
              content = content.replace(/<link rel="stylesheet" href="[^\!]+?">\n/g, '');

              // fix JS and CSS resources
              content = content.replace(/!!!/g, '');

              // whitespace reduction
              content = content.replace(/[ ]{2,}/g, ' ');
              content = content.replace(/\n{2,}/g, '\n');
            }

            return content;
          },

          // if you have other resources which you don't want to have
          // treated as text, add them here
          processContentExclude: [
            'app/images/**',
            'app/audio/**',
            'app/_locales/**',
            'app/fonts/**',
            'app/lib/**',
            '*.png',
            'README.txt'
          ]
        }
      }
    },

    // make wgt package in build/ directory
    package: {
      appName: '<%= packageInfo.name %>',
      version: '<%= packageInfo.version %>',
      files: 'build/app/**',
      stripPrefix: 'build/app/',
      outDir: 'build',
      suffix: '.wgt',
      addGitCommitId: false
    },

    sdb: {
      prepare: {
        action: 'push',
        localFiles: './tools/grunt-tasks/tizen-app.sh',
        remoteDestDir: '/opt/home/developer/',
        chmod: '+x',
        overwrite: true
      },

      pushwgt: {
        action: 'push',
        localFiles: {
          pattern: 'build/*.wgt',
          filter: 'latest'
        },
        remoteDestDir: '/opt/home/developer/'
      },

      stop: {
        action: 'stop',
        remoteScript: '/opt/home/developer/tizen-app.sh'
      },

      uninstall: {
        action: 'uninstall',
        remoteScript: '/opt/home/developer/tizen-app.sh'
      },

      install: {
        action: 'install',
        remoteFiles: {
          pattern: '/opt/home/developer/*.wgt',
          filter: 'latest'
        },
        remoteScript: '/opt/home/developer/tizen-app.sh'
      },

      debug: {
        action: 'debug',
        remoteScript: '/opt/home/developer/tizen-app.sh',
        localPort: '8888',
        openBrowser: 'google-chrome %URL%'
      },

      start: {
        action: 'start',
        remoteScript: '/opt/home/developer/tizen-app.sh'
      }
    }
  });

  grunt.registerTask('dist', ['clean', 'cssmin:dist', 'uglify:dist', 'copy:dist']);

  grunt.registerTask('pkg', 'Create package; call with pkg:STR to append STR to package name', function (identifier) {
    grunt.task.run('dist');

    var packageTask = (identifier ? 'package:' + identifier : 'package');
    grunt.task.run(packageTask);
  });

  grunt.registerTask('reinstall', ['pkg', 'sdb:prepare', 'sdb:pushwgt', 'sdb:stop', 'sdb:uninstall', 'sdb:install', 'sdb:debug']);
  grunt.registerTask('install', ['pkg', 'sdb:prepare', 'sdb:pushwgt', 'sdb:install', 'sdb:debug']);
  grunt.registerTask('restart', ['sdb:stop', 'sdb:start']);
  grunt.registerTask('default', 'dist');
};
