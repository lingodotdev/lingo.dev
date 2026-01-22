import fs from "fs";
import path from "path";
import express from "express"; 
import dotenv from 'dotenv';


dotenv.config(); 
const app = express(); 
app.use(express.json()); 
const PORT = process.env.PORT; 


const I18N_PATH = path.join(process.cwd(), "i18n", "en.json"); 


app.post("/content", async (req,res)=>{
    try {
    const content = req.body; 
    

    if(typeof content !== 'object') {
        return res.status(400).json({
            error: "Invaild Content"
        }); 
    }

    fs.writeFileSync(
        I18N_PATH,
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




app.get("/content-translate",async (req,res)=>{

    //Read file synchronously
    const data = fs.readFileSync(I18N_PATH, "utf-8"); 

    //Parse JSON if needed 
    const content = JSON.parse(data); 

    res.json({
        content
    })

   

})






app.listen(PORT, ()=>{
    console.log(`{Server Started at Port: ${PORT}`)
})
