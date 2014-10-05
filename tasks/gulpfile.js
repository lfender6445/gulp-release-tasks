var argv, bump, filter, git, gulp, paths, prompt, tag_version, versioning;

gulp = require('gulp');
prompt = require('gulp-prompt');
git = require('gulp-git');
bump = require('gulp-bump');
filter = require('gulp-filter');
tag_version = require('gulp-tag-version');
argv = require('yargs').argv;

paths = {
  scripts: ['dist/*.js'],
  versionsToBump: ['./package.json', './bower.json'],
  version: 'bower.json',
  dest: '.'
};

gulp.task 'release', ['tag'] -> // alias for tag

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

