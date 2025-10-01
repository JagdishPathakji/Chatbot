import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai"
const ai = new GoogleGenAI({apiKey: process.env.LLM_API});

const today = new Date();

// Get day, date, month, year
const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const dayOfWeek = days[today.getDay()]; // 0-6
const date = today.getDate(); // 1-31
const month = months[today.getMonth()]; // 0-11
const year = today.getFullYear();

const simpleDateString = `Today is ${dayOfWeek}, ${month} ${date}, ${year}`;

// For Formatting the LLM JSON output
function cleanLLMJson(text) {
    if (typeof text !== "string") {
        // already JSON object, just return it
        return text;
    }

    // Remove ```json or ``` at the start and ``` at the end
    return text
        .replace(/^```json\s*/i, '') // remove leading ```json
        .replace(/^```\s*/i, '')     // remove leading ``` (if no json)
        .replace(/\s*```$/, '');     // remove trailing ```
}

async function llm(prompt) {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-001',
            contents: prompt
        });
        return {"response":response.text,"success":true}
    }
    catch(error) {
        return {response:"LLM Error Occurred","success":false}
    }
}

export default async function handlechat(req,res) {
    const userQuestion = req.body.question;
    if (!userQuestion) {
        return res.status(400).send({ reply: "No question provided" });
    }

    try {
        let question = `You are a JSON generator for SigmaGPT. Always respond ONLY in valid JSON format. Never include explanations or extra text outside the JSON.
        Todays date: ${simpleDateString}
        JSON format:
        {
        "llmanswerableprompt": boolean,
        "llmanswer": string,
        "deviceaccessprompt": boolean,
        "devicecommands": string,
        "imagegen":boolean,
        "imgprompt":string,
        "googlesearch":boolean,
        "searchstring":string,
        "summary":string
        }

        Rules:

        1. Only one flag can be true at a time: llmanswerableprompt, deviceaccessprompt, imagegen, googlesearch. Others must be false/empty.

        2. LLM-answerable queries:
        - "llmanswerableprompt": true
        - "llmanswer": "<direct answer with sentences and/or code>"
        - All other fields false/empty.
        - If code is included, always wrap it in triple backticks with language specified. Use the string '\`\`\`' inside JSON instead of literal backticks to avoid breaking JS.

        3. Device command queries:
        - If the user wants to run a Windows command, set "deviceaccessprompt": true.
        - Put the exact Windows CMD command in "devicecommands".
        - Leave "llmanswer" empty.

        4. Image generation:
        - Set "imagegen": true and store prompt in "imgprompt".

       5. Google search:
        - If the user asks for factual info, latest news, or anything uncertain, set "googlesearch": true
        - Fill "searchstring" with the exact search query
        - Do not answer the query yourself
        - All other fields false/empty

        6. Always provide a summary in "summary" field.

        Constraints:
        - Keep unused fields false, empty string, or empty object.
        - Never output anything other than JSON.

        For any answer you give, it is being shown to the user so answer accordingly.
        USER QUERY: ${userQuestion}`;

                    
        let response = await llm(question)

        if (response.success === true) {
            const parsed = JSON.parse(cleanLLMJson(response.response))
            res.send({ reply: parsed })
        } else {
            res.status(500).send({ reply: response.response })
        }
    }
    catch(error) {
        res.send({"reply":error.message})
    }
}