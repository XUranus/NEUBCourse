var resourceTable = document.getElementById('resourceTable');

window.onload = function(){//主窗口初始化
	$('body').bind('contextmenu', function (e) {
	       e.preventDefault();
	});
  //获得目前的目录
  refresh();
	syncNotification();
}

function refresh() {
	$.ajax({//向服务器提交数据
	    url:GET_DUSTBIN_URL,
	    type:'post',
	    dataType:"json",
	    async: false,
	    xhrFields: {
	        withCredentials: true
	    },
	    success:function(data) {
	      if(data.fileArr==null) {alert('登陆已失效，请重新登陆！');window.location.href= 'login.html';return;}
	      renderFileList(data);
	    },
	    error:function(XMLHttpRequest, textStatus, errorThrown) {
	      alert('A Serious Err Ocured ! [sync path]');
	      window.location.href= LOGIN_URL;
	    },
	  });
}

//---------------------------------------------------       渲染文件列表  By Xx    --------------------------------------------------------

function renderFileList(data) {//data 是一个含有两个数组的json
    var arr_file = data.fileArr;
    var arr_folder = data.folderArr;
    var arr_td = ['<td>', '</td>'];
    var arr_icon = ['<i class="far fa-file-code"></i>&nbsp;', '<i class="far fa-file-pdf"></i>&nbsp;', '<i class="far fa-file-word"></i>&nbsp;', '<i class="far fa-file-powerpoint"></i>&nbsp;', '<i class="far fa-file-excel"></i>&nbsp;', '<i class="far fa-file-image"></i>&nbsp;', '<i class="far fa-file-video"></i>&nbsp;', '<i class="far fa-file-audio"></i>&nbsp;', '<i class="far fa-file-archive"></i>&nbsp;', '<i class="far fa-file"></i>&nbsp;']
    var arr_filetype = [['.c', '.cpp', '.java', '.py','.html'], ['.pdf'], ['.word'], ['.ppt'], ['.excel'], ['.jpg', '.jpeg', '.png', '.ico'], ['.mp4','.flv', '.avi', '.rmvb'], ['.mp3', '.flac'], ['.rar']];
    var file_result = [];
    var folder_result = [];
    for (var i in arr_folder) {
        var folder_id ='folder_id="' + arr_folder[i].id + '"';
        folder_result[i] += '<tr row_kind="folder" ' + folder_id +'>'; //
        folder_result[i] += '<td  onmousedown="what_mousebutton(event)">' + '<i class="far fa-folder"></i>&nbsp;' + arr_folder[i].name + arr_td[1] + arr_td[0] + arr_td[1] + arr_td[0] + resolveTime(arr_folder[i].time);
        folder_result[i] += '</tr>';
    }
    for (var k in arr_file) {
        var file_id ='file_id="' + arr_file[k].id + '"';
        file_result[k] = '<tr row_kind="file" ' + file_id + '>';
        //icon
        var flag = false;
        for (m in arr_filetype) {
            if (contains(arr_file[k].format, arr_filetype[m])) {
                file_result[k] += '<td onmousedown="what_mousebutton(event)">' + arr_icon[m];
                flag = true;
            }
        }
        if (!flag) {//未识别
            file_result[k] += '<td onmousedown="what_mousebutton(event)">' + '<i class="far fa-file"></i>&nbsp;';
        }
        file_result[k] += arr_file[k].name + resolveFormat(arr_file[k].format) + arr_td[1] + arr_td[0] + resolveSize(arr_file[k].size) + arr_td[1] + arr_td[0] + resolveTime(arr_file[k].time) + arr_td[1];
        file_result[k] += '</tr>';
    }
    var result = '';
    for (i in folder_result)
        result += folder_result[i];
    for (i in file_result)
        result += file_result[i];
    $('#newTable').html(result);
    if(result=='') $('#newTable').append('<tr><td>当前目录什么也没有哦...QwQ</td></tr>');
}

