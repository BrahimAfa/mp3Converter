const express = require("express");
const app = express();
const execa = require("execa");

app.get('/:list',async (req,res)=>{
    try{
         await execa('youtube-dl',["-x", "-e" ,"-o","./mp3/%(title)s.%(ext)s","--no-warnings", "--audio-format","mp3","https://www.youtube.com/playlist?list=PLETIo5u_JSiOrahkO8xY5tvzh8O4PLJA1"]).stdout.pipe(process.stdout);
         res.status(200).send("END");
    }catch(ex){
        console.log(ex);
        res.status(400).json(ex.message);
    }
});

app.listen("9988",()=>{
    console.log("running on 9988 🚀")
})