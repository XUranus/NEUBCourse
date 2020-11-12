var img_path = 'https://unsplash.it/700/450?image=610';//图片暂不处理 TODO:
var img_class = ['card-img-top img-fluid w-100','img-fluid w-100 mb-1','d-flex mr-3 avatar','d-flex mr-3 avatar'];//post图片 回复图片 头像
var card_class = ['card mb-3','card-body','card-title mb-1','card-text small','card-body py-2 small','card-body small bg-faded','card-footer small text-muted'];
var comment_class = ['media','media-body','media mt-2','mt-0 mb-1'];
var post_menu = ['mr-3 d-inline-block','d-inline-block','far fa-fw fa-thumbs-up','fas fa-fw fa-comments','fas fa-fw fa-share','fas fa-fw fa-comment','fas fa-fw fa-thumbs-up'];
var comment_menu = ['list-inline mb-0','list-inline-item','list-inline mb-0 mt-1'];
var textarea_class = ['collapse mt-2','form-control small'];
var insertID = -1;
var num1 = 0;
var num2 = 0;
var user = {"nickname":$('#avatar').next().next().text(),"avatar":$('#avatar').attr('src')};//TODO:
var img_src;

window.onload = function(){
    syncNotification();//加载通知
    loadEmojiTable();
    refresh();

    var emojiShow = document.getElementById('clickOnEmoji');
    var emojiShow_avg = document.getElementsByClassName('svg-inline--fa fa-smile fa-w-16 fa-lg');
    var emojiModal = document.getElementById('showEmoji');
    window.onclick = function(event) {
        // console.log(display);
        var emojiModal_state = $('#showEmoji').css("display");
        if (event.target != emojiModal && event.target != emojiShow && emojiModal_state == 'block') {
            $('#showEmoji').hide();
            if (event.target == emojiShow_avg[0]){
                $('#showEmoji').show();
            }
        }
    }
    var ImgInput = document.getElementById('fileImg');
    ImgInput.addEventListener("change", function (e) {
      $('#previewModal').show();
      var file = e.target.files[0];
      if(!/image\/\w+/.test(file.type))           //判断获取的是否为图片文件
      {
          alert("请确保文件为图像文件");
          return false;
      }
      var reader=new FileReader();
      reader.readAsDataURL(file);
      reader.onload=function(e)
      {
          var result=document.getElementById("result");
          document.getElementById("preview").src = this.result;
          img_src = this.result;
      }
    }, false);
}

