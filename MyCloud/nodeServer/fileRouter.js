const express = require('express');
const querystring = require('querystring');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const multer = require('multer')({dest:'wxx_uploads/'});//设置存储的位置
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const pathObj = require('path');
const fs = require('fs');
const crypto = require('crypto');
const conn = require('./mysqlConnectionConfig')();

module.exports = function() {
  var fileRouter = express.Router();
  fileRouter.use(multer.single('file-upload'));

  fileRouter.use('/',(req,res,next)=>{
    //统一的身份认证
    if(req.session['user_id']==null) {//没有登陆 返回错误码
      res.status(200).json({msg:'NOT LOGGED'}).end();
      console.log('request url: ',req.originalUrl)
      console.log('access file router not allowed')
    }
    else next();
  });

  fileRouter.use('/dir',(req,res)=>{//返回某个目录的文件 没有被删除的
    console.log(req.body);
    var dir = req.body.dir;//更换目录
    console.log('request switch to dir: ',dir);
    req.session['current_path'] = dir;
    //文件  文件夹
    var sql1 = 'select * from file where path = "'+dir+'" and (not in_dustbin) and uploader_id = '+ req.session['user_id'];//并且没有被删除！！！！
    var sql2 = 'select * from folder where path = "'+dir+'" and (not in_dustbin) and uploader_id = '+ req.session['user_id'];
    var fileArr = []; var folderArr = [];
    conn.query(sql1,(err,data)=>{
      if(err) console.log('query sql err when request dir: ',err)
      else {
        fileArr = data;
        //console.log('files arr: ',data);
        //第一次查询成功
        conn.query(sql2,(err,data)=>{
          if(err) console.log('query sql err when request dir: ',err)
          else {
            folderArr = data;
            //console.log('folder arr: ',data);
            //第二次查询成功
            var resData = {msg:'OK',fileArr:fileArr,folderArr:folderArr};
            res.json(resData).end();
            //console.log('sent: ',resData);
          }
        });
      }
    });
  });

  fileRouter.use('/catagory',(req,res)=>{//返回某个类型的文件集合
    var catagory = req.body.catagory;
    console.log('request catagory = ',catagory);
    var sql = 'select * from file where catagory = "'+ catagory + '" and  (not in_dustbin) and uploader_id = '+ req.session['user_id'];
    conn.query(sql,(err,data)=>{
      if(err) console.log('query sql err when request catagory',err)
      else {
        console.log('send files arr: ',data);
        res.json({msg:'OK',fileArr:data}).end();
      }
    });
  });

  fileRouter.use('/dustbin',(req,res)=>{//返回某个类型的文件集合 只返回文件 不能对其操作
    var catagory = req.body.catagory;
    var sql = 'select * from file where in_dustbin and uploader_id = '+ req.session['user_id'];
    conn.query(sql,(err,data)=>{
      if(err) console.
        log('query sql err when request dustbin: ',err)
      else {
        console.log('send dustbin arr: ',data);
        res.json({msg:'OK',fileArr:data}).end();
      }
    });
  });

  fileRouter.post('/upload', (req, res) => {//上传文件
   // 没有附带文件
    if (!req.file) {
      res.json({msg:'NO FILE SELECTED'}).end();
      return;
    }
    // 输出文件信息
    console.log('====================================================');
    console.log('fieldname: ' + req.file.fieldname);
    console.log('originalname: ' + req.file.originalname);
    console.log('encoding: ' + req.file.encoding);
    console.log('mimetype: ' + req.file.mimetype);
    console.log('size: ' + (req.file.size / 1024).toFixed(2) + 'KB');
    console.log('destination: ' + req.file.destination);
    console.log('filename: ' + req.file.filename);
    console.log('path: ' + req.file.path);
    res.json({msg:'OK'}).end();
    //存储文件
    var fileObj = pathObj.parse(req.file.originalname);
    let oldPath = req.file.path;
    let newPath = 'C:\\Users\\王星校\\Desktop\\Apache24\\htdocs\\MyCloudUploads\\'+req.file.filename+fileObj.ext; //
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
       console.log(err);
      } else {
       console.log('save file success',__dirname + '\\uploads\\' + req.file.filename+fileObj.ext);
      }
    });
    //建立数据库键值
    var file_size = (req.file.size / 1024).toFixed(2);
    var path = req.session['current_path'];
    var actual_path = '/MyCloudUploads/'+req.file.filename+fileObj.ext;
    var file_catagory = getCatagory(fileObj.ext);
    //var file_token = getToken(req.file.filename);
    console.log('sql store as: ' + path+'/'+req.file.originalname);
    var sql = 'insert into file (name,path,actual_path,size,format,catagory,uploader_id) values '+
    '("'+fileObj.name+'","'+path+'","'+ actual_path +'","'+file_size+'","'+(fileObj.ext).toLowerCase()+'","'+file_catagory+'","'+ req.session['user_id'] +'")';
    conn.query(sql,(err,data)=>{
      if(err) console.log('query sql err when upload: ',err);
    });
  });

  fileRouter.use('/createFolder',(req,res)=>{//创建文件夹
    //检测文件夹是否合法 为空 或者非法字符
    var folderName = req.body.folderName;
    if(folderName==''){
      res.json({msg:'FOLDER NAME CANNOT BE EMPTY'}).end();
      return;
    }
    var currentPath = req.body.currentPath;
    var path = currentPath;
    console.log('createFolder request: ',currentPath+' -> '+currentPath+'/'+folderName);
    var sql = 'insert into folder (name,path,uploader_id) values ('+
      '"'+folderName+'","'+path+'",'+req.session['user_id']+')';
    conn.query(sql,(err,data)=>{
      if(err) console.log('query sql err when createFolder: ',err);
      else res.json({msg:'OK'}).end();
    });
  });

  fileRouter.use('/currentPath',(req,res)=>{//根据session验证当前文件夹目录 用于登陆初始化
    var currentPath = req.session['current_path'];
    console.log('sync currentPath request get...');
    res.json({path:currentPath}).end();
    console.log('return path: ',currentPath);
  });

  fileRouter.use('/deleteFile',(req,res)=>{//文件移到垃圾箱
    var file_id = req.body.fileId;
    console.log('remove file to dustbin request: ','fileId = ',file_id);
    conn.query('update file set in_dustbin = true where id = '+ file_id +' and uploader_id = '+ req.session['user_id'],(err,data)=>{//放进回收站
      if(err) {
        res.json({msg:'ERROR'}).end();
        console.log('query sql err when remove file to dustbin: ',err);
      }
      else {
        res.json({msg:'OK'}).end();
      }
    })
  });

  fileRouter.use('/deleteFolder',(req,res)=>{//文件夹移到垃圾箱 注意删除所有目录下文件
    var folder_id = req.body.folderId;
    console.log('remove folder to dustbin request:   folder_id = '+ folder_id);
    conn.query('select * from folder where id = '+folder_id,(err,data)=>{
      if(err)
        console.log('query sql err when getFolderById:', err);
      else {
        var folder = data[0];//要删除的文件夹元组
        var path = folder.path+'/'+folder.name;
        var sql = 'update folder set in_dustbin = true where path like "'+ path +'%" and uploader_id = '+ req.session['user_id']+';';
        sql +=  'update file set in_dustbin = true where path like "'+ path +'%" and uploader_id = '+ req.session['user_id']+';';
        sql += 'update folder set in_dustbin = true where id = '+ folder.id+' and uploader_id = '+ req.session['user_id']+';';
        conn.query(sql,(err,data)=>{
          if(err)
            console.log('query sql err when remove folder to dustbin: ',err);
          else {
            res.json({msg:'OK'});
            console.log('remove folder to dustbin success');
          }
        });
      }
    });
  });

  fileRouter.use('/reNameFile',(req,res)=>{//重命名文件
    var file_id = req.body.fileId;
    var filename = req.body.filename;
    console.log('rename file request: fileId = '+file_id+'  new filename = '+filename);
    conn.query('update from file set name = "'+ filename +'" where uploader_id = '+ req.session['user_id'],(err,data)=>{
      if(err) {
        res.json({msg:'ERROR'}).end();
        console.log('query sql err when rename file: ',err);
      }
      else {
        res.json({msg:'OK'}).end();
        console.log('change file name success: ->',filename);
      }
    });
  });

  fileRouter.use('/reNameFolder',(req,res)=>{//重命名文件夹 注意要修改目录下所有的文件path
    console.log('rename folder request: folder_id = '+folder_id+'   new folder name = ' + newName);
    var folder_id = req.body.folderId;
    var newName = req.body.newName;//新名称
    conn.query('select * from folder where id = '+folderId,(err,data)=>{
      if(err)
        console.log('query sql err when getFolderById:', err);
      else {
        var folder = data[0];
        var new_path = folder.path + '/' + newName;
        var old_path = folder.path + '/' +folder.name;
        conn.query('update file set path = "'+ new_path +'" where path = "'+ old_path +'" and uploader_id = '+ req.session['user_id'] ,(err,data)=>{
          if(err) {
            console.log('query sql err when reNameFolder’s sub file path : ',err);
            res.json({msg:'rename Folder Err'});
          }
          else {
            conn.query('update folder set path = "'+ new_path +'" where path = "'+ old_path +'" and uploader_id = '+ req.session['user_id'] ,(err,data)=>{
              if(err) {
                console.log('query sql err when reNameFolder’s sub folderr path : ',err);
                res.json({msg:'rename Folder Err'});
              }
              else {
                  console.log('rename folder sub file’s path success...');
                  conn.query('update folder set name = "'+ newName +'" where id = '+ folder_id +' and uploader_id = '+ req.session['user_id'],(err,data)=>{
                    if(err) {
                      console.log('query sql err when rename folder: ',err);
                      res.json({msg:'Rename folder Err'});
                    }
                    else {
                      console.log('rename folder success: ->',newName);
                      res.json({msg:'OK'});
                    }
                  });
                }
             });
          };
        });
      }
    });
  });

  fileRouter.use('/permanentDeleteFile',(req,res)=>{//永久删除文件 (还没有删除实体！！！)
    var file_id = req.body.id;
    console.log('permanent delete file request: ','fileId = ',file_id);
    conn.query('delete from file where id = '+ file_id +' and uploader_id = '+ req.session['user_id'],(err,data)=>{//放进回收站
      if(err) {
        res.json({msg:'ERROR'}).end();
        console.log('query sql err when permanent delete file: ',err);
      }
      else {
        res.json({msg:'OK'}).end();
      }
    })
  });

  fileRouter.use('/permanentDeleteFolder',(req,res)=>{//永久删除文件基本
    console.log('permanent delete folder request');
    res.json({msg:'not support'}).end();
  });

  fileRouter.use('/recoverFile',(req,res)=>{
    var file_id = req.body.id;
    console.log('recover file request: ','fileId = ',file_id);
    conn.query('update file set in_dustbin = false where id = '+ file_id +' and uploader_id = '+ req.session['user_id'],(err,data)=>{//放进回收站
      if(err) {
        res.json({msg:'ERROR'}).end();
        console.log('query sql err when recover file: ',err);
      }
      else {
        res.json({msg:'OK'}).end();
      }
    })
  });

  fileRouter.use('/recoverFolder',(req,res)=>{
    console.log('recover folder request');
    res.json({msg:'not support'}).end();
  });

  fileRouter.use('/searchFile',(req,res)=>{//search
    var name = req.body.input;
    console.log('request search disk ',);
    var sql = 'select * from file where name like "%'+ name +'%" and  (not in_dustbin) and uploader_id = '+ req.session['user_id'];
    conn.query(sql,(err,data)=>{
      if(err) console.log('query sql err when request search disk',err)
      else {
        console.log('send files arr: ',data);
        res.json({msg:'OK',fileArr:data}).end();
      }
    });
  });

  return fileRouter;
};




