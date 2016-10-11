<?php
if(!isset($_COOKIE['features_unlocked']))
    readfile('views/index_locked.php');
else
    readfile('views/index_unlocked.php');