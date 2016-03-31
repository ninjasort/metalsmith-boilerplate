import gulp from 'gulp'
import browserSync from 'browser-sync'
import build from './scripts/build'
import s3 from 'gulp-s3';
import fs from 'fs';
import {argv} from 'yargs';

try {
  var awsStaging = JSON.parse(fs.readFileSync('./aws.json'));
} catch (e) {
  var awsStaging = {};
}
const awsProd = awsStaging.bucket = '';
const awsOptions = {
  headers: {
    'Cache-Control': 'max-age=7200, must-revalidate'
  }
};

const paths = {
  src: 'src/**',
  templates: [
    'templates/_layouts/*.liquid', 
    'templates/_includes/**/*.liquid'
  ],
};

let serverStarted = false

function refresh(cb) {
  return (...args) => {
    if (!serverStarted) {
      browserSync({
        ghostMode: {
          clicks: true,
          scroll: true,
          links: true,
          forms: true
        },
        server: {baseDir: './dist'}
      })
      serverStarted = true
    } else {
      browserSync.reload()
    }
    cb(...args)
  }
}

gulp.task('deploy', ['dist'], function () {
  return gulp.src('./dist/**')
    .pipe(
      argv.p ?
        s3(awsProd, awsOptions) :
        s3(awsStaging, awsOptions)
    );
});

gulp.task('dist', cb => {
  build({production: true}, cb)
})

gulp.task('dev-build', cb => {
  build({production: false}, refresh(cb))
});

gulp.task('test-build', cb => {
  build({production: false, test: true}, cb);
});

gulp.task('watch', ['dev-build'], cb => {
  gulp.watch(paths.src, ['dev-build'])
  gulp.watch(paths.templates, ['dev-build'])
});

gulp.task('test:watch', ['test-build'], cb => {
  gulp.watch(paths.src, ['test-build'])
  gulp.watch(paths.templates, ['test-build'])
});
