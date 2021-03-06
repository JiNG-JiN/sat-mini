<?php /**
 * Template part for displaying posts.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package saatchi
 */

?>
<div id="post-<?php $id = the_ID(); ?>" <?php post_class('primary-content'); ?>>
	<header class="entry-header">
		<?php
			if ( is_single() ) {
                the_title( '<h1 class="entry-title">', '</h1>' );
			} else {
                the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
			}

		if ( 'post' === get_post_type() ) : ?>
		<div class="entry-meta">
			<?php saatchi_posted_on(); ?>
		</div><!-- .entry-meta -->
		<?php
		endif; ?>
	</header><!-- .entry-header -->
	<div class="entry-content">
        <?php saatchi_post_thumbnail($id, array(753,422));?>
    </div>
	<div class="entry-content">
		<?php
			the_content( sprintf(
				/* translators: %s: Name of current post. */
				wp_kses( __( 'Continue reading %s <span class="meta-nav">&rarr;</span>', 'saatchi' ), array( 'span' => array( 'class' => array() ) ) ),
				the_title( '<span class="screen-reader-text">"', '"</span>', false )
			) );

			wp_link_pages( array(
				'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'saatchi' ),
				'after'  => '</div>',
			) );
		?>
	</div><!-- .entry-content -->

	<footer class="entry-footer">
		<?php saatchi_entry_footer(); ?>
	</footer><!-- .entry-footer -->
</div><!-- #post-## -->
    <?php
        $media_contact = get_post_meta( get_the_ID(), 'media-contact', true );
        if( !empty( $media_contact ) ) {
            $content = htmlspecialchars_decode($media_contact);
            $content = wpautop( $content );
        ?>
        <div class="secondary-content">
            <aside class="extra-content">
                <h1>Notes</h1>
                <div class="text">
                <?php echo $content;?>
                </div>
            </aside>
        </div>
        <?php
        }
    ?>