function getCatagory(suffix) {//获取文件类型
  suffix = suffix.toLowerCase();
  var imageArr = ['.gif','.jpg','.bmp','.jpeg','.ico','.png','.svg'];
  var audioArr = ['.mp3','.wmv'];
  var videoArr = ['.avi','.mp4','.rmvb'];
  var docArr = ['.pdf','.txt','','.doc','.docx','.xls','.xlsx','.ppt','.pptx','.md']
  for(i =0;i<imageArr.length;i++) if(imageArr[i]==suffix) return 'image';
  for(i =0;i<audioArr.length;i++) if(audioArr[i]==suffix) return 'audio';
  for(i =0;i<videoArr.length;i++) if(videoArr[i]==suffix) return 'video';
  for(i =0;i<docArr.length;i++) if(docArr[i]==suffix) return 'document';
  return 'unknown';
}

function getToken(str) {//文件特征码
  var res = getHexMd5(str);
  while(isTokenUsed(res)) {
    res = getHexMd5(res);
  }
  return res;

  function isTokenUsed(token_str) {
    conn.query('select * from file where token = "'+token_str+'"',(err,data)=>{
      if(data[0]==null)  return false;
      else return true;
    });
  }

  function getHexMd5(str) {
    var obj = crypto.createHash('md5');
    obj.update(str);
    return obj.digest('hex');//十六进制表示的字符串
  }
}

function removeFileFromDisk(fileId) {//删除文件硬盘实例
  //
  console.log('ready to delete file form dick - id: '+ fileId);
  console.log('not finish yet');
}
