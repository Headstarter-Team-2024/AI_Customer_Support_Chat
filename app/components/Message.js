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

        display: "flex",
        justifyContent: role === "assistant" ? "flex-start" : "flex-end",
        mb: 2,
        paddingRight: role === "user" ? {
      xs: "1.5rem", // Padding on the right for mobile screens
      md: "1.8rem", // Padding on the right for medium and larger screens
    } : 0, // No padding on the right for the assistant role
    }}
    >


    <Box
      sx={{
        textAlign: role === "left",
        backgroundColor: role === "assistant"  ? "primary.light" : "secondary.light",
        // color: message.role === "assistant" ? "white" : "black",
        padding: {
            xs: "0.5rem 1rem", // Padding for mobile screens
            md: "0.75rem 1.5rem", // Padding for medium and larger screens
          },
        borderRadius: "1rem",
        // marginBottom: "1rem",
        width: "fit-content",
        maxWidth: {
            xs: "90%", // Max width for mobile screens
            sm: "80%", // Max width for small screens
            md: "60%", // Max width for medium and larger screens
          },
        boxShadow: 1,
        boxSizing: "border-box", // Ensure padding is included in width
        wordBreak: "break-word", // Ensure long words break instead of causing overflow
      }}
    >
      <Typography variant="body1" sx={{
            fontSize: {
              xs: "0.875rem", // Font size for mobile screens
              sm: "1rem", // Font size for small screens
              md: "1rem", // Font size for medium and larger screens
            },
          }}
          >{content}</Typography>
    </Box>

        </Box>
  )
}

export default Message
