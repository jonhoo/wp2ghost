#!/usr/bin/node
var fs = require('fs'),
    path = require('path'),
    XmlStream = require('xml-stream');

var stream = fs.createReadStream(process.argv.slice(-1)[0]);
var xml = new XmlStream(stream);

var statusmap = {
  "publish": "published",
  "draft": "draft"
};

var exportDate = null;
var users = [];
var posts = [];
var tags  = [];
var posts_tags = [];
var author2user = {};
var termname2tag = {};

xml.on('endElement: pubDate', function(pd) {
  if (exportDate !== null) return;
  exportDate = new Date(pd.$text);
});

xml.on('endElement: wp:category', function(category) {
  var tag = {
    "id": parseInt(category['wp:term_id'], 10),
    "slug": category['wp:category_nicename'],
    "name": category['wp:cat_name'],
    "description": category['wp:category_description']
  };

  tags.push(tag);
  termname2tag[tag.slug] = tag.id;
});

xml.on('endElement: wp:tag', function(category) {
  var tag = {
    "id": parseInt(category['wp:term_id'], 10),
    "slug": category['wp:tag_slug'],
    "name": category['wp:tag_name'],
    "description": ""
  };

  if (tag.slug in termname2tag) return;

  tags.push(tag);
  termname2tag[tag.slug] = tag.id;
});

xml.on('endElement: wp:wp_author', function(author) {
  var user = {
    'name': author['wp:author_display_name'],
    'slug': author['wp:author_login'],
    'email': author['wp:author_email']
  };

  users.push(user);
  author2user[user.slug] = 1; /* TODO: users.length when Ghost supports importing users */
});

xml.collect('category');
xml.preserve('content:encoded', true);
xml.on('endElement: item', function(item) {
  if (item['wp:post_type'] != "post" && item['wp:post_type'] != "page") return;

  var date = item['wp:post_date'].match(/(\d{4})-(\d+)-(\d+) (\d+):(\d+):(\d+)/);
  date = date.map(function(e) { return parseInt(e, 10); });
  var d = new Date(date[1], date[2], date[3], date[4], date[5], date[6], 0);

  var post = {
    "id": parseInt(item['wp:post_id'], 10),
    "title": item.title,
    "slug": item['wp:post_name'],
    "markdown": treat(item['content:encoded']),
    "html": treathtml(item['content:encoded']),
    "image": null,
    "featured": item['wp:is_sticky'] === "1",
    "page": item['wp:post_type'] == "page",
    "status": item['wp:status'] in statusmap ? statusmap[item['wp:status']] : "draft",
    "language": "en_US",
    "meta_title": null,
    "meta_description": null,
    "author_id": author2user[item['dc:creator']],
    "created_at": d.getTime(),
    "created_by": 1,
    "updated_at": d.getTime(),
    "updated_by": 1,
    "published_at": d.getTime(),
    "published_by": 1
  };

  if (!post.title) {
    post.title = 'Untitled post';
  }

  if (!post.slug) {
    post.slug = 'post-' + (posts.length+1);
  }

  if (typeof item.category !== "undefined") {
    for (var i = 0; i < item.category.length; i++) {
      posts_tags.push({
        "tag_id": termname2tag[item.category[i].$.nicename],
        "post_id": post.id
      });
    }
  }

  posts.push(post);
});

xml.on('end', function() {
  var ghost = {
    "meta":{
        "exported_on": exportDate.getTime() * 1000,
        "version":"000"
    },
    "data":{
        "posts": posts,
        "tags": tags,
        "posts_tags": posts_tags
        //"users": users
    }
  };
  process.stdout.write(JSON.stringify(ghost));
});

function treat(html) {
  html = html.$children.join('');
  html = html.replace(/\r\n/g, "\n");
  html = html.replace(/\r/g, "\n");
  html = html.replace(/\[((source)?code)[^\]]*\]\n*([\s\S]*?)\n*\[\/\1\]/g, '<pre><code>$3</code></pre>');
  return html;
}

function treathtml(html) {
  html = treat(html);
  html = html.replace(/\n\n/g, '<p>');
  html = html.replace(/<pre>(.*?)<\/pre>/g, function(match) { return match.replace(/<p>/g, "\n\n"); });
  html = html.replace(/<p><pre>/g, "<pre>");
  return html;
}
