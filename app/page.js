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
  const [input, setInput] = useState(""); // Add this line to define the input state

  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    setMessages((messages=>[...messages, {role: "user", content: input}]));
    setMessage(input);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages,{ role: "user", content: input }]),
      }).then(async (res)=>{
        //create a readable stream
        const reader =res.body.getReader();
        //decode from binary to string
        const decoder = new TextDecoder()
        let result = "";
        //recursive function that reads the stream
        let initialBotMessage = messages[0]
        let userMessage = {role: "user", content: input}
        return reader.read().then(function processText({done, value}){
          if(done){
            //ending conditon to return final string
            return result
          }
          //decode the value but have condition in case value is null or undefined (data gaps)
          const text_stream =decoder.decode(value || new Uint8Array, {stream: true})
        
          setMessages((messages)=>{
            //this gives the current bot stream. If the response has not been set yet, it will be null
            let currentBotStream =  messages[messages.length - 1].role === "assistant" ? messages[messages.length - 1] : null
           
            let othermessages = messages.slice(0, messages.length - 1)
            
            //if on the bot stream then display the message and then append to it
            let messageStream = currentBotStream?{
              ...currentBotStream, 
              role:'assistant', content: currentBotStream.content + text_stream
            
            }:{
              //if not on bot stream then create a new bot stream
              role: 'assistant',content: text_stream
            }
            //this is only coming after user messages
            return [
              initialBotMessage,
              userMessage,
              messageStream
              
             
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
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 600,
          margin: 0,
          padding: 20,
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
        margin: 20,
        disiplay: 'flex'
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
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
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
