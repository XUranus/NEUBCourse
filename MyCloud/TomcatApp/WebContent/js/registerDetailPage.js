//提交详细信息后 ajax推送 然后前往dashborad
var errMsgPanel = document.getElementById('errMsgPanel');
var submitBtn = document.getElementById('submitBtn');
var tagBadges = document.getElementById('tagBadges');
var tag = document.getElementById('tag');

window.onload = function() {
  loadAgeSelection();
  loadTags();
  tag.content = '';
}

function loadAgeSelection() {//载入年龄标签
  var ageSelect = document.getElementById('select_age');
  for(i=0;i<100;i++) {//初始化选择年龄列表
    ageSelect.innerHTML += ('<option value="'+i+'">'+i+'</option>');
  }
}

function loadTags() {//载入tags
  //example : <button type="button" class="btn btn-outline-primary" onclick = addTag('primary')>Primary</button>
  tagBadges.innerHTML = '';
  var TagsClassArr = ['primary','secondary','success','danger','warning','info','light','dark'];
  var tagsArr = ['牛逼','骚','屌','徐啸','数据侠','带哥'];
  for(i=0;i<tagsArr.length;i++) {
    var new_span = document.createElement('div');
    new_span.setAttribute('class','btn btn-outline-'+TagsClassArr[i%TagsClassArr.length]);
    new_span.setAttribute('onclick','addTag(this,"'+ tagsArr[i] +'")');
    new_span.innerHTML = tagsArr[i];
    tagBadges.appendChild(new_span);
  }
}

function addTag(obj,str) {
  if(tag.value.indexOf(str)<0){
	tag.value = tag.value +  (str+',');
	console.log(tag.value);
  }else {
	tag.value = tag.value.replace(str + ',','');
	console.log(tag.value);
  }
  var button_class = $(obj).attr("class");
  if(button_class.indexOf('outline') < 0){
    button_class = button_class.replace('btn btn','btn btn-outline');
    $(obj).attr("class",button_class);
  }else{
    button_class = button_class.replace('btn btn-outline','btn btn');
    $(obj).attr("class",button_class);
  }
}

submitBtn.onclick = function() {
  saveAndRedirect();
}

function displayErr(err) {//显示错误信息
  errMsgPanel.innerHTML = err;
}

function formValidate() {//表单验证
  var tel = new String(document.getElementById('tel').content);
  var qq = new String(document.getElementById('qq').content);
  if(qq.length > 10){
    displayErr('QQ号长度错误');
    return false;
  }
  if(tel.length > 11){
    displayErr('错误的手机号');
    return false;
  }
  return true;
}

function saveAndRedirect() {//向node post详细信息
  if(!formValidate()) return;
  $.ajax({
      url: NODE_SAVE_USERINFO,
      type: 'POST',
      data: $('#detailInfoForm').serialize(),
      xhrFields: {
          withCredentials: true
      },
      dataType:'JSON',
      success: function(data){
        if(data.msg=='OK') {
          //跳转
          window.location.href = DST_URL;
        }
        else if(data.msg='NOT LOGGED'){
          alert('登陆已过期');
          window.location.href = LOGIN_URL;
        }
        else {
          displayErr(data.msg);
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
            displayErr('ajax Err code:'+XMLHttpRequest.status+' '+XMLHttpRequest.readyState+' '+textStatus);
      }
  });
}

/*-----------------------------------------   avatar by xx   -------------------------------------------------------*/

var initCropperInModal = function(img, input, modal){
    var image = img;
    var inputImage = input;
    var modal = modal;
    var options = {
        aspectRatio: 1, // 纵横比
        viewMode: 2,//模式1-4
        preview: '.img-preview' // 预览图的class名
    };

    // 模态框隐藏后需要保存的数据对象
    var saveData = {};
    var URL = window.URL || window.webkitURL;
    var blobURL;

    modal.on('show.bs.modal',function () {
        // 如果打开模态框时没有选择文件就点击“打开图片”按钮
        if(!inputImage.val()){
            inputImage.click();
        }
    }).on('shown.bs.modal', function () {
        // 重新创建
        image.cropper( $.extend(options, {
            ready: function () {
                // 当剪切界面就绪后，恢复数据
                if(saveData.canvasData){
                    image.cropper('setCanvasData', saveData.canvasData);
                    image.cropper('setCropBoxData', saveData.cropBoxData);
                }
            }
        }));
    }).on('hidden.bs.modal', function () {
        // 保存相关数据
        saveData.cropBoxData = image.cropper('getCropBoxData');
        saveData.canvasData = image.cropper('getCanvasData');
        // 销毁并将图片保存在img标签
        image.cropper('destroy').attr('src',blobURL);
    });
    if (URL) {
        inputImage.change(function() {
            var files = this.files;
            var file;
            if (!image.data('cropper')) {
                return;
            }
            if (files && files.length) {
                file = files[0];
                if (/^image\/\w+$/.test(file.type)) {

                    if(blobURL) {
                        URL.revokeObjectURL(blobURL);
                    }
                    blobURL = URL.createObjectURL(file);

                    // 重置cropper，将图像替换
                    image.cropper('reset').cropper('replace', blobURL);

                    // 选择文件后，显示和隐藏相关内容
                    $('.img-container').removeClass('hidden');
                    $('.img-preview-box').removeClass('hidden');
                    $('#changeModal .disabled').removeAttr('disabled').removeClass('disabled');
                    $('#changeModal .tip-info').hide();

                } else {
                    window.alert('请选择一个图像文件！');
                }
            }
        });
    } else {
        inputImage.prop('disabled', true).addClass('disabled');
    }
}

var sendPhoto = function(){
    $('#photo').cropper('getCroppedCanvas',{
        width:100,
        height:100
    }).toBlob(function(blob){
        // 转化为blob后更改src属性，隐藏模态框
        $('#user-photo').attr('src',URL.createObjectURL(blob));
        $('#user-photo').show();
        $('#changeModal').modal('hide');
    },"image/jpeg",0.95);
    $('#photo').cropper('getCroppedCanvas').toBlob(function(blob){
       		var fd = new FormData();
       		var mail = '<%=request.getParameter("mail")%>';
       		fd.append('smfile',blob,mail+'.jpg');
       		$.ajax({
       		    url:AVATAR_API_URL,
       		    type:"POST",
       		    data:fd,
       		 	processData: false, // 不处理数据
       			contentType: false, // 不设置内容类型
	       		success: function (res) {
	              if(res.code == "success"){
	            	  console.log('ready to save svatar path',res.data.url);
	                  saveAvatarSrc(res.data.url);
	              }
	              else {
	            	  console.log('get avatar err',res);
	              }
	            },
	            error : function() {
	              console.log('avatar ajax error');
	            }
       		});
       	});
}

$(function(){
    initCropperInModal($('#photo'),$('#photoInput'),$('#changeModal'));
});

function saveAvatarSrc(avatar_src) {
  $.ajax({
      url:SAVE_AVATAR_URL,
      type:"POST",
      data:{src:avatar_src},
      xhrFields: {
          withCredentials: true
      },
      success: function (res) {
        console.log('头像上传成功');
        window.location.href = JSP_SERVER_ROOT + '/refreshSession.jsp';
      },
      error : function() {
        console.log('sava avatar src error');
      }
  });
}
