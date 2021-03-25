<?php
  if(isset($_POST["submit"])) {
    $username = $_POST['name'];
    $password = $_POST['password1'];
    $mail = $_POST['mail'];
    //connection
    $con = new mysqli('','root','password','vbdashboard');
    $con->query('set names utf8;');
    $sql =  "INSERT INTO user (username,mail,password,age,gender,birthday) VALUES ('".$username."','".$mail."','".$password."',0,'','')";
    if($con->query($sql)) {
        echo"<script>alert('注册失败');history.go(-1);</script>";
    }
    else {
        echo"<script>alert('注册成功');history.go(-1);</script>";
    }

  }
?>
