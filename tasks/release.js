module.exports = function (gulp) {
    var argv, bump, filter, fs, git, paths, prompt, tag_version, versioning, spawn, through;

    argv = require('yargs').argv;
    bump = require('gulp-bump');
    filter = require('gulp-filter');
    fs = require('fs');
    git = require('gulp-git');
    prompt = require('gulp-prompt');
    spawn = require('child_process').spawn;
    tag_version = require('gulp-tag-version');
    through = require('through2');

    var versioningFiles = function () {
        if (argv.bower) {
            return ['./bower.json']
        }
        if (argv.npm || argv.node) {
            return ['./package.json']
        }
        if (fs.existsSync('package.json') && fs.existsSync('bower.json')) {
            return ['./package.json', './bower.json']
        } else {
            return ['./package.json']
        }
    };

    var bumpPreference = fs.existsSync('package.json') ? 'package.json' : 'bower.json';
    var vFiles = versioningFiles();

    paths = {
        versionsToBump: vFiles,
        version: bumpPreference,
        dest: '.'
    };

    gulp.task('tag', ['bump', 'commit', 'npm-publish'], function () {
        return gulp.src(paths.versionsToBump).pipe(filter(paths.version)).pipe(tag_version()).pipe(git.push('origin', 'master', {
            args: '--tags'
        }));
    });

    gulp.task('npm-publish', function (done) {
        spawn('npm', ['publish'], {stdio: 'inherit'}).on('close', done);
    });

    gulp.task('add', function () {
        return gulp.src(paths.versionsToBump).pipe(git.add());
    });

    var commitIt = function(file, enc, cb) {
        if (file.isNull()) return cb(null, file);
        if (file.isStream()) return cb(new Error('Streaming not supported'));

        var commitMessage = "Released version " + require(file.path).version;
        gulp.src('.').pipe(git.commit(commitMessage));

        cb(null, file);
    };

    gulp.task('commit', ['add'], function () {
        return gulp.src(paths.version).pipe(through.obj(commitIt));
    });

    versioning = function () {
        if (argv.minor || argv.feature) {
            return 'minor';
        }
        if (argv.major) {
            return 'major';
        }
        return 'patch';
    };

    gulp.task('bump', function () {
        return gulp.src(paths.versionsToBump).pipe(bump({
            type: versioning()
        })).pipe(gulp.dest(paths.dest));
    });


};
