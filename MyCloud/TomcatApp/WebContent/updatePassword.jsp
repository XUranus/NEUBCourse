<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"  import="Bean.FindPassword"%>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="">
  <meta name="author" content="">
  <title>MyCloud - 重设密码</title>
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
  
  
 <% 
   String token = request.getParameter("token");
   String password = request.getParameter("password");
   if(!FindPassword.tokenExist(token)) {
	   out.println("<script>window.location.href = 'login.html'</script>");//返回主页
   } else {
	FindPassword.resetPassword(token,password);%>
		
	<div class="card card-login mx-auto mt-5">
      <div class="card-header">重设密码</div>
      <div class="card-body">
      <div class="text-center mt-4 mb-5">
        <h4>成功</h4>
        <p>点击链接重新登陆</p>
        <a class="btn btn-primary btn-block" href="login.html">返回主页</a>
      </div>
    </div>
 
 <% } %>  
  	
  </div>
  
   
  
  
  <!-- Bootstrap core JavaScript-->
  <script src="js/config.js"></script>
  <script src="vendor/jquery/jquery.min.js"></script>
  <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <!-- Core plugin JavaScript-->
  <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
</body>

</html>