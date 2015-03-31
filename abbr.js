/**
 * HTML abbreviation builder
 * -------------------------
 * (c) MightyPork, 2015
 * MIT License
 */

(function () {
    "use strict";

    function _extend(a, b) {
        if (!b) return;
        for (var i in a) {
            if (b.hasOwnProperty(i)) {
                a[i] = b[i];
            }
        }
    }


    function _escape(s) {
        return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }


    /** Public function */
    function abbr(config) {

        // Default config options

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


        _extend(opts, config);

        // matches tags that shouldn't be traversed
        var badRegex = new RegExp('(' + opts.excluded.concat(opts.exclude).join('|') + '|' + opts.tag + ')', 'i');

        var wordlist = [];
        for (var word in opts.words) {
            if (!opts.words.hasOwnProperty(word)) continue;

            wordlist.push({
                w: word,
                t: opts.words[word],
                r: new RegExp('\\b' + _escape(word) + '\\b', opts.ci ? 'gi' : 'g'),
                l: word.length
            });
        }

        function _handle_nodes(nodes) {
            var i, j, node, offset, chop, collected, wrap, abbr_txt, abbr_txt_clone;

            for (i = 0; i < nodes.length; i++) {
                node = nodes[i];

                if (node.nodeType == 1) {

                    if (node.childNodes && !badRegex.test(node.tagName)) {
                        // ugly hack to convert live node list to array
                        var nl = [];
                        for (j = 0; j < node.childNodes.length; j++) nl.push(node.childNodes[j]);
                        _handle_nodes(nl);
                    }

                } else if (node.nodeType == 3) {

                    // find replacement positions within the text node
                    var text = node.textContent;
                    var replpairs = [];
                    for (j = 0; j < wordlist.length; j++) {
                        var obj = wordlist[j];
                        text.replace(obj.r, function (_, offset) {
                            replpairs.push({at: offset, len: obj.l, t: obj.t});
                        });
                    }

                    // sort by position
                    replpairs.sort(function (a, b) {
                        return a.at - b.at;
                    });

                    for (offset = 0, j = 0; j < replpairs.length; j++) {
                        var rp = replpairs[j];

                        // remove non-abbr text
                        chop = rp.at - offset;
                        if (chop < 0) continue;

                        node = node.splitText(chop);
                        offset += chop;

                        // collect abbr text
                        chop = rp.len;
                        collected = node;
                        node = node.splitText(chop);
                        offset += chop;

                        // the highlight thing
                        wrap = document.createElement(opts.tag);
                        wrap.setAttribute(opts.attr, rp.t);
                        abbr_txt = collected;
                        abbr_txt_clone = abbr_txt.cloneNode(true);
                        wrap.appendChild(abbr_txt_clone);
                        abbr_txt.parentNode.replaceChild(wrap, abbr_txt);
                    }
                }
            }
        }

        _handle_nodes(document.querySelectorAll(opts.where));
    }

    // make it public
    window.abbr = abbr;
})();
