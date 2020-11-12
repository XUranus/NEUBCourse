
var mail = document.getElementById('mail');
var password = document.getElementById('password');
var submitBtn = document.getElementById('login_btn');
var errMsgPanel = document.getElementById('errMsgPanel');
window.onload = function() {
  //初始化
}

function loginToNode() {
  var isPermit = false;
  $.ajax({//向服务器提交数据
    url:NODE_LOGIN_URL,
    data:{mail:mail.value,password:password.value},
    type:'post',
    async:false,
    dataType:"json",
    xhrFields: {
        withCredentials: true
    },
    success:function(data) {
      if(data.Msg=="OK") {
        isPermit = true;
      }
      else {
        disPlayError(data.Msg);
      }
    },
    error:function(XMLHttpRequest, textStatus, errorThrown) {
        displayErr('ajax Err: '+XMLHttpRequest.status+' '+XMLHttpRequest.readyState+' '+textStatus);
    },
  });
  return isPermit;
}

function disPlayError(str) {
  errMsgPanel.innerHTML = str;
}
