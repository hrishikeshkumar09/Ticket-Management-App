// src/components/Chatbot/ChatbotLauncher.js
import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import AssistantIcon from '@mui/icons-material/Assistant';
import CloseIcon from '@mui/icons-material/Close';

const ChatbotLauncher = ({ open, onClick }) => {
  return (
    <Tooltip title={open ? "Close Chat" : "Open Chat"} placement="left">
      <Fab
        color="primary"
        aria-label="chat"
        onClick={onClick}
        sx={{
          width: 70,
          height: 70,
          position: 'fixed',
          bottom: 30, // 24px from bottom
          right: 30,  // 24px from right
          zIndex: 1200, // Ensure it's above most content, but below the Chatbot window
        }}
      >
        {open ? <CloseIcon /> : <AssistantIcon />}
      </Fab>
    </Tooltip>
  );
};

export default ChatbotLauncher;