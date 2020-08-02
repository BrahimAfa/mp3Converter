const express = require("express");
const execa = require("execa");
const fs = require("fs")
const archiver = require('archiver');

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
    output.on('close', async () => {
        // when the archive finish zipping the folder
        // send the file to the client to download it 
        await execa('rm', ['-rf','./mp3']);
        console.log('archiver has been finalized and the output file descriptor has closed.');
        res.redirect('/download?type=video');
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
    output.on('close', async ()=> {
        // when the archive finish zipping the folder
        // send the file to the client to download it 
        await execa('rm', ['-rf','./mp3']);
        console.log('archiver has been finalized and the output file descriptor has closed.');
        res.redirect('/download?type=playlist');
    });

    const start = req.query.start;
    let startPlaylistAt = [];
    if (start) startPlaylistAt = ["--playlist-start",start]
    try{
        yt_dl= execa('youtube-dl',[...startPlaylistAt, "-x","--no-progress","-o","./mp3/%(title)s.%(ext)s","--no-warnings", "--audio-format","mp3",`https://www.youtube.com/playlist?list=${req.params.id}`])
      //  youtube-dl -x -o './mp3/%(title)s.%(ext)s' --no-warnings --audio-format mp3 https://www.youtube.com/playlist?list=PLETIo5u_JSiOrahkO8xY5tvzh8O4PLJA1
        yt_dl.stdout.pipe(stdoutFile);
        console.log('=================> im here playlist : '+req.params.id+' <==============');
    }catch(ex){
        console.log(ex);
        res.status(400).json(ex.message);
    }
});

app.all('/download',async (req,res)=>{
    res.on('finish',async ()=>{
        console.log("finished download request.......")
    }).on('close',()=>{ 
        console.log('closed Download Request...')
    })
    console.log("download query params",req.query)
    try{
        if(req.query.type==='video'){
            fs.readdir('./mp3',(err,files)=>{
                if(files[0].endsWith('mp3')){
                    res.download(`${__dirname}/mp3/${files[0]}`,(err)=>{console.log("download express ERROR : ",err)});
                }
            })
        }else{
            res.download(`${__dirname}/myMusic.zip`,(err)=>{console.log("download express ERROR : ",err)});
        }
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
