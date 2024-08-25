"use client";
import { Box, Button, TextField } from "@mui/material";
import RenderResult from "next/dist/server/render-result";
import { useEffect, useState } from "react";
import Message from "./components/Message";
import styles from "./page.module.css";

export default function Home() {
  const [messages, setMessages] = useState([{
    role: "assistant", content: "Hi I am Rate My Professor Assistant Bot. I am here to help you with any questions you have about Rate My Professor. Ask me anything!" ,
  }]);
  // const [input, setInput] = useState(""); // Add this line to define the input state

  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    //format message
    // setMessage(message.replace(/---/g, '\n'))
    setMessages((messages)=>[
      ...messages,
      {role:'user', content: message},
      {role:'assistant', content: ''}
    ])
    setMessage('');
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages,{ role: "user", content: message }]),
      }).then(async (res)=>{
        //create a readable stream
        const reader =res.body.getReader();
        //decode from binary to string
        const decoder = new TextDecoder()
        let result = "";
        //recursive function that reads the stream
        return reader.read().then(function processText({done, value}){
          if(done){
            //ending conditon to return final string
            return result
          }
          //decode the value but have condition in case value is null or undefined (data gaps)
          const newMessageStream =decoder.decode(value || new Uint8Array, {stream: true})

          setMessages((messages)=>{
            let lastMessage =  messages[messages.length - 1]
            // let lastUserMessage =lastMessage.role === "user" ? lastMessage : null
            // let lastPromptedBotMessage = lastMessage.role === "assistant"  && messages.length>1 ? lastMessage : null
            console.log('last message:', lastMessage)
            //if user has prompted we want all messages besides the last. If  not then just provide the only existing message (the intro bot message)
            let othermessages = messages.slice(0, messages.length - 1)

            //this is only coming after user messages
            return [
              ...othermessages,
              //if last user message is not null (meaning user has actualy prompted)
             {...lastMessage, content: lastMessage.content + newMessageStream}
            ]
          })
          return reader.read().then(processText)
        })
      })

    } catch (error) {
      console.error("Error fetching initial message:", error);
    }
  }


  useEffect(()=>{
    console.log(messages);
  },[messages])

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        padding: { xs: "1rem", md: "2rem" },  // Responsive padding
        boxSizing: "border-box", // Ensure padding is included in the height
        background: "linear-gradient(135deg, #1b2735 0%, #090a0f 100%)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          padding: "1rem",  // Add padding to keep it away from edges
        }}
      >
        <Button
          variant="contained"
          sx={{
            padding: "10px 20px",
            fontSize: 16,
            backgroundColor: "#007bff",
            "&:hover": {
              backgroundColor: "#0056b3",
            }
          }}
          href="/scrape_page"
        >
          Add your Professor 
        </Button>
      </Box>
      {/* Main container: Holds the entire chat interface */}
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        mb: 2,
        borderRadius: "12px",
        width: { xs: '100%', sm: '80%', md: 700 }, // Responsive width
        margin: "0 auto",
        pb: 1,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        backdropFilter: "blur(4px)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
      }}
    >

      {/* Chat messages container: Displays all messages */}

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: 'column',
          width: '100%',
          maxWidth: 600,
          margin: "0 auto",
          p: 2,
          overflowY: "auto",

        }}
      >

        {messages.map((message, index) => (
          <Message key={index} content = {message.content} role = {message.role}/>

        ))}

      </Box>
      </Box>
{/* Input container: Holds the text input field and send button */}
      <Box
      sx={{
        width: '100%',
        maxWidth: 600,
        margin: "0 auto",
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        pt: 2,

      }}
      >
        {/* .input {
  flex-grow: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
} */}
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."

          variant="outlined"
          sx={{
            flexGrow: 1,
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            },

      "& input": {
        color: "white", // Set the text color to white
      },
      "& .MuiInputBase-input::placeholder": {
        color: "rgba(255, 255, 255, 0.9)", // Placeholder text color
      },
    },
        }}
        />

          {/* sendButton {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  margin-left: 10px;
  cursor: pointer;
}

.sendButton:hover {
  background-color: #0056b3;
} */}

        <Button
        sx={{
          backgroundColor: "#007bff",
      color: "white",
      borderRadius: "12px",
      padding: { xs: "8px 16px", md: "10px 20px" },  // Responsive padding
      textTransform: "none",
      fontWeight: "bold",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
      minWidth: '80px',
      "&:hover": {
        backgroundColor: "#0056b3",
        boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
      },
        }}
        onClick={sendMessage} >Send</Button>

      </Box>
    </Box>
  );
}
