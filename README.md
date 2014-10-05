gulp-release-tasks
=========

global release tasks for use with gulp, to make your life easier :heart:

## Usage
`npm install gulp-release-tasks --save-dev`

```javascript
// add to gulpfile.js
// tasks will be registered via global context
require('gulp-release-tasks');
```

run `gulp -T` for a list of available commands

bumps the versions of your `package.json` and `bower.json`

### tagging
task             | version
-----------------|-------------------------------------
gulp tag         | v0.0.1 -> v0.0.2 + commit + tag + push
gulp tag --minor | v0.0.1 -> v0.1.0 + commit + tag + push
gulp tag --major | v0.0.1 -> v1.0.1 + commit + tag + push

### bumping
task             | version
--------------   |-----------------
gulp bump        | v0.0.1 -> v0.0.2
gulp bump --minor| v0.0.1 -> v0.1.0
gulp bump --major| v0.0.1 -> v1.0.1

#### flags
limit versioning to single config
- `gulp tag --bower`
  - applies versioning to `bower.json`
- `gulp tag --npm`
  - applys versioning to `package.json`
- `gulp tag --npm --major`
  - v0.0.1 -> v1.0.1, applies versioning to `package.json`

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

---

![x](http://i.imgur.com/ydTgw5e.gif)
