function assertNodeVersion(version) {
  const nodeVersion = process.version;
  if( nodeVersion < version) {
    throw new Error( `Expected Node version to be >=${version}, but is actually ${nodeVersion}; exiting.`);
  }
}

module.exports = {
  assertNodeVersion
}