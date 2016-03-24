<?php
/**
 * Custom functions that act independently of the theme templates.
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package saatchi
 */

/**
 * Adds custom classes to the array of body classes.
 *
 * @param array $classes Classes for the body element.
 * @return array
 */
function saatchi_body_classes( $classes ) {
	// Adds a class of group-blog to blogs with more than 1 published author.
	if ( is_multi_author() ) {
		$classes[] = 'group-blog';
	}

	// Adds a class of hfeed to non-singular pages.
	if ( ! is_singular() ) {
		$classes[] = 'hfeed';
	}

	return $classes;
}
add_filter( 'body_class', 'saatchi_body_classes' );

/**
 * Adds Media Contact meta box to the post editing screen
 */

function saatchi_post_note_meta() {
    add_meta_box('post_note', __('Media Contact','saatchi'), 'post_note_callback', 'post');
}
add_action( 'add_meta_boxes', 'saatchi_post_note_meta' );

function post_note_callback() {
    global $post;
    wp_nonce_field( 'media_contact', 'saatchi_nonce' );
    $saatchi_stored_meta = get_post_meta( $post->ID );
    $media_contact = isset($saatchi_stored_meta['media-contact']) ? $saatchi_stored_meta['media-contact'][0] : '';
     wp_editor(htmlspecialchars_decode($media_contact) , 'media-contact', array(
 "media_buttons" => true
 ));

}

/**
 * Saves the custom meta input
 */
function saatchi_meta_save( $post_id ) {

    // Checks save status
    $is_autosave = wp_is_post_autosave( $post_id );
    $is_revision = wp_is_post_revision( $post_id );
    $is_valid_nonce = ( isset( $_POST[ 'saatchi_nonce' ] ) && wp_verify_nonce( $_POST[ 'saatchi_nonce' ], 'media_contact' ) ) ? 'true' : 'false';

    // Exits script depending on save status
    if ( $is_autosave || $is_revision || !$is_valid_nonce ) {
        return;
    }

    // Checks for input and sanitizes/saves if needed
    if( isset( $_POST[ 'meta-text' ] ) ) {
        update_post_meta( $post_id, 'meta-text', sanitize_text_field( $_POST[ 'meta-text' ] ) );
    }
    if( isset( $_POST[ 'media-contact' ] ) ) {
        $data = htmlspecialchars($_POST['media-contact']);
        update_post_meta( $post_id, 'media-contact', $data );
    }

}
add_action( 'save_post', 'saatchi_meta_save' );

/**
 * Adds the meta box stylesheet when appropriate
 */
function saatchi_admin_styles(){
    global $typenow;
    if( $typenow == 'post' ) {
        wp_enqueue_style( 'saatchi_meta_box_styles', get_stylesheet_directory_uri() . '/admin/css/metabox.css' );
    }
}
add_action( 'admin_print_styles', 'saatchi_admin_styles' );