function contains(format, array) {
    var have = false;
    for (i in array) {
        if (array[i] == format)
            have = true;
    }
    return have;
}
function resolveTime(time){
    var realTime = '';
    realTime = time.substring(0,10);
    return realTime;
}
function resolveSize(size){
    var realSize = parseInt(size);
    var sizeUnit = ['KB','MB','GB'];
    var i = 0;
    while(realSize>1024){
        realSize = Math.round(realSize/1024);
        i++;
    }
    return realSize + sizeUnit[i] + '';
}
function resolveFormat(format){
    format = '<span style="color:grey">' + format + '</span>';
    return format;
}
function menu(event){
    //获取点击位置
    x = event.clientX;
    y = event.clientY;
    var name = $(event.target).eq(0).text().trim();
    var file_id = $(event.target).parent().attr("file_id");
    var folder_id = $(event.target).parent().attr("folder_id");
    var key = (file_id==null)?folder_id:file_id;
    var path = $(event.target).parent().attr("file_path");
    var row_kind = $(event.target).parent().attr("row_kind");
    newMenu(x,y,name,key,path,row_kind);
}
function newMenu(x,y,name,key,path,row_kind){
    var menuOption = ['彻底删除','恢复'];
    var menuNode = document.getElementById('newMenu');
    if(!menuNode){
        menuNode = document.createElement('div');
        menuNode.setAttribute('class','btn-group-vertical');
        menuNode.setAttribute('id','newMenu');
    }else{
      $("#newMenu").remove();
      return;
    }

    $(menuNode).css({left:x+'px',top:y+'px'});
    for(i in menuOption){
    	if(row_kind=='folder' && i>1) break;
      var tempNode=document.createElement("a");
      tempNode.setAttribute('class','btn btn-outline-secondary');
      $(tempNode).text(menuOption[i]);
      var str = 'menu_func(' + i + ',' + key + ',"' + row_kind + '")';//id = key
      $(tempNode).attr("onclick",str);
      menuNode.appendChild(tempNode);
    }
    $("body").append(menuNode);
    $('body').bind('click', function (e) {
        var o = e.target;
        if($(o).closest('#newMenu').length==0){//不是特定区域
            $("#newMenu").slideUp("normal");//slow normal fast 也可手动设置速度 单位毫秒
            //TODO:滑动效果冲突 下拉效果未做
            $("#newMenu").remove();
        }
    });
}
function menu_func(act,id,kind){
    switch(act){
        case 0://彻底删除
					 permanentlyDelete(id,kind);
					 break;
        case 1: //恢复
					recover(id,kind);
					break;
        default: break;
    }
		$("#newMenu").hide();
}
function rename_prompt(key,act,id){
    //var newName=prompt("请输入新的文件名","");
    if(act==0){
        renameFolder(id,newName);
    }else if(act==1){
        renameFile(id,newName);
    }
}
function what_mousebutton(e){
  if(e.button == 2){
    menu(e);
  }else{
    return;
  }
}

function permanentlyDelete(id,kind) { //永久删除
	console.log('permanentlyDelete ',id,' ',kind);
	if(kind=='file') {
		$.ajax({
		    url:PERMENENTLY_DELETE_FILE_URL,
				data:{id:id},
		    type:'post',
		    dataType:"json",
		    xhrFields: {
		        withCredentials: true
		    },
		    success:function(data) {
		      refresh();
		    },
		    error:function(XMLHttpRequest, textStatus, errorThrown) {
		      console.log('A Serious Err Ocured ! [permanently delete file]');
				}
		  });
	}
	else {
		$.ajax({
		    url:PERMENENTLY_DELETE_FOLDER_URL,
				data:{id:id},
		    type:'post',
		    dataType:"json",
		    xhrFields: {
		        withCredentials: true
		    },
		    success:function(data) {
		      refresh();
		    },
		    error:function(XMLHttpRequest, textStatus, errorThrown) {
		      console.log('A Serious Err Ocured ! [permanently delete folder]');
				}
		  });
	}
}

function recover(id,kind) { //恢复
	console.log('recover ',id,' ',kind);
	if(kind=='file') {
		$.ajax({
		    url:RECOVER_FILE_URL,
				data:{id:id},
		    type:'post',
		    dataType:"json",
		    xhrFields: {
		        withCredentials: true
		    },
		    success:function(data) {
		      refresh();
		    },
		    error:function(XMLHttpRequest, textStatus, errorThrown) {
		      console.log('A Serious Err Ocured ! [recover file]');
				}
		  });
	}
	else {
		$.ajax({
		    url:RECOVER_FOLDER_URL,
				data:{id:id},
		    type:'post',
		    dataType:"json",
		    xhrFields: {
		        withCredentials: true
		    },
		    success:function(data) {
		      refresh();
		    },
		    error:function(XMLHttpRequest, textStatus, errorThrown) {
		      console.log('A Serious Err Ocured ! [permanently delete folder]');
				}
		  });
	}
}
