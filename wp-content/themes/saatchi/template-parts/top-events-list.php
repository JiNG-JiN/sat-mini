<?php
/**
 * Template part for displaying eshooper top page  Event list.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package saatchi
 */
$limit = $wp_query->query_vars['limit'] ? $wp_query->query_vars['limit'] : '12';
$args = array(
    'post_type' => 'event',
    'posts_per_page' => $limit,
);
$query = new WP_Query( $args );
if(($event = $query->have_posts())):
$class = 'item';
$n = '0';
?>
			<ul class="events events-slideshow clearer">
            <?php while ( $query->have_posts() ) {
                $query->the_post();
                $n++;
                $st_date = saatchi_event_st(get_post_meta( get_the_ID(), 'saatchi_events_st', true ));
                $location = esc_html(get_post_meta( get_the_ID(), 'saatchi_events_location', true ));
            ?>
                <li class="<?php echo $class . $n?> slide">
                <header><h2><?php the_title();?></h2></header>
				<div class="content">
                <p class="post-on"><?php echo $st_date; ?></p>
                    <h3><?php echo $location;?></h3>
					<p class="intro">
                    <?php excerpt(50); ?>
					</p>
					<a class="join" href="javascript:;">JOIN</a>
				</div>
			</li>
            <?php } // end while ?>
			</ul>
    <?php endif;?>
