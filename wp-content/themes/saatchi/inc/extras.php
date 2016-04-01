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

/*
 * remove open sans font
 */
if(!function_exists('remove_web_fonts')):
    function remove_web_fonts() {
        wp_deregister_style( 'open-sans' );
        wp_register_style( 'open-sans', false );
    }
    add_action('admin_enqueue_scripts', 'remove_web_fonts');
endif;

/*
 * add events post type
 */
function create_event_post() {
  register_post_type( 'event',
    array(
        'labels' => array(
            'name' => __( 'Events', 'Events', 'saatchi' ),
            'singular_name' => __( 'Event', 'Event', 'saatchi' ),
            'add_new_item' => __( 'Add New Event', 'saatchi'),
            'new_item'           => __( 'New Event', 'saatchi' ),
            'edit_item'          => __( 'Edit Event', 'saatchi' ),
            'view_item'          => __( 'View Event', 'saatchi' ),
            'all_items'          => __( 'All Events', 'saatchi' ),
            'search_items'       => __( 'Search Events', 'saatchi' ),
            'not_found'          => __( 'No Events found.', 'saatchi' ),
            'not_found_in_trash' => __( 'No Events found in Trash.', 'saatchi' )
    ),
        'public' => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'menu_position'      => 23,
        'menu_icon'          => 'dashicons-smiley',
        'query_var'          => true,
        'rewrite' => array( 'slug' => 'event' ),
        'capability_type' => 'post',
        'has_archive' => true,
        'hierarchical' => false,
        'supports' => array( 'title', 'editor', 'author', 'thumbnail', 'excerpt', 'post-formats' ),
        'taxonomies' => array( 'eventcategory', 'post_tag')
    )
  );
}
add_action( 'init', 'create_event_post' );

/**
 * Adds Media Contact meta box to the post editing screen
 */

