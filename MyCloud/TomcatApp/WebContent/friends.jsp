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
  <meta name="description" content="XUranus">
  <meta name="author" content="XUranus">
  <title>好友中心</title>
    <!-- Bootstrap core CSS-->
    <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <!-- Page level plugin CSS-->
    <link href="vendor/datatables/dataTables.bootstrap4.css" rel="stylesheet">
    <!-- Custom styles for this template-->
    <link href="css/sb-admin.css" rel="stylesheet">
    <link href="css/chat-bubble.css" rel="stylesheet">
    <link rel="shortcut icon" href="img/favicon.ico" />
    <!--Friends -->
    <script src="js/friends.js"></script>
    <script src="vendor/jquery/jquery.js"></script>
    <script src="js/jquery.filtertable.js"></script>
    <script src="js/bindWithDelay.js"></script>
    <style>
        .filter-table .quick { margin-left: 0.5em; font-size: 0.8em; text-decoration: none; }
        .fitler-table .quick:hover { text-decoration: underline; }
        td.alt { background-color: #ffc; background-color: rgba(255, 255, 0, 0.2); }
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
      <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text">搜索</span>
        </div>
        <input class="form-control" type="search" id="input-filter" size="15" placeholder="在此输入昵称">&nbsp;
        <button class="btn btn-outline-primary" data-toggle="modal" data-target="#friendsModal">
          <i class="fas fa-user-plus"></i>&nbsp;添加
        </button>
      </div>


      <div class="row">

        <div class="col-5">
          <table id="friendsTable" class="table table-hover">
              <thead>
              <tr>
                  <th scope="col">好友列表</th>
                  <th scope="col">
              </tr>
              </thead>
              <tbody id="friendsTable_tbody"></tbody>
          </table>
        </div>

        <div class="col-7">
          <div class="card" id="chatPanel">
            <div class="card-header text-center"></div>
            <div class="card-body">
              <div id="chatContent" style="height:25em;overflow:auto"></div>
            </div>
            <div class="card footer">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" onclick="refreshChat()">@</span>
                </div>
                <input type="text" class="form-control" placeholder="在此输入文字" id="chatMessageInput">
                  <button class="btn btn-outline-secondary" type="button" onclick="sendChatMessage()">发送</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <!-- /.container-fluid-->
    <!-- /.content-wrapper-->

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

    <!-- UserInfoModal-->
    <div class="modal fade" id="userInfoModal" userID="" tabindex="-1" role="dialog" aria-labelledby="userInfoModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="userInfoModalTitle"></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body"></div>
                <div class="modal-footer"></div>
            </div>
        </div>
    </div>

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

    <!-- notification / message-->
    <div class="modal fade" id="notificationModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
       <div class="modal-dialog" role="document" >
         <div class="modal-content"></div>
       </div>
    </div>


    <!--Friends2-->
    <div class="modal fade" id="friendsModal" tabindex="-1" role="dialog" aria-labelledby="friendsModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="friendsModalLabel">添加好友</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-inline">
          <input class="form-control" type="text" placeholder="输入关键字" id="searchNewFriendInput">
          <button class="btn btn-primary" onclick="searchNewFriend()">查找</button>
        </div>
        <table class="table table-hover" id="searchNewFriendResult"></table>
      </div>
    </div>
    </div>





    <script src="js/config.js"></script>
    <script src="js/notification.js"></script>
    <!-- Bootstrap core JavaScript-->
    <script src="js/fontawesome-all.js"></script>
    <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
    <!-- Core plugin JavaScript-->
    <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
    <!-- Custom scripts for all pages-->
    <script src="js/sb-admin.min.js"></script>
    <!-- Custom scripts for this page-->
</div>
</body>
</html>
