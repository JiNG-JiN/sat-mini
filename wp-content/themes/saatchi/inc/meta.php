<?php

  $title = "Saatchi & Saatchi";
  if ($page['id'] == 1 && $page['varchars_3'] != '') $title = $page['varchars_3'];
  $description = "The Lovemarks company. Nothing is impossible.";
  $image = site_url('assets/image') . "profile.png";
  $type = "website";

  if ( $parent_section == 'purpose' ) {
    $section_title = isset($translation['purpose']) ? ucfirst($translation['purpose']) : 'Purpose';
    $title = $section_title . ' : ' . $title;
    $image = site_url('assets/image') . "purpose.png";
    if ( $page['token'] != 'purpose-page' ) {
      $title = $page['title'] . " : " . $title;
      if ( $page['token'] != 'most-shared' ) {
        $description = $page['longtexts_1'];
        $image = isset($item['carousel']) ? get_upload($item['carousel'][0]['files_1_uri'], 'resize_then_crop[500, 350]') : "";
      }
    } else {
      $description = $page['longtexts_1'];
    }

  } elseif ( $parent_section == 'news' ) {
    $section_title = isset($translation['news']) ? ucfirst($translation['news']) : 'News';
    $title = $section_title . ' : ' . $title;
    if ( isset($newsDetail) ) {
      $title = $newsDetail['title'] . " : " . $title;
      $description = $newsDetail['longtexts_1'];
      $type = "article";
      $url = site_url($idiom . "/news/" . $newsDetail['token']);
      $image = get_upload($newsDetail['files_1_uri'], 'resize_then_crop[500, 350]');
    }

  } elseif ( $parent_section == 'work' ) {
    $section_title = isset($translation['work']) ? ucfirst($translation['work']) : 'Work';
    $title = $section_title . ' : ' . $title;
    if ( isset($workDetail) ) {
      $title = $workDetail['title'] . " : " . $title;
      $description = $workDetail['longtexts_1'];
      $type = "article";
      $url = site_url($idiom . "/work/" . $workDetail['token']);
      $image = get_upload($workDetail['files_1_uri'], 'resize_then_crop[500, 350]');
    }

  } elseif ( $parent_section == 'people' ) {
    $section_title = isset($translation['people']) ? ucfirst($translation['people']) : 'People';
    $title = $section_title . ' : ' . $title;
    if ( isset($selected_category)  AND !empty($selected_category)) {
      $title = $selected_category['title'] . " : " . $title;
      $description = $selected_category['longtexts_1'];
      $type = "profile";
      $url = site_url($idiom . "/people/" . $selected_category['token']);
    }
    if ( isset($person) ) {
      if ( $person['token'] != 'kevin' )  $title = $person['title'] . " : " . $title;
      $description = $person['longtexts_1'];
      $url = site_url($idiom . "/people/" . $selected_category['token'] . "/" . $person['token']);
      $image = get_upload($person['files_1_uri'], 'resize_then_crop[500, 500]');
    }

  } elseif ( $parent_section == 'network' ) {
    $section_title = isset($translation['network']) ? ucfirst($translation['network']) : 'Network';
    $title = $section_title . ' : ' . $title;

    $title = $page['title'] . " : " . $title;
    if ( $page['longtexts_1'] != "" ) { $description = $page['longtexts_1']; }
    if ( isset($item['carousel']) && isset($item['carousel'][0]) ) { $image = get_upload($item['carousel'][0]['files_1_uri'], 'resize_then_crop[500, 350]'); }

  } else {

    $title = ((isset($page['title']) AND $page['id'] != 1) ? $page['title'] . ' : ' : '') . $title;

  }

  $title = trim($title);
  $description = trim(htmlspecialchars(word_limiter(strip_tags($description), 100), ENT_COMPAT));

?>

  <title><?= $title ?></title>
  <meta name="description" content="<?= $description ?>">
  <meta name="keywords" content="Saatchi & Saatchi, The Lovemarks Company, Nothing is Impossible">
  <meta name="language" content="<?= $idiom ?>">

  <meta property="og:title" content="<?= $title ?>">
  <meta property="og:type" content="<?= $type ?>">
  <?php if ( $image ): ?><meta property="og:image" content="<?= $image ?>"><?php endif ?>
  <meta property="og:site_name" content="Saatchi & Saatchi">
  <meta property="og:description" content="<?= $description ?>">
