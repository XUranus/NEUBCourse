var FriendListArr = [];
var chatingToId = null;
var timer = null;

function syncFriendList() {
  $.ajax({
      url:GET_FRIEND_LIST_URL,
      type:'post',
      dataType:"json",
      xhrFields: {
          withCredentials: true
      },
      success:function(data) {
        FriendListArr = data;
        console.log(FriendListArr);
        renderFriendsTable(FriendListArr);
        if(FriendListArr.length>0) chatToFriend(0);
        else $("#chatPanel").hide();
      },
      error:function(XMLHttpRequest, textStatus, errorThrown) {
          console.log('A Serious Err Ocured ! [get friend list]');
      },
    });
}

window.onload=function(){
    syncNotification();
    syncFriendList();

    $('#userInfoModal').on('show.bs.modal',function (event){
        var tr = $(event.relatedTarget);
        var key = tr.data('whatever');
        var modal = $(this);
        //generate model framework
        var modal_body = modal.find('.modal-body');
        var icon_class = ['fa-user-circle','fa-at','fa-star','fa-info-circle','fa-user-secret','fa-venus-mars','fa-tags','fa-qq','fa-phone'];
        var info_items = ['nickname','mail','credit','self_intruction','age','gender','tag','qq','tel'];
        var content = '<div style="text-align: center" id="avatar"><img style="border-radius: 50%;height: 9em;width: 9em;margin-bottom: 1.5em;position: center" src=""></div>'
        for(i=0;i<9;i++) {
          if( FriendListArr[key][info_items[i]]==null) continue;
          content += ('<div id="'+ info_items[i] +'" class="input-group mb-3"><div class="input-group-prepend"><span class="input-group-text">'+
            '<i class="fas '+ icon_class[i] +' fa-fw"></i></span></div><input type="text" class="form-control" readonly="true"></div>');
        }
        modal_body.html(content);

        var modal_footer = modal.find('.modal-footer');
        /*<button type="button" class="btn btn-primary" onclick="alert($('#friends_add').val());">添加好友</button>-->*/
        //根据是否是你的好友选择不同的按钮
        var user_id = FriendListArr[key].id;
        modal_footer.html('<button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>');
        modal_footer.append('<button type="button" class="btn btn-primary" onclick="deleteFriend('+ user_id +');">删除好友</button>');

        //get value
        modal.find('#self_intruction input').attr("type","textarea");
        modal.find('#userInfoModalTitle').text('个人信息');
        modal.find('#avatar img').attr('src',FriendListArr[key].avatar_path);//头像接口
        modal.find('#nickname input').val(FriendListArr[key].nickname);
        modal.find('#mail input').val(FriendListArr[key].mail);
        modal.find('#credit input').val(FriendListArr[key].credit);
        modal.find('#self_intruction input').val(FriendListArr[key].self_intruction);
        modal.find('#tag input').val(FriendListArr[key].tag);
        modal.find('#qq input').val(FriendListArr[key].qq);
        modal.find('#tel input').val(FriendListArr[key].tel);
        modal.find('#age input').val(FriendListArr[key].age);
        modal.find('#gender input').val(FriendListArr[key].gender);
        //$("#nickname").input.attr('placeholder',data.friends[key].nickname);
    });
}

function renderFriendsTable(fri) {
    var result = '';
    var func = '';
    for(var i in fri){
        var avatar_col = '<td><img src="' + fri[i].avatar_path + '" style="border-radius:200px;width:30px"></td>';
        result += ('<tr>'+ avatar_col
        + '<td  data-whatever='+ i +' ondblclick="chatToFriend('+ i +')">' + fri[i].nickname + '</td>'
        + '<td data-toggle="modal" data-target="#userInfoModal" data-whatever="' + i + '"><button class="btn btn-primary">查看</button></td>'
        + '</tr>');
    }
    $('#friendsTable_tbody').html(result);
    $('table').filterTable({
        inputSelector: '#input-filter',
        minRows:0
    });
}

function deleteFriend(friend_id) { //删除好友
  $.ajax({//向服务器提交数据
    url:DELETE_FRIEND_REQUEST,
    type:'post',
    data:{friend_id:friend_id},
    dataType:"json",
    async: false,
    xhrFields: {
        withCredentials: true
    },
    success:function(data) {
      syncFriendList();
      $('#userInfoModal').modal('hide');
    },
    error:function(XMLHttpRequest, textStatus, errorThrown) {
        console.log('A Serious Err Ocured ! [delete friend]');
    },
  });
}

/*----------------------------------------------------- wxx --------------------------------------------------------*/
function searchNewFriend() {
  var value = document.getElementById('searchNewFriendInput').value;
  $.ajax({//向服务器提交数据
    url:SEARCH_NEW_FRIEND_URL,
    type:'post',
    data:{input:value},
    dataType:"json",
    async: false,
    xhrFields: {
        withCredentials: true
    },
    success:function(data) {
      renderSearchFriendList(data);
    },
    error:function(XMLHttpRequest, textStatus, errorThrown) {
        alert('A Serious Err Ocured ! [searchNewFriendRequest]');
    },
  });
}

