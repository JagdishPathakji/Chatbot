import '../styles/Sidebar.css'
import { SquarePen as PenSquare, MessageCircle } from 'lucide-react'

function Sidebar() {

    const email = localStorage.getItem("email")

    return (
        <section className='sidebar'>
            {/* new chat button */}
            <button className="new-chat-btn">
                <MessageCircle className='logo' size={24} />
                <span><PenSquare size={18} /></span>
            </button>

            {/* history */}
            <div className="history-section">
                <h3>Recent Chats</h3>
                <ul className='history'>
                    <li>
                        <MessageCircle size={16} />
                        <span>What is React?</span>
                    </li>
                    <li>
                        <MessageCircle size={16} />
                        <span>Explain TypeScript</span>
                    </li>
                    <li>
                        <MessageCircle size={16} />
                        <span>CSS Grid vs Flexbox</span>
                    </li>
                    <li>
                        <MessageCircle size={16} />
                        <span>Node.js basics</span>
                    </li>
                    <li>
                        <MessageCircle size={16} />
                        <span>Database design tips</span>
                    </li>
                </ul>
            </div>
            
            {/* username */}
            <div className='sign'>
                <p>{email}</p>
            </div>
        </section>
    )
}

export default Sidebar