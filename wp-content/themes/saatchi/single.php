<?php
/**
 * The template for displaying all single posts.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package saatchi
 */

get_header(); ?>
	<div id="primary" class="full-width cf">

		<?php
		while ( have_posts() ) : the_post();
        ?>
      <section class="page news inset cf">

      <?php
			get_template_part( 'template-parts/content', get_post_format() );

			// the_post_navigation();

			// If comments are open or we have at least one comment, load up the comment template.
            if(1 != 1):
                if ( comments_open() || get_comments_number() ) :
                    comments_template();
                endif;
            endif;
?>

		</section><!-- #section -->
        <?php
		endwhile; // End of the loop.
		?>

	</div><!-- #primary -->
    <hr class="shadow">
	<div class="full-width cf">
    <?php
			get_template_part( 'template-parts/latest-blog', get_post_format() );
    ?>
    </div>
<?php
get_sidebar();
get_footer();
