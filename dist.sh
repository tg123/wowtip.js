#!/bin/bash

perl Markdown.pl --html4tags index.markdown > index.markdown.php
java -jar ~/bin/yuicompressor-2.4.6.jar wowtip.src.js > wowtip.js
java -jar ~/bin/yuicompressor-2.4.6.jar wowtip.src.css > wowtip.css
