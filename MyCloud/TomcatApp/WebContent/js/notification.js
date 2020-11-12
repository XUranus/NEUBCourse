var notificationArr = [];
var messageArr = [];

function syncNotification() {
  $.ajax({
  	  url:GET_NOTIFICATIONS_URL,
  	  type:'post',
  	  dataType:"json",
  	  xhrFields: {
  	      withCredentials: true
  	  },
  	  success:function(data) {
  	    console.log('notifications',data);
  			notificationArr = data;
  			renderNotification(notificationArr);
  	  },
  	  error:function(XMLHttpRequest, textStatus, errorThrown) {
  	      console.log('A Serious Err Ocured ! [get notifications]');
  	  },
  	});
    $.ajax({
    	  url:GET_MESSAGES_URL,
    	  type:'post',
    	  dataType:"json",
    	  xhrFields: {
    	      withCredentials: true
    	  },
    	  success:function(data) {
    	    console.log('messages',data);
    			messageArr = data;
    			renderMessage(messageArr);
    	  },
    	  error:function(XMLHttpRequest, textStatus, errorThrown) {
    	      console.log('A Serious Err Ocured ! [get messages]');
    	  },
    	});
      //左侧的用量通知
      refreshUsageProgress();
}

function renderNotification(Arr) {
	document.getElementById('notificationNum').innerHTML = Arr.length + '条新通知';
	var notificationList = document.getElementById('notificationList');
  if(Arr.length==0) notificationList.innerHTML = '<h6 class="dropdown-header">没有通知</h6>';
	else notificationList.innerHTML = '<h6 class="dropdown-header">新通知:</h6>';
	for(i = 0;i<Arr.length;i++) {
		var content = eval('('+ Arr[i].content +')');
		var time = Arr[i].time;
		if(content.type=='ADD FRIENDSHIP REQUEST') notificationList.innerHTML += renderFriendRequest(i,content,time);
		else if(content.type=='ACCEPT FRIENDSHIP REQUEST') notificationList.innerHTML += renderFriendRequest(i,content,time);
    else if(content.type=='DECLINE FRIENDSHIP REQUEST') notificationList.innerHTML += renderFriendRequest(i,content,time);
    else notificationList.innerHTML += renderFriendRequest(i,content,time);
	}
	notificationList.innerHTML += '<a class="dropdown-item small" href="#">查看所有通知</a>';

	function renderFriendRequest(data_index,content,time) {
		return '<div class="dropdown-divider"></div>'
		+ '<a class="dropdown-item"  href="javascript:;" onclick="showNotificationDetail('+ data_index +')">'
		+	'<span class="text-success" >'
		+		'<strong>'
		+		'<i class="fas fa-long-arrow-alt-up fa-fw"></i>'+ content.title +'</strong>'
		+	'</span>'
		+ '<span class="small float-right text-muted">'+time.substr(0,10)+'</span>'
		+ '<div class="dropdown-message small">'+content.text+'&nbsp;&nbsp;&nbsp;&nbsp;</div>'
		+ '</a>';
	}
}

function renderMessage(Arr) {
  document.getElementById('messageNum').innerHTML = Arr.length + '条新消息';
  var messageList = document.getElementById('messageList');
  if(Arr.length==0) messageList.innerHTML = '<h6 class="dropdown-header">没有消息</h6>';
  else messageList.innerHTML = '<h6 class="dropdown-header">新消息:</h6>';
  for(i = 0;i<Arr.length;i++) {
    var content = eval('('+ Arr[i].content +')');
    var time = Arr[i].time;
    messageList.innerHTML += renderCommonMessage(i,content,time);
  }
  messageList.innerHTML += '<a class="dropdown-item small" href="#">查看所有消息</a>';

  function renderCommonMessage(data_index,content,time) {
    return '<div class="dropdown-divider"></div>'
    + '<a class="dropdown-item"  href="javascript:;" onclick="showMessageDetail('+ data_index +')">'
    +		'<strong>'+ content.title +'</strong>'
    +   '<span class="small float-right text-muted">'+time.substr(0,10)+'</span>'
    +   '<div class="dropdown-message small">'+content.text+'&nbsp;&nbsp;&nbsp;&nbsp;</div>'
    + '</a>';
  }
}

