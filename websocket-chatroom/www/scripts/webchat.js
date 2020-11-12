window.onload = function() {
    var webchat = new webChat();
    webchat.init();
};
var webChat = function() {
    this.socket = null;
};
webChat.prototype = {
    init: function() {
        var that = this;
        this.socket = io.connect();
        this.socket.on('connect', function() {
            document.getElementById('info').textContent = '输入你的昵称...';
            document.getElementById('nickWrapper').style.display = 'block';
            document.getElementById('nicknameInput').focus();
        });
        this.socket.on('nickExisted', function() {
            document.getElementById('info').textContent = '该昵称已经被使用！请重新输入';
        });
        this.socket.on('userList', function(users) {
            myName = document.getElementById('nicknameInput').value;
            all = document.createElement('a');
            all.setAttribute('class','dropdown-item');
            all.setAttribute('href','#');
            all.setAttribute('onclick', 'document.getElementById("talkTo").innerHTML=this.innerHTML;');
            all.innerHTML = '全部';
            divisor = document.createElement('a');
            divisor.setAttribute('class','dropdown-divider');
            divisor.setAttribute('role', 'separator');
            document.getElementById('menu').innerHTML = '';
            document.getElementById('menu').appendChild(all);
            document.getElementById('menu').appendChild(divisor);
            //
            for(i=0;i<users.length;i++) {
                if(users[i]!=document.getElementById('nicknameInput').value){
                    var newa = document.createElement("a");
                    newa.setAttribute('class','dropdown-item');
                    newa.setAttribute('href','#');
                    newa.setAttribute('onclick', 'document.getElementById("talkTo").innerHTML=this.innerHTML;');
                    newa.innerHTML = users[i];
                    document.getElementById('menu').appendChild(newa);
                }
            }
        });
        this.socket.on('loginSuccess', function() {
            document.title = 'WebChat | ' + document.getElementById('nicknameInput').value;
            document.getElementById('loginWrapper').style.display = 'none';
            document.getElementById('messageInput').focus();
        });
        this.socket.on('error', function(err) {
            if (document.getElementById('loginWrapper').style.display == 'none') {
                document.getElementById('status').textContent = '连接失败，嘤嘤嘤';
            } else {
                document.getElementById('info').textContent = '链接失败，嘤嘤嘤';
            }
        });
        this.socket.on('system', function(nickName, userCount, type) {
            var msg = nickName + (type == 'login' ? ' 进入了聊天室' : ' 离开了聊天室');
            that._displayNewMsg(' 系统消息 ', msg, 'red');
            document.getElementById('status').textContent = userCount +' 人' + '在线';
        });
        this.socket.on('newMsg', function(user, msg, color) {
            that._displayNewMsg('  '+user, msg, color);
        });
        this.socket.on('newImg', function(user, img, color) {
            that._displayImage(user, img, color);
        });
        document.getElementById('loginBtn').addEventListener('click', function() {
            var nickName = document.getElementById('nicknameInput').value;
            if (nickName.trim().length != 0) {
                that.socket.emit('login', nickName);
            } else {
                document.getElementById('nicknameInput').focus();
            };
        }, false);
        document.getElementById('nicknameInput').addEventListener('keyup', function(e) {
            if (e.keyCode == 13) {
                var nickName = document.getElementById('nicknameInput').value;
                if (nickName.trim().length != 0) {
                    that.socket.emit('login', nickName);
                };
            };
        }, false);
        document.getElementById('sendBtn').addEventListener('click', function() {
            var messageInput = document.getElementById('messageInput'),
                msg = messageInput.value,
                color = document.getElementById('colorStyle').value;
            messageInput.value = '';
            messageInput.focus();
            if (msg.trim().length != 0) {
                that.socket.emit('postMsg', msg, color);
                that._displayNewMsg('  我 ', msg, color);
                return;
            };
            if(document.getElementById('usersLive').innerHTML==''){
                that.socket.emit('showUsers')
            }
        }, false);
        document.getElementById('messageInput').addEventListener('keyup', function(e) {
            var messageInput = document.getElementById('messageInput'),
                msg = messageInput.value,
                color = document.getElementById('colorStyle').value;
            if (e.keyCode == 13 && msg.trim().length != 0) {
                messageInput.value = '';
                that.socket.emit('postMsg', msg, color);
                that._displayNewMsg('  我 ', msg, color);
            };
        }, false);
        document.getElementById('clearBtn').addEventListener('click', function() {
            document.getElementById('historyMsg').innerHTML = '';
        }, false);
        document.getElementById('sendImage').addEventListener('change', function() {
            if (this.files.length != 0) {
                var file = this.files[0],
                    reader = new FileReader(),
                    color = document.getElementById('colorStyle').value;
                if (!reader) {
                    that._displayNewMsg(' 系统消息 ', '你的浏览器不支持上传文件！', 'red');
                    this.value = '';
                    return;
                };
                reader.onload = function(e) {
                    this.value = '';
                    that.socket.emit('img', e.target.result, color);
                    that._displayImage('  我 ', e.target.result, color);
                };
                reader.readAsDataURL(file);
            };
        }, false);
        this._initialEmoji();
        document.getElementById('emoji').addEventListener('click', function(e) {
            var emojiwrapper = document.getElementById('emojiWrapper');
            emojiwrapper.style.display = 'block';
            e.stopPropagation();
        }, false);
        document.body.addEventListener('click', function(e) {
            var emojiwrapper = document.getElementById('emojiWrapper');
            if (e.target != emojiwrapper) {
                emojiwrapper.style.display = 'none';
            };
        });
        document.getElementById('emojiWrapper').addEventListener('click', function(e) {
            var target = e.target;
            if (target.nodeName.toLowerCase() == 'img') {
                var messageInput = document.getElementById('messageInput');
                messageInput.focus();
                messageInput.value = messageInput.value + '[emoji:' + target.title + ']';
            };
        }, false);
    },
    _initialEmoji: function() {
        var emojiContainer = document.getElementById('emojiWrapper'),
            docFragment = document.createDocumentFragment();
        for (var i = 27; i > 0; i--) {
            var emojiItem = document.createElement('img');
            emojiItem.src = '../content/emoji/' + i + '.gif';
            emojiItem.title = i;
            docFragment.appendChild(emojiItem);
        };
        emojiContainer.appendChild(docFragment);
    },
    _displayNewMsg: function(user, msg, color) {
        talkTo = document.getElementById('talkTo').innerHTML;
        if((talkTo!='全部')&&(('  '+talkTo)!=user)&&(user!='  我 ')){
           /* if(talkTo!=user) {
                alert(user+" is not "+talkTo);
            }*/
            return;
        }
        var container = document.getElementById('historyMsg'),
            msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0, 8),
            //determine whether the msg contains emoji
            msg = this._showEmoji(msg);
        msgToDisplay.style.color = color || '#000';
        
        if(user==('  我 ')) {
            msgToDisplay.style.float = 'right';
            msgToDisplay.innerHTML = '<span style="float:right">'+user + '<span class="timespan">(' + date + '): </span></span>&nbsp;&nbsp;<br>' +'<div class="test"><span class="bot"></span><span class="top"></span>'+msg+'</div>'+'<br>';
        }
        else if(user==(' 系统消息 ')) {
            msgToDisplay.align = 'center';
            msgToDisplay.innerHTML = '<span>'+user + '<span class="timespan">(' + date + '): </span></span>'+msg+'<br>';
        }
        else {
            msgToDisplay.innerHTML = '&nbsp;'+user + '<span class="timespan">(' + date + '): </span>' +'<div class="test"><span class="bot"></span><span class="top"></span>'+msg+'</div>'+'<br>';
        }
        
        container.appendChild(msgToDisplay);
        if(user==('  我 ')) {
            temp = document.createElement('p');
            temp.style.clear='both';
            container.appendChild(temp);
        }
        container.scrollTop = container.scrollHeight;
        
        var _lable = $("<div style='right:20px;top:0px;opacity:1;color:"+color+";'>"+user+":"+msg+"</div>");
        $(".mask").append(_lable.show());
        init_barrage();
        
    },
    _displayImage: function(user, imgData, color) {
        var container = document.getElementById('historyMsg'),
            msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0, 8);
        msgToDisplay.style.color = color || '#000';
        
        
        if(user==('  我 ')) {
            msgToDisplay.style.float = 'right';
             msgToDisplay.innerHTML = '<span style="float:right">'+user + '<span class="timespan">(' + date + '): </span></span> &nbsp;&nbsp;<br/>' + '<a href="' + imgData + '" target="_blank" style="float:right"><img src="' + imgData + '"/></a>';
        }
        else {
            msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span> <br/>' + '<a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a>';
        }
       
        container.appendChild(msgToDisplay);
        if(user==('  我 ')) {
            temp = document.createElement('p');
            temp.style.clear='both';
            container.appendChild(temp);
         }
        container.scrollTop = container.scrollHeight;
    },
    _showEmoji: function(msg) {
        var match, result = msg,
            reg = /\[emoji:\d+\]/g,
            emojiIndex,
            totalEmojiNum = document.getElementById('emojiWrapper').children.length;
        while (match = reg.exec(msg)) {
            emojiIndex = match[0].slice(7, -1);
            if (emojiIndex > totalEmojiNum) {
                result = result.replace(match[0], '[X]');
            } else {
                result = result.replace(match[0], '<img class="emoji" src="../content/emoji/' + emojiIndex + '.gif" />');//todo:fix this in chrome it will cause a new request for the image
            };
        };
        return result;
    }
};



