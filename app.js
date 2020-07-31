const express = require("express");
const fs = require("fs")
const app = express();
const execa = require("execa");
let yt_dl;
var archiver = require('archiver');
app.all('/start/:id',async (req,res)=>{

var output = fs.createWriteStream(__dirname + '/example.zip');
var archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
});

const test = fs.createWriteStream('stdout.txt')
test.once('close',()=>{

console.log("stdout.txt closed")
  archive.pipe(output);
  archive.directory('mp3/', 'new-subdir');
archive.finalize();
})
archive.on('error', function(err) {
  throw err;
});
output.once('close', function() {
    res.download(__dirname + '/example.zip',(err)=>{console.log(err);});
    
console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
  });

  output.on('end', function() {
    console.log('Data has been drained');
  });
    try{
        yt_dl= execa('youtube-dl',["-x","--no-progress","-o","./mp3/%(title)s.%(ext)s","--no-warnings", "--audio-format","mp3",`https://www.youtube.com/watch?v=0pwttmAYCTw`])
      //  youtube-dl -x -o './mp3/%(title)s.%(ext)s' --no-warnings --audio-format mp3 https://www.youtube.com/playlist?list=PLETIo5u_JSiOrahkO8xY5tvzh8O4PLJA1
        yt_dl.stdout.pipe(test);
        console.log('=================> im here <==============');

   //     res.status(200).send("Started");
    }catch(ex){
        console.log(ex);
        res.status(400).json(ex.message);
    }
});

app.all('/end',async (req,res)=>{
    try{
        console.log("in END ==>",yt_dl);
        yt_dl.kill('SIGTERM', {
            forceKillAfterTimeout: 1000
        });
         res.status(200).send("END");
    }catch(ex){
        console.log(ex);
        res.status(400).json(ex.message);
    }
});
app.listen("9988",()=>{
    console.log("running on 9988 🚀")
})
