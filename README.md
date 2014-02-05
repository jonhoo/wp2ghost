This script will convert Wordpress XML [exports][wpexport] ([WXR][wxr]) to the
Ghost [JSON format][gjson]. This JSON file can then be directly imported using
the Ghost debug interface.

While there is a [Wordpress plugin][wpghost] that will export to the Ghost
format directly, it only seems to work some of the time, and users of
Wordpress.com will have a hard time using it seeing how WP.com doesn't allow
plugins at all.

This is a simple command-line tool that takes a Wordpress XML file as input and
prints the corresponding Ghost JSON to standard out. It currently converts the
following:

  - Posts: title, slug, content, page/post, featured, status, publication date
  - Catgeories: name, slug, description (converted to tags)
  - Tags: name, slug

Wordpress authors are parsed, but not added to the output yet because Ghost
currently only supports editing the primary user during imports.

  [wpexport]: http://en.support.wordpress.com/export/
  [wxr]: http://devtidbits.com/2011/03/16/the-wordpress-extended-rss-wxr-exportimport-xml-document-format-decoded-and-explained/
  [gjson]: https://github.com/tryghost/Ghost/wiki/import-format
  [wpghost]: http://wordpress.org/plugins/ghost/