function showMessageDetail(data_index) {
	var message = messageArr[data_index];
	var content = eval('('+ message.content +')');

  $('#notificationModal').modal('show');
  var modal = $('#notificationModal').find('.modal-content');
  var modal_content =
    '<div class="modal-header">'
  +	'<h5 class="modal-title">'+ content.title +'</h5>'
  +	'<button class="close" type="button" data-dismiss="modal" aria-label="Close">'
  +	'	<span aria-hidden="true">×</span>'
  + '</button>'
  + '</div>'
  + '<div class="modal-body">'
  + '		<div>'+ content.text +'</div>'
  + '</div>';

  //else {//if(content.type=='ACCEPT FRIENDSHIP REQUEST'){
    modal_content +=
     '<div class="modal-footer">'
    + '		<button class="btn btn-success" onclick="confirmNotification('+ message.id+')">确定</button>'
    + '</div>';

  modal.html(modal_content);
}

function showNotificationDetail(data_index) {
  var notification = notificationArr[data_index];
	var content = eval('('+ notification.content +')');

  $('#notificationModal').modal('show');
  var modal = $('#notificationModal').find('.modal-content');
  var modal_content =
    '<div class="modal-header">'
  +	'<h5 class="modal-title">'+ content.title +'</h5>'
  +	'<button class="close" type="button" data-dismiss="modal" aria-label="Close">'
  +	'	<span aria-hidden="true">×</span>'
  + '</button>'
  + '</div>'
  + '<div class="modal-body">'
  + '		<div>'+ content.text +'</div>'
  + '</div>';

  if(content.type=='ADD FRIENDSHIP REQUEST') { //如果是好友请求
    modal_content +=
     '<div class="modal-footer">'
    + '		<button class="btn btn-success" onclick="acceptFriend('+ notification.id +','+ notification.sender_id +')">接受</button>'
    + '		<button class="btn btn-warning" onclick="declineFriend('+ notification.id +','+ notification.sender_id +')">拒绝</button>'
    + '</div>';
  }
  else {//if(content.type=='ACCEPT FRIENDSHIP REQUEST'){
    modal_content +=
     '<div class="modal-footer">'
    + '		<button class="btn btn-success" onclick="confirmNotification('+ notification.id+')">确定</button>'
    + '</div>';
  }
  modal.html(modal_content);
}

function acceptFriend(notification_id,sender_id) {
  $.ajax({
      url:ACCEPT_FRIEND_URL,
      type:'post',
      dataType:"json",
      data:{notification_id:notification_id,friend_id:sender_id},
      xhrFields: {
          withCredentials: true
      },
      success:function(data) {
        $('#notificationModal').modal('hide');
        syncNotification();
      },
      error:function(XMLHttpRequest, textStatus, errorThrown) {
          console.log('A Serious Err Ocured ! [accept friend]');
      },
    });
}

function declineFriend(notification_id,sender_id) {
  $.ajax({
      url:DECLINE_FRIEND_URL,
      type:'post',
      dataType:"json",
      data:{notification_id:notification_id,friend_id:sender_id},
      xhrFields: {
          withCredentials: true
      },
      success:function(data) {
        $('#notificationModal').modal('hide');
        syncNotification();
      },
      error:function(XMLHttpRequest, textStatus, errorThrown) {
          console.log('A Serious Err Ocured ! [declineFriend friend]');
      },
    });
}

function confirmNotification(notification_id) {
  $.ajax({
      url:CONFIRM_NOTIFICATION_URL,
      type:'post',
      dataType:"json",
      data:{notification_id:notification_id},
      xhrFields: {
          withCredentials: true
      },
      success:function(data) {
        $('#notificationModal').modal('hide');
        syncNotification();
      },
      error:function(XMLHttpRequest, textStatus, errorThrown) {
          console.log('A Serious Err Ocured ! [confirmNotification]');
      },
    });
}


//----------------------------------------  左侧的用量面板 ---------------------------------------------------------

function refreshUsageProgress() {
  $.ajax({
      url:GET_CAPACITY_URL,
      type:'post',
      dataType:"json",
      xhrFields: {
          withCredentials: true
      },
      success:function(data) {
        console.log('capacity data',data);
        renderProgressBar(data.capacity,data.used);
      },
      error:function(XMLHttpRequest, textStatus, errorThrown) {
          console.log('A Serious Err Ocured ! [get notifications]');
      },
  });

  function renderProgressBar(max_size,used_size) {  //GB 为单位
    var percent = used_size*1.0/max_size*100;
    var content ="总容量 "+ max_size+"GB"
    +' <div class="progress"><br>'
    + '  <div class="progress-bar" role="progressbar" style="width: '+percent+'%" aria-valuenow="'+percent+'" aria-valuemin="0" aria-valuemax="100">'+used_size.toFixed(2)+'GB</div>'
    + '</div>'
    $("#usageProgress").html(content);
  }
}
