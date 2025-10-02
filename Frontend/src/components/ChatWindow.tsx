import '../styles/ChatWindow.css'
import Chat from './Chat'
import { useState } from 'react'
import { Send } from 'lucide-react'
import HandleSubmit from '../functionalities/HandleSubmit.ts'
import HandleOutput from '../functionalities/HandleOutput.ts'
import GenerateImg from '../functionalities/GenerateImg.ts'
import HandleGoogleSearch from '../functionalities/HandleGoogleSearch.ts'
// import saveToDB from '../functionalities/saveToDB.ts'
import LogoutButton from './Logout.tsx'

function ChatWindow({setIsAuthenticated}) {
    const [userPrompt, setuserPrompt] = useState<string[]>([]);
    const [chatsummary, setchatsummary] = useState<string[]>([]);
    const [chats, setchats] = useState<any[]>([])
    const [currPrompt, setcurrPrompt] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const userEmail = localStorage.getItem("email") || ""
    
    const handleSubmitClick = async () => {
        if (!currPrompt.trim() || isLoading) return;
        
        setIsLoading(true);
        setuserPrompt(prev => [...prev, currPrompt]);
        setcurrPrompt("");

        try {

            const lastChats = chatsummary.slice(-15);
            const lastPrompts = userPrompt.slice(-15);

            let context = lastChats.map((value, index) => {
                return "Ques: " + lastPrompts[index] + " Your Answer: " + value;
            }).join("\n");

            context += "\nCurrent Question: " + currPrompt;

            const response = await HandleSubmit(context);
            
            setchatsummary(prev=> [...prev,response.summary])
            let output:any = null
            if (response.llmanswerableprompt === true) {
                output = response.llmanswer
                setchats(prev => [...prev, response.llmanswer]);
            }
            else if (response.imagegen === true) {
                output = await GenerateImg(response.imgprompt);
                setchats(prev => [...prev, output]);
            }
            else if (response.deviceaccessprompt === true) {
                // Handle device access through HandleOutput
                output = await HandleOutput(response);
                setchats(prev => [...prev, output]);
            }
            else if(response.googlesearch === true) {
                output = await HandleGoogleSearch(response.searchstring)
                output = await HandleSubmit("Summarize the output : "+output)
                setchatsummary(prev=> [...prev,response.summary])
                setchats(prev => [...prev,output.llmanswer])
            }
            else {    
                const output = await HandleOutput(response);
                setchats(prev => [...prev, output]);
            }

            // const dbresult = await saveToDB({prompt:promptToSave,response:output,email:userEmail})
            // if(dbresult.success === false) {
            //     alert("Database problem occured, Failed to save previous chat !")
            //     throw new Error(`Database Error occured ${dbresult.reply}`)
            // } 
        } catch (error:any) {
            alert(`Error occured , ${error.message}`)
            setchats(prev => [...prev, "Sorry, something went wrong. Please try again."]);
        } finally {
            setIsLoading(false);
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmitClick();
        }
    }
    
    return (
        <div className='chatwindow'>
            <div className='navbar'>
                <div className="navbar-title">
                    <span>QueryAI</span>
                </div>
                <LogoutButton email={userEmail} setIsAuthenticated={setIsAuthenticated}/>
            </div>
            
            <Chat chats={chats} userPrompt={userPrompt} isLoading={isLoading} />
            
            <div className='chatInput'>
                <div className="inputbox">
                    <input 
                        placeholder='Ask anything...' 
                        value={currPrompt} 
                        onChange={(e) => setcurrPrompt(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                    />
                    <button 
                        className={`submit-btn ${isLoading ? 'loading' : ''}`}
                        onClick={handleSubmitClick}
                        disabled={isLoading}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatWindow
