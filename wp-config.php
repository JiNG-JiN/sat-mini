<?php


// ** MySQL settings ** //
/** The name of the database for WordPress */
define('DB_NAME', 'saatchi-mini');

/** MySQL database username */
define('DB_USER', 'saatchi-mini');

/** MySQL database password */
define('DB_PASSWORD', 'saatchi-mini');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

define('AUTH_KEY',         '+h.+W[B/}?goc&od707&xY?0}X[HcU#;~J-j]<ol0&7*KQVop;iFz7PAFX>.O?[@');
define('SECURE_AUTH_KEY',  '1$Wo.Y^pMsf0<M$:So:CdD~V%BA7}VFm5$6=We3T^SGn--A13_1HM<#l)0yOA:_-');
define('LOGGED_IN_KEY',    '[=jMNd.uV12j&Z3Roj)D.EtmLgYKke)UUKFK&Z56+4C!EO;OijMT`5wJdFY!.*.9');
define('NONCE_KEY',        '!h%VTr4xQg~=GrQ=MnO>q5h}utRSlms&?zP@r^O*Ao+3&VrdQ3N*H+lr]1=ct6G6');
define('AUTH_SALT',        'AK49Q47VrYKbzr1j~*J?)+eE=oipUSK$BR+6+H/zH@Sx+y+k`w`<Jy;OLV>UU3^p');
define('SECURE_AUTH_SALT', 'tl+{5}z;TL?75u,GX6Xa#!c}2[)VQg2C`]f^e| p:N>hTuJu|fCjhJC$ctPR(wM9');
define('LOGGED_IN_SALT',   'zkTa4XZ:Que92.!x!hW!.1+:6YvR67obvJ%3{}Z)FPZ8%gyfEAEQ}WwSy`{_>CpE');
define('NONCE_SALT',       '#VwvabQTzblmj) tA+;iyG@GHHma.c6`8XQTqvT~&d`^4=DRJyj+1XVMpN:K-RpH');


$table_prefix = 'mini';

define('WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'SCRIPT_DEBUG', true );
define( 'WP_DEBUG_DISPLAY', false );
@ini_set( 'display_errors', 0 );

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');

