const express = require("express");
const app = express();
const execa = require("execa");
const { stdout, stderr } = require("process");

var exec = require('child_process').exec

app.get('/:list',async (req,res)=>{
    try{
         // execa('youtube-dl',["-x", "--print-json" ,"--no-warnings", "--audio-format","mp3","https://www.youtube.com/playlist?list=PLETIo5u_JSiOrahkO8xY5tvzh8O4PLJA1","|","jq","-r",".title"])
         exec('youtube-dl -x --print-json --no-warnings --audio-format mp3 https://www.youtube.com/playlist?list=PLETIo5u_JSiOrahkO8xY5tvzh8O4PLJA1 | jq -r .title',(err,stdout,stderr)=>{
             if(err) return console.log(err.message);
             if(stderr) return console.error(stderr);
             console.log(stdout);
         })
         
         res.status(200).send("END");
    }catch(ex){
        console.log(ex);
        res.status(400).send(ex.message);
    }
});

app.listen("9988",()=>{
    console.log("running on 9988 🚀")
})