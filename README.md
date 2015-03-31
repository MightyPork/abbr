ABBR
====

Abbr is a JavaScript library / function for finding, highlighting and annotating abbreviations in text.

It needs no extra markup, all is done automatically. Just tell it what words you want to explain, and it'll do it.

Abbr takes the following arguments:

    var opts = {
        // selector in which to search for abbreviations
        where: 'body',
        // abbreviation list - word: explanation
        words: {},
        // Tag used to mark the matches
        tag: 'abbr',
        // Attribute holding the "description" to be added to the tag
        attr: 'title',
        // Case insensitive
        ci: true,
        // tags that shall not be traversed (in addition to opts.tag)
        excluded: ['script', 'style', 'code', 'head', 'textarea', 'embed'],
        // Extra excluded (doesn't overwrite the original list)
        exclude: []
    };

All config options are optional (though, obviously, you don't want to leave `words` empty).

To run it, simply call:

    abbr({
        // Your options here
    });

For example:

    abbr({
        where: 'article',
        words: {
            'NSA': 'National Spying Agency',
            'Putin': 'Bear rider'
        }
    });

