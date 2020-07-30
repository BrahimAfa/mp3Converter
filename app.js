const express = require("express");
const app = express();
const execa = require("execa");

app.get('/:list',async (req,res)=>{
    try{
        const {stdout} = await execa('', [req.params.list]);
        console.log(stdout);
        
    }catch(ex){
        console.log(ex);
    }
    res.staus(200).json(stdout);
});

app.listen("3030",()=>{
    console.log("running on 3030 🚀")
})