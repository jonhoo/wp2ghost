var should = require('chai').should();
var wp2ghost = require('../lib/wp2ghost.js');

var when = wp2ghost.fromFile('./test/wordpress-export.xml');
var g;
var p;

before(function(done) {
  when.then(function(data) { g = data.data; p = g.posts[0]; done(); },
            function(err)  { done(new Error(err)); });
});

describe('Wordpress XML', function() {
  it('should be correctly parsed', function() {
    g.should.not.equal(undefined);
  });
});

describe('Post', function(){
  describe('itself', function(){
    it("should exist", function() {
      p = g.posts[0];
      if (!p) throw new Exception();
    });
  });

  describe('title', function(){
    it("should be preserved", function() {
      p.title.should.be.a('string');
      p.title.should.equal('A Simple Post with Text');
    });
  });

  describe('slug', function(){
    it("should be preserved", function() {
      p.slug.should.be.a('string');
      p.slug.should.equal('a-simple-post-with-text');
    });
  });

  describe('status', function(){
    it("should be preserved", function() {
      p.status.should.be.a('string');
      p.status.should.equal('published');
    });
  });

  describe('language', function(){
    it("should be preserved", function() {
      p.language.should.be.a('string');
      p.language.should.equal('en_US');
    });
  });

  describe('creation date', function(){
    it("should respect timezone", function() {
      p.created_at.should.not.equal(1217706746000);
    });
    it("should be preserved", function() {
      p.created_at.should.equal(1217724746000);
    });
    it("should be used as last updated", function() {
      // When WP exports post_modified, we can fix this
      p.updated_at.should.equal(1217724746000);
    });
  });

  describe('publication date', function(){
    it("should be preserved", function() {
      p.published_at.should.equal(1217724746000);
    });
  });

  describe('author', function(){
    it("should be reset to admin", function() {
      p.created_by.should.equal(1);
      p.updated_by.should.equal(1);
      p.published_by.should.equal(1);
    });
  });

  describe('page', function(){
    it('should be "0" for posts', function() {
      p.page.should.equal(0);
    });
  });

  describe('shortcodes', function(){
    it('should replace caption shortcodes', function() {
      p.markdown.search('<a href="#"><img class="wp-image-1" alt="Sample Image" src="foo.jpg" width="150" height="150" /></a> FooBar Caption')
                .should.not.equal(-1);
    });
    it('should replace audio shortcodes for a single source', function(){
      p.markdown.search('<audio controls><source src="source.mp3"></audio>')
                .should.not.equal(-1);
    });
    it('should replace audio shortcodes for a multiple sources', function(){
      p.markdown.search('<audio controls><source src="source.ogg"><source src="source.wav"><source src="source.mp3"></audio>')
                .should.not.equal(-1);
    });
    it('should replace video shortcodes for a single source', function(){
      p.markdown.search('<video controls><source src="source.mp4" type="video/mp4"></video>')
                .should.not.equal(-1);
    });
    it('should replace video shortcodes for multiple sources', function(){
      p.markdown.search('<video controls><source src="source.mp4" type="video/mp4"><source src="source.ogv" type="video/ogv"></video>')
                .should.not.equal(-1);
    });
  });
});
