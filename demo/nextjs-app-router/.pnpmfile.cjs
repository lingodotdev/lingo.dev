module.exports = {
  hooks: {
    readPackage(pkg) {
      // Force this directory to be treated as non-workspace
      return pkg;
    }
  }
};