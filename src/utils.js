function findTitle(md) {
  var matchedTitle = md.split('\n')[0].match(/#{1,6}(.+)/);

  if(!matchedTitle) {
    return null;
  }
  var title = matchedTitle[1].trim().split(' ').join('-');
  return title;
}

function sortPosts(posts) {
  return Object.keys(posts).map(function(key) {
    var title = posts[key];
    var date = '';
    var match = title.match(/^(\d{4}-\d{1,2}-\d{1,2}).*/);

    if(match) {
      date = match[1];
      title = title.replace(/^(\d{4}-\d{1,2}-\d{1,2}-*)/, '');
    }

    return {
      id: key,
      title: title,
      date: date
    };
  }).sort(function(a, b) {
    if(!a.date) {
      return 1;
    }
    if(!b.date) {
      return -1;
    }
    var aDate = new Date(a.date);
    var bDate = new Date(b.date);
    if(aDate.getTime() > bDate.getTime()) {
      return 1;
    } else if(aDate.getTime() < bDate.getTime()) {
      return -1;
    } else {
      return 0;
    }
  });
}

module.exports = {
  findTitle: findTitle,
  sortPosts: sortPosts
};
