<?php
/**
 * The template for displaying all pages.
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package saatchi
 */

get_header();
global $post;
$slug = $post->post_name;
?>
    <?php
        if($slug == 'eshopper') {
            get_template_part( 'template-parts/slider', get_post_format() );
        }
    ?>
	<div id="primary" class="full-width cf">
		<main id="main" class="site-main" role="main">

			<?php

                switch($slug) {
                    case 'blog':
                        get_template_part( 'template-parts/blog-list', get_post_format() );
                        break;
                    case 'eshopper':
                        get_template_part( 'template-parts/top', get_post_format() );
                        break;
                    case 'events':
                        set_query_var('limit', 12);
                        get_template_part( 'template-parts/events-list', get_post_format() );
                        break;
                    default:
                        /* Start the Loop */
                        while ( have_posts() ) : the_post();

                            /*
                            * Include the Post-Format-specific template for the content.
                            * If you want to override this in a child theme, then include a file
                            * called content-___.php (where ___ is the Post Format name) and that will be used instead.
                            */
                            get_template_part( 'template-parts/content', 'page' );

                        endwhile;
                }
			?>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php
if ( !is_home() && ! is_front_page() ) :
    get_sidebar();
endif;
get_footer();