function renderSearchFriendList(data) {
  console.log(data.data);
  var Arr = data.data;
  var result = document.getElementById('searchNewFriendResult');
  result.innerHTML = '<thead><tr><th scope="col" colspan="3">找到'+ Arr.length +'个符合条件的用户</th></tr></thead>';
  var tbody = '';
  for(i=0;i<Arr.length;i++) {
    var row = '<tr>'
    +'<td><img style="border-radius:200px;width:30px" src="'+ Arr[i].avatar_path +'"></img></td>'
    +'<td>'+ Arr[i].nickname +'</td>'
    +'<td><button class="btn btn-primary" onclick="addNewFriendRequest('+ Arr[i].id +')">添加</button></td>';
    +'</tr>';
    tbody += row;
  }
  result.innerHTML += '<tbody>' + tbody + '</tbody>';
}

function addNewFriendRequest(user_id) {
  console.log('send friend request to user: id=',user_id);
  $.ajax({//向服务器提交数据
    url:ADD_FRIEND_REQUEST_URL,
    type:'post',
    data:{userID:user_id},
    dataType:"json",
    async: false,
    xhrFields: {
        withCredentials: true
    },
    success:function(data) {
      console.log(data.msg);
    },
    error:function(XMLHttpRequest, textStatus, errorThrown) {
        alert('A Serious Err Ocured ! [sendAddNewFriendRequest]');
    },
  });
}

function chatToFriend(data_index) {
  var friend = FriendListArr[data_index];
  loadChatHistory(friend.id);
  //console.log(friend);
  var chatPanel = $("#chatPanel");
  chatPanel.find(".card-header").html('和 '+friend.nickname+' 的会话');
  isChatingTo = friend;
  timer=self.setInterval("refreshChat()",1000);//定时器
}


function loadChatHistory(friend_id) { //加载历史聊天记录
  if(!friend_id) return;//防止崩溃
  $.ajax({//向服务器提交数据
    url:LOAD_CHAT_HISTROY_URL,
    type:'post',
    data:{friend_id:friend_id},
    dataType:"json",
    xhrFields: {
        withCredentials: true
    },
    success:function(data) {
      renderChatHistory(data);
    },
    error:function(XMLHttpRequest, textStatus, errorThrown) {
        console.log('A Serious Err Ocured ! [load char history]',XMLHttpRequest,textStatus,errorThrown);
    },
  });

  function renderChatHistory(data) {
    console.log('render chat hisory',data);
    var Arr1 = data.data1;
    var Arr2 = data.data2;
    var chatContent = document.getElementById('chatContent');
    chatContent.innerHTML = '';
    var Arr = [];
    for(i=0;i<Arr1.length;i++) {
      Arr.push({message:Arr1[i].message,type:'myFriend'});
    }
    for(i=0;i<Arr2.length;i++) {
      Arr.push({message:Arr2[i].message,type:'myMessage'});
    }
    Arr = Arr.sort(compare);
    for(i=0;i<Arr.length;i++) {
      if(Arr[i].type=='myMessage')
        chatContent.innerHTML += renderMyMessage(Arr[i].message);
      else
        chatContent.innerHTML += renderFriendMessage(Arr[i].message);
    }
    $("#chatContent").scrollTop($("#chatContent")[0].scrollHeight);

    function renderFriendMessage(message) {
      var res =
         '<div class="bubbleItem">'
      + '<img src="'+ isChatingTo.avatar_path +'" style="border-radius:200px;width:30px">'
      +  '  <span class="bubble leftBubble">'
      +  message
      +  '      <span class="bottomLevel"></span>'
      +  '      <span class="topLevel"></span>'
      +  '  </span>'
      +  '</div>';
      return res;
    }

    function renderMyMessage(message) {
      var res =
        '<div class="bubbleItem clearfix">   <span style="font-family: Arial, Helvetica, sans-serif;">'
      + '    <span class="bubble rightBubble">'
      +            message
      + '        <span class="bottomLevel"></span>'
      + '        <span class="topLevel"></span>'
      + '    </span>'
      + '</div>';
      return res;
    }

    function compare(a,b) {
        var value1 = a["id"];
        var value2 = b["id"];
        return value2 - value1;
    }

  }

}

function refreshChat() { //邪恶的函数
  var friend_id = isChatingTo.id;
  loadChatHistory(friend_id);
}

function sendChatMessage() {
  $.ajax({//向服务器提交数据
    url:SEND_CHAT_MESSAGE_URL,
    type:'post',
    data:{receiver_id:isChatingTo.id,message:$("#chatMessageInput").val()},
    dataType:"json",
    xhrFields: {
        withCredentials: true
    },
    success:function(data) {
      console.log(data.msg);
      loadChatHistory(isChatingTo.id);
    },
    error:function(XMLHttpRequest, textStatus, errorThrown) {
        alert('A Serious Err Ocured ! [send chat message]');
    },
  });
}
