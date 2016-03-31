import path from 'path'
import fs from 'fs'
import webpack from 'webpack'
import webpackConfig from '../webpack.config.babel';
import webpackProdConfig from '../webpack.config.prod.babel'
import customTags from './customtags';

var config = {

  ignore: [
    '_data/**',
    '_drafts/*.md',
    'templates/**',
    'lib/**',
    'feed.xml'
  ],

  /**
   * Metadata
   */
  metadata: {
    site: '_data/_config.yaml',
    env: '_data/_config-env.yaml'
  },

  /**
   * Markdown
   */
  markdown: {
    gfm: true,
    tables: true
  },

  /**
   * Collections
   */
  collections: {
    pages: {
      pattern: 'pages/*.md'
    },
    posts: {
      pattern: 'posts/!(index).md',
      sortBy: 'date',
      reverse: true
    }
  },

  /**
   * Permalinks
   */
  permalinks: {
    relative: false,
    linksets: [
      {
        match: { collection: 'pages' },
        pattern: ':title'
      },
      {
        match: { collection: 'posts' },
        pattern: ':date/:title'
      }
    ]
  },

  /**
   * Pagination
   */
  pagination: {
    'collections.posts': {
      perPage: 5,
      first: 'blog/index.html',
      path: 'blog/:num/index.html',
      pageMetadata: {
        title: 'Blog'
      },
      pageContents: fs.readFileSync('src/posts/index.md'),
      layout: 'blog.liquid'
    }
  },

  rss: {
    feedOptions: {
      title: 'Metalsmith Boilerplate',
      site_url: 'http://'
    }
  },

  sitemap: {
    hostname: 'http://'
  },
  
  /**
   * Imagemin
   */
  imagemin: {
    optimizationLevel: 4,
    progressive: true
  },

  /**
   * HtmlMinifier
   */
  htmlMinifier: {
    removeComments: false,
    removeEmptyAttributes: false
  },

  /**
   * Layouts
   */
  layouts: {
    engine: 'liquid',
    directory: 'templates/_layouts',
    includeDir: 'templates/_includes',
    filters: customTags
  },

  /**
   * InPlace
   */
  inPlace: {
    engine: 'liquid',
    pattern: '**/*.liquid',
    includeDir: 'templates/_includes'
  },
  
  /**
   * Webpack
   */
  webpack: webpackConfig,
  webpackProd: webpackProdConfig,
  
  /**
   * Sass
   */
  sass: {
    outputDir: 'assets/css',
    sourceMap: true,
    sourceMapEmbed: true
  }

};

export default config;