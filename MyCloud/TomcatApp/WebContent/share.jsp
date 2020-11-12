<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="Bean.UserBean,Bean.FileBean,Bean.ShareBean,Bean.Config" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="">
  <meta name="author" content="">
  <title>MyCloud</title>
  <link rel="shortcut icon" href="img/favicon.ico" />
  <!-- Bootstrap core CSS-->
  <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <!-- Custom styles for this template-->
  <link href="css/sb-admin.css" rel="stylesheet">
  <link rel="stylesheet" href="css/audioplayer.css">
  <link rel="stylesheet" type="text/css" href="css/common.css">
  <link rel="stylesheet" type="text/css" href="css/detail_p.css">
  <link rel="stylesheet" type="text/css" href="http://at.alicdn.com/t/font_u4qz1594lnixusor.css">
  <script>FontAwesomeConfig = { searchPseudoElements: true };</script>
</head>

<body class="fixed-nav sticky-footer bg-dark container-fluid" id="page-top">
	<!-- Navigation-->
	<!--nav class="nav nav-pills navbar-expand-lg navbar-dark bg-dark fixed-top">
		<a class="nav-link active" href="javascript:;">MyCloud Share</a>
		<a class="nav-link" href="#">我的网盘</a>
	</nav-->
	
	<div>
	<% String token = request.getParameter("token");
	   ShareBean share = new ShareBean(token);
	%>
	 
	<% if(share.getFile()==null || share.getUploader()==null) { %>
		<div class="jumbotron">
		  <h1 class="display-4">404</h1>
		  <p class="lead">找不到您所请求的资源</p>
		  <hr class="my-4">
		  <p>分享不存在 或者资源已被删除</p>
		  <p class="lead">
		    <a class="btn btn-primary btn-lg" href="disk.jsp" role="button">返回我的网盘</a>
		  </p>
		</div>
	<% } else { %>
	    <div class="card">
	      <div class="card-header">
	        来自  <%=share.getUploader().getNickname()%>的文件分享
	      </div>
	      <div class="card-body  text-center">
	        <h5 class="card-title"><%=share.getFile().getFileName()%></h5>
	        <!--p class="card-text">描述</p-->
	        <i id="icon" class="" style="width:300px" onclick="preview()" data-toggle="collapse" href="#preview" aria-expanded="false" aria-controls="preview"></i>
            <br>
            <div class="collapse" id="preview">
                <div id="videoModal" class="container-fluid">
                    <div class="videos">
                      <!--bottom-->
                      <div class="video_b" style="margin-top:0">
                            <div class="video_ls">
                                <video id="vids">
                                  您的浏览器不支持h5标签,请升级或换个浏览器
                                  </video>
                                  <!--标题-->
                                  <div class="title_top">
                                    视频标题
                                  </div>
                                  <!--列表菜单-->
                                  <div class="list_right">
                                    <a href="javascript:void(0)" id="like"><i class="iconfont icon-xinxing2"></i></a>
                                      <a href="javascript:void(0)" id="zan"><i class="iconfont icon-dianzan"></i></a>
                                      <a href="javascript:void(0)"><i class="iconfont icon-pinglun"></i></a>
                                      <a href="javascript:void(0)"><i class="iconfont icon-zhuanfa"></i></a>
                                      <a href="javascript:void(0)"><i class="iconfont icon-gerenyetianjiajiaguanzhu"></i></a>
                                  </div>
                                  <!--暂停-->
                                  <div id="pass">
                                    <img src="img/zt.png">
                                  </div>
                                  <!--控制器-->
                                  <div class="controls">
                                    <!--进度条容器-->
                                      <div id="pBar">
                                        <!--进度条底色-->
                                          <div class="pBar_bj">
                                            <!--缓冲的进度条-->
                                              <div id="buff"></div>
                                            <!--进度条动态-->
                                            <div id="pBar_move">
                                                <!--进度条按钮-->
                                              <div id="pBtn"></div>
                                              </div>
                                          </div>
                                      </div>
                                      <!--展厅播放快进快退音量全屏-->
                                      <div class="trol_list">
                                        <!--暂停和快进快退-->
                                          <div class="list_1">
                                            <i class="iconfont icon-kuaitui-copy" onClick="ktui()"></i>
                                              <i class="iconfont icon-zanting2" id="ztbf"></i>
                                              <i class="iconfont icon-kuaijin" onClick="kjin()"></i>
                                          </div>
                                          <!--音量-->
                                          <div class="voice">
                                            <i class="iconfont icon-yinliang" style="float:left;"></i>
                                              <div class="voicep">
                                                <div id="vBar">
                                                    <div id="vBar_in"></div>
                                                  </div>
                                                  <div id="vBtn"></div>
                                              </div>
                                          </div>
                                          <!--时间-->
                                          <div class="vtime">
                                            <font id="nTime">00:00:00</font>/<em id="aTime">00:00:00</em>
                                          </div>
                                          <!--全屏-->
                                          <i id="qp" class="iconfont icon-quanping"></i>
                                      </div>
                                  </div>
                              </div>
                      </div>
                    </div>
                </div>
            </div>
	      </div>
	      <div class="card-footer text-muted">
	        <%=share.getTime(token) %>
	      </div>
	      <div class="card-body text-center">
	        <a id="downloadLink" href="<%=Config.getFileServerDomain()+share.getFile().getFileLink() %>" class="btn">下载</a>
	        <a href="javascript:;" class="btn">保存到我的网盘</a>
	      </div>
	    </div>
	    
	    <label style="display:none" id="formatLabel"><%=share.getFile().getFormat() %></label>
    <%} %>


	  <!-- Bootstrap core JavaScript-->
      <script src="js/config.js"></script>
      <script src="js/fontawesome-all.js"></script>
	  <script src="vendor/jquery/jquery.js"></script>
	  <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
	  <!-- Core plugin JavaScript-->
	  <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
	  <!-- Custom scripts for all pages-->
	  <script src="js/audioplayer.js"></script>
	  <script src="js/vedio.js"></script>
	  <script src="js/share.js"></script>
  </div>
</body>
</html>
