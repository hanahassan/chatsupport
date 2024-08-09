"use client";
import {
  Box,
  Stack,
  TextField,
  Button,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  // const [messages, setMessages] = useState([
  //   {
  //     role: "assistant",
  //     content: `Hi! I'm the Headstarter Support Agent, how can I assist you today!`,
  //   },
  // ]);

  // const [message, setMessage] = useState("");

  // const sendMessage = async() => {
  //   setMessage('')
  //   setMessages((message)=> [
  //     ...messages,
  //     {role: "user", intent: message},
  //     {role: "assistant", content: ''},
  //   ])
  //   const response = fetch('/api/chat', {
  //     method: "POST",
  //     headers:{
  //     'Content-Type': 'application/json' },
  //     body: JSON.stringify([...messages, {role: 'user', content: message}]),
  //   }).then(async (res)=>{
  //     const reader = res.body.getReader()
  //     const decoder = new TextDecoder()

  //     let result = ''
  //     return reader.read().then(function processText({done, value }) {
  //       if (done){
  //         return result
  //       }
  //       const text = decoder.decode(value || new Int8Array(), {stream:true})
  //       setMessages((messages)=>{
  //         let lastMessage = messages[messages.length - 1]
  //         let otherMessages = messages.slice(0, messages.length - 1)
  //         return([
  //           ...otherMessages,
  //           {
  //             ...lastMessage,
  //             content: lastMessage.content + text,
  //           },
  //         ])
  //       })
  //       return reader.read().then(processText)
  //     })
  //   })
  // }

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I'm a AI Assiastant, how can I assist you today!`,
    },
  ]);
  const [message, setMessage] = useState("");

  const fetchLLMResponse = async (query) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/${query}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching LLM Model", error);
      throw error;
    }
  };

  const sendMessage = async () => {
    const userMessage = message; // Store the current message
    setMessage(""); // Clear input field immediately

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: userMessage },
      { role: "assistant", content: "" },
    ]);

    try {
      const text = await fetchLLMResponse(userMessage);

      setMessages((prevMessages) => {
        const lastMessageIndex = prevMessages.length - 1;
        return [
          ...prevMessages.slice(0, lastMessageIndex),
          {
            ...prevMessages[lastMessageIndex],
            content: text,
          },
        ];
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Box
      width="100vm"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor={"#D3D3D3"}
    >
      <AppBar
        position="static"
        sx={{ bgcolor: "#003366" }}
      >
        <Toolbar>
          <Typography
            variant="h4"
            color={"#FFD700"}
            fontFamily={"Courier New Arial"}
          >
            AI Chat Assistant
          </Typography>
        </Toolbar>
      </AppBar>
      <Stack
        direction="column"
        width="600px"
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === "assistant" ? "flex-start" : "flex-end"
              }
            >
              <Box
                bgcolor={
                  message.role === "assistant"
                    ? "primary.main"
                    : "secondary.main"
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack
          direction="row"
          spacing={2}
        >
          <TextField
            label="message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