function saatchi_post_note_meta() {
    add_meta_box('post_note', __('Media Contact','saatchi'), 'post_note_callback', 'post');
    // add_meta_box('post_event', __('Event Info','saatchi'), 'event_info_callback', 'event', 'side', 'core');
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

add_action( 'cmb2_admin_init', 'saatchi_event_metabox' );
function saatchi_event_metabox() {
	$prefix = 'saatchi_events_';
    $cmb = new_cmb2_box( array(
		'id'            => $prefix . 'metabox',
		'title'         => __( 'Event Info', 'saatchi' ),
		'object_types'  => array( 'event', ),
        'context'      => 'side',
        'priority'   => 'high',
        'show_names' => true, // Show field names on the left
    ) );

    $cmb->add_field( array(
        'name' => __('Start Date', 'saatchi'),
        'id'   => $prefix . 'st',
        'type' => 'text_date_timestamp',
        'attributes' => array(
            'data-datepicker' => json_encode( array(
                'yearRange' => '2015:'. ( date( 'Y' ) + 20 ),
            )),
            'required'    => 'required',
        ),
        // 'timezone_meta_key' => 'wiki_test_timezone',
        // 'date_format' => 'l jS \of F Y',
    ));

    $cmb->add_field( array(
        'name' => __('End Date', 'saatchi'),
        'id'   => $prefix . 'ed',
        'type' => 'text_date_timestamp',
        // 'timezone_meta_key' => 'wiki_test_timezone',
        // 'date_format' => 'l jS \of F Y',
    ) );

    $cmb->add_field( array(
        'name' => __('Location', 'saatchi'),
        'id'   => $prefix . 'location',
        'type' => 'textarea_small'
    ) );

	$cmb->add_field( array(
		'name' => __( 'Event URL', 'saatchi' ),
		'id'   => $prefix . 'url',
		'type' => 'text_url',
	) );

	$prefix = 'saatchi_sidebar_';
    $cmb_sidebar = new_cmb2_box(
        array(
            'id'            => $prefix . 'metabox',
            'title'         => __( 'Choose Sidebar', 'saatchi' ),
            'object_types'  => array( 'page', ),
            // 'context'      => 'normal',
            // 'priority'   => 'hight',
            'show_names' => true, // Show field names on the left
        )
    );

	$cmb_sidebar->add_field( array(
		'name' => __( 'Event URL', 'saatchi' ),
		'id'   => $prefix . 'url',
		'type' => 'text_url',
	) );
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

function restrict_post_deletion($post_ID){
    $restricted_pages = array(42);
    if(in_array($post_ID, $restricted_pages)){
        echo "You are not authorized to delete this page.";
        exit;
    }
}
add_action('wp_trash_post', 'restrict_post_deletion', 10, 1);
add_action('before_delete_post', 'restrict_post_deletion', 10, 1);

add_action( 'cmb2_admin_init', 'saatchi_register_demo_metabox' );
/**
 * Hook in and add a demo metabox. Can only happen on the 'cmb2_admin_init' or 'cmb2_init' hook.
 */
function saatchi_register_demo_metabox() {
	$prefix = 'saatchi_demo_';

	/**
	 * Sample metabox to demonstrate each field type included
	 */
	$cmb_demo = new_cmb2_box( array(
		'id'            => $prefix . 'metabox',
		'title'         => __( 'Test Metabox', 'cmb2' ),
		'object_types'  => array( 'page', ), // Post type
		// 'show_on_cb' => 'yourprefix_show_if_front_page', // function should return a bool value
        // 'context'    => 'side',
		// 'show_names' => true, // Show field names on the left
		// 'cmb_styles' => false, // false to disable the CMB stylesheet
		// 'closed'     => true, // true to keep the metabox closed by default
	) );

	// $cmb_demo->add_field( array(
		// 'name'       => __( 'Test Text', 'cmb2' ),
		// 'desc'       => __( 'field description (optional)', 'cmb2' ),
		// 'id'         => $prefix . 'text',
		// 'type'       => 'text',
		// 'show_on_cb' => 'yourprefix_hide_if_no_cats', // function should return a bool value
		// // 'sanitization_cb' => 'my_custom_sanitization', // custom sanitization callback parameter
		// // 'escape_cb'       => 'my_custom_escaping',  // custom escaping callback parameter
		// // 'on_front'        => false, // Optionally designate a field to wp-admin only
		// // 'repeatable'      => true,
	// ) );

	// $cmb_demo->add_field( array(
		// 'name' => __( 'Test Text Small', 'cmb2' ),
		// 'desc' => __( 'field description (optional)', 'cmb2' ),
		// 'id'   => $prefix . 'textsmall',
		// 'type' => 'text_small',
		// // 'repeatable' => true,
	// ) );

	// $cmb_demo->add_field( array(
		// 'name' => __( 'Test Text Medium', 'cmb2' ),
		// 'desc' => __( 'field description (optional)', 'cmb2' ),
		// 'id'   => $prefix . 'textmedium',
		// 'type' => 'text_medium',
		// // 'repeatable' => true,
	// ) );

	// $cmb_demo->add_field( array(
		// 'name' => __( 'Website URL', 'cmb2' ),
		// 'desc' => __( 'field description (optional)', 'cmb2' ),
		// 'id'   => $prefix . 'url',
		// 'type' => 'text_url',
		// // 'protocols' => array('http', 'https', 'ftp', 'ftps', 'mailto', 'news', 'irc', 'gopher', 'nntp', 'feed', 'telnet'), // Array of allowed protocols
		// // 'repeatable' => true,
	// ) );

	// $cmb_demo->add_field( array(
		// 'name' => __( 'Test Text Email', 'cmb2' ),
		// 'desc' => __( 'field description (optional)', 'cmb2' ),
		// 'id'   => $prefix . 'email',
		// 'type' => 'text_email',
		// // 'repeatable' => true,
	// ) );

	// $cmb_demo->add_field( array(
		// 'name' => __( 'Test Time', 'cmb2' ),
		// 'desc' => __( 'field description (optional)', 'cmb2' ),
		// 'id'   => $prefix . 'time',
		// 'type' => 'text_time',
		// // 'time_format' => 'H:i', // Set to 24hr format
	// ) );

	// $cmb_demo->add_field( array(
		// 'name' => __( 'Time zone', 'cmb2' ),
		// 'desc' => __( 'Time zone', 'cmb2' ),
		// 'id'   => $prefix . 'timezone',
		// 'type' => 'select_timezone',
	// ) );

	// $cmb_demo->add_field( array(
		// 'name' => __( 'Test Date Picker', 'cmb2' ),
		// 'desc' => __( 'field description (optional)', 'cmb2' ),
		// 'id'   => $prefix . 'textdate',
		// 'type' => 'text_date',
		// // 'date_format' => 'Y-m-d',
	// ) );

	// $cmb_demo->add_field( array(
		// 'name' => __( 'Test Date Picker (UNIX timestamp)', 'cmb2' ),
		// 'desc' => __( 'field description (optional)', 'cmb2' ),
		// 'id'   => $prefix . 'textdate_timestamp',
		// 'type' => 'text_date_timestamp',
		// // 'timezone_meta_key' => $prefix . 'timezone', // Optionally make this field honor the timezone selected in the select_timezone specified above
	// ) );

	// $cmb_demo->add_field( array(
		// 'name' => __( 'Test Date/Time Picker Combo (UNIX timestamp)', 'cmb2' ),
		// 'desc' => __( 'field description (optional)', 'cmb2' ),
		// 'id'   => $prefix . 'datetime_timestamp',
		// 'type' => 'text_datetime_timestamp',
	// ) );

	// // This text_datetime_timestamp_timezone field type
	// // is only compatible with PHP versions 5.3 or above.
	// // Feel free to uncomment and use if your server meets the requirement
	// // $cmb_demo->add_field( array(
	// // 	'name' => __( 'Test Date/Time Picker/Time zone Combo (serialized DateTime object)', 'cmb2' ),
	// // 	'desc' => __( 'field description (optional)', 'cmb2' ),
	// // 	'id'   => $prefix . 'datetime_timestamp_timezone',
	// // 	'type' => 'text_datetime_timestamp_timezone',
	// // ) );

	// $cmb_demo->add_field( array(
		// 'name' => __( 'Test Money', 'cmb2' ),
		// 'desc' => __( 'field description (optional)', 'cmb2' ),
		// 'id'   => $prefix . 'textmoney',
		// 'type' => 'text_money',
		// // 'before_field' => '£', // override '$' symbol if needed
		// // 'repeatable' => true,
	// ) );

	// $cmb_demo->add_field( array(
		// 'name'    => __( 'Test Color Picker', 'cmb2' ),
		// 'desc'    => __( 'field description (optional)', 'cmb2' ),
		// 'id'      => $prefix . 'colorpicker',
		// 'type'    => 'colorpicker',
		// 'default' => '#ffffff',
		// // 'attributes' => array(
		// // 	'data-colorpicker' => json_encode( array(
		// // 		'palettes' => array( '#3dd0cc', '#ff834c', '#4fa2c0', '#0bc991', ),
		// // 	) ),
		// // ),
	// ) );

	// $cmb_demo->add_field( array(
		// 'name' => __( 'Test Text Area', 'cmb2' ),
		// 'desc' => __( 'field description (optional)', 'cmb2' ),
		// 'id'   => $prefix . 'textarea',
		// 'type' => 'textarea',
	// ) );

	// $cmb_demo->add_field( array(
		// 'name' => __( 'Test Text Area Small', 'cmb2' ),
		// 'desc' => __( 'field description (optional)', 'cmb2' ),
		// 'id'   => $prefix . 'textareasmall',
		// 'type' => 'textarea_small',
	// ) );

	// $cmb_demo->add_field( array(
		// 'name' => __( 'Test Text Area for Code', 'cmb2' ),
		// 'desc' => __( 'field description (optional)', 'cmb2' ),
		// 'id'   => $prefix . 'textarea_code',
		// 'type' => 'textarea_code',
	// ) );

	// $cmb_demo->add_field( array(
		// 'name' => __( 'Test Title Weeeee', 'cmb2' ),
		// 'desc' => __( 'This is a title description', 'cmb2' ),
		// 'id'   => $prefix . 'title',
		// 'type' => 'title',
	// ) );

	// $cmb_demo->add_field( array(
		// 'name'             => __( 'Test Select', 'cmb2' ),
		// 'desc'             => __( 'field description (optional)', 'cmb2' ),
		// 'id'               => $prefix . 'select',
		// 'type'             => 'select',
		// 'show_option_none' => true,
		// 'options'          => array(
			// 'standard' => __( 'Option One', 'cmb2' ),
			// 'custom'   => __( 'Option Two', 'cmb2' ),
			// 'none'     => __( 'Option Three', 'cmb2' ),
		// ),
	// ) );

	// $cmb_demo->add_field( array(
		// 'name'             => __( 'Test Radio inline', 'cmb2' ),
		// 'desc'             => __( 'field description (optional)', 'cmb2' ),
		// 'id'               => $prefix . 'radio_inline',
		// 'type'             => 'radio_inline',
		// 'show_option_none' => 'No Selection',
		// 'options'          => array(
			// 'standard' => __( 'Option One', 'cmb2' ),
			// 'custom'   => __( 'Option Two', 'cmb2' ),
			// 'none'     => __( 'Option Three', 'cmb2' ),
		// ),
	// ) );

	// $cmb_demo->add_field( array(
		// 'name'    => __( 'Test Radio', 'cmb2' ),
		// 'desc'    => __( 'field description (optional)', 'cmb2' ),
		// 'id'      => $prefix . 'radio',
		// 'type'    => 'radio',
		// 'options' => array(
			// 'option1' => __( 'Option One', 'cmb2' ),
			// 'option2' => __( 'Option Two', 'cmb2' ),
			// 'option3' => __( 'Option Three', 'cmb2' ),
		// ),
	// ) );

	// $cmb_demo->add_field( array(
		// 'name'     => __( 'Test Taxonomy Radio', 'cmb2' ),
		// 'desc'     => __( 'field description (optional)', 'cmb2' ),
		// 'id'       => $prefix . 'text_taxonomy_radio',
		// 'type'     => 'taxonomy_radio',
		// 'taxonomy' => 'category', // Taxonomy Slug
		// // 'inline'  => true, // Toggles display to inline
	// ) );

	// $cmb_demo->add_field( array(
		// 'name'     => __( 'Test Taxonomy Select', 'cmb2' ),
		// 'desc'     => __( 'field description (optional)', 'cmb2' ),
		// 'id'       => $prefix . 'taxonomy_select',
		// 'type'     => 'taxonomy_select',
		// 'taxonomy' => 'category', // Taxonomy Slug
	// ) );

	// $cmb_demo->add_field( array(
		// 'name'     => __( 'Test Taxonomy Multi Checkbox', 'cmb2' ),
		// 'desc'     => __( 'field description (optional)', 'cmb2' ),
		// 'id'       => $prefix . 'multitaxonomy',
		// 'type'     => 'taxonomy_multicheck',
		// 'taxonomy' => 'post_tag', // Taxonomy Slug
		// // 'inline'  => true, // Toggles display to inline
	// ) );

	// $cmb_demo->add_field( array(
		// 'name' => __( 'Test Checkbox', 'cmb2' ),
		// 'desc' => __( 'field description (optional)', 'cmb2' ),
		// 'id'   => $prefix . 'checkbox',
		// 'type' => 'checkbox',
	// ) );

	// $cmb_demo->add_field( array(
		// 'name'    => __( 'Test Multi Checkbox', 'cmb2' ),
		// 'desc'    => __( 'field description (optional)', 'cmb2' ),
		// 'id'      => $prefix . 'multicheckbox',
		// 'type'    => 'multicheck',
		// // 'multiple' => true, // Store values in individual rows
		// 'options' => array(
			// 'check1' => __( 'Check One', 'cmb2' ),
			// 'check2' => __( 'Check Two', 'cmb2' ),
			// 'check3' => __( 'Check Three', 'cmb2' ),
		// ),
		// // 'inline'  => true, // Toggles display to inline
	// ) );

	// $cmb_demo->add_field( array(
		// 'name'    => __( 'Test wysiwyg', 'cmb2' ),
		// 'desc'    => __( 'field description (optional)', 'cmb2' ),
		// 'id'      => $prefix . 'wysiwyg',
		// 'type'    => 'wysiwyg',
		// 'options' => array( 'textarea_rows' => 5, ),
	// ) );

	// $cmb_demo->add_field( array(
		// 'name' => __( 'Test Image', 'cmb2' ),
		// 'desc' => __( 'Upload an image or enter a URL.', 'cmb2' ),
		// 'id'   => $prefix . 'image',
		// 'type' => 'file',
	// ) );

	// $cmb_demo->add_field( array(
		// 'name'         => __( 'Multiple Files', 'cmb2' ),
		// 'desc'         => __( 'Upload or add multiple images/attachments.', 'cmb2' ),
		// 'id'           => $prefix . 'file_list',
		// 'type'         => 'file_list',
		// 'preview_size' => array( 100, 100 ), // Default: array( 50, 50 )
	// ) );

	// $cmb_demo->add_field( array(
		// 'name' => __( 'oEmbed', 'cmb2' ),
		// 'desc' => __( 'Enter a youtube, twitter, or instagram URL. Supports services listed at <a href="http://codex.wordpress.org/Embeds">http://codex.wordpress.org/Embeds</a>.', 'cmb2' ),
		// 'id'   => $prefix . 'embed',
		// 'type' => 'oembed',
	// ) );

	// $cmb_demo->add_field( array(
		// 'name'         => 'Testing Field Parameters',
		// 'id'           => $prefix . 'parameters',
		// 'type'         => 'text',
		// 'before_row'   => 'yourprefix_before_row_if_2', // callback
		// 'before'       => '<p>Testing <b>"before"</b> parameter</p>',
		// 'before_field' => '<p>Testing <b>"before_field"</b> parameter</p>',
		// 'after_field'  => '<p>Testing <b>"after_field"</b> parameter</p>',
		// 'after'        => '<p>Testing <b>"after"</b> parameter</p>',
		// 'after_row'    => '<p>Testing <b>"after_row"</b> parameter</p>',
	// ) );

}
