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
  <title>MyCloud 个人中心</title>
  <link rel="shortcut icon" href="img/favicon.ico" />
  <!-- Bootstrap core CSS-->
  <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <!-- Custom styles for this template-->
  <link href="css/sb-admin.css" rel="stylesheet">
  <link rel="stylesheet" type="text/css" href="css/table.css" />
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
  <script>FontAwesomeConfig = { searchPseudoElements: true };</script>
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


  <div class="content-wrapper">
    <div class="container-fluid">


      <ol class="breadcrumb">个人中心</ol>
      <div class="row">
          <div class="col-5">
            <div class="card">
              <div class="card-header">用量</div>
              <div class="card-body">
                <canvas id="usagePieChart" width="100%" height="100"></canvas>
              </div>
            </div>
          </div>


          <div class="col-7">
            <form id="detailInfoForm" name="detailInfoForm">
              <div class="form-group">

                <div class="text-center" data-target="#changeModal" data-toggle="modal">
                  <div class="btn btn-outline-light">
                    <img id="user-photo" src="${sessionScope.user_now.avatar_path }" style="text-align: center;border-radius: 50%;height: 9em;width: 9em;margin-bottom: 1.5em;margin-top: 1.5em;">
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
                <div class="input-group mb-3">
      					  <div class="input-group-prepend">
      					    <span class="input-group-text">QQ</span>
      					  </div>
      					  <input type="text" class="form-control" placeholder="QQ号" name="qq" id="qq">
    					  </div>
                <div class="input-group mb-3">
      					  <div class="input-group-prepend">
      					    <span class="input-group-text">手机</span>
      					  </div>
      					  <input type="text" class="form-control" placeholder="手机号" name="tel" id="tel">
    					  </div>
                <div class="input-group mb-3">
      					  <div class="input-group-prepend">
      					    <span class="input-group-text">自我描述</span>
      					  </div>
      					  <textarea type="text" class="form-control" placeholder="这个人很懒，什么也没留下" name="self_intruction" id="self_intruction"></textarea>
    					  </div>
                <span id="errMsgPanel" style="color:red"></span>
              </div>
            </form>
            <button class="btn btn-primary btn-block" id="submitBtn">修改</button>
          </div>
      </div><br>

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

    <!-- Logout Modal-->
    <div class="modal fade" id="exitModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">你确定要退出吗</h5>
            <button class="close" type="button" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div class="modal-body">点击“退出”以退出网盘</div>
          <div class="modal-footer">
            <button class="btn btn-secondary" type="button" data-dismiss="modal">取消</button>
            <a class="btn btn-primary" href="login.html">退出</a>
          </div>
        </div>
      </div>
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
                    <img src="" alt="" id="photo">
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

    <!-- notification / message-->
    <div class="modal fade in" id="notificationModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
       <div class="modal-dialog" role="document" >
         <div class="modal-content"></div>
       </div>
    </div>

    <!-- Bootstrap core JavaScript-->
    <script src="js/config.js"></script>
    <script src="js/notification.js"></script>
    <script src="js/fontawesome-all.js"></script>
    <script src="vendor/jquery/jquery.js"></script>
    <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
    <!-- Core plugin JavaScript-->
    <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
    <!-- Custom scripts for all pages-->
    <script src="js/sb-admin.min.js"></script>
    <script src="vendor/chart.js/Chart.min.js"></script>
    <script src="js/self-info-manage.js"></script>
    <script src="js/cropper.min.js"></script>
    <script src="js/registerDetailPage.js"></script>
  </div>
</body>
</html>
