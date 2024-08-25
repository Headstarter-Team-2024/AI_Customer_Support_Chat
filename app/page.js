"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import RenderResult from "next/dist/server/render-result";
import { Box, Button, TextField } from "@mui/material";
import Message from "./components/Message";

export default function Home() {
  const [messages, setMessages] = useState([{
    role: "assistant", content: "Hi I am Rate My Professor Assistant Bot. I am here to help you with any questions you have about Rate My Professor. Ask me anything!" ,
  }]);
  // const [input, setInput] = useState(""); // Add this line to define the input state

  const [message, setMessage] = useState("");

  const sendMessage = async () => {
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
        justifyContent: "space-between",
        alignItems: "center",
        padding: "6rem",
        // color:'white',
        minHeight: "1vh",
        
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
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          margin: 0,
          height: '20vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          padding: 20,
          border: '2px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',

        }}
      >
        {messages.map((message, index) => (
          <Message key={index} content = {message.content} role = {message.role}/>

        ))}
      </Box>
  
      <Box 
      sx={{
        width: '100%',
        maxWidth: 600,

        margin: 5,
        display: 'flex' 

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

          sx={{
            width: '50vw',
            bgcolor: 'white',
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
          padding: "10px 20px",
          fontSize: 16,
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: 4,
          marginLeft: 10,
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "#0056b3",
          }
        }}
        onClick={sendMessage} >Send</Button>

      </Box>
    </Box>
  );
}