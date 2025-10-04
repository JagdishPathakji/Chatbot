const HandleGoogleSearch = async (prompt: string) => {
  try {
    const response = await fetch('https://chatbot-backend-t13q.onrender.com/api/googlesearch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify({ question: prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Your backend sends {reply: actualResponse}
    return "USER QUERY : " + prompt + "\n ANSWER THIS ACCORDINGLY : " + data.reply;
  } catch (error) {
    return {
      llmanswerableprompt: true,
      llmanswer: "Sorry, there was an error connecting to the server. Please try again.",
      deviceaccessprompt: false,
      devicecommands: "",
      imagegen: false,
      imgprompt: "",
    };
  }
};

export default HandleGoogleSearch;
