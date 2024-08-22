"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import RenderResult from "next/dist/server/render-result";

export default function Home() {
  const [messages, setMessages] = useState([{
    role: "system", content: "Hi I am Rate My Professor Assistant Bot. I am here to help you with any questions you have about Rate My Professor. Ask me anything!" ,
  }]);
  const [input, setInput] = useState(""); // Add this line to define the input state

  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    setMessages((messages=>[...messages, {role: "user", content: message}]));
    setMessage("");
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
          const text =decoder.decode(value || new Uint8Array, {stream: true})
          setMessages((messages)=>{
            let lastMessage = messages[messages.length - 1]
            let othermessages = messages.slice(0, messages.length - 1)
            return [
              ...othermessages,
              //adds the last message, then updates the content attribute with the text
              {...lastMessage, content: lastMessage.content + text}
            ]
          })
          return reader.read().then(processText)
        })
      })

    } catch (error) {
      console.error("Error fetching initial message:", error);
    }
  }



  return (
    <main className={styles.main}>
      <div className={styles.chatContainer}>
        {messages.map((message, index) => (
          <div key={index} className={message.role === "assistant" ? styles.botMessage : styles.userMessage}>
            {message.content}
          </div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className={styles.input}
        />
        <button onClick={sendMessage} className={styles.sendButton}>Send</button>
      </div>
    </main>
  );
}
