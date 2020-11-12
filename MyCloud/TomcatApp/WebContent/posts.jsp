<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="Bean.UserBean"%>
<% if(session.getAttribute("USERID")==null || session.getAttribute("user_now")==null)//session has expired
out.println("<script>window.location.href='"+"login.html"+"'</script>"); //redirect %>
<%-----------------------------------   html part  ---------------------------------------------%>



<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="shortcut icon" href="img/favicon.ico" />
    <title>MyCloud</title>
    <!-- Bootstrap core CSS-->
    <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <!-- Custom styles for this template-->
    <link href="css/sb-admin.css" rel="stylesheet">
    <script>
        FontAwesomeConfig = {searchPseudoElements: true};
    </script>
</head>

<body class="fixed-nav sticky-footer bg-dark" id="page-top">

<!-- Navigation-->
<nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav">

  <a href="selfInfoManage.jsp" class="navbar-brand">
    <img id="avatar" src="${sessionScope.user_now.avatar_path }" style="border-radius:200px;width:30px" >
    <span>&nbsp;</span>
    <span style="color:white;padding-bottom:0px;">${sessionScope.user_now.nickname }</span>
  </a>
  <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarResponsive">
    <ul class="navbar-nav navbar-sidenav" id="exampleAccordion">
      <li class="nav-item" data-toggle="tooltip" data-placement="right" title="Dashboard">
        <a class="nav-link" href="disk.jsp">
          <i class="fa fa-fw fa-cloud"></i>
          <span class="nav-link-text">我的网盘</span>
        </a>
      </li>
      <li class="nav-item" data-toggle="tooltip" data-placement="right" title="Charts">
        <a class="nav-link" href="dustbin.jsp">
          <i class="fa fa-fw fa-recycle"></i>
          <span class="nav-link-text">回收站</span>
        </a>
      </li>
      <li class="nav-item" data-toggle="tooltip" data-placement="right" title="Components">
        <a class="nav-link nav-link-collapse collapsed" data-toggle="collapse" href="#collapseComponents" data-parent="#exampleAccordion">
          <i class="fa fa-fw fa-wrench"></i>
          <span class="nav-link-text">文件分类</span>
        </a>
        <ul class="sidenav-second-level collapse" id="collapseComponents">
          <li>
            <a href="catagory-video.jsp">视频</a>
          </li>
          <li>
            <a href="catagory-image.jsp">图片</a>
          </li>
          <li>
            <a href="catagory-music.jsp">音乐</a>
          </li>
          <li>
            <a href="catagory-document.jsp">文档</a>
          </li>
        </ul>
      </li>
      <li class="nav-item" data-toggle="tooltip" data-placement="right" title="Tables">
        <a class="nav-link" href="posts.jsp">
          <i class="fa fa-fw fa-cubes"></i>
          <span class="nav-link-text">资源广场</span>
        </a>
      </li>
      <li class="nav-item" data-toggle="tooltip" data-placement="right" title="Tables">
        <a class="nav-link" href="friends.jsp">
          <i class="fa fa-fw fa-users"></i>
          <span class="nav-link-text">我的好友</span>
        </a>
      </li>
      <li class="nav-item" data-toggle="tooltip" data-placement="right" title="Tables">
        <a class="nav-link" href="shareList.jsp">
          <i class="fa fa-fw fa-share"></i>
          <span class="nav-link-text">我的分享</span>
        </a>
      </li>
      <!---status-->
      <li class="nav-item" data-toggle="tooltip" data-placement="right" title="Dashboard">
        <a class="nav-link"  href="selfInfoManage.jsp">
          <i class="fas fa-tachometer-alt"></i>
          <span class="nav-link-text" id="usageProgress">
            载入中
            <div class="progress"><br>
              <div class="progress-bar" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0</div>
            </div>
          </span>
        </a>
      </li>
      <!--/-status-->
    </ul>



    <ul class="navbar-nav sidenav-toggler">
      <li class="nav-item">
        <a class="nav-link text-center" id="sidenavToggler">
          <i class="fa fa-fw fa-angle-left"></i>
        </a>
      </li>
    </ul>

    <ul class="navbar-nav ml-auto">
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle mr-lg-2" id="messagesDropdown" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="fa fa-fw fa-envelope"></i>
          <span class="d-lg-none">消息
            <span class="badge badge-pill badge-primary" id="messageNum">消息拉取中</span>
          </span>
          <span class="indicator text-primary d-none d-lg-block">
            <i class="fa fa-fw fa-circle"></i>
          </span>
        </a>
        <div class="dropdown-menu" aria-labelledby="messagesDropdown" id="messageList">消息加载中</div>
      </li>

      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle mr-lg-2" id="alertsDropdown" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="fa fa-fw fa-bell"></i>
          <span class="d-lg-none">通知
            <span class="badge badge-pill badge-warning" id="notificationNum">通知拉取中...</span>
          </span>
          <span class="indicator text-warning d-none d-lg-block">
            <i class="fa fa-fw fa-circle"></i>
          </span>
        </a>
        <div class="dropdown-menu" aria-labelledby="alertsDropdown" id="notificationList">通知加载中...</div>
      </li>

      <li class="nav-item">
        <form class="form-inline my-2 my-lg-0 mr-lg-2">
          <div class="input-group">
            <input class="form-control" type="text" placeholder="搜索我的网盘...">
            <span class="input-group-append">
              <button class="btn btn-primary" type="button">
                <i class="fa fa-search"></i>
              </button>
            </span>
          </div>
        </form>
      </li>
      <li class="nav-item">
        <a class="nav-link" data-toggle="modal" data-target="#exitModal">
          <i class="fas fa-sign-out-alt"></i>退出</a>
      </li>
    </ul>
  </div>
