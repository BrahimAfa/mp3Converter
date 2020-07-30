const express = require("express");
const app = express();
const execa = require("execa");

app.get('/:list',async (req,res)=>{
    try{
         execa('youtube-dl',["-x", "--print-json" ,"--no-warnings", "--audio-format","mp3","https://www.youtube.com/playlist?list=PLETIo5u_JSiOrahkO8xY5tvzh8O4PLJA1","|","jq","-r",".title"]).stdout.pipe(process.stdout);
         res.staus(200).send("END");
    }catch(ex){
        console.log(ex);
        res.staus(400).json(ex.message);
    }
});

app.listen("3030",()=>{
    console.log("running on 3030 🚀")
})