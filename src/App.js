// src/App.js
import React, { useState, useMemo } from 'react';
import { Box, Typography, Container, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Header from './components/Header';
import DashboardStats from './components/DashboardStats';
import RecentTicketList from './components/RecentTicketList';
import TicketFormModal from './components/TicketFormModal'; // We'll create this for 'Create Ticket'
import EngineerTicketDetail from './components/EngineerTicketDetail';
import AdminPanel from './components/AdminPanel'; // Placeholder

// --- Mock Data ---
const initialTickets = [
  {
    id: 'TKT001',
    title: 'Login Issues with SSO',
    description: 'Unable to authenticate using company SSO credentials. Tried resetting password, clearing cache, and different browsers. Still no access.',
    status: 'open', // 'open', 'in-progress', 'resolved'
    priority: 'high', // 'low', 'medium', 'high', 'critical'
    category: 'Authentication',
    user: 'Alice',
    createdAt: '2024-01-15',
    engineerNotes: '',
    llmSuggestion: '',
    llmCost: 0,
    llmTokens: 0,
    llmModel: '',
    aiAssisted: false,
  },
  {
    id: 'TKT002',
    title: 'Dashboard Loading Slowly',
    description: 'Main dashboard takes 30+ seconds to load data. It used to be much faster. Affects daily reporting.',
    status: 'in-progress',
    priority: 'medium',
    category: 'Performance',
    user: 'Bob',
    createdAt: '2024-01-14',
    engineerNotes: 'Initial check indicates potential database query optimization needed. Running diagnostics.',
    llmSuggestion: "For dashboard loading issues: 1. Optimize database queries (add indexes, reduce joins). 2. Cache frequently accessed data. 3. Lazy load components. 4. Reduce data transferred by pagination or server-side filtering.",
    llmCost: 0.0375,
    llmTokens: 1250,
    llmModel: 'GPT-4',
    aiAssisted: true,
  },
  {
    id: 'TKT003',
    title: 'API Rate Limiting Error',
    description: 'Getting 429 errors when making API calls to the external service. Our application is becoming unstable due to this.',
    status: 'resolved',
    priority: 'critical',
    category: 'API Integration',
    user: 'Charlie',
    createdAt: '2024-01-13',
    engineerNotes: 'Increased API rate limit with vendor. Implemented retry mechanism with exponential backoff in our client code. Monitored for 24 hours, no further errors.',
    llmSuggestion: "To handle API rate limits: 1. Implement exponential backoff for retries. 2. Use client-side rate limiting. 3. Request higher limits from API provider. 4. Cache API responses where possible.",
    llmCost: 0.0220,
    llmTokens: 800,
    llmModel: 'Claude-3',
    aiAssisted: true,
  },
  {
    id: 'TKT004',
    title: 'Email Notifications Failing',
    description: 'Users are not receiving email notifications for critical system events. Checked email server, seems fine.',
    status: 'open',
    priority: 'high',
    category: 'Notifications',
    user: 'David',
    createdAt: '2024-01-16',
    engineerNotes: '',
    llmSuggestion: '',
    llmCost: 0,
    llmTokens: 0,
    llmModel: '',
    aiAssisted: false,
  },
];

function App() {
  const [tickets, setTickets] = useState(initialTickets);
  const [currentUserRole, setCurrentUserRole] = useState('user'); // 'user', 'engineer', 'admin'
  const [openCreateTicketModal, setOpenCreateTicketModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'create'
  const [selectedEngineerTicket, setSelectedEngineerTicket] = useState(null); // For engineer's detailed view

  // Dashboard Stats calculation
  const stats = useMemo(() => {
    const open = tickets.filter(t => t.status === 'open').length;
    const inProgress = tickets.filter(t => t.status === 'in-progress').length;
    const resolved = tickets.filter(t => t.status === 'resolved').length;
    const aiAssisted = tickets.filter(t => t.aiAssisted).length;
    const aiCosts = tickets.reduce((sum, t) => sum + t.llmCost, 0);

    return { open, inProgress, resolved, aiAssisted, aiCosts };
  }, [tickets]);

  const handleNewTicket = (newTicketData) => {
    const newId = `TKT${String(tickets.length + 1).padStart(3, '0')}`;
    setTickets((prevTickets) => [
      ...prevTickets,
      {
        id: newId,
        title: newTicketData.title,
        description: newTicketData.description,
        status: 'open',
        priority: newTicketData.priority || 'medium', // Default if not provided
        category: newTicketData.category || 'General',
        user: 'Current End User', // Mock current user
        createdAt: new Date().toISOString().split('T')[0],
        engineerNotes: '',
        llmSuggestion: '',
        llmCost: 0,
        llmTokens: 0,
        llmModel: '',
        aiAssisted: false,
      },
    ]);
    setOpenCreateTicketModal(false);
    setActiveTab('all'); // Go back to viewing all tickets
  };

  const handleResolveTicket = (ticketId, resolutionNotes) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              status: 'resolved',
              engineerNotes: resolutionNotes,
              engineer: 'Current Engineer', // Mock current engineer
              resolvedDate: new Date().toLocaleDateString(),
            }
          : ticket
      )
    );
    setSelectedEngineerTicket(null); // Close detail view
    alert(`Ticket ${ticketId} resolved successfully!`);
  };

  const handleLLMSuggestion = (ticketId, suggestion, model, cost, tokens) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              llmSuggestion: suggestion,
              llmModel: model,
              llmCost: cost,
              llmTokens: tokens,
              status: 'in-progress', // Mark as InProgress
              aiAssisted: true,
            }
          : ticket
      )
    );
  };

  const handleRoleChange = (event, newRole) => {
    if (newRole !== null) { // Prevent unselecting role
      setCurrentUserRole(newRole);
      setOpenCreateTicketModal(false); // Close modal if changing roles
      setSelectedEngineerTicket(null); // Close detail if changing roles
      setActiveTab('all');
    }
  };


  return (
    <Box sx={{ flexGrow: 1, backgroundColor: 'background.default', minHeight: '100vh' }}>
      <Header currentUserRole={currentUserRole} onRoleChange={handleRoleChange} />
      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
        {/* Main Content Area */}
        {currentUserRole === 'user' && (
          <Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <ToggleButtonGroup
                value={activeTab}
                exclusive
                onChange={(event, newTab) => setActiveTab(newTab)}
                aria-label="ticket view options"
                sx={{
                    bgcolor: 'background.paper',
                    borderRadius: '8px',
                    '& .MuiToggleButton-root': {
                        border: 'none',
                        '&.Mui-selected': {
                            bgcolor: 'primary.main',
                            color: 'white',
                            '&:hover': { bgcolor: 'primary.dark' }
                        }
                    }
                }}
              >
                <ToggleButton value="all" aria-label="all tickets">
                  All Tickets
                </ToggleButton>
                <ToggleButton value="create" aria-label="create new ticket">
                  Create Ticket
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {activeTab === 'all' && (
              <>
                <DashboardStats stats={stats} />
                <RecentTicketList tickets={tickets} />
              </>
            )}

            {activeTab === 'create' && (
              <TicketFormModal
                open={true} // Always open when activeTab is 'create'
                onClose={() => setActiveTab('all')}
                onSubmit={handleNewTicket}
              />
            )}
          </Box>
        )}

        {currentUserRole === 'engineer' && (
          <Box>
            {selectedEngineerTicket ? (
              <EngineerTicketDetail
                ticket={selectedEngineerTicket}
                onBack={() => setSelectedEngineerTicket(null)}
                onResolveTicket={handleResolveTicket}
                onLLMSuggestion={handleLLMSuggestion}
              />
            ) : (
              <>
                <DashboardStats stats={stats} />
                <RecentTicketList tickets={tickets} onTicketClick={setSelectedEngineerTicket} />
              </>
            )}
          </Box>
        )}

        {currentUserRole === 'admin' && <AdminPanel />}
      </Container>
    </Box>
  );
}

export default App;