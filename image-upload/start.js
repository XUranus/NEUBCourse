const port = 8000;

const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const pathObj = require('path');
const multer = require('multer')

const upload = multer({dest:'./uploads/'})
var server = express();

server.use(bodyParser.json({limit: '1mb'}));
server.use(bodyParser.urlencoded({limit: '1mb', extended: true}));

server.post('/upload',upload.single('img'),(req,res)=>{
    if(!req.file) { //没有文件
        res.json({msg:'没有选择文件！',success:false}).end();
    } else {
        var file = req.file;
        console.log('====================================================');
        console.log('fieldname: ' + file.fieldname);
        console.log('originalname: ' + file.originalname);
        console.log('encoding: ' + file.encoding);
        console.log('mimetype: ' + file.mimetype);
        console.log('size: ' + (file.size / 1024).toFixed(2) + 'KB');
        console.log('destination: ' + file.destination);
        console.log('filename: ' + file.filename);
        console.log('path: ' + file.path);

        var fileObj = pathObj.parse(file.originalname);
        newPath = file.path + fileObj.ext;
        oldPath = file.path;

        fs.rename(oldPath,newPath,(err)=>{
            if(err) {
                console.log(err);
                res.json({success:false,msg:'internal error'}).end();
            } else {
                res.json({
                    success:true,
                    url:file.filename + fileObj.ext
                }).end();
            }
        })
    }
});

server.use('/uploads', express.static(__dirname + '/uploads'));
server.use('/', express.static(__dirname + '/build'));


server.listen(port);
console.log('Server Starting...port:',port);