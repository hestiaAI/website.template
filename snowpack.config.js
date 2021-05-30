// Snowpack configuration, integrated with Eleventy and Netlify
// https://www.snowpack.dev/reference/configuration
//
// Folder configuration of Snowpack is linked to the configuration
// of Eleventy and Netlify, and vice-versa; specifically:
//
//  * the `build/11ty` folder statically mounted at `/` must match
//    Eleventy `dir.output` setting;
//
//  * the `build/snowack` folder defined by the `buildOptions.out`
//    setting must match Netlify `build.publish` setting.
//
// HOW DO SNOWPACK AND 11TY COLLABORATE?
//
//   In dev and build modes, Eleventy will generate a static website
//   from the `src` folders into `build/11ty`; the later is watched
//   by Snowpack and statically mounted and served as-is at `/`.
//
//   In dev mode, any change to the source files would trigger a new
//   build by Eleventy. The resulting changes to `build/11ty` would
//   in turn be observed by Snowpack, which would trigger its own new
//   ES build, and statically serve the updated files of `build/11ty`.
//
// STATUS
//
//   Snowpack serves the results of the Eleventy build; and performs
//   an ES build of the Web Components in `/src/components/`, which
//   are mounted and available to HTML pages at base URL `/components/`.
//
/* eslint-env node */

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    // NOTE: in dev mode, only `build/11ty` would exist
    // (`build/snowpack` folder appears at build only)
    'build/11ty': { url: '/', static: true },   // linked to Eleventy `dir.output` setting
    'src/components': { url: '/components' },   // linked from HTML pages
  },
  plugins: [
    // NOTE: to run Eleventy before Snowpack builds, we replaced the
    // @snowpack/plugin-run-script that was here with NPM run-s/run-p
    // scripts in package.json, because the @snowpack/plugin-run-script
    // did not start Eleventy in build mode, it worked only in dev mode.
  ],
  packageOptions: {},
  devOptions: {
    openUrl: 'en/',
    port: 8080,             // (default value)
    hmr: true               // (default value)
  },
  buildOptions: {
    out: 'build/snowpack',  // linked to Netlify `build.publish` setting
    clean: true,            // (default value)
    metaUrlPath: 'modules', // bundled packages will be mounted at base URL /modules/pkg/
    sourcemap: true
  },
  optimize: {
    target: 'es2020'
  }
};