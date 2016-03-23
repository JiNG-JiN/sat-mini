<?php
/**
 * Template part for displaying latest Blog pages.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package saatchi
 */

$args = array(
    'post_type' => 'post',
    'posts_per_page' => '3',
);
$query = new WP_Query( $args );
if ( $query->have_posts() ) {
?>
 <section class="media-boxes cf">
<h1>Latest Blog</h1>
<?php while ( $query->have_posts() ) {
    $query->the_post();
?>
<?php } // end while ?>
</section>
<?php } ?>
