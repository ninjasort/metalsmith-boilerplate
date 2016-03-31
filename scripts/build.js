import path             from 'path'
import config           from './build.config'
import Metalsmith       from 'metalsmith'
import collections      from 'metalsmith-collections'
import metadata         from 'metalsmith-metadata'
import markdown         from 'metalsmith-markdown'
import layouts          from 'metalsmith-layouts'
import inPlace          from 'metalsmith-in-place'
import permalinks       from 'metalsmith-permalinks'
import pagination       from 'metalsmith-pagination'
import excerpts         from 'metalsmith-excerpts'
import sass             from 'metalsmith-sass'
import moment           from 'moment'
import define           from 'metalsmith-define'
import jekyllDates      from 'metalsmith-jekyll-dates'
import autoprefixer     from 'metalsmith-autoprefixer'
import webpack          from 'metalsmith-webpack'
import ignore           from 'metalsmith-ignore'
import helpers          from '../test/helpers'
// prod
import htmlMinifier     from 'metalsmith-html-minifier'
import fingerprint      from 'metalsmith-fingerprint'
import imagemin         from 'metalsmith-imagemin'
import sitemap          from 'metalsmith-sitemap'
import rss              from 'metalsmith-rss'

const DEFAULT_OPTIONS = {
  title: 'Metalsmith Boilerplate',
  description: 'Website',
  url: 'https://',
  sitemapPath: 'sitemap.xml'
};

export default function (specifiedOptions = {}, callback) {

  const options = Object.assign({}, DEFAULT_OPTIONS, specifiedOptions);
  
  // Config
  // --------------------------------------------------------------------------
  const m = Metalsmith(path.resolve(__dirname, '..'));

  // Metalsmith Config
  // --------------------------------------------------------------------------
  m.clean(true);
  if (options.test) {
    m.destination('tmp');
  } else {
    m.destination('dist');
  }
  m.metadata(options);
  
  // File Metadata
  // --------------------------------------------------------------------------
  m.use(metadata(config.metadata));

  // Ignores
  // --------------------------------------------------------------------------
  m.use(ignore(config.ignore));

  // Definitions
  // --------------------------------------------------------------------------
  m.use(define({moment}));

  // Attach Collections
  // --------------------------------------------------------------------------
  m.use(collections(config.collections));

  // Date
  // --------------------------------------------------------------------------
  m.use(jekyllDates());

  // Markdown
  // --------------------------------------------------------------------------
  m.use(markdown(config.markdown))

  // Excerpts
  // --------------------------------------------------------------------------
  m.use(excerpts());

  // Permalinks
  // --------------------------------------------------------------------------  
  m.use(permalinks(config.permalinks));

  // Pagination
  // --------------------------------------------------------------------------
  m.use(pagination(config.pagination));

  // Templates
  // -------------------------------------------------------------------------- 
  m.use(layouts(config.layouts));
  m.use(inPlace(config.inPlace));

  // Styles
  // --------------------------------------------------------------------------  
  if (options.production) {
    config.sass.outputStyle = 'compressed';
    m.use(sass(config.sass));
  } else {
    m.use(sass(config.sass));
  }
  m.use(autoprefixer());

  // Test Fixtures
  // --------------------------------------------------------------------------  
  if (options.test) {
    m.use((files) => {
      for (let f in files) {
        if (f.indexOf('.html') !== -1) {
          files[f].contents = helpers.stripScripts(files[f].contents);
        }
      }
    });
  }
  
  // Js
  // --------------------------------------------------------------------------  
  if (options.production) {
    m.use(webpack(config.webpackProd));
  } else if (options.test) {} else {
    m.use(webpack(config.webpack));
  }

  // Sitemap
  // -------------------------------------------------------------------------- 
  if (options.production) {
    m.use(sitemap(config.sitemap));
  }

  // RSS Feed
  // -------------------------------------------------------------------------- 
  if (options.production) {
    m.use(rss(config.rss));
  }
  
  // Production
  // --------------------------------------------------------------------------  
  if (options.production) {
    m.use(imagemin(config.imagemin));
    m.use(htmlMinifier('*.html', config.htmlMinifier));
  }

  // Build
  // --------------------------------------------------------------------------  
  m.build(callback);

}