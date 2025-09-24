// src/components/Chatbot/Chatbot.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  CircularProgress,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import ChatMessage from './ChatMessage';

const dummyChatResponses = [
  "Hello! I'm your TicketAI assistant. How can I help you today regarding your tickets?",
  "Please provide the ticket ID or a brief description of the issue you'd like to discuss.",
  "I can summarize ticket history, suggest next steps, or answer general IT questions.",
  "That's an interesting problem. Let me check the knowledge base...",
  "Could you elaborate more on the symptoms you're observing?",
  "Sure, what about ticket #TKT001 would you like to know?",
  "The current status of that ticket is 'Open' and it's assigned to Alice.",
  "I've noted your question. I'll pass it along.",
  "I am just a demo chatbot for now, but I can simulate helpful responses!",
];

// Add initialX and initialY to props
const Chatbot = ({ open, onClose, tickets, initialX, initialY }) => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! I'm your TicketAI Assistant. Ask me anything about tickets!" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize position with props if provided, otherwise default
  const [position, setPosition] = useState({
    x: initialX || window.innerWidth - 380,
    y: initialY || window.innerHeight - 500,
  });
  const [size /* , setSize */] = useState({ width: 350, height: 400 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Update initial position on mount/prop change for better placement
  useEffect(() => {
    setPosition({
      x: initialX || window.innerWidth - 380,
      y: initialY || window.innerHeight - 500,
    });
  }, [initialX, initialY]);


  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [messages, open]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const randomIndex = Math.floor(Math.random() * dummyChatResponses.length);
      const aiResponseText = dummyChatResponses[randomIndex];
      setMessages((prev) => [...prev, { sender: 'ai', text: aiResponseText }]);
    } catch (error) {
      console.error('Error simulating chatbot response:', error);
      setMessages((prev) => [...prev, { sender: 'ai', text: 'Oops! My dummy brain encountered an error.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleMouseDown = (e) => {
    const targetIsHeader = e.target.closest('.chatbot-header');
    if (!targetIsHeader || e.target.tagName === 'BUTTON') return;

    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  if (!open) return null;

  return (
    <Paper
      elevation={5}
      sx={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        zIndex: 1300,
        resize: 'both',
        overflow: 'auto',
        minWidth: 300,
        minHeight: 300,
        maxWidth: '90vw',
        maxHeight: '90vh',
      }}
    >
        {/* Header - Drag Handle */}
        <Stack
          className="chatbot-header"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            p: 1.5,
            bgcolor: 'primary.main',
            color: 'white',
            cursor: 'grab',
            flexShrink: 0,
          }}
          onMouseDown={handleMouseDown}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            TicketAI Chat
          </Typography>
          <IconButton onClick={onClose} color="inherit" size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider />

        {/* Chat Messages Area */}
        <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: 'background.default' }}>
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg.text} sender={msg.sender} />
          ))}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">AI is typing...</Typography>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>
        <Divider />

        {/* Input Area */}
        <Box sx={{ p: 2, bgcolor: 'background.paper', flexShrink: 0 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Ask about a ticket..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !loading) {
                handleSendMessage();
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSendMessage} disabled={loading || !input.trim()} color="primary">
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
    </Paper>
  );
};

export default Chatbot;