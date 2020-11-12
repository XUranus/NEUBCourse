/*
create database MyCloud;

use MyCloud;

create table user (
id int not null AUTO_INCREMENT,
password varchar(50) not null,
mail varchar(50) not null,
nickname varchar(50) not null,
credit integer not null,
used json default null,
capacity int not null,
status varchar(20) not null,
avatar_path varchar(50) default null,
self_intruction varchar(100) default null,
tag varchar(50) default null,
qq varchar(20) default null,
tel varchar(20) default null,
age integer default null,
gender varchar(10) default null,
time timestamp,
UNIQUE(mail),
PRIMARY KEY (id)
);


create table file (
id int not null AUTO_INCREMENT,
name varchar(50) not null,
path varchar(100) not null,
actual_path varchar(100) not null,
size integer not null,
format varchar(50) not null,
catagory varchar(50) not null,
uploader_id int not null,
is_shared bool default false,
in_dustbin bool default false,
time timestamp,
PRIMARY KEY (id)
);



create table folder(
id int not null AUTO_INCREMENT,
name varchar(50) not null,
path varchar(50) not null,
uploader_id int not null,
in_dustbin bool default false,
time timestamp,
PRIMARY KEY (id)
);


create table share(
id int not null AUTO_INCREMENT,
file_id int not null,
token varchar(100) not null,
description varchar(100) default null,
time timestamp,
UNIQUE(file_id),
PRIMARY KEY (id)
);

create table notification(
id int not null AUTO_INCREMENT,
sender_id int not null,
receiver_id int not null,
content json not null,
readed bool default false,
time timestamp,
PRIMARY KEY (id)
);

create table message(
id int not null AUTO_INCREMENT,
sender_id int not null,
receiver_id int not null,
content json not null,
readed bool default false,
time timestamp,
PRIMARY KEY (id)
);


create table post (
id int not null AUTO_INCREMENT,
poster_id int not null,
text text not null,
tag varchar(50) default null,
href varchar(100) default null,
img varchar(100) default null,
time timestamp,
PRIMARY KEY (id)
);

create table comment(
id int not null AUTO_INCREMENT,
commenter_id int not null,
post_id int not null,
content text not null,
time timestamp,
PRIMARY KEY (id)
);


create table friendship (
user_id int not null,
friend_id int not null,
time timestamp
);

create table chatMessage (
sender_id int not null,
receiver_id int not null,
message text not null,
time timestamp
);

create table account_token (
id int not null AUTO_INCREMENT,
user_id int not null,
token varchar(100) not null,
time timestamp,
UNIQUE(token),
PRIMARY KEY (id)
);


create table reply (
id int not null AUTO_INCREMENT,
replyer_id int not null,
comment_id int not null,
content text not null,
time timestamp,
PRIMARY KEY (id)
);

create table likes (
id int not null AUTO_INCREMENT,
like_type varchar(20) not null,
to_id int not null,
user_id int not null,
PRIMARY KEY (id)
);

*/

var sql = "create database MyCloudxx;use MyCloud;create table user (id int not null AUTO_INCREMENT,password varchar(50) not null,mail varchar(50) not null,nickname varchar(50) not null,credit integer not null,used json default null,capacity int not null,status varchar(20) not null,avatar_path varchar(50) default null,self_intruction varchar(100) default null,tag varchar(50) default null,qq varchar(20) default null,tel varchar(20) default null,age integer default null,gender varchar(10) default null,time timestamp,UNIQUE(mail),PRIMARY KEY (id))"+
"create table file (id int not null AUTO_INCREMENT,name varchar(50) not null,path varchar(100) not null,actual_path varchar(100) not null,size integer not null,format varchar(50) not null,catagory varchar(50) not null,uploader_id int not null,is_shared bool default false,in_dustbin bool default false,token varchar(50) not null,UNIQUE(token),time timestamp,PRIMARY KEY (id));"+
"create table folder(id int not null AUTO_INCREMENT,name varchar(50) not null,path varchar(50) not null,uploader_id int not null,in_dustbin bool default false,time timestamp,PRIMARY KEY (id));"


const mysql = require('mysql');
//need to be configured
const conn = mysql.createPool({host:'localhost',user:'root',password:'password',database:'MyCloud',multipleStatements:true});
conn.query(sql,(err,data)=>{});