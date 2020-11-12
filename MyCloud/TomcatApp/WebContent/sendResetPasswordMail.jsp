<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"  %>
<%@page import = "Bean.FindPassword" %>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="">
  <meta name="author" content="">
  <title>MyCloud - 找回密码</title>
  <link rel="shortcut icon" href="img/favicon.ico" />
  <!-- Bootstrap core CSS-->
  <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <!-- Custom fonts for this template-->
  <link href="vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
  <!-- Custom styles for this template-->
  <link href="css/sb-admin.css" rel="stylesheet">
</head>

<body class="bg-dark">

  <div class="text-center">
    <br><br>
      <img src="img/logo.png" style="width:150px">
      <h1>MyCloud</h1>
  </div>

  <div class="container">
    <div class="card card-login mx-auto mt-5">
      <div class="card-header">找回密码</div>
      
      
      <% String mail = request.getParameter("mail"); %>
      <% if(FindPassword.mailExist(mail)) { %>
      <% FindPassword.sendResetPasswordMail(mail); %>
      <div class="card-body">
        <div class="text-center mt-4 mb-5">
          <h4>邮件已发送</h4>
          <p>请根据邮件提供的链接重设密码</p>
        </div>
        <a class="btn btn-primary btn-block" href="login.html">返回登陆页</a>
        <div class="text-center">
          <a class="d-block small mt-3" href="register.html">没有账号?注册</a>
          <a class="d-block small" href="login.html">登陆</a>
        </div>
      </div>
      <% } else { %>
      <div class="card-body">
        <div class="text-center mt-4 mb-5">
          <h4>发送邮件失败</h4>
          <p>没有该用户，请检查你的邮箱是否正确</p>
        </div>
        <button class="btn btn-primary btn-block" onclick="javascript:history.back(-1)">返回上一页</button>
        <div class="text-center">
          <a class="d-block small mt-3" href="register.html">没有账号?注册</a>
          <a class="d-block small" href="login.html">登陆</a>
        </div>
      </div>
      <% } %>
      
      
      
      
    </div>
  </div>
  <!-- Bootstrap core JavaScript-->
  <script src="js/config.js"></script>
  <script src="vendor/jquery/jquery.min.js"></script>
  <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <!-- Core plugin JavaScript-->
  <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
</body>

</html>
