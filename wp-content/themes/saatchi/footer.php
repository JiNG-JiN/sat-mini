<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package saatchi
 */

?>

	</div><!-- #content -->

	<footer id="colophon" class="site-footer" role="contentinfo">
		<div class="site-info full-width cf">
            <h1>Saatchi &amp; Saatchi</h1>
        <?php if (is_active_sidebar( 'first-footer-widget-area' )):?>
        <?php dynamic_sidebar( 'first-footer-widget-area' ); ?>
        <?php endif;?>
		</div><!-- .site-info -->
	</footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
