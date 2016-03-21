## Assets

In here you'll find a complete directory structure ready to go, which was initially proposed by Nate V.

It's supposed to follow a similar convention to the Outside Line GCMS structure, with some room for minified files within css/ and js/.

#### CodeKit

CodeKit isn't a requirement but it sure as hell is a rad tool. At least download the trial and give it a shot - you won't look back.

It handles pretty much all CSS processors under the sun and minifies/compresses/obfuscates both CSS and Javascript. It's FTW. Speak to Nate V about getting set up when you first use it.

#### .htaccess

You shouldn't really have to touch this file as it's mainly for server configuration. It has some defaults in there for enabling the server to return gzipped assets when a users browser can accept them, which reduces load times.

There's also some basic settings for specifying content-types for different media, which sometimes can he a headache when it comes to HTML5 video and audio asa well and custom fonts.

#### js/

Further help can be found in js/readme.md.

#### css/

Further help can be found in css/readme.md.

#### image/

Unless you're working on very small website/project, you should be suitable naming images with what they're used for. Create a smart directory structure if you need to make things visually clear and easy to navigate.

If you're using a spritesheet then make sure you include a .psd of the spritesheet, not just the .png itself. This makes it a lot more helpful when needing to do amends.

If possible, try and use PunyPNG, SmushIt or JPEGmini to reduce image file sizes.

#### fonts/

All custom fonts as well as font-squirrel kits should live here. Make sure only the fonts exist here and the corresponding font stylesheet lives in the css/ directory.
