const HandleOutput = async (response: any) => {
  try {
    
    // If it's a device access prompt, call the deviceaccess endpoint
    if (response.deviceaccessprompt === true) {
      const deviceResponse = await fetch('https://chatbot-backend-t13q.onrender.com/api/deviceaccess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({ response: response }),
      });

      if (!deviceResponse.ok) {
        throw new Error(`HTTP error! status: ${deviceResponse.status}`);
      }

      const deviceData = await deviceResponse.json();
      
      // Return the reply from device access
      return deviceData.reply || "Command executed successfully";
    }
    // For other types of responses, convert to string
    if (typeof response === 'object') {
      return JSON.stringify(response, null, 2);
    }
    
    return String(response);
  } catch (error) {
    return `Error: ${error.message}`;
  }
};

export default HandleOutput;