</nav>




<div class="content-wrapper" >
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-1"></div><!--样式待考虑-->
            <div class="col-lg-10">
                <div class="card pl-4 pr-4" style="background-color: buttonface;">
                    <span class="mt-2">
                        <button type="button" id="clickOnEmoji" class="btn btn-secondary-outline btn-sm" onclick="showEmoji()">
                            <i class="far fa-lg fa-smile"></i>
                        </button>
                            <div id="showEmoji" style="display: none;z-index: 13;position: absolute;">
                                <table class="table table-bordered" style="height:448.8px;width: 404px;background: #f1f1f1;">
                                    <tbody id="emojiTbody"></tbody>
                                </table>
                            </div>
						<input type="file" style="display:none" accept="image/*" id="fileImg">
                        <label class="btn btn-secondary-outline btn-sm mb-0" for="fileImg">
                          <i class="far fa-lg fa-image"></i>
                        </label>				                        
                        <button type="button" class="btn btn-secondary-outline btn-sm" data-toggle="modal" data-target="#linkModal">
                            <i class="fa fa-lg fa-link"></i>
                        </button>
                    </span>
                    <textarea id="textarea_post" class="form-control col-lg-12 mt-1 mb-1" type="text"></textarea>
                    <span class="mb-2" style="text-align:right">
                        <button type="button" class="btn btn-secondary-outline btn-sm" onclick="submit_post()">
                            <i class="far fa-lg fa-paper-plane"></i>
                        </button>
                        <button type="button" class="btn btn-secondary-outline btn-sm" onclick="submit_cancel()">
                            <i class="fa fa-lg fa-ban"></i>
                        </button>
                    </span>
                    <div class="text-center mb-4" id="previewModal" style="display:none">
                      <img id="preview" src=""  max-width="100%" max-height="100%"/>
                    </div>                    
                </div>
                <div class="modal fade" id="linkModal" tabindex="-1" aria-labelledby="linkModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h6 class="modal-title" id="linkModalLabel">分享我的链接</h4>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    <span class="sr-only">Close</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div class="input-group ml-2 mt-2 mb-4 col-lg-11">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="basic-addon1"><i class="fas fa-fw fa-tag"></i></span>
                                    </div>
                                    <input id="linkModalLinkTag" type="text" class="form-control" placeholder="输入链接的标签" aria-label="Username" aria-describedby="basic-addon1">
                                </div>
                                <div class="input-group ml-2 mt-2 mb-2 col-lg-11">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="basic-addon2"><i class="fa fa-fw fa-link"></i></i></span>
                                    </div>
                                    <input id="linkModalLink" type="text" class="form-control" value="https://" aria-label="Username" aria-describedby="basic-addon2">
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="link_cancel()">取消</button>
                                <button type="button" class="btn btn-primary" onclick="$('#linkModal').modal('toggle');">完成</button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Card Columns Example Social Feed-->
                <div class="mb-0 mt-2">
                    <i class="far fa-newspaper "></i>&nbsp;好友动态
                </div>
                <hr class="mt-2"><!--分割线-->
                <div class="card-columns">

                </div>
                <!-- /Card Columns-->
            </div>
        </div>
    </div>
    <!-- /.container-fluid-->

    <!-- /.content-wrapper-->
    <footer class="sticky-footer">
      <div class="container">
        <div class="text-center">
          <small>Copyright © <a href="https://xuranus.github.io">XUranus</a> 2018 All rights reserved</small>
        </div>
      </div>
    </footer>

    <!-- Scroll to Top Button-->
    <a class="scroll-to-top rounded" href="#page-top">
        <i class="fa fa-angle-up"></i>
    </a>
</div>

<script src="js/config.js"></script>
<script src="js/notification.js"></script>
<script src="js/fontawesome-all.js"></script>
<script src="vendor/jquery/jquery.js"></script>
<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<!-- Core plugin JavaScript-->
<script src="vendor/jquery-easing/jquery.easing.min.js"></script>
<!-- Custom scripts for all pages-->
<script src="js/sb-admin.min.js"></script>
<script src="js/posts.js"></script>
</body>
</html>
