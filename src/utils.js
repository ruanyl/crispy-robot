function findTitle(md) {
  var title = '';
  var mdArr = md.split('\n');
  var matchedTitle = mdArr[0].match(/#{1,6}(.+)/)

  if(matchedTitle) {
    title = matchedTitle[1].trim().split(' ').join('-');
  } else if(mdArr[1].match(/^=+$/)) {
    title = mdArr[0];
  }
  return title;
}

function sortPosts(posts) {
  return Object.keys(posts).map(function(key) {
    var title = posts[key].title;
    var name = posts[key].name;
    var date = findDate(name);

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
      return -1;
    } else if(aDate.getTime() < bDate.getTime()) {
      return 1;
    } else {
      return 0;
    }
  });
}

function renderList(posts, page) {
  var list = '';
  posts = sortPosts(posts);
  posts.forEach(function(post) {
    var title = post.title.split('-').join(' ');
    list = list + '<div class="title-card"><span>' + post.date + '</span><a href="#/' + page + '/' + post.id + '">' + title + '</a></div>';
  });

  return list;
}

function findDate(str) {
  var date = '';
  var match = str.match(/^(\d{4}-\d{1,2}-\d{1,2}).*/);
  if(match) { // append date to file name
    date = match[1];
  }
  return date;
}

module.exports = {
  findTitle: findTitle,
  sortPosts: sortPosts,
  renderList: renderList,
  findDate: findDate
};
