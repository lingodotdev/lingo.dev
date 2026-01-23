import { exec } from "child_process";

export function runLingo() { 
    return new Promise((resolve, reject)=> {
        exec("npx lingo.dev@latest run", (error, stdout, stderr)=>{
            if(error) return reject(stderr); 
            resolve(stdout); 
        })
    })

}