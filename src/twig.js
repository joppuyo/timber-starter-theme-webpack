// https://stackoverflow.com/questions/29421409/how-to-load-all-files-in-a-directory-using-webpack-without-require-statements
function requireAll(require) {
  require.keys().forEach(require);
}
requireAll(require.context('.', true, /\.twig$/));