function refresh() {
  $.ajax({
      url: GET_POSTS_URL,
      type: 'POST',
      xhrFields: {
          withCredentials: true
      },
      dataType:'JSON',
      success: function(data){
        document.getElementsByClassName('card-columns').innerHTML = '';
        console.log('get post arr data:',data.post);
        var post = data.post;
        for(i in post){
            createPost(post[i]);
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log('ajax Err code:'+XMLHttpRequest.status+' '+XMLHttpRequest.readyState+' '+textStatus);
      }
  });
}

function loadEmojiTable() {
  var content = '';
  for(i=1;i<85;i++) {
    if(i%10==1) content += '<tr style="width: 280px;height: 28px">';
    content += '<td><img src="emoji/'+ i +'.png" width="28" height="28" onclick="sendEmoji(src);"></td>';
    if(i%10==0 || i==84) content += '</tr>';
  }
  document.getElementById('emojiTbody').innerHTML = content;
}

function createPost(data){
    //新建card
    var root = document.getElementsByClassName('card-columns');
    var card = document.createElement("div");
    card.setAttribute('class',card_class[0]);
    //加载post信息
    if(data.post.img){
      card.appendChild(createPost_img(img_class[0],data.post.img));
    }
    var card_body = document.createElement("div");
    card_body.setAttribute('class',card_class[1]);
    createPost_body(card_body,data.post);
    card.appendChild(card_body);
    createPost_line(card);
    //加载主功能栏
    createPost_mainMenu(card,data.post.iflike);
    createPost_line(card);
    createPost_comment(card,data.comment);
    ceratePost_footer(card,data.post_time);
    root[0].appendChild(card);
    $('.collapse').on('hidden.bs.collapse', function () {
        $(this).children('textarea').val('');//清空
    })
}
function createPost_img(imgClass,src){//TODO:图片的src=-=
    var model_img = document.createElement("img");
    model_img.setAttribute('class',imgClass);
    model_img.setAttribute('src',src);
    return model_img;
}

function createPost_body(root,json){//TODO:悬浮框显示个人信息
    var show_name = document.createElement('h6');
    var show_info = document.createElement('a');
    var show_text = document.createElement('p');
    var show_tag = document.createElement('a');
    show_name.setAttribute('class',card_class[2]);
    show_name.setAttribute('post_id',json.id);
    show_info.setAttribute('href','JavaScript:');//TODO : selfinfo
    show_info.innerHTML = json.nickname;
    show_name.appendChild(show_info);
    show_text.setAttribute('class',card_class[3]);
    show_text.innerHTML = json.text;
    show_tag.setAttribute('href',json.href);
    show_tag.innerHTML = '#' + json.tag;
    if(json.href != 'https://'){
      show_text.appendChild(show_tag);
    }
    root.appendChild(show_name);
    root.appendChild(show_text);
}

function createPost_line(root){
    root.innerHTML = root.innerHTML + '<hr class="my-0">';
}

function createPost_mainMenu(root,flag){//TODO:方法=-= 点赞数目
    var id = 'comment_area' + num1;
    num1++;
    var card_menu = document.createElement('div');
    card_menu.setAttribute('class',card_class[4]);
    if(!flag){
      var likeclass = post_menu[2];
      var liketext = '点赞';
    }else{
      var likeclass = post_menu[6];
      var liketext = '取消点赞';
    }
    card_menu.innerHTML = '<a class="' + post_menu[0] + '" href="JavaScript:" onclick="post_thumbsUp(this)"><i class="' + likeclass + '"></i>' + liketext + '</a>';
    // var thumbs_up = document.createElement('a');
    // thumbs_up.setAttribute('class',post_menu[0]);
    // thumbs_up.setAttribute('href','JavaScript:');
    // var thumbs_up_i = document.createElement('i');
    // thumbs_up_i.setAttribute('class',post_menu[2]);
    // thumbs_up.appendChild(thumbs_up_i);
    // thumbs_up.innerHTML = thumbs_up.innerHTML + '点赞';

    var post_comment = document.createElement('a');
    post_comment.setAttribute('class',post_menu[0]);
    post_comment.setAttribute('data-toggle','collapse');
    post_comment.setAttribute('href','#' + id);
    post_comment.setAttribute('aria-expanded',false);
    post_comment.setAttribute('aria-controls',id);
    var comment_i = document.createElement('i');
    comment_i.setAttribute('class',post_menu[3]);
    post_comment.appendChild(comment_i);
    post_comment.innerHTML = post_comment.innerHTML + '评论';

    var share = document.createElement('a');
    share.setAttribute('class',post_menu[1]);
    share.setAttribute('href','JavaScript:');
    share.setAttribute('onclick','submit_post_share(this)');
    var share_i = document.createElement('i');
    share_i.setAttribute('class',post_menu[4]);
    share.appendChild(share_i);
    share.innerHTML = share.innerHTML + '分享';
    var comment_area = document.createElement('div');
    createTextarea(comment_area,id,0);
    //card_menu.appendChild(thumbs_up);
    card_menu.appendChild(post_comment);
    card_menu.appendChild(share);
    card_menu.appendChild(comment_area);
    root.appendChild(card_menu);
}
function createPost_comment(root,comments){
    var card_comment = document.createElement('div');
    card_comment.setAttribute('class',card_class[5]);
    for(i in comments){
        var card_media = document.createElement('div');
        card_media.setAttribute('class',comment_class[0]);
        card_media.appendChild(createPost_img(img_class[2],comments[i].avatar));
        createComment(card_media,comments[i],true,true);
        card_comment.appendChild(card_media);
    }
    root.appendChild(card_comment);
}

function createComment(root,comment,flag1,flag2){ //1 false:新增评论 true:渲染评论  2 false:不要点赞
    var id = 'reply_area' + num2;
    num2++;
    var comment_body = document.createElement('div');
    comment_body.setAttribute('class',comment_class[1]);
    var commenter_name = document.createElement('h6');
    commenter_name.setAttribute('class',comment_class[3]);
    commenter_name.setAttribute('comment_id',comment.comment_id);//TODO:
    var commenter_info = document.createElement('a');
    commenter_info.setAttribute('href','JavaScript:');//TODO ： selfinfo
    commenter_info.innerHTML = comment.nickname;
    commenter_name.appendChild(commenter_info);
    // var commenter_content = document.createElement('p');
    // commenter_content.setAttribute('class',card_class[3]);
    // commenter_content.innerHTML = comment.content;

    var commenter_menu = document.createElement('ul');
    commenter_menu.setAttribute('class',comment_menu[0]);
    createComment_menu(commenter_menu,id,flag2);
    var reply_area = document.createElement('div');
    createTextarea(reply_area,id,1);
    comment_body.appendChild(commenter_name);

    //comment_menu.appendChild(createPost_img(img_class[1],comment.img));  //评论加图待定
    //comment_body.appendChild(commenter_content);
    comment_body.innerHTML = comment_body.innerHTML + comment.content;
    comment_body.appendChild(commenter_menu);
    comment_body.appendChild(reply_area);
    if(flag1){
        for(i in comment.reply){
            var commenter_reply = document.createElement('div');
            commenter_reply.setAttribute('class',comment_class[2]);
            commenter_reply.appendChild(createPost_img(img_class[3],comment.reply[i].avatar));
            createComment_reply(commenter_reply,comment.reply[i]);
            comment_body.appendChild(commenter_reply);
        }
    }
    root.appendChild(comment_body);
}

function createComment_menu(root,id,flag){ //false:不要点赞
    if(flag){
        var commenter_like = document.createElement('li');
        commenter_like.setAttribute('class',comment_menu[1]);
        commenter_like.innerHTML = '<a class="' + post_menu[1] + '" href="JavaScript:" onclick="post_thumbsUp(this)"><i class="' + post_menu[2] + '"></i>点赞</a>';
        // var commenter_like_a = document.createElement('a');
        // commenter_like.setAttribute('class',comment_menu[1]);
        // commenter_like_a.setAttribute('href','JavaScript:');
        // commenter_like_a.innerHTML = '点赞';
        // commenter_like.appendChild(commenter_like_a);
        var commenter_skip = document.createElement('li');
        commenter_skip.setAttribute('class',comment_menu[1]);
        commenter_skip.innerHTML = '·';
    }
    var commenter_reply = document.createElement('li');
    commenter_reply.setAttribute('class',comment_menu[1]);
    commenter_reply.innerHTML = '<a class="' + post_menu[1] + '" data-toggle="collapse" href="#' + id + '" aria-expanded="false" aria-controls="' + id + '"><i class="' + 
    post_menu[5] + '"></i>回复</a>';
    // var commenter_reply_a = document.createElement('a');
    // commenter_reply_a.setAttribute('data-toggle','collapse');
    // commenter_reply_a.setAttribute('href','#' + id);
    // commenter_reply_a.setAttribute('aria-expanded',false);
    // commenter_reply_a.setAttribute('aria-controls','#' + id);
    // commenter_reply_a.innerHTML = '回复';
    // commenter_reply.appendChild(commenter_reply_a);
    if(flag) {
      root.appendChild(commenter_like);
      root.appendChild(commenter_skip);
    }
    root.appendChild(commenter_reply);
}

function createComment_reply(root,reply){
    var id = 'reply_area' + num2;
    num2++;
    var reply_body = document.createElement('div');
    reply_body.setAttribute('class',comment_class[1])
    var reply_name = document.createElement('h6');
    reply_name.setAttribute('class',comment_class[3]);
    reply_name.setAttribute('reply_id',reply.reply_id);
    var reply_name_i = document.createElement('a');
    reply_name_i.setAttribute('href','JavaScript:');
    reply_name_i.innerHTML = reply.nickname;
    reply_name.appendChild(reply_name_i);
    // var reply_content = document.createElement('p');
    // reply_content.setAttribute('class',card_class[3]);
    // reply_content.innerHTML = reply.content;
    var reply_menu = document.createElement('ul');
    reply_menu.setAttribute('class',comment_menu[0]);
    createComment_menu(reply_menu,id,false);
    var reply_area = document.createElement('div');
    createTextarea(reply_area,id,2);
    reply_body.appendChild(reply_name);
    reply_body.innerHTML = reply_body.innerHTML + reply.content;
    reply_body.appendChild(reply_menu);
    reply_body.appendChild(reply_area);
    root.appendChild(reply_body);
}

function ceratePost_footer(root,post_time){
    var footer = document.createElement('div');
    footer.setAttribute('class',card_class[6]);
    footer.style.textAlign = 'right';
    footer.innerHTML = post_time;
    root.appendChild(footer);
}

function createTextarea(root,id,key){ //0:post 1:comment 2:reply
    root.setAttribute('class',textarea_class[0]);
    root.setAttribute('id',id);
    var textarea = document.createElement('textarea');
    textarea.setAttribute('class',textarea_class[1]);
    textarea.setAttribute('type','text');
    textarea.style.fontSize = '95%';
    var textarea_menu = document.createElement('ul');
    textarea_menu.setAttribute('class',comment_menu[2]);
    textarea_menu.style.textAlign = 'right';
    var textarea_submit = document.createElement('li');
    textarea_submit.setAttribute('class',comment_menu[1]);
    // var textarea_submit_a = document.createElement('a');
    // textarea_submit_a.setAttribute('href','JavaScript:');
    // textarea_submit_a.innerHTML = '提交';
    // textarea_submit.appendChild(textarea_submit_a);
    textarea_submit.innerHTML = '<a href="JavaScript:" onclick="' + 'submit_text(this,' + key + ')' + '">提交</a>';

    var textarea_skip = document.createElement('li');
    textarea_skip.setAttribute('class',comment_menu[1]);
    var textarea_cancel = document.createElement('li');
    textarea_cancel.setAttribute('class',comment_menu[1]);
    var textarea_cancel_a = document.createElement('a');
    textarea_cancel_a.setAttribute('href','JavaScript:');
    textarea_cancel_a.innerHTML = '取消';
    textarea_cancel.appendChild(textarea_cancel_a);
    textarea_menu.appendChild(textarea_submit);
    textarea_menu.appendChild(textarea_skip);
    textarea_menu.appendChild(textarea_cancel);
    root.appendChild(textarea);
    root.appendChild(textarea_menu);
}

function submit_text(th,key){ //key {0:post,1:comment,2:reply} value为被评论的对象
//隐藏
    var node = th.parentNode.parentNode;//<ul>
    var json = {};
    json.nickname = user.nickname; //填入当前页面的用户名即可
    switch (key) {
      case 0:
          json.content = node.previousSibling.value;
          json.id = node.parentNode.parentNode.previousSibling.previousSibling.firstChild.getAttribute("post_id");
          var insertNode = node.parentNode.parentNode.nextSibling.nextSibling;
          var insert_comment = document.createElement('div');
          insert_comment.setAttribute('class',comment_class[0]);
          insert_comment.appendChild(createPost_img(img_class[2],user.avatar));//TODO:
          commentToPost(json,insert_comment,insertNode);
          break;
      case 1:
          //var assessee = node.parentNode.parentNode.firstChild.innerHTML;
          var assessee = node.parentNode.parentNode.firstChild.firstChild.innerHTML;//被回复者
          json.id = node.parentNode.parentNode.firstChild.getAttribute("comment_id");
          json.content = '@' + assessee + '  ' + node.previousSibling.value;
          var insertNode = node.parentNode.parentNode;
          var insert_comment = document.createElement('div');
          insert_comment.setAttribute('class',comment_class[2]);
          insert_comment.appendChild(createPost_img(img_class[2],user.avatar));//TODO:
          replyToComment(json,insert_comment,insertNode);
          break;
      case 2:
          var assessee = node.parentNode.parentNode.firstChild.firstChild.innerHTML;
          json.id = node.parentNode.parentNode.firstChild.getAttribute("reply_id");
          json.content = '@' + assessee + '  ' + node.previousSibling.value;
          var insertNode = node.parentNode.parentNode.parentNode.parentNode;
          var insert_comment = document.createElement('div');
          insert_comment.setAttribute('class',comment_class[2]);
          insert_comment.appendChild(createPost_img(img_class[2],user.avatar));//TODO:
          replyToReply(json,insert_comment,insertNode);
          break;
      default:
    }
    $(node.parentNode).collapse('hide');
    $('.collapse').on('hidden.bs.collapse', function () {
        $(this).children('textarea').val('');//清空
    })
}

function post_thumbsUp(th){ //TODO:后端&点赞数目	
	var json = {};
	if(th.getAttribute("class") == post_menu[1]){
		json.type = 'comment';
		json.id = th.parentNode.previousSibling.getAttribute("comment_id");
	}else{
		json.type = 'post';		
		json.id = th.parentNode.previousSibling.previousSibling.firstChild.getAttribute("post_id");
	}
    if(th.text == '点赞' ){
        th.innerHTML = '<i class="fas fa-fw fa-thumbs-up"></i>取消点赞';     
        //ajax
    }else{
        th.innerHTML = '<i class="far fa-fw fa-thumbs-up"></i>点赞';
        //ajax
    }
}

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

function submit_post(){ //新建post
    var fd = new FormData();
    if(img_src){
      var blob = dataURLtoBlob(img_src);
      fd.append('smfile',blob,user.nickname + '.jpg');
      $.ajax({
          url:AVATAR_API_URL,
          type:"POST",
          data:fd,
        processData: false, // 不处理数据
        contentType: false, // 不设置内容类型
        success: function (res) {
            if(res.code == "success"){
            $('#previewModal').hide();
              console.log('ready to save img path',res.data.url);
              var json = {};
              json.img = res.data.url;
              json.nickname = user.nickname;
              json.text = replaceEmoji($('#textarea_post').val());
              json.tag = $('#linkModalLinkTag').val();
              json.href = $('#linkModalLink').val();
              if(json.content == '' && json.img == '' && json.href == 'https://') return;
              else { //开始向后台发送post数据
                $.ajax({//向服务器提交数据
                  url:SEND_POST_URL,
                  type:'post',
                  data:{content:json.text,tag:json.tag,href:json.href,img:json.img},  //这里我已经装进json里了  直接用就行 然后你返回给我的data里放上post的id
                  dataType:"json",
                  xhrFields: {
                      withCredentials: true
                  },
                  success:function(data) {
                    if(data.msg=='OK') {
                        json.id = data.insertId;
                        var root = document.getElementsByClassName('card-columns');
                        var card = document.createElement("div");
                        card.setAttribute('class',card_class[0]);
                        //加载post信息
                        card.appendChild(createPost_img(img_class[0],json.img));
                        var card_body = document.createElement("div");
                        card_body.setAttribute('class',card_class[1]);
                        createPost_body(card_body,json);//TODO:
                        card.appendChild(card_body);
                        createPost_line(card);
                        //加载主功能栏
                        createPost_mainMenu(card);
                        createPost_line(card);
                        var card_comment = document.createElement('div');
                        card_comment.setAttribute('class',card_class[5]);
                        card.appendChild(card_comment);
                        ceratePost_footer(card,getNowDate());
                        root[0].insertBefore(card,root[0].firstChild);
                        $('.collapse').on('hidden.bs.collapse', function () {
                            $(this).children('textarea').val('');//清空
                        })
                        submit_cancel();
                    }
                  },
                  error:function(XMLHttpRequest, textStatus, errorThrown) {
                      console.log('send posts err');
                  }
                });
              }
            }
            else {
              console.log('get img err',res);
            }
          },
          error : function() {
            console.log('avatar ajax error');
          }
      });
    }else {
        var json = {};
        json.img = '';
        json.nickname = user.nickname;
        json.text = replaceEmoji($('#textarea_post').val());
        json.tag = $('#linkModalLinkTag').val();
        json.href = $('#linkModalLink').val();
        if(json.content == '' && json.img == '' && json.href == 'https://') return;
        else { //开始向后台发送post数据
          $.ajax({//向服务器提交数据
            url:SEND_POST_URL,
            type:'post',
            data:{content:json.text,tag:json.tag,href:json.href,img:json.img},  //这里我已经装进json里了  直接用就行 然后你返回给我的data里放上post的id
            dataType:"json",
            xhrFields: {
                withCredentials: true
            },
            success:function(data) {
              if(data.msg=='OK') {
                  json.id = data.insertId;
                  var root = document.getElementsByClassName('card-columns');
                  var card = document.createElement("div");
                  card.setAttribute('class',card_class[0]);
                  //加载post信息
                  card.appendChild(createPost_img(img_class[0],json.img));
                  var card_body = document.createElement("div");
                  card_body.setAttribute('class',card_class[1]);
                  createPost_body(card_body,json);//TODO:
                  card.appendChild(card_body);
                  createPost_line(card);
                  //加载主功能栏
                  createPost_mainMenu(card);
                  createPost_line(card);
                  var card_comment = document.createElement('div');
                  card_comment.setAttribute('class',card_class[5]);
                  card.appendChild(card_comment);
                  ceratePost_footer(card,getNowDate());
                  root[0].insertBefore(card,root[0].firstChild);
                  $('.collapse').on('hidden.bs.collapse', function () {
                      $(this).children('textarea').val('');//清空
                  })
                  submit_cancel();
              }
            },
            error:function(XMLHttpRequest, textStatus, errorThrown) {
                console.log('send posts err');
            }
          });
        }


    }
}

//newPost
function getNowDate(){
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var hour = d.getHours();
    var minute = d.getMinutes();
    var res = year + "/" + month + "/" + day + ' ' + hour + ':' + minute;
    return res;
}

function submit_cancel(){
    $('#textarea_post').val('');
    link_cancel();
}

function link_cancel(){
    $('#linkModalLinkTag').val('');
    $('#linkModalLink').val('https://');
}

function showEmoji() {
    var display = $('#showEmoji').css("display");
    if (display == "none") {
        // var offset = $('#clickOnEmoji').offset();
        // var pos = $('#clickOnEmoji').position();
        // var width = $('#clickOnEmoji').width();
        // var height = $('#clickOnEmoji').height();
        // var pos_x = pos.left + 300;
        // var pos_y = pos.top + 100;
        // $('#showEmoji').css({'left' : pos_x, 'top' : pos_y});
        $('#showEmoji').show();
    } else if (display == "block") {
        $('#showEmoji').hide();
    }
}

function sendEmoji(src){
    src_real = src.substring(30);
    $('#textarea_post').val($('#textarea_post').val() + '[' + src_real + ']');
    ///\[ emoji//{n}.png\]/
}

function replaceEmoji(content){
    var reg = /\[emoji\/[1-9][0-9]{1,2}\.png\]/g;
    return content.replace(/\[emoji\/[1-9][0-9]{0,1}\.png\]/g,function(str){
        return ('<img src="' + str.substring(1,str.length-1) + '" width="28" height="28">');
    });
}

//json 你只需要用 json.content 和 json.id  这里和submit_post()类似 但是关于前端的部分我已经写在submit_text里了 只要你分别写ajax发给后端就行了 最后给我return id 就行了
function commentToPost(json,insert_comment,insertNode){
  //console.log('comment to post',json);
  $.ajax({
      url: COMMENT_POST_URL,
      type: 'POST',
      data:{post_id:json.id,content:json.content},
      xhrFields: {
          withCredentials: true
      },
      dataType:'JSON',
      success: function(data){
          console.log('comment to post ajax get data:',data);
          json.comment_id = data.insertId;
          createComment(insert_comment,json,false,true);
          insertNode.append(insert_comment);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log('ajax Err code:'+XMLHttpRequest.status+' '+XMLHttpRequest.readyState+' '+textStatus);
      }
  });
}

function replyToComment(json,insert_comment,insertNode){
  console.log('reply to comment',json);
  $.ajax({
      url: REPLY_COMMENT_URL,
      type: 'POST',
      data:{comment_id:json.id,content:json.content},
      xhrFields: {
          withCredentials: true
      },
      dataType:'JSON',
      success: function(data){
          console.log('reply to comment ajax get data:',data);//
          json.reply_id = data.insertId;
          createComment_reply(insert_comment,json);
          insertNode.append(insert_comment);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log('ajax Err code:'+XMLHttpRequest.status+' '+XMLHttpRequest.readyState+' '+textStatus);
      }
  });
}

function replyToReply(json,insert_comment,insertNode){
  console.log('reply to reply',json);
  $.ajax({
      url: COMMENT_POST_URL,
      type: 'POST',
      data:{comment_id:json.id,content:json.content},
      xhrFields: {
          withCredentials: true
      },
      dataType:'JSON',
      success: function(data){
          console.log('reply to reply ajax get data:',data);
          json.reply_id = data.insertId;
          createComment_reply(insert_comment,json);
          insertNode.append(insert_comment);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log('ajax Err code:'+XMLHttpRequest.status+' '+XMLHttpRequest.readyState+' '+textStatus);
      }
  });
}

function submit_post_share(obj){
	  var json = {};
	  var node = obj.parentNode.previousSibling.previousSibling;
	  var content = node.firstChild.nextSibling.innerText;	  
	  var a = node.firstChild.nextSibling.getElementsByTagName("a");
	  if(a.length>0){ //有没有标签
		  var tags = node.firstChild.nextSibling.childNodes;
		  var tags_content = tags[1].innerHTML;
		  json.tag = tags_content.substring(1,tags_content.length);
		  json.href = tags[1].href;
		  //json.id = ;
		  json.text = 'From ' + node.firstChild.firstChild.innerHTML + ' : ' + content.substring(0,content.indexOf(tags_content)) ;
	  }else{
		  json.tag = '';
		  json.href = 'https://';
		  json.text = 'From ' + node.firstChild.firstChild.innerHTML + ' : ' + content;
	  }	  
	  if(node.parentNode.firstChild.nodeName == 'DIV'){ //有没有图片
		  json.img = '';
	  }else{
		  json.img = node.previousSibling.src;
	  }	  
	  json.nickname = user.nickname;
	  $.ajax({//向服务器提交数据
	    url:SEND_POST_URL,
	    type:'post',
	    data:{content:json.text,tag:json.tag,href:json.href,img:json.img},  //这里我已经装进json里了  直接用就行 然后你返回给我的data里放上post的id
	    dataType:"json",
	    xhrFields: {
	        withCredentials: true
	    },
	    success:function(data) {
	      if(data.msg=='OK') {
	    	  console.log('haha');
	          json.id = data.insertId;
	          var root = document.getElementsByClassName('card-columns');
	          var card = document.createElement("div");
	          card.setAttribute('class',card_class[0]);
	          //加载post信息
	          card.appendChild(createPost_img(img_class[0],json.img));
	          var card_body = document.createElement("div");
	          card_body.setAttribute('class',card_class[1]);
	          createPost_body(card_body,json);//TODO:
	          card.appendChild(card_body);
	          createPost_line(card);
	          //加载主功能栏
	          createPost_mainMenu(card);
	          createPost_line(card);
	          var card_comment = document.createElement('div');
	          card_comment.setAttribute('class',card_class[5]);
	          card.appendChild(card_comment);
	          ceratePost_footer(card,getNowDate());
	          root[0].insertBefore(card,root[0].firstChild);
	          $('.collapse').on('hidden.bs.collapse', function () {
	              $(this).children('textarea').val('');//清空
	          })
	          submit_cancel();
	      }
	    },
	    error:function(XMLHttpRequest, textStatus, errorThrown) {
	        console.log('send posts err');
	    }
	  });
	}
