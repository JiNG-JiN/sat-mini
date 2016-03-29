<?php
/**
 * The header for our theme.
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package saatchi
 */
$styles_path = get_stylesheet_directory_uri();
?>
<!DOCTYPE html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" <?php language_attributes(); ?>> <!--<![endif]-->
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1,requiresActiveX=true">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
<link rel="dns-prefetch" href="//ajax.googleapis.com">
<meta name="robots" content="all">
<link rel="icon" href="<?php echo $styles_path . '/assets/image/favicon.png'; ?>">
<link rel="profile" href="http://gmpg.org/xfn/11">
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
<link rel='stylesheet' href='<?php echo $styles_path . '/assets/css/style.1439995701721.css' ?>'>
<script src="<?php echo $styles_path . '/assets/js/libs/html5media.min.js'; ?>"></script>
<script type="text/javascript">
var imgLoaded = function(img) { img.className = img.className ? img.className + ' loaded' : 'loaded'; }
</script>
<!--[if lt IE 9]>
<script src="<?php echo $styles_path . '/assets/js/libs/html5shiv.min.js'; ?>"></script>
<![endif]-->

<?php wp_head(); ?>
</head>

<body data-section="" data-base-url="<?php echo site_url() ?>" <?php body_class() ?>>
<div id="wrapper">
	<a class="skip-link screen-reader-text" href="#content"><?php esc_html_e( 'Skip to content', 'saatchi' ); ?></a>

	<header id="masthead" class="site-header" role="banner">
<!--
		<div class="site-branding">
			<?php
			if ( is_front_page() && is_home() ) : ?>
				<h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
			<?php else : ?>
				<p class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></p>
			<?php
			endif;

			$description = get_bloginfo( 'description', 'display' );
			if ( $description || is_customize_preview() ) : ?>
				<p class="site-description"><?php echo $description; /* WPCS: xss ok. */ ?></p>
			<?php
			endif; ?>
        </div>
-->
<!-- .site-branding -->

      <div class="full-width cf">
        <hgroup class="logo cf">
            <?php if (isset($office_logo) && ($office_logo != '')): ?>
            <h1><a href="<?php echo site_url() ?>" style="background:url('<?php echo $styles_path . '/assets/image/' . $office_logo;?>') left center no-repeat">Saatchi &amp; Saatchi</a></h1>
            <?php else: ?>
            <h1><a href="<?php echo site_url() ?>">Saatchi &amp; Saatchi</a></h1>
            <?php endif; ?>
            <h2><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Greater China</a></h2>
        </hgroup>
      </div><!-- end .full-width -->

      <div class="fixed-header">
		<nav id="site-navigation" class="main-navigation site-nav" role="navigation">
          <div class="full-width cf">
			<button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false"><?php esc_html_e( 'Primary Menu', 'saatchi' ); ?></button>
			<?php //wp_nav_menu( array( 'theme_location' => 'primary', 'menu_id' => 'primary-menu' ) ); ?>
            <?php
                wp_nav_menu(array(
                'theme_location' => 'primary',
                'container' => false,
                'menu_id' => 'primary-menu',
                'menu_class' => 'cf drawer',
                'depth' => 2,
                'walker' => new Saatchi_Walker_Nav_Menu
                ));
            ?>
            </div>
		</nav><!-- site-navigation -->
    </div>

	</header><!-- #masthead -->

	<div id="content" class="site-content">
