<html>
<body>
<?php
   $say = htmlspecialchars($_POST['detail']);
   $to = "aditya@mutinylabs.in";
   $subject = "[MeriAwaaz]Contact Request";
   $message = $say;
   $header = "From:meriawaazapp.com \r\n";
   $retval = mail ($to,$subject,$message,$header);
   if( $retval == true )  
   {
      echo "Message sent successfully...";
   }
   else
   {
      echo "Message could not be sent...";
   }
?>
</body>
</html>