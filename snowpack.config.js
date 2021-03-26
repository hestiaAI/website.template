// Snowpack configuration file
// https://www.snowpack.dev/reference/configuration
/* eslint-env node */

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    'build/11ty': { url: '/', static: true },
  },
  plugins: [
    [ '@snowpack/plugin-run-script', {
        cmd: 'eleventy',    // production build command
        watch: '$1 --watch' // (optional) dev server command
      } ]
  ],
  packageOptions: {},
  devOptions: {
    open: 'none',
    port: 8080,             // (default value)
    hmr: true               // (default value)
  },
  buildOptions: {
    out: 'build/snowpack',
    clean: true,            // (default value)
    metaUrlPath: 'modules',
    sourcemap: true
  },
  optimize: {
    target: 'es2020'
  }
};