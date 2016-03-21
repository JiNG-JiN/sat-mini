## Javascript

The setup in here closely follows suite to the HTML5 Boilerplate, which everyone should be up to speed with. All further documentiation you need should be in there.

#### libs/

jQuery, Modernizr and plugins like carousels, sliders and scrollbars should live in here. Only use minified versions, but try and include full-fat versions just in case you need to debug the library itself (not all plugins are perfect!).

#### min/

Only minified files should live in these directories.

#### plugins.js

This file includes a fix for console.log errors in IE and should where all your app-specific enhancments should go. These are likely to be prototypes or helper functions. Taken from the HTML5BP

#### script.js

All your scripts are belong here. Some basic ```console``` warnings exist at the top of this file to make sure of meta content – remove these when resolved.
