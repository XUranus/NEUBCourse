<%@ page contentType="text/html; charset=UTF-8" import="java.sql.*,Bean.UserBean,Bean.Config"%>
<%request.setCharacterEncoding("UTF-8");%>
<%@ page import="java.sql.*" %>


<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="XUranus">
  <meta name="author" content="XUranus">
  <title>MyCloud - 完善你的信息</title>
  <link rel="shortcut icon" href="img/favicon.ico" />
  <!-- Bootstrap core CSS-->
  <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <!-- Custom styles for this template-->
  <link href="css/sb-admin.css" rel="stylesheet">
  <link href="css/cropper.min.css" rel="stylesheet">
  <style type="text/css">
    #user-photo {
        width:100px;
        height:100px;
        border-radius: 50%;
    }
    #photo {
        max-width:100%;
        max-height:350px;
        border-radius: 50%;
    }
    .img-preview-box {
        text-align: center;
    }
    .img-preview-box > div {
        display: inline-block;;
        margin-right: 10px;
    }
    .img-preview {
        overflow: hidden;
    }
    .img-preview-box .img-preview-md {
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }
    .img-preview-box .img-preview-sm {
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
</style>
</head>

<body class="bg-dark">
  <div class="text-center">
    <br><br>
      <img src="img/logo.png" style="width:150px">
      <h1>MyCloud</h1>
  </div>

  <div class="container">
    <div class="card card-login mx-auto mt-5">
      <div class="card-header">完善你的信息</div>
      <div class="card-body">
  <%
		String driver = "com.mysql.jdbc.Driver";
	  	String url = Config.getMySQLUrl();//need to be modified
		String user = Config.getMySQLUserName();
		String sqlPassword = Config.getMySQLPassword();
		try {

			String mail = request.getParameter("mail");
			String password = request.getParameter("password");
			String nickname = "";
     		String avatar_path = "";
			Class.forName(driver);
			Connection conn = DriverManager.getConnection(url, user, sqlPassword);
			Statement statement = conn.createStatement();
			String sql = "select * from user where mail = '" + mail+"' and password = '"+password+"'";
			ResultSet rs = statement.executeQuery(sql);
			int count = 0;
			int userID = -1;
			while (rs.next()) {
				count ++;
				userID = rs.getInt("ID");
				nickname = rs.getString("nickname");
        		avatar_path = rs.getString("avatar_path");
			}
			rs.close();
			statement.close();
			conn.close();
			if(count==1){
				session.setAttribute("USERID",userID);
       			 UserBean user_now = new UserBean(mail,nickname,avatar_path,userID);
				session.setAttribute("user_now",user_now);
			}else{
				out.println("<script>window.location.href='"+"login.html"+"'</script>");
			}
		} catch (ClassNotFoundException e) {
			System.out.println("Sorry,can`t find the Driver!");
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	%>
      <%---在这里完成登陆 获取session ---%>


        <div class="text-center mt-4 mb-4">
          <h4>你可以进一步完善你的信息</h4>
          <p>使我们能给你提供更好的体验</p>
          <a class="btn btn-primary btn-block" href="disk.jsp">不了,现在开始体验</a>
        </div>


    <!--avatar modal -->
    <div class="modal fade" id="changeModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title text-primary">
                  <i class="fas fa-pencil-alt"></i> 选择头像
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            </div>
            <div class="modal-body">
                <p class="tip-info text-center">
                    未选择图片
                </p>
                <div class="img-container hidden">
                    <img src="${sessionScope.user_now.avatar_path}" alt="" id="photo">
                </div>
                <div class="img-preview-box hidden">
                    <span>100*100:</span>
                    <div class="img-preview img-preview-md">
                    </div>
                    <span>30*30:</span>
                    <div class="img-preview img-preview-sm">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <label class="btn btn-danger" for="photoInput" style="margin-bottom:0;;">
                <input type="file" class="sr-only" id="photoInput" accept="image/*">
                <span>上传图片</span>
                </label>
                <button class="btn btn-primary disabled" disabled="true" onclick="sendPhoto();">确定</button>
                <button class="btn btn-close" aria-hidden="true" data-dismiss="modal">取消</button>
            </div>
        </div>
    </div>
    </div>


        <!--detail panel-->
          <div>
            <div class="dropdown-divider"></div>
            <h5>以下信息均为选填</h5>
            <form id="detailInfoForm" name="detailInfoForm">
              <div class="form-group">

                <div class="text-center" data-target="#changeModal" data-toggle="modal">
                  <div class="btn btn-outline-light">
                    <img id="user-photo" src="img/default_avatar.png" style="text-align: center;border-radius: 50%;height: 9em;width: 9em;margin-bottom: 1.5em;margin-top: 1.5em;">
                  </div>
                </div><br>

                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="select_age">年龄</label>
                  </div>
                  <select class="custom-select" id="select_age" form="detailInfoForm" name="age"></select>
                </div>

                <div class="form-group">
                  <label for="tag">选择你的标签&nbsp;</label>
                  <input type="text" style="display:none" name="tag" id="tag">
                  <div id="tagBadges" style="margin:5px"> tags loading...</div>
                </div>

                <div class="text-center" style="margin-top:1em;margin-bottom:1em;">
                	<div class="custom-control custom-radio custom-control-inline">
        					  <input type="radio" id="customRadioInline1" name="gender" value="male" class="custom-control-input">
        					  <label class="custom-control-label" for="customRadioInline1">男性</label>
        					</div>
        					<div class="custom-control custom-radio custom-control-inline">
        					  <input type="radio" id="customRadioInline2" name="gender" value="female" class="custom-control-input">
        					  <label class="custom-control-label" for="customRadioInline2">女性</label>
        					</div>
                </div>

                <div class="form-group">
                  <label for="qq">QQ号</label>
                  <input class="form-control" type="text" placeholder="QQ号" name="qq" id="qq" aria-describedby="QQ">
                </div>
                <div class="form-group">
                  <label for="tel">手机号</label>
                  <input class="form-control" type="text" placeholder="手机号" name="tel" id="tel" aria-describedby="tel">
                </div>
                <div class="form-group">
                  <label for="self_intruction">自我描述</label>
                  <textarea class="form-control" id="self_intruction" name="self_intruction" type="text" aria-describedby="self_intruction" placeholder="一句话描述一下你自己"></textarea>
                </div>
                <span id="errMsgPanel" style="color:red"></span>
              </div>
            </form>
            <button class="btn btn-primary btn-block" id="submitBtn">提交</button>
          </div>
        <!--/detail panel-->


      </div>
    </div>
  </div>
<!-- Bootstrap core JavaScript-->
  <script src="js/config.js"></script>
  <script src="js/fontawesome-all.js"></script>
  <script src="vendor/jquery/jquery.js"></script>
  <script src="js/registerDetailPage.js"></script>
  <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <!-- Core plugin JavaScript-->
  <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
  <!-- Avatar JavaScript -->
  <script src="js/cropper.min.js"></script>
  <script src="vendor/bootstrap/js/bootstrap.min.js"></script>
</body>

</html>
