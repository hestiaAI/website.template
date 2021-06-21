function assertNodeVersion(specificVersion) {
  const nodeVersion = process.version;
  const version = specificVersion || 'v14';
  if( nodeVersion < version) {
    const message = `Expected Node version to be >=${version}, but is actually ${nodeVersion}; exiting.`;
    console.error(message);
    throw new Error(message);
  }
}

module.exports = {
  assertNodeVersion,
}
