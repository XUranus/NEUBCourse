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
  
<% String token = request.getParameter("token"); %>
<% if(FindPassword.tokenExist(token)) { %>

	 <div class="card card-login mx-auto mt-5">
      <div class="card-header">重设密码</div>
      <div class="card-body">
      <div class="text-center mt-4 mb-5">
          <h4>输入新的密码以重置密码</h4>
        </div>
        <form action="updatePassword.jsp" method="post" onsubmit="return validate();">
          <div class="form-group">
            <input class="form-control" id="password1" name="password" type="password" placeholder="输入新密码"><br>
            <input class="form-control" id="password2" type="password" placeholder="再次输入密码">
            <input style="display:none" name="token" type="text" value="<%=request.getParameter("token") %>">
          </div>
          <span id="errMessage" style="color:red"></span><br>
          <button class="btn btn-primary btn-block" type="submit">立刻重置</button>
        </form>
      </div>
    </div>
    
<% } else { %>

	 <div class="card card-login mx-auto mt-5">
      <div class="card-header">重设密码</div>
      <div class="card-body">
      <div class="text-center mt-4 mb-5">
        <h4>该链接已不可用</h4>
        <p>请重新发送邮件</p>
        <a class="btn btn-primary btn-block" href="login.html">返回主页</a>
      </div>
    </div>
    
	
<% } %>
    
    <script>
	  function validate() {
		  var pass1 = $("#password1").val();
		  var pass2 = $("#password2").val();
		  if(pass1=='' || pass1==null || pass1!=pass2 || pass1.length <5) {
			  $("#errMessage").html("密码不合法！");
			  return false;
		  }
		  return true;
	  }
  	</script>
  	
  </div>
  
   
  
  
  <!-- Bootstrap core JavaScript-->
  <script src="js/config.js"></script>
  <script src="vendor/jquery/jquery.min.js"></script>
  <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <!-- Core plugin JavaScript-->
  <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
</body>

</html>