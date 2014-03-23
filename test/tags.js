var should = require('chai').should();
var wp2ghost = require('../lib/wp2ghost.js');

var when = wp2ghost.fromFile('./test/wordpress-export.xml');
var g;
var p;

before(function(done) {
  when.then(function(data) { g = data.data; p = g.posts[0]; done(); },
            function(err)  { throw new Exception(); });
});

var tags = [
  {
    "name": "tag1",
    "slug": "tag1"
  },
  {
    "name": "tag2",
    "slug": "tag2"
  },
  {
    "name": "tag3",
    "slug": "tag3"
  },
  {
    "name": "tag4",
    "slug": "tag4"
  },
  {
    "name": "tag5",
    "slug": "tag5"
  },
  {
    "name": "tag6",
    "slug": "tag6"
  },
  {
    "name": "tag7",
    "slug": "tag7"
  }
];
var categories = [
  {
    "name": "Parent Category I",
    "slug": "parent-category-i"
  },
  {
    "name": "Parent Category II",
    "slug": "parent-category-ii"
  },
  {
    "name": "Parent Category III",
    "slug": "parent-category-iii"
  },
  {
    "name": "Uncategorized",
    "slug": "uncategorized"
  },
  {
    "name": "Child Category I",
    "slug": "child-category-i"
  },
  {
    "name": "Child Category II",
    "slug": "child-category-ii"
  },
  {
    "name": "Child Category III",
    "slug": "child-category-iii"
  },
  {
    "name": "Grandchild Category I",
    "slug": "grandchild-category-i"
  },
  {
    "name": "Custom slug",
    "slug": "weird-nicename"
  }
];
describe('Tag', function(){
  describe('import', function(){
    it('should include tags', function() {
      for (var i = 0; i < tags.length; i++) {
        var found = false;
        for (var j = 0; j < g.tags.length; j++) {
          if (g.tags[j].name === tags[i].name) found = true;
        }
        found.should.equal(true, tags[i].name);
      }
    });

    it('should preserve tag slugs', function() {
      for (var i = 0; i < tags.length; i++) {
        var found = false;
        for (var j = 0; j < g.tags.length; j++) {
          if (g.tags[j].slug === tags[i].slug) found = true;
        }
        found.should.equal(true, tags[i].slug);
      }
    });

    it('should convert categories to tags', function() {
      for (var i = 0; i < categories.length; i++) {
        var found = false;
        for (var j = 0; j < g.tags.length; j++) {
          if (g.tags[j].name === categories[i].name) found = true;
        }
        found.should.equal(true, categories[i].name);
      }
    });


    it('should convert category nicename to tag slug', function() {
      for (var i = 0; i < categories.length; i++) {
        var found = false;
        for (var j = 0; j < g.tags.length; j++) {
          if (g.tags[j].slug === categories[i].slug) found = true;
        }
        found.should.equal(true, categories[i].slug);
      }
    });

  });
});

var p1tags = ["tag1", "tag2", "tag5"];
var p1cats = ["child-category-i", "parent-category-i"];
describe('Post associations', function(){
  before(function() {
    for (var i = 0; i < p1tags.length; i++) {
      for (var j = 0; j < g.tags.length; j++) {
        if (g.tags[j].slug === p1tags[i]) p1tags[i] = g.tags[j].id;
      }
    }
    for (var i = 0; i < p1cats.length; i++) {
      for (var j = 0; j < g.tags.length; j++) {
        if (g.tags[j].slug === p1cats[i]) p1cats[i] = g.tags[j].id;
      }
    }
  });

  it('should include categories', function() {
    for (var i = 0; i < p1cats.length; i++) {
      var found = false;
      for (var j = 0; j < g.posts_tags.length; j++) {
        if (g.posts_tags[j].post_id === g.posts[0].id
         && g.posts_tags[j].tag_id === p1cats[i]) found = true;
      }
      found.should.equal(true, p1cats[i]);
    }
  });

  it('should include tags', function() {
    for (var i = 0; i < p1tags.length; i++) {
      var found = false;
      for (var j = 0; j < g.posts_tags.length; j++) {
        if (g.posts_tags[j].post_id === g.posts[0].id
         && g.posts_tags[j].tag_id === p1tags[i]) found = true;
      }
      found.should.equal(true, p1tags[i]);
    }
  });
});
