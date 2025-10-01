import {exec} from "child_process"

export default function Handledeviceaccess(req,res) {

    const result = req.body.response
    try {
        if(result.deviceaccessprompt === true) {
            const command = result.devicecommands; 
            exec(command, { shell: "cmd.exe" }, (error, stdout, stderr) => {
                let reply = "";

                if (error) {
                    reply += `Error: ${error.message}\n`;
                }

                if (stderr) {
                    reply += `Stderr: ${stderr}\n`;
                }

                if (stdout) {
                    reply += stdout;
                }

                if (!reply) {
                    reply = `Command executed: ${command}`;
                }

                res.send({ reply });
            });
        }
        else {
           res.send({"reply":result.answer || "Answer field is empty"})
        }
    }
    catch(error) {
        res.send({"reply":error.message})
    }
}