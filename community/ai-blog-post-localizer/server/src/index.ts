import fs from "fs";
import path from "path";
import express from "express"; 
import dotenv from 'dotenv';
import cors from "cors";
import { runLingo } from "./runLingo.js";
const app = express(); 


dotenv.config(); 
app.use(cors());    
app.use(express.json()); 
const PORT = process.env.PORT; 


const I18N_PATH_Source = path.join(process.cwd(), "i18n", "en.json");
const I18N_PATH_Target = path.join(process.cwd(), "i18n", "es.json"); 



app.post("/content", async (req,res)=>{
    try {

    const content = req.body; 
    if(typeof content !== 'object') {
        return res.status(400).json({
            error: "Invaild Content"
        }); 
    }

    fs.writeFileSync(
        I18N_PATH_Source,
        JSON.stringify(content, null, 2),
        "utf-8"
    )

        res.json({message: "en.json updated successfully"})
    } 

    catch(e) { 
        res.status(500).json({
            error: "Failed to write content"
        })
    }
})



app.get("/translate-content",async (req,res)=>{
    try {

    await runLingo(); 
    const data = fs.readFileSync(I18N_PATH_Target, "utf-8"); 
    const content = JSON.parse(data); 

    res.json({
        success : true,
        content
    })


    } catch(err) {
        res.json({
            error: String(err)
        })
    }


})

app.listen(PORT, ()=>{
    console.log(`{Server Started at Port: ${PORT}`)
})
