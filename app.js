const express = require("express");
const app = express();
const execa = require("execa");
let yt_dl;
app.all('/start/:id',async (req,res)=>{
    try{
        yt_dl= execa('youtube-dl',["-x","-o","./mp3/%(title)s.%(ext)s","--no-warnings", "--audio-format","mp3",`https://www.youtube.com/playlist?list=${req.params.id}`])
        // youtube-dl -x -e -o './mp3/%(title)s.%(ext)s' --no-warnings --audio-format mp3 https://www.youtube.com/playlist?list=PLETIo5u_JSiOrahkO8xY5tvzh8O4PLJA1
        yt_dl.stdout.pipe(process.stdout);
         res.status(200).send("Started");
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