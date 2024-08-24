import { Box, Typography } from '@mui/material'
import React from 'react'

const Message = ({content,role}) => {
  return (
    // className={message.role === "assistant" ? styles.botMessage : styles.userMessage}
    // .botMessage, .userMessage {
    //     margin-bottom: 10px;
    //     padding: 10px;
    //     border-radius: 5px;
    //   }
      
    //   .botMessage {
    //     background-color: #e6f3ff;
    //   }
      
    //   .userMessage {
    //     background-color: #f0f0f0;
    //     text-align: right;
    //   }
    <Box  
    sx ={{
        backgroundColor: role === "assistant"  ? "primary.main" : "secondary.main",
        // color: message.role === "assistant" ? "white" : "black",
        padding: "1rem",
        borderRadius: "1rem",
        marginBottom: "1rem",
        width: "fit-content",
        maxWidth: "80%",
        display: "flex",
        justifyContent: role === "assistant" ? "flex-start" : "flex-end"
    }}
    >
        
        
    <Typography
      sx={{
        textAlign: role === "assistant" ? "left" : "right", // Align text based on role
        color: role === "assistant" ? "white" : "black", // Adjust text color for readability
      }}
    >
      {content}
    </Typography>
            
        </Box>
  )
}

export default Message
