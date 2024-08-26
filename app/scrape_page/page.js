// pages/scrape_page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, CircularProgress, TextField, Typography, Container, Stack } from "@mui/material";
import Alert from '@mui/material/Alert';
import SuccessIcon from '../icons/SuccessIcon'

export default function ScrapePage() {
  const [url, setUrl] = useState("");
  // const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [success,setSuccess] = useState(false)
  const [error,setError] = useState(false)
  const router = useRouter();  // Initialize useRouter

  const throwError = ()=>{
    console.log('throwing error')
    console.log(url)
    setLoading(false)
      setUrl('')
      setError(true)
      setTimeout(()=>{
        setError(false)
      },3000)
  }
  const handleScrape = async () => {
    if(!url.includes('professor')) return throwError()
    setLoading(true);
    try {
      const response = await fetch("/api/scrape", {  // Adjust API endpoint as needed
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: url,
      });

      if (!response.ok) {
        throw new Error("Failed to scrape the URL");
      }

      const result = await response.json();
      // setStatus("Scraping successful!");
      //temporary success message displayed
      setSuccess(true)
      setTimeout(()=>{
        setSuccess(false)
      },3000)
      setUrl('')

      // Handle result, update Pinecone or display data as needed
      console.log(result);

    } catch (error) {
      console.log('not related to validation')
      throwError()
      // setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: 'center',
        // padding: 4,
        minHeight: "100vh",
        backgroundColor: '#121212',
        color: '#e0e0e0',
      }}
    >
      <Button
          variant="contained"
          sx={{padding: "10px 20px",
            fontSize: 16,
            backgroundColor: "#007bff",
            "&:hover": {
              backgroundColor: "#0056b3",
            },
            position: "absolute",  // Absolute positioning
            top: 16,
            left: 16,
          }}
          onClick={() => router.back()}
        >
          Back to Chat
        </Button>
        {
          error &&
          <Alert variant = 'filled' severity="error">Not Sucessful. Try a Rate My Professor Link with data</Alert>
        }
          {
            success &&
            <Alert variant = 'filled' severity="success">Success! Professor added to chatbot knowledge</Alert>

            
          }

      <Typography variant="h4" gutterBottom sx={{color: "#ffffff", mt:10, mb:5}}>
        Scrape Your Professor
      </Typography>

      <TextField
        label="URL to Scrape"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        variant='filled'
        sx={{ marginBottom: 2,
            width: '100%', 
            maxWidth: 600,
            borderColor: '#e0e0e0',
            backgroundColor: '"#333333"',
            color: "#e0e0e0",
            '& .MuiInputLabel-root': {
            color: "#e0e0e0",  // Light color for input label
          },
          '& .MuiInputBase-input': {
            color: "#e0e0e0",  // Light color for input text
          },
          '& .MuiFilledInput-root': {
            border: '1px solid #e0e0e0',  // White border for filled variant
            borderRadius: '4px',  // Optional: rounded corners
          }
        }}
      />

      {loading?(
        <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Container>
      ):(
        <Button
        variant="contained"
        onClick={handleScrape}
        sx={{ padding: "10px 20px", fontSize: 16 }}
        disabled={loading}
      >
        Submit
      </Button>
      )
      }
      

      {/* {status && (
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          {status}
        </Typography>
      )} */}
    </Box>
    </>
  );
}
