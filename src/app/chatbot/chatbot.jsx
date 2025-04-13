'use client';
import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material';


const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Ask me anything about agriculture 🌱' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`/api/chat?question=${encodeURIComponent(input)}`);
      const data = await res.json();
      const botMessage = { role: 'bot', content: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: 'Oops! Something went wrong.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: 'auto',
        p: 2,
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #ccc',
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        🌾 AgriBot - Ask me about crops!
      </Typography>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          mb: 2,
          pr: 1,
        }}
      >
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            display="flex"
            justifyContent={
              msg.role === 'user' ? 'flex-end' : msg.role === 'bot' ? 'flex-start' : 'center'
            }
            my={1}
          >
            <Paper
              elevation={2}
              sx={{
                p: 1.5,
                maxWidth: '75%',
                bgcolor: msg.role === 'user' ? '#e0f2f1' : '#f5f5f5',
              }}
            >
              <Typography variant="body1">{msg.content}</Typography>
            </Paper>
          </Box>
        ))}
        {loading && (
          <Box display="flex" justifyContent="center" my={1}>
            <CircularProgress size={20} />
            <Typography ml={1} variant="body2" color="textSecondary">
              Bot is typing...
            </Typography>
          </Box>
        )}
        <div ref={chatEndRef} />
      </Box>

      <Box component="form" onSubmit={handleSubmit} display="flex" gap={1}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask about crop yield, fertilizers, diseases..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          variant="contained"
          color="success"
          type="submit"
          disabled={loading}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}

export default Chatbot;