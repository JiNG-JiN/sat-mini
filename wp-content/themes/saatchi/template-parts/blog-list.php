<?php
/**
 * Template part for displaying Blog list pages.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package saatchi
 */

$style_width = get_image_width('thumbnail') . 'px';
$cat_id = get_cat_ID( 'blog' );
$args = array(
    'cat' => $cat_id,
    'post_type' => 'post',
    'posts_per_page' => '12',
);
$query = new WP_Query( $args );
if ( $query->have_posts() ) {
?>
<section class="media-boxes cf">
    <?php while ( $query->have_posts() ) {
        $query->the_post();
    ?>
        <article class="media-box hover show" style="width: <?php echo $style_width;?>" data-url="<?php the_permalink(); ?>">
            <header>
                <hgroup>
                <h2><a href="<?php the_permalink(); ?>" title="Read more"><?php the_title(); ?></a></h2>
                <h5>BLOG <?php saatchi_posted_on();?></h5>
                </hgroup>
                <div class="intro"><?php get_excerpt(20);?></div>
            </header>
            <div class="image-frame">
            <a href="<?php the_permalink(); ?>" title="Read more"><?php saatchi_post_thumbnail(null, array(460,308), array('class' => 'preload', 'onload' => 'imgLoaded(this)'));?></a>
            </div>
        </article>
    <?php } // end while ?>
</section>
<?php } //end if ?>
<?php
// Use reset to restore original query.
wp_reset_postdata();
?>

