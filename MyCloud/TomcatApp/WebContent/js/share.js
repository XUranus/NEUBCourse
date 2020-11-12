var num1 = 0;
var find = false;
var file_name = $('.card-title').text();
var file_path = $('#downloadLink').attr('href');
var file_catagory = $('#formatLabel').text();
var arr_icon = ['far fa-4x fa-file-code', 'far fa-4x fa-file-pdf', 'far  fa-4x fa-file-word', 'far  fa-4x fa-file-powerpoint', 'far  fa-4x fa-file-excel', 'far  fa-4x fa-file-image', 'fas fa-4x fa-video', 'fas fa-4x fas fa-music', 'far fa-4x fa-file-archive', 'far fa-4x fa-file']
var arr_filetype = [['.c', '.cpp', '.java', '.py','.html'], ['.pdf'], ['.word'], ['.ppt'], ['.excel'], ['.jpg', '.jpeg', '.png', '.ico'], ['.mp4','.flv', '.avi', '.rmvb'],['.mp3','.ogg','.wav'],['.rar']];
for(i in arr_filetype){
    if(!find){
        var arr_file = arr_filetype[i];
        for(j in arr_file){
            if(arr_file[j] == file_catagory){
                $('#icon').attr('class',arr_icon[i] + ' mt-2 mb-2');
            }
        }
    }
}
function preview(){
    num1++;
    if(file_catagory == '.mp3' || file_catagory == '.ogg' || file_catagory == '.wav'){
        if(num1 == 1){
          $('#videoModal').remove();
          $('#preview').append('<div id="wrapper"><audio preload="auto" controls loop><source src="' + file_path + '"></audio></div>');
          $('audio').audioPlayer();
          $('#preview').css({"width":"40%", "margin-left":"30%"});
        }
    }else if(file_catagory == '.mp4' || file_catagory == '.avi'){
        var vids=document.getElementById("vids");
        vids.src = file_path;
        $('.title_top').text(file_name);
    }else {
        $('#videoModal').remove();
    }
}


// //------------------------------------------------  预览/下载文件    ----------------------------------------------------------------
// function preview(file_name,file_path,file_catagory) {
// $("#previewFileModal").modal('show');
// var previewPanel = document.getElementById('previewFilePanel');
// document.getElementById('previewFileNameLabel').innerHTML = file_name;
// file_path = FILE_SERVER_ROOT + file_path;
// if(file_catagory == 'image') { //预览图片
// previewPanel.innerHTML=('<img src="'+file_path+'" style="width:100%"></img>');
// }
// // else if(file_catagory == 'document') {//文档 经过转化
// // $.ajax({//向服务器提交dir请求
// //     url:"http://v.juhe.cn/fileconvert/query",
// //     data:{key:"27bd815861ba74da2115337d002b7b1d",url:FILE_SERVER_ROOT + file_path,type:"3"}, //暂时不可用 需要公网服务器
// //     type:'post',
// //     dataType:"jsonp",
// //     success:function(data) {
// //       console.log(data);
// //       var doc_path = data.mes_path;
// //       previewPanel.innerHTML=('<img src="'+doc_path+'" style="width:100%"></img>');
// //     },
// //     error:function(XMLHttpRequest, textStatus, errorThrown) {
// //       alert('ajax Err load files: '+XMLHttpRequest.status+' '+XMLHttpRequest.readyState+' '+textStatus);
// //     }
// // });
// // }
// else if(file_catagory=='audio') { //音乐
// var music_panel = '<audio controls="controls"><source src="'+ file_path +'" type="audio/mpeg"><embed height="100" width="100" src="'+ file_path +'" /></audio>';
// previewPanel.innerHTML= music_panel ;
// }
// else if(file_path.indexOf('.mp4')!=-1) {//MP4视频
// previewPanel.innerHTML=('<video src="'+file_path+'" style="width:100%" controls preload="metadata"></video>');
// }
// else { //其他类型
// previewPanel.innerHTML = '无法预览 不支持的文件类型';
// }
// }
