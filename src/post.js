function findTitle(md) {
  var matchedTitle = md.split('\n')[0].match(/#{1,6}(.+)/);

  if(!matchedTitle) {
    return null;
  }
  var title = matchedTitle[1].trim().split(' ').join('-');
  return title;
}

module.exports = {
  findTitle: findTitle
};
