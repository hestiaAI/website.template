// Snowpack configuration, integrated with Eleventy and Netlify
// https://www.snowpack.dev/reference/configuration
/* eslint-env node */

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    // NOTE: in dev mode, only `build/11ty` would exist
    // (`build/snowpack` folder appears at build only)
    'build/11ty': { url: '/', static: true },   // linked to Eleventy `dir.output` setting
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
    metaUrlPath: 'modules',
    sourcemap: true
  },
  optimize: {
    target: 'es2020'
  }
};