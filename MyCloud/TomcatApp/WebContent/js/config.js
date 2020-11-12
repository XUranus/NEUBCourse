var FILE_SERVER_ROOT = "http://localhost";
var NODE_SERVER_ROOT = "http://localhost:8081";
var JSP_SERVER_ROOT = "http://localhost:8080/MyCloud";
var AVATAR_API_URL = "https://sm.ms/api/upload";

//file stores as FILE_SERVER_ROOT/MyCloudUploads
/*
var DOMAIN_IP = "192.168.137.1";
var FILE_SERVER_ROOT = "http://"+DOMAIN_IP;
var NODE_SERVER_ROOT = "http://"+ DOMAIN_IP + ":8081";
var JSP_SERVER_ROOT = "http://"+ DOMAIN_IP +":8080/MyCloud";
*/
//my-disk.js
var FILE_UPLOAD_URL = NODE_SERVER_ROOT + "/file/upload";
var CREATE_FOLDER_URL = NODE_SERVER_ROOT + "/file/createFolder";
var SYNC_PATH_URL = NODE_SERVER_ROOT + "/file/currentPath";
var LOAD_FILES_URL = NODE_SERVER_ROOT + "/file/dir";
var DELETE_FILE_URL = NODE_SERVER_ROOT + "/file/deleteFile";
var DELETE_FOLDER_URL = NODE_SERVER_ROOT + "/file/deleteFolder";
var PERMENENTLY_DELETE_FILE_URL = NODE_SERVER_ROOT + '/file/permanentDeleteFile';
var PERMENENTLY_DELETE_FOLDER_URL = NODE_SERVER_ROOT + '/file/permanentDeleteFolder';
var RECOVER_FILE_URL = NODE_SERVER_ROOT + '/file/recoverFile';
var RECOVER_FOLDER_URL = NODE_SERVER_ROOT + '/file/recoverFolder';

//loginPage.js
var LOGIN_URL = JSP_SERVER_ROOT + "/login.html";
var NODE_LOGIN_URL = NODE_SERVER_ROOT + '/user/login';

//dustbin.js
var GET_DUSTBIN_URL = NODE_SERVER_ROOT + "/file/dustbin";

//registerDetailPage.js
var NODE_SAVE_USERINFO = NODE_SERVER_ROOT +'/user/saveInfo';
var DST_URL = JSP_SERVER_ROOT + '/disk.jsp';
var SAVE_AVATAR_URL = NODE_SERVER_ROOT + '/user/saveAvatarSrc';

//registerPage.js
var NODE_REGISTER_URL = NODE_SERVER_ROOT + '/user/register';

//self_info_manage.js
var capacity = 1024*1024;
var GET_USAGE_URL = NODE_SERVER_ROOT + '/user/getUsage';
var GET_MYINFO_URL = NODE_SERVER_ROOT + '/user/getMyInfo';

//catagory-*.js
var GET_CATAGORY_URL = NODE_SERVER_ROOT + '/file/catagory';

//friends.js
var GET_FRIEND_LIST_URL = NODE_SERVER_ROOT + '/friend/friendList';
var SEARCH_NEW_FRIEND_URL = NODE_SERVER_ROOT + '/friend/searchNewFriend';
var ADD_FRIEND_REQUEST_URL = NODE_SERVER_ROOT + '/friend/addFriend';
var DELETE_FRIEND_REQUEST = NODE_SERVER_ROOT + '/friend/deleteFriend';

var SEND_CHAT_MESSAGE_URL = NODE_SERVER_ROOT + '/chat/sendChatMessage';//
var LOAD_CHAT_HISTROY_URL = NODE_SERVER_ROOT + '/chat/loadChatHistory';

//dashboard goble url
var GET_NOTIFICATIONS_URL = NODE_SERVER_ROOT + '/notification/getNotifications';
var GET_MESSAGES_URL = NODE_SERVER_ROOT + '/notification/getMessages';
var ACCEPT_FRIEND_URL = NODE_SERVER_ROOT + '/friend/acceptFriend';
var DECLINE_FRIEND_URL = NODE_SERVER_ROOT + '/friend/declineFriend';
var CONFIRM_NOTIFICATION_URL = NODE_SERVER_ROOT + '/notification/confirmNotification';
var GET_CAPACITY_URL = NODE_SERVER_ROOT + '/user/getCapacity';
var GET_SHARE_TOKEN_URL = NODE_SERVER_ROOT + '/share/createShareToken';
var IS_FILE_SHARED_URL = NODE_SERVER_ROOT + '/share/isFileShared';

//sharelist.js
var GET_SHARE_LIST_URL = NODE_SERVER_ROOT + '/share/myShareList';
var CANVEL_SHARE_URL = NODE_SERVER_ROOT + '/share/cancelShare';

//posts.js
var SEND_POST_URL = NODE_SERVER_ROOT + '/post/newPost';
var DELETE_POST_URL = NODE_SERVER_ROOT + '/post/deletePost';
var GET_POSTS_URL = NODE_SERVER_ROOT + '/post/getPosts';
var COMMENT_POST_URL = NODE_SERVER_ROOT + '/post/commentToPost';
var REPLY_COMMENT_URL = NODE_SERVER_ROOT + '/post/replyToComment';
