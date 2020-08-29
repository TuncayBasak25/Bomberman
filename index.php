<?php

include 'header.php';

$dir = getcwd() . DIRECTORY_SEPARATOR . 'img';
$images = scandir($dir);

foreach ($images as $image) { if ($image !== '.' && $image !== '..') {
  if (is_dir($dir . DIRECTORY_SEPARATOR . $image) && $image === 'explosion') {
   $exp_images = scandir($dir . DIRECTORY_SEPARATOR . $image);
   foreach ($exp_images as $exp_image) { if ($exp_image !== '.' && $exp_image !== '..') {
     echo "<link rel='preload' href='img/explosion/$exp_image' as='image'>";
   }}
  }
  else {
    echo "<link rel='preload' href='img/$image' as='image'>";
  }
}}

echo "<script src='script.js'></script>";















include 'footer.php';
