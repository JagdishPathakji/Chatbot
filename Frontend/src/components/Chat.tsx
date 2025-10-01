import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { User, Bot } from "lucide-react";
import "../styles/Chat.css";

interface ChatProps {
  chats: any[];
  userPrompt: string[];
  isLoading?: boolean;
}

function Chat({ chats, userPrompt, isLoading = false }: ChatProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, isLoading]);

  const renderMarkdown = (text: string) => (
    <div className="prose max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {text}
      </ReactMarkdown>
    </div>
  );


  const renderChatItem = (chatItem: any) => {
    // If chatItem is string, render directly as markdown
    if (typeof chatItem === "string") {
      return <div className="chat-message">{renderMarkdown(chatItem)}</div>;
    }

    // If chatItem is an image object
    if (chatItem?.type === "img") {
      return chatItem.url === "error" ? (
        "Error in generating image"
      ) : (
        <img
          src={chatItem.url}
          alt={chatItem.alt || "Generated image"}
          className="chat-image"
        />
      );
    }

    // If chatItem is an object from LLM JSON
    if (typeof chatItem === "object" && chatItem !== null) {
      if (chatItem.llmanswerableprompt && chatItem.llmanswer) {
        return <div className="chat-message">{renderMarkdown(chatItem.llmanswer)}</div>;
      }

      // Otherwise render raw JSON
      return (
        <div className="chat-message">
          <pre><code>{JSON.stringify(chatItem, null, 2)}</code></pre>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="chats">
      {!chats || chats.length === 0 ? (
        <div className="welcome-message">
          <Bot size={48} className="welcome-icon" />
          <h1>Welcome to QueryAI</h1>
          <p>Start asking your questions and I'll help you out!</p>
        </div>
      ) : (
        chats.map((chatItem, idx) => {
          const userText = userPrompt[idx] || "";
          return (
            <div key={idx} className="chat-pair">
              {/* User message */}
              <div className="message-container user-message-container">
                <div className="avatar user-avatar">
                  <User size={20} />
                </div>
                <div className="message-bubble user-message">
                  <p>{userText}</p>
                </div>
              </div>

              {/* Bot/LLM message */}
              <div className="message-container bot-message-container">
                <div className="avatar bot-avatar">
                  <Bot size={20} />
                </div>
                <div className="message-bubble bot-message">
                  {renderChatItem(chatItem)}
                </div>
              </div>
            </div>
          );
        })
      )}

      {isLoading && (
        <div className="message-container bot-message-container">
          <div className="avatar bot-avatar">
            <Bot size={20} />
          </div>
          <div className="message-bubble bot-message loading">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}

      <div ref={chatEndRef} />
    </div>
  );
}

export default Chat;
