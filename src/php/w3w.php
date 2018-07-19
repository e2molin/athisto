<?php
  include("what3words.php");
  $what3words = new Pas_Service_What3words();
  $what3words->setApiKey("L7ZG8VW6")->setLanguage("es")->positionToWords(array(-3.5665656,43.23232369));
?>