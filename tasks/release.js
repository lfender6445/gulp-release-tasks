module.exports = function(gulp){
  var argv, bump, filter, fs, git, paths, prompt, tag_version, versioning;

  fs = require('fs');
  prompt = require('gulp-prompt');
  git = require('gulp-git');
  bump = require('gulp-bump');
  filter = require('gulp-filter');
  tag_version = require('gulp-tag-version');
  argv = require('yargs').argv;

  var versioningFiles = function(){
    if(argv.bower){
      return ['./bower.json']
    }
    if(argv.npm || argv.node){
      return ['./package.json']
    }
    if(fs.existsSync('package.json') && fs.existsSync('bower.json')){
      return ['./package.json', './bower.json']
    } else {
      return ['./package.json']
    }
  };

  var bumpPreference = fs.existsSync('package.json')  ? 'package.json' : 'bower.json';
  var vFiles         = versioningFiles();

  paths = {
    versionsToBump: vFiles,
    version: bumpPreference,
    dest: '.'
  };

  gulp.task('tag', ['bump', 'commit'], function() {
    return gulp.src(paths.versionsToBump).pipe(filter(paths.version)).pipe(tag_version()).pipe(git.push('origin', 'master', {
      args: '--tags'
    }));
  });

  gulp.task('add', function() {
    return gulp.src(paths.versionsToBump).pipe(git.add());
  });

  gulp.task('commit', ['add'], function() {
    return gulp.src(paths.version).pipe(prompt.prompt({
      type: 'input',
      name: 'commit',
      message: 'enter a commit msg, eg initial commit'
    }, function(res) {
      return gulp.src('.').pipe(git.commit(res.commit));
    }));
  });

  versioning = function() {
    if (argv.minor || argv.feature) {
      return 'minor';
    }
    if (argv.major) {
      return 'major';
    }
    return 'patch';
  };

  gulp.task('bump', function() {
    return gulp.src(paths.versionsToBump).pipe(bump({
      type: versioning()
    })).pipe(gulp.dest(paths.dest));
  });


};
