window.onload = function() {
  //初始化窗口
}

var nickname = document.getElementById('nickname');
var password1 = document.getElementById('password1');
var password2 = document.getElementById('password2');
var mail = document.getElementById('mail');
var errMsgPanel = document.getElementById('errMsgPanel');

function displayErr(err) {//显示错误信息
  errMsgPanel.innerHTML = err;
}

function formValidate() {//表单验证
  if(mail.value==''||mail.value==null){
    displayErr('邮箱不能为空');
    return false;
  }
  if(nickname.value==''||nickname.value==null){
    displayErr('请输入昵称');
    return false;
  }
  if(password1.value==''||password1.value==null){
    displayErr('请输入密码');
    return false;
  }
  if(password1.value!=password2.value){
    displayErr('两次密码不一致');
    return false;
  }
  //最好时能加上md5加密
  return true;
}

function check() {//检验远端服务器是否许可(例如mail是否重复)
  if(!formValidate()) return false;
  var isPermit = false;//默认false
  $.ajax({
      url: NODE_REGISTER_URL,
      type: 'POST',
      async:false,
      data: $('#registerForm').serialize(),
      xhrFields: {
          withCredentials: true
      },
      dataType:'JSON',
      success: function(data){
        if(data.msg=='OK') {
          isPermit = true;
        }
        else {
          displayErr(data.msg);
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
            displayErr('ajax Err code:'+XMLHttpRequest.status+' '+XMLHttpRequest.readyState+' '+textStatus);
      }
  });
  return isPermit;
}
