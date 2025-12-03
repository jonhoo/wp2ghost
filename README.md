[![Build Status](https://travis-ci.org/jonhoo/wp2ghost.svg?branch=master)](https://travis-ci.org/jonhoo/wp2ghost)

This script will convert WordPress XML [exports][wpexport] ([WXR][wxr]) to the
Ghost (1.x [for now][1x]) [JSON format][gjson]. This JSON file can then
be directly imported using the Ghost debug interface.

While there is a [WordPress plugin][wpghost] that will export to the Ghost
format directly, it only seems to work some of the time, and users of
WordPress.com will have a hard time using it seeing how WP.com doesn't allow
plugins at all (in its free account).

This is a simple command-line tool that takes a WordPress XML file as input and
prints the corresponding Ghost JSON to standard out. It currently converts the
following:

  - Posts: title, slug, content, page/post, featured, status, creation/publication date
  - Catgeories: name, slug, description (converted to tags)
  - Tags: name, slug

WordPress authors are parsed, but not added to the output yet because Ghost
currently only supports editing the primary user during imports.

To run it, you need to have [NodeJS][node] installed (and
[maybe](https://github.com/jonhoo/wp2ghost/issues/12) also [Python][python]). You
can then just run:

    $ cd wp2ghost
    $ npm install
    $ GHOST_VERSION="<your-ghost-version>" node bin/wp2ghost.js <your-wordpress-xml> > ghost.json


If you prefer not to specify the Ghost version, you can run the command directly (it defaults to version 6.0):

    $ node bin/wp2ghost.js <your-wordpress-xml> > ghost.json

Next, go to http://example.com/ghost, select Labs in the menu on the
left, and import `ghost.json`. All your content should now show up!

Happy migrating!

  [wpexport]: http://en.support.wordpress.com/export/
  [wxr]: http://devtidbits.com/2011/03/16/the-wordpress-extended-rss-wxr-exportimport-xml-document-format-decoded-and-explained/
  [gjson]: https://docs.ghost.org/api/migration/#json-file-structure
  [wpghost]: http://wordpress.org/plugins/ghost/
  [node]: http://nodejs.org/
  [python]: https://www.python.org/
  [1x]: https://github.com/jonhoo/wp2ghost/issues/13
