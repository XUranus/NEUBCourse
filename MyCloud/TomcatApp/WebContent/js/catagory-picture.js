var CATAGORY = 'image';

window.onload = function(){//主窗口初始化
	$('body').bind('contextmenu', function (e) {
	       e.preventDefault();
	});
  //刷新
  refresh();
}

function refresh() {
  $.ajax({//向服务器提交数据
    url:GET_CATAGORY_URL,
    type:'post',
    data:{catagory:CATAGORY},
    dataType:"json",
    async: false,
    xhrFields: {
        withCredentials: true
    },
    success:function(data) {
      if(data.fileArr==null) {alert('登陆已失效，请重新登陆！');window.location.href= 'login.html';return;}
      document.getElementById('newTable').innerHTML = '';
      renderFileList(data);
    },
    error:function(XMLHttpRequest, textStatus, errorThrown) {
        alert('A Serious Err Ocured ! [sync path]');
        window.location.href= LOGIN_URL;
    },
  });

	syncNotification();
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
        folder_result[i] += '<tr row_kind="folder" ondblclick="updateCurrentPath(\''+currentPath()+'/'+arr_folder[i].name+'\')"' + folder_id +'>'; //
        folder_result[i] += '<td  onmousedown="what_mousebutton(event)">' + '<i class="far fa-folder"></i>&nbsp;' + arr_folder[i].name + arr_td[1] + arr_td[0] + arr_td[1] + arr_td[0] + resolveTime(arr_folder[i].time);
        folder_result[i] += '</tr>';
    }
    for (var k in arr_file) {
        var file_id ='file_id="' + arr_file[k].id + '"';
        file_result[k] = '<tr file_path = "'+ arr_file[k].actual_path +'" ondblclick="preview(\''+arr_file[k].name+'\',\''+ arr_file[k].actual_path +'\',\''+ arr_file[k].catagory +'\')"' + file_id + '>';
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
    $('#newTable').append(result);
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
    var menuOption = ['删除','重命名','分享','下载'];
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
        var str = 'menu_func(' + i + ',"' + name + '",' + key +',"' + path +'")';//id = key
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
function menu_func(act,file_name,id,file_path){
    switch(act){
        case 0://右键——删除
            if(file_name.indexOf('.')==-1) {removeFolderToDustbin(id);alert('folder');}//删除文件夹
            	else removeFileToDustbin(id);//删除文件
            break;
        case 1: //重命名
            if(file_name.indexOf('.')==-1)//文件夹
                rename_prompt(file_name,0,id);
            else
                rename_prompt(file_name,1,id);//文件
            break;
        case 2: //分享
						displayShareModal(id);
            break;
        case 3: //下载
        	window.open(FILE_SERVER_ROOT + file_path);
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

//------------------------------------------------  预览/下载文件    ----------------------------------------------------------------
function preview(file_name,file_path,file_catagory) {
	$("#previewFileModal").modal('show');
	var previewPanel = document.getElementById('previewFilePanel');
	document.getElementById('previewFileNameLabel').innerHTML = file_name;
	file_path = FILE_SERVER_ROOT + file_path;
	if(file_catagory == 'image') { //预览图片
		previewPanel.innerHTML=('<img src="'+file_path+'" style="width:100%"></img>');
	}
	else if(file_catagory == 'document') {//文档 经过转化
		$.ajax({//向服务器提交dir请求
		    url:"http://v.juhe.cn/fileconvert/query",
		    data:{key:"27bd815861ba74da2115337d002b7b1d",url:FILE_SERVER_ROOT + file_path,type:"3"}, //暂时不可用 需要公网服务器
		    type:'post',
		    dataType:"jsonp",
		    success:function(data) {
		    	console.log(data);
		    	var doc_path = data.mes_path;
		    	previewPanel.innerHTML=('<img src="'+doc_path+'" style="width:100%"></img>');
		    },
		    error:function(XMLHttpRequest, textStatus, errorThrown) {
		      alert('ajax Err load files: '+XMLHttpRequest.status+' '+XMLHttpRequest.readyState+' '+textStatus);
		    }
		});
	}
  else if(file_catagory=='audio') { //音乐
    var music_panel = '<audio controls="controls"><source src="'+ file_path +'" type="audio/mpeg"><embed height="100" width="100" src="'+ file_path +'" /></audio>';
    previewPanel.innerHTML= music_panel ;
  }
	else if(file_path.indexOf('.mp4')!=-1) {//MP4视频
		previewPanel.innerHTML=('<video src="'+file_path+'" style="width:100%" controls preload="metadata"></video>');
	}
	else { //其他类型
		previewPanel.innerHTML = '无法预览 不支持的文件类型';
	}
}

//------------------------------------------------  删除文件/目录    ----------------------------------------------------------------
//这里的删除都只是暂时的删除  只改变了元组的一个列属性
function removeFileToDustbin(fileId) { //根据file_id删除文件
  $.ajax({//向服务器提交dir请求
    url:DELETE_FILE_URL,
    data:{fileId:fileId},
    type:'post',
    dataType:"json",
    xhrFields: {
        withCredentials: true
    },
    success:function(data) {
      if(data.msg!='OK') {
        alert(data.msg);
        return false;
      }
      refresh();
    },
    error:function(XMLHttpRequest, textStatus, errorThrown) {
      alert('ajax Err delete files: '+XMLHttpRequest.status+' '+XMLHttpRequest.readyState+' '+textStatus);
      return false;
    },
  });
}


//------------------------------------------------------------  分享   --------------------------------------------------------------
function displayShareModal(file_id) {

	$.ajax({//请求文件share状态
		url:IS_FILE_SHARED_URL,
		data:{file_id:file_id},
		type:'post',
		async:false,
		dataType:"json",
		xhrFields: {
				withCredentials: true
		},
		success:function(data) {
			console.log('is file shared ',data);
			if(data.msg=='YES') renderShareModal(data.token);
			else renderCreateShareModal(file_id);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown) {
			console.log('ajax Err render shareModal: '+XMLHttpRequest.status+' '+XMLHttpRequest.readyState+' '+textStatus);
		},
	});

	function renderCreateShareModal(file_id) { //创建决定分享的面板
		var shareModal = $("#shareModal");
		var header =
		 '<div class="modal-header">'
		+'<h5 class="modal-title" id="previewFileNameLabel">创建文件分享</h5>'
		+	'<button class="close" type="button" data-dismiss="modal" aria-label="Close">'
		+	'	<span aria-hidden="true">×</span>'
		+'	</button>'
		+'</div>';
		var body =
		 '<div class="modal-body">'
		+'		该文件尚未被分享，你可以点击创建分享链接创建'
		+'</div>'
		+'<div class="modal-footer">'
		+'<button class="btn btn-primary" onclick="getTokenAndRefresh('+file_id+')">创建分享链接</button>'
		+'</div>';
		var content = shareModal.find(".modal-content");
		content.html(header+body);
		shareModal.modal('show');
	}
}

function renderShareModal(token) {
	var shareModal = $("#shareModal");
	var header =
	 '<div class="modal-header">'
	+'<h5 class="modal-title" id="previewFileNameLabel">文件分享已创建</h5>'
	+	'<button class="close" type="button" data-dismiss="modal" aria-label="Close">'
	+	'	<span aria-hidden="true">×</span>'
	+'	</button>'
	+'</div>';
	var link = JSP_SERVER_ROOT+ '/share.jsp?token=' + token;
	var body =
	 '<div class="modal-body">'
	+'		分享链接 <br><a href='+ link + '>'+ link +'</a><br>'
	+'</div>'
	+'<div class="modal-footer">'
	+ '<span id="copyMessage" style="color:red"></span>'
	+	'<button class="btn btn-light" onclick="copyUrl()">复制到剪贴板</button>&nbsp;'
	+	'<a class="btn btn-success" href="posts.jsp?shareToken='+ token +'">分享到动态</a>'
	+'</div>';
	var content = shareModal.find(".modal-content");
	content.html(header+body);
	shareModal.modal('show');
}

function getTokenAndRefresh(file_id) {
	$.ajax({//请求token
		url:GET_SHARE_TOKEN_URL,
		data:{file_id:file_id},
		type:'post',
		async:false,
		dataType:"json",
		xhrFields: {
				withCredentials: true
		},
		success:function(data) {
			console.log('get share token:',data);
			if(data.msg!='Access rejected') renderShareModal(data.token);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown) {
			console.log('ajax Err render shareModal: '+XMLHttpRequest.status+' '+XMLHttpRequest.readyState+' '+textStatus);
		},
	});
}

function copyUrl() {
		var text = $("#shareModal").find('.modal-body').find('a').attr("href");
		console.log('Copy: ',text);
    var oInput = document.createElement('textarea');
    oInput.innerHTML = text;
    oInput.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
		document.getElementById('copyMessage').innerHTML = '复制成功';
}
