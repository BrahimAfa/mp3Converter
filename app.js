const express = require("express");
const execa = require("execa");
const fs = require("fs")
const archiver = require('archiver');
const { exec } = require("child_process");

const app = express();
let yt_dl;
const output = fs.createWriteStream(__dirname + '/myMusic.zip');
const stdoutFile = fs.createWriteStream('stdout.txt')
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
});

archive.on('error', function(err) {
    console.log("ARCHIVE ERROR",err);
    throw err;
  });

output.on('end', function() {
    console.log('Data has been drained');
  });


stdoutFile.on('close',()=>{
    // if the youtube-dl cli finshed writing to the stdout file 
    // then archive the result to a Zip file
    console.log("stdout.txt closed")
      archive.pipe(output);
      archive.directory('mp3/', 'mp3');
    archive.finalize();
})


app.get('/video/:id',async (req,res)=>{
    // this event is here cuz of the res paramtere (will passit to a function later)
    output.once('close', async () => {
        // when the archive finish zipping the folder
        // send the file to the client to download it 
        console.log('archiver has been finalized and the output file descriptor has closed.');
        await execa('rm', ['-rf','./mp3']);
        res.download(__dirname + '/myMusic.zip',(err)=>{console.log("download express ERROR : ",err)});
    });

    try{
        yt_dl= execa('youtube-dl', ["-x","--no-progress","-o","./mp3/%(title)s.%(ext)s","--no-warnings", "--audio-format","mp3",`https://www.youtube.com/watch?v=${req.params.id}`])
      //  youtube-dl -x -o './mp3/%(title)s.%(ext)s' --no-warnings --audio-format mp3 https://www.youtube.com/playlist?list=PLETIo5u_JSiOrahkO8xY5tvzh8O4PLJA1
        yt_dl.stdout.pipe(stdoutFile);
        console.log('=================> im here Video : '+req.params.id+' <==============');

   //     res.status(200).send("Started");
    }catch(ex){
        console.log(ex);
        res.status(400).json(ex.message);
    }
});

app.get('/playlist/:id',async (req,res)=>{
    output.once('close', async ()=> {
        // when the archive finish zipping the folder
        // send the file to the client to download it 
        await execa('rm', ['-rf','./mp3']);
        console.log('archiver has been finalized and the output file descriptor has closed.');
        res.download(__dirname + '/myMusic.zip',(err)=>{console.log("download express ERROR : ",err);});
    });

    const start = req.query.start;
    let startPlaylistAt = [];
    if (start) startPlaylistAt = ["--playlist-start",start]
    try{
        yt_dl= execa('youtube-dl',[...startPlaylistAt, "-x","--no-progress","-o","./mp3/%(title)s.%(ext)s","--no-warnings", "--audio-format","mp3",`https://www.youtube.com/playlist?list=${req.params.id}`])
      //  youtube-dl -x -o './mp3/%(title)s.%(ext)s' --no-warnings --audio-format mp3 https://www.youtube.com/playlist?list=PLETIo5u_JSiOrahkO8xY5tvzh8O4PLJA1
        yt_dl.stdout.pipe(test);
        console.log('=================> im here playlist : '+req.params.id+' <==============');
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
