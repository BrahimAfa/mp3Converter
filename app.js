const express = require("express");
const app = express();
const execa = require("execa");

app.get('/:list',async (req,res)=>{
    try{
        const {stdout} = await execa('youtube-dl',["-x", "--print-json" ,"--no-warnings", "--audio-format mp3","https://www.youtube.com/watch?v=NjN4rOBZV2s"]);
        console.log(stdout);
        
    }catch(ex){
        console.log(ex);
    }
    res.status(200).json(stdout);
});

app.listen("9988",()=>{
    console.log("running on 9988 🚀")
})