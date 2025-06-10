import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';
import FarmerIcon from '@mui/icons-material/Face';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

interface MessageType {
  id: number;
  sender: 'Farmer' | 'Support';
  content: string;
  timestamp: Date;
  isSupportRequest?: boolean;
  status?: 'Open' | 'In Progress' | 'Closed';
  priority?: 'Low' | 'Medium' | 'High';
  issueType?: string;
}

const PRIORITY_COLORS: Record<string, string> = {
  Low: '#aed581', // green light
  Medium: '#ffb74d', // amber
  High: '#e57373', // red
};

const ISSUE_TYPES = ['Milk Testing Issue', 'Payment Query', 'Delivery Problem', 'Technical Support', 'Other'];

const FarmerMessage: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: 1,
      sender: 'Support',
      content: 'Hello! Welcome to your farm support chat. How can we help you today?',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [supportForm, setSupportForm] = useState({
    issueType: '',
    description: '',
    priority: 'Medium',
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'info' | 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll chat to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) {
      setSnackbar({ open: true, message: 'Please enter a message.', severity: 'error' });
      return;
    }
    const msg: MessageType = {
      id: Date.now(),
      sender: 'Farmer',
      content: newMessage.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage('');
    setSnackbar({ open: true, message: 'Message sent!', severity: 'success' });
  };

  const submitSupportRequest = () => {
    if (!supportForm.issueType) {
      setSnackbar({ open: true, message: 'Please select an issue type.', severity: 'error' });
      return;
    }
    if (!supportForm.description.trim()) {
      setSnackbar({ open: true, message: 'Please describe your issue.', severity: 'error' });
      return;
    }

    const supportMsg: MessageType = {
      id: Date.now(),
      sender: 'Farmer',
      content: `Support Request - ${supportForm.issueType}: ${supportForm.description.trim()}`,
      timestamp: new Date(),
      isSupportRequest: true,
      status: 'Open',
      priority: supportForm.priority as 'Low' | 'Medium' | 'High',
      issueType: supportForm.issueType,
    };

    setMessages((prev) => [...prev, supportMsg]);
    setSupportForm({ issueType: '', description: '', priority: 'Medium' });
    setSnackbar({ open: true, message: 'Support request submitted!', severity: 'success' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto', p: 2, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <Box
        sx={{
          mb: 4,
          py: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
          color: 'white',
          textAlign: 'center',
          boxShadow: '0px 6px 20px rgba(100, 200, 123, 0.4)',
          userSelect: 'none',
        }}
      >
        <Typography variant="h4" fontWeight="bold" letterSpacing={1}>
          Farmer Messaging & Support Center
        </Typography>
        <Typography variant="subtitle1" mt={1} fontWeight={500}>
          Connect with your support team quickly and easily
        </Typography>
      </Box>

      <Box
        sx={{
          display: { xs: 'block', md: 'flex' },
          gap: 4,
          height: 600,
        }}
      >
        {/* Chat Area */}
        <Paper
          elevation={4}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden',
          }}
          aria-label="Farmer chat messages"
        >
          <Box
            sx={{
              flexGrow: 1,
              py: 2,
              px: 3,
              overflowY: 'auto',
              backgroundColor: '#e8f5e9',
            }}
          >
            {messages.length === 0 ? (
              <Typography sx={{ textAlign: 'center', mt: 10, color: '#555' }}>No messages yet</Typography>
            ) : (
              messages.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    mb: 2,
                    maxWidth: '85%',
                    bgcolor: msg.sender === 'Farmer' ? '#a5d6a7' : '#fff',
                    ml: msg.sender === 'Farmer' ? 'auto' : 2,
                    borderRadius: 2,
                    p: 2,
                    boxShadow: '0px 2px 6px rgba(0,0,0,0.1)',
                    position: 'relative',
                  }}
                  aria-label={`${msg.sender} message`}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 'bold', mb: 0.5 }}
                  >
                    {msg.sender} {msg.isSupportRequest ? `(Support Request - ${msg.status})` : ''}
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {msg.content}
                  </Typography>
                  {msg.isSupportRequest && msg.priority && (
                    <Box
                      sx={{
                        mt: 1,
                        display: 'inline-block',
                        fontWeight: 'bold',
                        fontSize: 12,
                        color: 'white',
                        backgroundColor: PRIORITY_COLORS[msg.priority],
                        px: 1.5,
                        py: 0.6,
                        borderRadius: 1,
                        userSelect: 'none',
                      }}
                      aria-label={`Priority: ${msg.priority}`}
                    >
                      Priority: {msg.priority}
                    </Box>
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      bottom: 4,
                      right: 8,
                      color: 'rgba(0,0,0,0.45)',
                      fontSize: 10,
                    }}
                  >
                    {formatTime(msg.timestamp)}
                  </Typography>
                </Box>
              ))
            )}
            <div ref={messagesEndRef} />
          </Box>
          <Box
            sx={{
              display: 'flex',
              p: 2,
              gap: 1,
              backgroundColor: '#c8e6c9',
            }}
          >
            <TextField
              placeholder="Type your message..."
              variant="outlined"
              size="small"
              fullWidth
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              aria-label="Type your message"
            />
            <Button
              variant="contained"
              color="success"
              endIcon={<SendIcon />}
              onClick={sendMessage}
              aria-label="Send message"
            >
              Send
            </Button>
          </Box>
        </Paper>

        {/* Support Request Area */}
        <Paper
          elevation={4}
          sx={{
            width: { xs: '100%', md: 380 },
            borderRadius: 3,
            p: 3,
            backgroundColor: '#f1f8e9',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            userSelect: 'none',
          }}
          aria-label="Support request form"
        >
          <Typography variant="h6" fontWeight="700" mb={2} color="#33691e">
            Support Request Form
          </Typography>
          <FormControl sx={{ mb: 2 }} fullWidth required>
            <InputLabel id="issue-type-label">Issue Type</InputLabel>
            <Select
              labelId="issue-type-label"
              value={supportForm.issueType}
              label="Issue Type"
              onChange={(e) => setSupportForm(prev => ({ ...prev, issueType: e.target.value }))}
              aria-required="true"
            >
              {ISSUE_TYPES.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Description"
            multiline
            rows={4}
            fullWidth
            required
            value={supportForm.description}
            onChange={(e) => setSupportForm(prev => ({ ...prev, description: e.target.value }))}
            aria-required="true"
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth required sx={{ mb: 2 }}>
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              value={supportForm.priority}
              label="Priority"
              onChange={(e) => setSupportForm(prev => ({ ...prev, priority: e.target.value as 'Low' | 'Medium' | 'High' }))}
              aria-required="true"
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="success"
            onClick={submitSupportRequest}
            size="large"
            aria-label="Submit support request"
          >
            Submit Request
          </Button>
        </Paper>
      </Box>

      {/* Snackbar for alerts */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          elevation={6}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FarmerMessage;
