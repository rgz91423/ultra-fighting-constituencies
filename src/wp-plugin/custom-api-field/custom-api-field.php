<?php
/*
Plugin Name: Custom API Field
*/

add_action( 'rest_api_init', function () {
    register_rest_field( 'category', 'img_thumbnail', array(
        'get_callback' => function( $category_arr ) {
           // $category_obj = get_category( $category_arr['id'] );
            return cfix_featured_image_url(array( 'size' => 'thumbnail', 'cat_id' => $category_arr['id'] ));
        }
    ) );

    register_rest_field( 'category', 'img_medium', array(
        'get_callback' => function( $category_arr ) {
            // $category_obj = get_category( $category_arr['id'] );
             return cfix_featured_image_url(array( 'size' => 'medium', 'cat_id' => $category_arr['id'] ));
         }
    ) );

    register_rest_field( 'category', 'img_large', array(
        'get_callback' => function( $category_arr ) {
            // $category_obj = get_category( $category_arr['id'] );
             return cfix_featured_image_url(array( 'size' => 'large', 'cat_id' => $category_arr['id'] ));
         }
    ) );

    register_rest_field( 'category', 'img_full', array(
        'get_callback' => function( $category_arr ) {
            // $category_obj = get_category( $category_arr['id'] );
             return cfix_featured_image_url(array( 'size' => 'full', 'cat_id' => $category_arr['id'] ));
         }
    ) );


} );

?>