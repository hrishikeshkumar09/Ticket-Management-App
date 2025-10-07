// // src/App.js
// import React, { useState, useMemo } from 'react';
// import { Box, Container, ToggleButton, ToggleButtonGroup } from '@mui/material';
// import Header from './components/Header';
// import DashboardStats from './components/DashboardStats';
// import RecentTicketList from './components/RecentTicketList';
// import TicketFormModal from './components/TicketFormModal'; // We'll create this for 'Create Ticket'
// import EngineerTicketDetail from './components/EngineerTicketDetail';
// import AdminPanel from './components/AdminPanel'; // Placeholder

// // --- Mock Data ---
// const initialTickets = [
//   {
//     id: 'TKT001',
//     title: 'Login Issues with SSO',
//     description: 'Unable to authenticate using company SSO credentials. Tried resetting password, clearing cache, and different browsers. Still no access.',
//     status: 'open', // 'open', 'in-progress', 'resolved'
//     priority: 'high', // 'low', 'medium', 'high', 'critical'
//     category: 'Authentication',
//     user: 'Alice',
//     createdAt: '2024-01-15',
//     engineerNotes: '',
//     llmSuggestion: '',
//     llmCost: 0,
//     llmTokens: 0,
//     llmModel: '',
//     aiAssisted: false,
//   },
//   {
//     id: 'TKT002',
//     title: 'Dashboard Loading Slowly',
//     description: 'Main dashboard takes 30+ seconds to load data. It used to be much faster. Affects daily reporting.',
//     status: 'in-progress',
//     priority: 'medium',
//     category: 'Performance',
//     user: 'Bob',
//     createdAt: '2024-01-14',
//     engineerNotes: 'Initial check indicates potential database query optimization needed. Running diagnostics.',
//     llmSuggestion: "For dashboard loading issues: 1. Optimize database queries (add indexes, reduce joins). 2. Cache frequently accessed data. 3. Lazy load components. 4. Reduce data transferred by pagination or server-side filtering.",
//     llmCost: 0.0375,
//     llmTokens: 1250,
//     llmModel: 'GPT-4',
//     aiAssisted: true,
//   },
//   {
//     id: 'TKT003',
//     title: 'API Rate Limiting Error',
//     description: 'Getting 429 errors when making API calls to the external service. Our application is becoming unstable due to this.',
//     status: 'resolved',
//     priority: 'critical',
//     category: 'API Integration',
//     user: 'Charlie',
//     createdAt: '2024-01-13',
//     engineerNotes: 'Increased API rate limit with vendor. Implemented retry mechanism with exponential backoff in our client code. Monitored for 24 hours, no further errors.',
//     llmSuggestion: "To handle API rate limits: 1. Implement exponential backoff for retries. 2. Use client-side rate limiting. 3. Request higher limits from API provider. 4. Cache API responses where possible.",
//     llmCost: 0.0220,
//     llmTokens: 800,
//     llmModel: 'Claude-3',
//     aiAssisted: true,
//   },
//   {
//     id: 'TKT004',
//     title: 'Email Notifications Failing',
//     description: 'Users are not receiving email notifications for critical system events. Checked email server, seems fine.',
//     status: 'open',
//     priority: 'high',
//     category: 'Notifications',
//     user: 'David',
//     createdAt: '2024-01-16',
//     engineerNotes: '',
//     llmSuggestion: '',
//     llmCost: 0,
//     llmTokens: 0,
//     llmModel: '',
//     aiAssisted: false,
//   },
// ];

// function App() {
//   const [tickets, setTickets] = useState(initialTickets);
//   const [currentUserRole, setCurrentUserRole] = useState('user'); // 'user', 'engineer', 'admin'
//   const [openCreateTicketModal, setOpenCreateTicketModal] = useState(false);
//   const [activeTab, setActiveTab] = useState('all'); // 'all', 'create'
//   const [selectedEngineerTicket, setSelectedEngineerTicket] = useState(null); // For engineer's detailed view

//   // Dashboard Stats calculation
//   const stats = useMemo(() => {
//     const open = tickets.filter(t => t.status === 'open').length;
//     const inProgress = tickets.filter(t => t.status === 'in-progress').length;
//     const resolved = tickets.filter(t => t.status === 'resolved').length;
//     const aiAssisted = tickets.filter(t => t.aiAssisted).length;
//     const aiCosts = tickets.reduce((sum, t) => sum + t.llmCost, 0);

//     return { open, inProgress, resolved, aiAssisted, aiCosts };
//   }, [tickets]);

//   const handleNewTicket = (newTicketData) => {
//     const newId = `TKT${String(tickets.length + 1).padStart(3, '0')}`;
//     setTickets((prevTickets) => [
//       ...prevTickets,
//       {
//         id: newId,
//         title: newTicketData.title,
//         description: newTicketData.description,
//         status: 'open',
//         priority: newTicketData.priority || 'medium', // Default if not provided
//         category: newTicketData.category || 'General',
//         user: 'Current End User', // Mock current user
//         createdAt: new Date().toISOString().split('T')[0],
//         engineerNotes: '',
//         llmSuggestion: '',
//         llmCost: 0,
//         llmTokens: 0,
//         llmModel: '',
//         aiAssisted: false,
//       },
//     ]);
//     setOpenCreateTicketModal(false);
//     setActiveTab('all'); // Go back to viewing all tickets
//   };

//   const handleResolveTicket = (ticketId, resolutionNotes) => {
//     setTickets((prevTickets) =>
//       prevTickets.map((ticket) =>
//         ticket.id === ticketId
//           ? {
//               ...ticket,
//               status: 'resolved',
//               engineerNotes: resolutionNotes,
//               engineer: 'Current Engineer', // Mock current engineer
//               resolvedDate: new Date().toLocaleDateString(),
//             }
//           : ticket
//       )
//     );
//     setSelectedEngineerTicket(null); // Close detail view
//     alert(`Ticket ${ticketId} resolved successfully!`);
//   };

//   const handleLLMSuggestion = (ticketId, suggestion, model, cost, tokens) => {
//     setTickets((prevTickets) =>
//       prevTickets.map((ticket) =>
//         ticket.id === ticketId
//           ? {
//               ...ticket,
//               llmSuggestion: suggestion,
//               llmModel: model,
//               llmCost: cost,
//               llmTokens: tokens,
//               status: 'in-progress', // Mark as InProgress
//               aiAssisted: true,
//             }
//           : ticket
//       )
//     );
//   };

//   const handleRoleChange = (event, newRole) => {
//     if (newRole !== null) { // Prevent unselecting role
//       setCurrentUserRole(newRole);
//       setOpenCreateTicketModal(false); // Close modal if changing roles
//       setSelectedEngineerTicket(null); // Close detail if changing roles
//       setActiveTab('all');
//     }
//   };


//   return (
//     <Box sx={{ flexGrow: 1, backgroundColor: 'background.default', minHeight: '100vh' }}>
//       <Header currentUserRole={currentUserRole} onRoleChange={handleRoleChange} />
//       <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
//         {/* Main Content Area */}
//         {currentUserRole === 'user' && (
//           <Box>
//             <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
//               <ToggleButtonGroup
//                 value={activeTab}
//                 exclusive
//                 onChange={(event, newTab) => setActiveTab(newTab)}
//                 aria-label="ticket view options"
//                 sx={{
//                     bgcolor: 'background.paper',
//                     borderRadius: '8px',
//                     '& .MuiToggleButton-root': {
//                         border: 'none',
//                         '&.Mui-selected': {
//                             bgcolor: 'primary.main',
//                             color: 'white',
//                             '&:hover': { bgcolor: 'primary.dark' }
//                         }
//                     }
//                 }}
//               >
//                 <ToggleButton value="all" aria-label="all tickets">
//                   All Tickets
//                 </ToggleButton>
//                 <ToggleButton value="create" aria-label="create new ticket">
//                   Create Ticket
//                 </ToggleButton>
//               </ToggleButtonGroup>
//             </Box>

//             {activeTab === 'all' && (
//               <>
//                 <DashboardStats stats={stats} />
//                 <RecentTicketList tickets={tickets} />
//               </>
//             )}

//             {activeTab === 'create' && (
//               <TicketFormModal
//                 open={true} // Always open when activeTab is 'create'
//                 onClose={() => setActiveTab('all')}
//                 onSubmit={handleNewTicket}
//               />
//             )}
//           </Box>
//         )}

//         {currentUserRole === 'engineer' && (
//           <Box>
//             {selectedEngineerTicket ? (
//               <EngineerTicketDetail
//                 ticket={selectedEngineerTicket}
//                 onBack={() => setSelectedEngineerTicket(null)}
//                 onResolveTicket={handleResolveTicket}
//                 onLLMSuggestion={handleLLMSuggestion}
//               />
//             ) : (
//               <>
//                 <DashboardStats stats={stats} />
//                 <RecentTicketList tickets={tickets} onTicketClick={setSelectedEngineerTicket} />
//               </>
//             )}
//           </Box>
//         )}

//         {currentUserRole === 'admin' && <AdminPanel />}
//       </Container>
//     </Box>
//   );
// }

// export default App;


// src/App.js
// import React, { useState, useMemo } from 'react';
// import { Box, ToggleButton, ToggleButtonGroup, Container } from '@mui/material';
// import Header from './components/Header';
// import DashboardStats from './components/DashboardStats';
// import RecentTicketList from './components/RecentTicketList';
// import TicketFormModal from './components/TicketFormModal';
// import EngineerTicketDetail from './components/EngineerTicketDetail';
// import AdminPanel from './components/AdminPanel';

// // --- Mock Data ---
// const initialTickets = [
//   // ... (your initialTickets array remains the same)
//   {
//     id: 'TKT001',
//     title: 'Login Issues with SSO',
//     description: 'Unable to authenticate using company SSO credentials. Tried resetting password, clearing cache, and different browsers. Still no access.',
//     status: 'open', // 'open', 'in-progress', 'resolved'
//     priority: 'high', // 'low', 'medium', 'high', 'critical'
//     category: 'Authentication',
//     user: 'Alice',
//     createdAt: '2024-01-15',
//     engineerNotes: '',
//     llmSuggestion: '',
//     llmCost: 0,
//     llmTokens: 0,
//     llmModel: '',
//     aiAssisted: false,
//   },
//   {
//     id: 'TKT002',
//     title: 'Dashboard Loading Slowly',
//     description: 'Main dashboard takes 30+ seconds to load data. It used to be much faster. Affects daily reporting.',
//     status: 'in-progress',
//     priority: 'medium',
//     category: 'Performance',
//     user: 'Bob',
//     createdAt: '2024-01-14',
//     engineerNotes: 'Initial check indicates potential database query optimization needed. Running diagnostics.',
//     llmSuggestion: "For dashboard loading issues: 1. Optimize database queries (add indexes, reduce joins). 2. Cache frequently accessed data. 3. Lazy load components. 4. Reduce data transferred by pagination or server-side filtering.",
//     llmCost: 0.0375,
//     llmTokens: 1250,
//     llmModel: 'GPT-4',
//     aiAssisted: true,
//   },
//   {
//     id: 'TKT003',
//     title: 'API Rate Limiting Error',
//     description: 'Getting 429 errors when making API calls to the external service. Our application is becoming unstable due to this.',
//     status: 'resolved',
//     priority: 'critical',
//     category: 'API Integration',
//     user: 'Charlie',
//     createdAt: '2024-01-13',
//     engineerNotes: 'Increased API rate limit with vendor. Implemented retry mechanism with exponential backoff in our client code. Monitored for 24 hours, no further errors.',
//     llmSuggestion: "To handle API rate limits: 1. Implement exponential backoff for retries. 2. Use client-side rate limiting. 3. Request higher limits from API provider. 4. Cache API responses where possible.",
//     llmCost: 0.0220,
//     llmTokens: 800,
//     llmModel: 'Claude-3',
//     aiAssisted: true,
//   },
//   {
//     id: 'TKT004',
//     title: 'Email Notifications Failing',
//     description: 'Users are not receiving email notifications for critical system events. Checked email server, seems fine.',
//     status: 'open',
//     priority: 'high',
//     category: 'Notifications',
//     user: 'David',
//     createdAt: '2024-01-16',
//     engineerNotes: '',
//     llmSuggestion: '',
//     llmCost: 0,
//     llmTokens: 0,
//     llmModel: '',
//     aiAssisted: false,
//   },
// ];


// function App() {
//   const [tickets, setTickets] = useState(initialTickets);
//   const [currentUserRole, setCurrentUserRole] = useState('user');
//   const [openCreateTicketModal, setOpenCreateTicketModal] = useState(false); // This is the state that directly controls the modal
//   const [activeTab, setActiveTab] = useState('all'); // This state controls which main view is shown
//   const [selectedEngineerTicket, setSelectedEngineerTicket] = useState(null);

//   // Dashboard Stats calculation
//   const stats = useMemo(() => {
//     const open = tickets.filter(t => t.status === 'open').length;
//     const inProgress = tickets.filter(t => t.status === 'in-progress').length;
//     const resolved = tickets.filter(t => t.status === 'resolved').length;
//     const aiAssisted = tickets.filter(t => t.aiAssisted).length;
//     const aiCosts = tickets.reduce((sum, t) => sum + t.llmCost, 0);

//     return { open, inProgress, resolved, aiAssisted, aiCosts };
//   }, [tickets]);

//   const handleNewTicket = (newTicketData) => {
//     const newId = `TKT${String(tickets.length + 1).padStart(3, '0')}`;
//     setTickets((prevTickets) => [
//       ...prevTickets,
//       {
//         id: newId,
//         title: newTicketData.title,
//         description: newTicketData.description,
//         status: 'open',
//         priority: newTicketData.priority || 'medium',
//         category: newTicketData.category || 'General',
//         user: 'Current End User',
//         createdAt: new Date().toISOString().split('T')[0],
//         engineerNotes: '',
//         llmSuggestion: '',
//         llmCost: 0,
//         llmTokens: 0,
//         llmModel: '',
//         aiAssisted: false,
//       },
//     ]);
//     setOpenCreateTicketModal(false); // Close the modal after submission
//     setActiveTab('all'); // Set active tab to 'all' to show dashboard
//   };

//   const handleResolveTicket = (ticketId, resolutionNotes) => {
//     setTickets((prevTickets) =>
//       prevTickets.map((ticket) =>
//         ticket.id === ticketId
//           ? {
//               ...ticket,
//               status: 'resolved',
//               engineerNotes: resolutionNotes,
//               engineer: 'Current Engineer',
//               resolvedDate: new Date().toLocaleDateString(),
//             }
//           : ticket
//       )
//     );
//     setSelectedEngineerTicket(null);
//     alert(`Ticket ${ticketId} resolved successfully!`);
//   };

//   const handleLLMSuggestion = (ticketId, suggestion, model, cost, tokens) => {
//     setTickets((prevTickets) =>
//       prevTickets.map((ticket) =>
//         ticket.id === ticketId
//           ? {
//               ...ticket,
//               llmSuggestion: suggestion,
//               llmModel: model,
//               llmCost: cost,
//               llmTokens: tokens,
//               status: 'in-progress',
//               aiAssisted: true,
//             }
//           : ticket
//       )
//     );
//   };

//   const handleRoleChange = (event, newRole) => {
//     if (newRole !== null) {
//       setCurrentUserRole(newRole);
//       setOpenCreateTicketModal(false); // Close modal on role change
//       setSelectedEngineerTicket(null); // Close detail if changing roles
//       setActiveTab('all'); // Default to 'all' tab
//     }
//   };


//   return (
//     <Box sx={{ flexGrow: 1, backgroundColor: 'background.default', minHeight: '100vh' }}>
//       <Header currentUserRole={currentUserRole} onRoleChange={handleRoleChange} />
//       <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
//         {/* Main Content Area */}
//         {currentUserRole === 'user' && (
//           <Box>
//             <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
//               <ToggleButtonGroup
//                 value={activeTab}
//                 exclusive
//                 onChange={(event, newTab) => {
//                   setActiveTab(newTab);
//                   if (newTab === 'create') {
//                       setOpenCreateTicketModal(true); // Open the modal when 'create' is selected
//                   } else {
//                       setOpenCreateTicketModal(false); // Ensure modal is closed if switching to 'all'
//                   }
//                 }}
//                 aria-label="ticket view options"
//                 sx={{
//                     bgcolor: 'background.paper',
//                     borderRadius: '8px',
//                     '& .MuiToggleButton-root': {
//                         border: 'none',
//                         '&.Mui-selected': {
//                             bgcolor: 'primary.main',
//                             color: 'white',
//                             '&:hover': { bgcolor: 'primary.dark' }
//                         }
//                     }
//                 }}
//               >
//                 <ToggleButton value="all" aria-label="all tickets">
//                   All Tickets
//                 </ToggleButton>
//                 <ToggleButton value="create" aria-label="create new ticket">
//                   Create Ticket
//                 </ToggleButton>
//               </ToggleButtonGroup>
//             </Box>

//             {/* Conditionally render DashboardStats and RecentTicketList only if activeTab is 'all' */}
//             {activeTab === 'all' && (
//               <>
//                 <DashboardStats stats={stats} />
//                 <RecentTicketList tickets={tickets} />
//               </>
//             )}

//             {/* The TicketFormModal's 'open' prop is now directly tied to openCreateTicketModal state */}
//             <TicketFormModal
//               open={openCreateTicketModal} // <-- THIS IS THE KEY FIX. openCreateTicketModal is now *used* here
//               onClose={() => {
//                   setOpenCreateTicketModal(false); // Allow modal to be closed directly
//                   setActiveTab('all'); // Switch back to 'all' tab when modal closes
//               }}
//               onSubmit={handleNewTicket}
//             />
//           </Box>
//         )}

//         {currentUserRole === 'engineer' && (
//           <Box>
//             {selectedEngineerTicket ? (
//               <EngineerTicketDetail
//                 ticket={selectedEngineerTicket}
//                 onBack={() => setSelectedEngineerTicket(null)}
//                 onResolveTicket={handleResolveTicket}
//                 onLLMSuggestion={handleLLMSuggestion}
//               />
//             ) : (
//               <>
//                 <DashboardStats stats={stats} />
//                 <RecentTicketList tickets={tickets} onTicketClick={setSelectedEngineerTicket} />
//               </>
//             )}
//           </Box>
//         )}

//         {currentUserRole === 'admin' && <AdminPanel />}
//       </Container>
//     </Box>
//   );
// }

// export default App;

// src/App.js
// import React, { useState, useMemo /*, useEffect */ } from 'react'; // Removed unused useEffect
// import { Box, ToggleButton, ToggleButtonGroup, Container } from '@mui/material';
// import Header from './components/Header';
// import DashboardStats from './components/DashboardStats';
// import RecentTicketList from './components/RecentTicketList';
// import TicketFormModal from './components/TicketFormModal';
// import EngineerTicketDetail from './components/EngineerTicketDetail';
// import AdminPanel from './components/AdminPanel';
// import Chatbot from './components/Chatbot/Chatbot';
// import ChatbotLauncher from './components/Chatbot/ChatbotLauncher';

// // --- Mock Data --- (This was missing!)
// const initialTickets = [
//   {
//     id: 'TKT001',
//     title: 'Login Issues with SSO',
//     description: 'Unable to authenticate using company SSO credentials. Tried resetting password, clearing cache, and different browsers. Still no access.',
//     status: 'open', // 'open', 'in-progress', 'resolved'
//     priority: 'high', // 'low', 'medium', 'high', 'critical'
//     category: 'Authentication',
//     user: 'Alice',
//     createdAt: '2024-01-15',
//     engineerNotes: '',
//     llmSuggestion: '',
//     llmCost: 0,
//     llmTokens: 0,
//     llmModel: '',
//     aiAssisted: false,
//   },
//   {
//     id: 'TKT002',
//     title: 'Dashboard Loading Slowly',
//     description: 'Main dashboard takes 30+ seconds to load data. It used to be much faster. Affects daily reporting.',
//     status: 'in-progress',
//     priority: 'medium',
//     category: 'Performance',
//     user: 'Bob',
//     createdAt: '2024-01-14',
//     engineerNotes: 'Initial check indicates potential database query optimization needed. Running diagnostics.',
//     llmSuggestion: "For dashboard loading issues: 1. Optimize database queries (add indexes, reduce joins). 2. Cache frequently accessed data. 3. Lazy load components. 4. Reduce data transferred by pagination or server-side filtering.",
//     llmCost: 0.0375,
//     llmTokens: 1250,
//     llmModel: 'GPT-4',
//     aiAssisted: true,
//   },
//   {
//     id: 'TKT003',
//     title: 'API Rate Limiting Error',
//     description: 'Getting 429 errors when making API calls to the external service. Our application is becoming unstable due to this.',
//     status: 'resolved',
//     priority: 'critical',
//     category: 'API Integration',
//     user: 'Charlie',
//     createdAt: '2024-01-13',
//     engineerNotes: 'Increased API rate limit with vendor. Implemented retry mechanism with exponential backoff in our client code. Monitored for 24 hours, no further errors.',
//     llmSuggestion: "To handle API rate limits: 1. Implement exponential backoff for retries. 2. Use client-side rate limiting. 3. Request higher limits from API provider. 4. Cache API responses where possible.",
//     llmCost: 0.0220,
//     llmTokens: 800,
//     llmModel: 'Claude-3',
//     aiAssisted: true,
//   },
//   {
//     id: 'TKT004',
//     title: 'Email Notifications Failing',
//     description: 'Users are not receiving email notifications for critical system events. Checked email server, seems fine.',
//     status: 'open',
//     priority: 'high',
//     category: 'Notifications',
//     user: 'David',
//     createdAt: '2024-01-16',
//     engineerNotes: '',
//     llmSuggestion: '',
//     llmCost: 0,
//     llmTokens: 0,
//     llmModel: '',
//     aiAssisted: false,
//   },
// ];


// function App() {
//   const [tickets, setTickets] = useState(initialTickets);
//   const [currentUserRole, setCurrentUserRole] = useState('user');
//   const [openCreateTicketModal, setOpenCreateTicketModal] = useState(false);
//   const [activeTab, setActiveTab] = useState('all');
//   const [selectedEngineerTicket, setSelectedEngineerTicket] = useState(null);
//   const [openChatbot, setOpenChatbot] = useState(false);

//   // Dashboard Stats calculation (remains the same)
//   const stats = useMemo(() => {
//     const open = tickets.filter(t => t.status === 'open').length;
//     const inProgress = tickets.filter(t => t.status === 'in-progress').length;
//     const resolved = tickets.filter(t => t.status === 'resolved').length;
//     const aiAssisted = tickets.filter(t => t.aiAssisted).length;
//     const aiCosts = tickets.reduce((sum, t) => sum + t.llmCost, 0);

//     return { open, inProgress, resolved, aiAssisted, aiCosts };
//   }, [tickets]);

//   const handleNewTicket = (newTicketData) => {
//     const newId = `TKT${String(tickets.length + 1).padStart(3, '0')}`;
//     setTickets((prevTickets) => [
//       ...prevTickets,
//       {
//         id: newId,
//         title: newTicketData.title,
//         description: newTicketData.description,
//         status: 'open',
//         priority: newTicketData.priority || 'medium',
//         category: newTicketData.category || 'General',
//         user: 'Current End User',
//         createdAt: new Date().toISOString().split('T')[0],
//         engineerNotes: '',
//         llmSuggestion: '',
//         llmCost: 0,
//         llmTokens: 0,
//         llmModel: '',
//         aiAssisted: false,
//       },
//     ]);
//     setOpenCreateTicketModal(false);
//     setActiveTab('all');
//   };

//   const handleResolveTicket = (ticketId, resolutionNotes) => {
//     setTickets((prevTickets) =>
//       prevTickets.map((ticket) =>
//         ticket.id === ticketId
//           ? {
//               ...ticket,
//               status: 'resolved',
//               engineerNotes: resolutionNotes,
//               engineer: 'Current Engineer',
//               resolvedDate: new Date().toLocaleDateString(),
//             }
//           : ticket
//       )
//     );
//     setSelectedEngineerTicket(null);
//     alert(`Ticket ${ticketId} resolved successfully!`);
//   };

//   const handleLLMSuggestion = (ticketId, suggestion, model, cost, tokens) => {
//     setTickets((prevTickets) =>
//       prevTickets.map((ticket) =>
//         ticket.id === ticketId
//           ? {
//               ...ticket,
//               llmSuggestion: suggestion,
//               llmModel: model,
//               llmCost: cost,
//               llmTokens: tokens,
//               status: 'in-progress',
//               aiAssisted: true,
//             }
//           : ticket
//       )
//     );
//   };

//   const handleRoleChange = (event, newRole) => {
//     if (newRole !== null) {
//       setCurrentUserRole(newRole);
//       setOpenCreateTicketModal(false);
//       setSelectedEngineerTicket(null);
//       setActiveTab('all');
//     }
//   };


//   return (
//     <Box sx={{ flexGrow: 1, backgroundColor: 'background.default', minHeight: '100vh' }}>
//       <Header
//         currentUserRole={currentUserRole}
//         onRoleChange={handleRoleChange}
//       />
//       <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
//         {/* Main Content Area (remains the same) */}
//         {currentUserRole === 'user' && (
//           <Box>
//             <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
//               <ToggleButtonGroup
//                 value={activeTab}
//                 exclusive
//                 onChange={(event, newTab) => {
//                   setActiveTab(newTab);
//                   if (newTab === 'create') {
//                       setOpenCreateTicketModal(true);
//                   } else {
//                       setOpenCreateTicketModal(false);
//                   }
//                 }}
//                 aria-label="ticket view options"
//                 sx={{
//                     bgcolor: 'background.paper',
//                     borderRadius: '8px',
//                     '& .MuiToggleButton-root': {
//                         border: 'none',
//                         '&.Mui-selected': {
//                             bgcolor: 'primary.main',
//                             color: 'white',
//                             '&:hover': { bgcolor: 'primary.dark' }
//                         }
//                     }
//                 }}
//               >
//                 <ToggleButton value="all" aria-label="all tickets">
//                   All Tickets
//                 </ToggleButton>
//                 <ToggleButton value="create" aria-label="create new ticket">
//                   Create Ticket
//                 </ToggleButton>
//               </ToggleButtonGroup>
//             </Box>

//             {activeTab === 'all' && (
//               <>
//                 <DashboardStats stats={stats} />
//                 <RecentTicketList tickets={tickets} />
//               </>
//             )}

//             <TicketFormModal
//               open={openCreateTicketModal}
//               onClose={() => {
//                   setOpenCreateTicketModal(false);
//                   setActiveTab('all');
//               }}
//               onSubmit={handleNewTicket}
//             />
//           </Box>
//         )}

//         {currentUserRole === 'engineer' && (
//           <Box>
//             {selectedEngineerTicket ? (
//               <EngineerTicketDetail
//                 ticket={selectedEngineerTicket}
//                 onBack={() => setSelectedEngineerTicket(null)}
//                 onResolveTicket={handleResolveTicket}
//                 onLLMSuggestion={handleLLMSuggestion}
//               />
//             ) : (
//               <>
//                 <DashboardStats stats={stats} />
//                 <RecentTicketList tickets={tickets} onTicketClick={setSelectedEngineerTicket} />
//               </>
//             )}
//           </Box>
//         )}

//         {currentUserRole === 'admin' && <AdminPanel />}
//       </Container>

//       {/* RENDER THE CHATBOT LAUNCHER AND CHATBOT HERE */}
//       <ChatbotLauncher open={openChatbot} onClick={() => setOpenChatbot(!openChatbot)} />
//       <Chatbot
//         open={openChatbot}
//         onClose={() => setOpenChatbot(false)}
//         tickets={tickets}
//         // These initial positions place the chatbot window a bit above the launcher
//         initialX={window.innerWidth - 380} // Chatbot width is 350, launcher is approx 56 + 24px padding = 80px
//         initialY={window.innerHeight - 500 - 80} // Adjust based on launcher height and desired spacing
//       />
//     </Box>
//   );
// }

// export default App;

// // src/App.js
// import React, { useState, useMemo, useEffect } from 'react';
// import {
//   Box,
//   Container,
//   CssBaseline,
//   Typography
// } from '@mui/material';
// import Header from './components/Header';
// import DashboardStats from './components/DashboardStats';
// import RecentTicketList from './components/RecentTicketList';
// import TicketFormModal from './components/TicketFormModal';
// import EngineerTicketDetail from './components/EngineerTicketDetail';
// import AdminPanel from './components/AdminPanel';

// // UserChatView is deleted
// // UserChatThread is deleted
// // Chatbot is now the main chat display component
// import Chatbot from './components/Chatbot/Chatbot';

// // UserSidebar will list conversations and launch new ones
// import UserSidebar from './components/UserSidebar';


// // Mock Data for Tickets (KEEP THIS)
// const initialTickets = [
//   {
//     id: 'TKT001',
//     title: 'Login Issues with SSO',
//     description: 'Unable to authenticate using company SSO credentials. Tried resetting password, clearing cache, and different browsers. Still no access.',
//     status: 'open', // 'open', 'in-progress', 'resolved'
//     priority: 'high', // 'low', 'medium', 'high', 'critical'
//     category: 'Authentication',
//     user: 'Alice',
//     createdAt: '2024-01-15',
//     engineerNotes: '',
//     llmSuggestion: '',
//     llmCost: 0,
//     llmTokens: 0,
//     llmModel: '',
//     aiAssisted: false,
//   },
//   {
//     id: 'TKT002',
//     title: 'Dashboard Loading Slowly',
//     description: 'Main dashboard takes 30+ seconds to load data. It used to be much faster. Affects daily reporting.',
//     status: 'in-progress',
//     priority: 'medium',
//     category: 'Performance',
//     user: 'Bob',
//     createdAt: '2024-01-14',
//     engineerNotes: 'Initial check indicates potential database query optimization needed. Running diagnostics.',
//     llmSuggestion: "For dashboard loading issues: 1. Optimize database queries (add indexes, reduce joins). 2. Cache frequently accessed data. 3. Lazy load components. 4. Reduce data transferred by pagination or server-side filtering.",
//     llmCost: 0.0375,
//     llmTokens: 1250,
//     llmModel: 'GPT-4',
//     aiAssisted: true,
//   },
//   {
//     id: 'TKT003',
//     title: 'API Rate Limiting Error',
//     description: 'Getting 429 errors when making API calls to the external service. Our application is becoming unstable due to this.',
//     status: 'resolved',
//     priority: 'critical',
//     category: 'API Integration',
//     user: 'Charlie',
//     createdAt: '2024-01-13',
//     engineerNotes: 'Increased API rate limit with vendor. Implemented retry mechanism with exponential backoff in our client code. Monitored for 24 hours, no further errors.',
//     llmSuggestion: "To handle API rate limits: 1. Implement exponential backoff for retries. 2. Use client-side rate limiting. 3. Request higher limits from API provider. 4. Cache API responses where possible.",
//     llmCost: 0.0220,
//     llmTokens: 800,
//     llmModel: 'Claude-3',
//     aiAssisted: true,
//   },
//   {
//     id: 'TKT004',
//     title: 'Email Notifications Failing',
//     description: 'Users are not receiving email notifications for critical system events. Checked email server, seems fine.',
//     status: 'open',
//     priority: 'high',
//     category: 'Notifications',
//     user: 'David',
//     createdAt: '2024-01-16',
//     engineerNotes: '',
//     llmSuggestion: '',
//     llmCost: 0,
//     llmTokens: 0,
//     llmModel: '',
//     aiAssisted: false,
//   },
// ];

// // Mock Data for Conversations (KEEP THIS)
// const initialConversations = [
//   {
//     id: 'CONV001',
//     ticketId: 'TKT001',
//     ticketTitle: 'Login Issues with SSO',
//     startDate: '2024-01-15',
//     isResolved: false,
//     messages: [
//       { sender: 'user', text: 'I cannot log in using SSO. Password reset not working.' },
//       { sender: 'ai', text: 'I understand. Have you tried clearing your browser cache and cookies?' },
//       { sender: 'user', text: 'Yes, I tried that and still no luck.' },
//       { sender: 'ai', text: 'Okay. Can you verify your username and which SSO provider you are trying to use?' },
//     ],
//   },
//   {
//     id: 'CONV002',
//     ticketId: 'TKT002',
//     ticketTitle: 'Dashboard Loading Slowly',
//     startDate: '2024-01-14',
//     isResolved: true,
//     resolvedDate: '2024-01-15',
//     messages: [
//       { sender: 'user', text: 'My dashboard is loading very slowly, takes forever to show data.' },
//       { sender: 'ai', text: 'I see. This sounds like a performance issue. Have you tried using a different browser or checking your internet speed?' },
//       { sender: 'user', text: 'Yes, confirmed it\'s slow on multiple browsers and my internet is fast.' },
//       { sender: 'ai', text: 'Thank you for the details. The engineering team is investigating. In the meantime, try reducing the data range you are viewing. If you need a quick overview, the summarized reports might be faster.' },
//       { sender: 'user', text: 'Okay, I\'ll try that. Thanks for the tip!' }
//     ],
//     resolutionNotes: `Solution for Dashboard Loading Slowly:
// 1. Try refreshing the page after 5 minutes.
// 2. Check your internet connection speed.
// 3. If using a VPN, try disconnecting and reconnecting.
// 4. Reduce the data range of the dashboard view if possible.
// 5. The IT team is aware of potential performance issues and is working on database optimization. Your patience is appreciated.`
//   },
// ];


// const drawerWidth = 280; // Define drawer width for consistent layout

// function App() {
//   const [tickets, setTickets] = useState(initialTickets);
//   const [conversations, setConversations] = useState(initialConversations);
//   const [currentUserRole, setCurrentUserRole] = useState('user');
//   const [openCreateTicketModal, setOpenCreateTicketModal] = useState(false);
//   const [selectedEngineerTicket, setSelectedEngineerTicket] = useState(null);

//   // NEW: State to manage the currently selected conversation in the sidebar
//   const [currentConversationId, setCurrentConversationId] = useState(
//     initialConversations.length > 0 ? initialConversations[0].id : null // Auto-select first conversation
//   );
//   // State for the Chatbot's input field (managed here to be passed to Chatbot)
//   const [chatInput, setChatInput] = useState('');
//   const [chatLoading, setChatLoading] = useState(false);

//   // Dashboard Stats calculation (only used by engineer now)
//   const stats = useMemo(() => {
//     const open = tickets.filter(t => t.status === 'open').length;
//     const inProgress = tickets.filter(t => t.status === 'in-progress').length;
//     const resolved = tickets.filter(t => t.status === 'resolved').length;
//     const aiAssisted = tickets.filter(t => t.aiAssisted).length;
//     const aiCosts = tickets.reduce((sum, t) => sum + t.llmCost, 0);
//     return { open, inProgress, resolved, aiAssisted, aiCosts };
//   }, [tickets]);

//   // useEffect to automatically select the first conversation if none is selected
//   useEffect(() => {
//     if (currentUserRole === 'user' && !currentConversationId && conversations.length > 0) {
//       setCurrentConversationId(conversations[0].id);
//     }
//   }, [currentUserRole, currentConversationId, conversations]);

//   const handleNewTicket = (newTicketData) => {
//     const newId = `TKT${String(tickets.length + 1).padStart(3, '0')}`;
//     const newTicket = {
//       id: newId,
//       title: newTicketData.title,
//       description: newTicketData.description,
//       status: 'open',
//       priority: newTicketData.priority || 'medium',
//       category: newTicketData.category || 'General',
//       user: 'Current End User',
//       createdAt: new Date().toISOString().split('T')[0],
//       engineerNotes: '',
//       llmSuggestion: '',
//       llmCost: 0,
//       llmTokens: 0,
//       llmModel: '',
//       aiAssisted: false,
//     };
//     setTickets((prevTickets) => [...prevTickets, newTicket]);

//     const newConvId = `CONV${String(conversations.length + 1).padStart(3, '0')}`;
//     const newConversation = {
//       id: newConvId,
//       ticketId: newTicket.id,
//       ticketTitle: newTicket.title,
//       startDate: newTicket.createdAt,
//       isResolved: false,
//       messages: [
//         { sender: 'ai', text: `Hello! I've noted your new ticket #${newTicket.id}: "${newTicket.title}". How can I assist you with this issue?` }
//       ],
//     };
//     setConversations((prevConversations) => [newConversation, ...prevConversations]);
//     setCurrentConversationId(newConvId); // Auto-select the newly created conversation
//     setOpenCreateTicketModal(false); // Close the modal
//   };

//   const handleResolveTicket = (ticketId, resolutionNotes) => {
//     setTickets((prevTickets) =>
//       prevTickets.map((ticket) =>
//         ticket.id === ticketId
//           ? {
//               ...ticket,
//               status: 'resolved',
//               engineerNotes: resolutionNotes,
//               engineer: 'Current Engineer',
//               resolvedDate: new Date().toLocaleDateString(),
//             }
//           : ticket
//       )
//     );
//     setConversations(prevConversations =>
//       prevConversations.map(conv =>
//         conv.ticketId === ticketId && !conv.isResolved
//           ? { ...conv, isResolved: true, resolvedDate: new Date().toLocaleDateString(), resolutionNotes: resolutionNotes }
//           : conv
//       )
//     );
//     setSelectedEngineerTicket(null);
//     alert(`Ticket ${ticketId} resolved successfully!`);
//   };

//   const handleLLMSuggestion = (ticketId, suggestion, model, cost, tokens) => {
//     setTickets((prevTickets) =>
//       prevTickets.map((ticket) =>
//         ticket.id === ticketId
//           ? {
//               ...ticket,
//               llmSuggestion: suggestion,
//               llmModel: model,
//               llmCost: cost,
//               llmTokens: tokens,
//               status: 'in-progress',
//               aiAssisted: true,
//             }
//           : ticket
//       )
//     );
//   };

//   const handleRoleChange = (event, newRole) => {
//     if (newRole !== null) {
//       setCurrentUserRole(newRole);
//       setOpenCreateTicketModal(false);
//       setSelectedEngineerTicket(null);
//       // Reset convo selection on role change for user
//       if (newRole === 'user') {
//           setCurrentConversationId(initialConversations.length > 0 ? initialConversations[0].id : null);
//       }
//     }
//   };

//   const handleNewChat = () => {
//     const newConvId = `CONV${String(conversations.length + 1).padStart(3, '0')}`;
//     const newConversation = {
//       id: newConvId,
//       ticketId: null, // No associated ticket yet
//       ticketTitle: 'New Chat',
//       startDate: new Date().toISOString().split('T')[0],
//       isResolved: false,
//       messages: [{ sender: 'ai', text: "Hello! How can I help you with a new issue today?" }],
//     };
//     setConversations((prevConversations) => [newConversation, ...prevConversations]);
//     setCurrentConversationId(newConvId); // Immediately select the new empty chat
//   };

//   // Centralized message sending function, used by Chatbot
//   const handleSendMessageToChatbot = async (message) => {
//     if (message.trim() === '' || !currentConversationId) return;

//     setChatLoading(true);
//     const userMessage = message.trim();

//     setConversations(prev => prev.map(conv =>
//       conv.id === currentConversationId
//         ? { ...conv, messages: [...conv.messages, { sender: 'user', text: userMessage }] }
//         : conv
//     ));

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 1500));
//       // Using dummy responses, as backend is not implemented for now
//       const dummyChatResponses = [
//         "Hello! I'm your TicketAI assistant. How can I help you today?",
//         "Please provide more details.",
//         "I can summarize information or suggest next steps.",
//         "That's an interesting problem. Let me check the knowledge base...",
//         "Could you elaborate more on the symptoms?",
//         "Thank you for the information. I'm processing your request.",
//         "I am just a demo chatbot for now, but I can simulate helpful responses!",
//       ];
//       const randomIndex = Math.floor(Math.random() * dummyChatResponses.length);
//       const aiResponseText = dummyChatResponses[randomIndex];

//       setConversations(prev => prev.map(conv =>
//         conv.id === currentConversationId
//           ? { ...conv, messages: [...conv.messages, { sender: 'ai', text: aiResponseText }] }
//           : conv
//       ));
//     } catch (error) {
//       console.error('Error simulating chatbot response:', error);
//       setConversations(prev => prev.map(conv =>
//         conv.id === currentConversationId
//           ? { ...conv, messages: [...conv.messages, { sender: 'ai', text: 'Oops! Something went wrong. Please try again.' }] }
//           : conv
//       ));
//     } finally {
//       setChatLoading(false);
//       setChatInput(''); // Clear input in the chatbot
//     }
//   };

//   const handleMarkConversationResolved = (conversationId, solutionText) => {
//     setConversations(prevConversations =>
//       prevConversations.map(conv => {
//         if (conv.id === conversationId) {
//           setTickets(prevTickets =>
//             prevTickets.map(ticket =>
//               ticket.id === conv.ticketId
//                 ? { ...ticket, status: 'resolved', engineerNotes: solutionText, resolvedDate: new Date().toLocaleDateString() }
//                 : ticket
//             )
//           );
//           return {
//             ...conv,
//             isResolved: true,
//             resolvedDate: new Date().toLocaleDateString(),
//             resolutionNotes: solutionText,
//           };
//         }
//         return conv;
//       })
//     );
//     alert(`Conversation ${conversationId} marked as resolved!`);
//   };

//   const currentConversation = useMemo(() => {
//     return conversations.find(conv => conv.id === currentConversationId) || null;
//   }, [currentConversationId, conversations]);


//   return (
//     <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
//       <CssBaseline />
//       <Header
//         currentUserRole={currentUserRole}
//         onRoleChange={handleRoleChange}
//       />

//       {currentUserRole === 'user' && (
//         <>
//           <UserSidebar
//             conversations={conversations}
//             onNewChat={handleNewChat}
//             onSelectConversation={setCurrentConversationId}
//             currentConversationId={currentConversationId}
//             userDisplayName="John Doe"
//             userEmail="john.doe@company.com"
//           />
//           <Box
//             component="main"
//             sx={{
//               flexGrow: 1,
//               bgcolor: 'background.default',
//               ml: `${drawerWidth}px`,
//               mt: '64px',
//               display: 'flex',
//               flexDirection: 'column',
//               height: 'calc(100vh - 64px)',
//             }}
//           >
//             {currentConversation ? (
//               <Chatbot // Chatbot now directly renders the full chat window
//                 currentConversation={currentConversation}
//                 onSendMessage={handleSendMessageToChatbot}
//                 chatInput={chatInput}
//                 setChatInput={setChatInput}
//                 chatLoading={chatLoading}
//                 onMarkConversationResolved={handleMarkConversationResolved}
//               />
//             ) : (
//                 <Box sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
//                     <Typography variant="h5" color="text.secondary">
//                         Select a chat from the sidebar or start a new one.
//                     </Typography>
//                 </Box>
//             )}
//           </Box>
//         </>
//       )}

//       {currentUserRole === 'engineer' && (
//         <Container maxWidth="lg" sx={{ mt: 4, pb: 4, flexGrow: 1 }}>
//           {selectedEngineerTicket ? (
//             <EngineerTicketDetail
//               ticket={selectedEngineerTicket}
//               onBack={() => setSelectedEngineerTicket(null)}
//               onResolveTicket={handleResolveTicket}
//               onLLMSuggestion={handleLLMSuggestion}
//             />
//           ) : (
//             <>
//               <DashboardStats stats={stats} />
//               <RecentTicketList tickets={tickets} onTicketClick={setSelectedEngineerTicket} />
//             </>
//           )}
//         </Container>
//       )}

//       {currentUserRole === 'admin' && (
//         <Container maxWidth="lg" sx={{ mt: 4, pb: 4, flexGrow: 1 }}>
//             <AdminPanel />
//         </Container>
//       )}

//       {openCreateTicketModal && (
//         <TicketFormModal
//           open={openCreateTicketModal}
//           onClose={() => {
//             setOpenCreateTicketModal(false);
//           }}
//           onSubmit={handleNewTicket}
//         />
//       )}
//     </Box>
//   );
// }

// export default App;

// // src/App.js
// import React, { useState, useMemo, useEffect } from 'react';
// import {
//   Box,
//   Container,
//   CssBaseline,
//   Typography,
//   AppBar,
//   Toolbar
// } from '@mui/material';
// import Header from './components/Header';
// import DashboardStats from './components/DashboardStats'; // Still imported for Admin view
// import RecentTicketList from './components/RecentTicketList'; // Still imported for Admin view
// import TicketFormModal from './components/TicketFormModal';
// import EngineerTicketDetail from './components/EngineerTicketDetail'; // Still imported for Admin view
// import AdminPanel from './components/AdminPanel'; // This will now potentially render engineer content

// // Chatbot is now the main chat display component
// import Chatbot from './components/Chatbot/Chatbot';

// // UserSidebar will list conversations and launch new ones
// import UserSidebar from './components/UserSidebar';


// // Mock Data for Tickets (KEEP THIS)
// const initialTickets = [
//   {
//     id: 'TKT001',
//     title: 'Login Issues with SSO',
//     description: 'Unable to authenticate using company SSO credentials. Tried resetting password, clearing cache, and different browsers. Still no access.',
//     status: 'open', // 'open', 'in-progress', 'resolved'
//     priority: 'high', // 'low', 'medium', 'high', 'critical'
//     category: 'Authentication',
//     user: 'Alice',
//     createdAt: '2024-01-15',
//     engineerNotes: '',
//     llmSuggestion: '',
//     llmCost: 0,
//     llmTokens: 0,
//     llmModel: '',
//     aiAssisted: false,
//   },
//   {
//     id: 'TKT002',
//     title: 'Dashboard Loading Slowly',
//     description: 'Main dashboard takes 30+ seconds to load data. It used to be much faster. Affects daily reporting.',
//     status: 'in-progress',
//     priority: 'medium',
//     category: 'Performance',
//     user: 'Bob',
//     createdAt: '2024-01-14',
//     engineerNotes: 'Initial check indicates potential database query optimization needed. Running diagnostics.',
//     llmSuggestion: "For dashboard loading issues: 1. Optimize database queries (add indexes, reduce joins). 2. Cache frequently accessed data. 3. Lazy load components. 4. Reduce data transferred by pagination or server-side filtering.",
//     llmCost: 0.0375,
//     llmTokens: 1250,
//     llmModel: 'GPT-4',
//     aiAssisted: true,
//   },
//   {
//     id: 'TKT003',
//     title: 'API Rate Limiting Error',
//     description: 'Getting 429 errors when making API calls to the external service. Our application is becoming unstable due to this.',
//     status: 'resolved',
//     priority: 'critical',
//     category: 'API Integration',
//     user: 'Charlie',
//     createdAt: '2024-01-13',
//     engineerNotes: 'Increased API rate limit with vendor. Implemented retry mechanism with exponential backoff in our client code. Monitored for 24 hours, no further errors.',
//     llmSuggestion: "To handle API rate limits: 1. Implement exponential backoff for retries. 2. Use client-side rate limiting. 3. Request higher limits from API provider. 4. Cache API responses where possible.",
//     llmCost: 0.0220,
//     llmTokens: 800,
//     llmModel: 'Claude-3',
//     aiAssisted: true,
//   },
//   {
//     id: 'TKT004',
//     title: 'Email Notifications Failing',
//     description: 'Users are not receiving email notifications for critical system events. Checked email server, seems fine.',
//     status: 'open',
//     priority: 'high',
//     category: 'Notifications',
//     user: 'David',
//     createdAt: '2024-01-16',
//     engineerNotes: '',
//     llmSuggestion: '',
//     llmCost: 0,
//     llmTokens: 0,
//     llmModel: '',
//     aiAssisted: false,
//   },
// ];

// // Mock Data for Conversations (KEEP THIS)
// const initialConversations = [
//   {
//     id: 'CONV001',
//     ticketId: 'TKT001',
//     ticketTitle: 'Login Issues with SSO',
//     startDate: '2024-01-15',
//     isResolved: false,
//     messages: [
//       { sender: 'user', text: 'I cannot log in using SSO. Password reset not working.' },
//       { sender: 'ai', text: 'I understand. Have you tried clearing your browser cache and cookies?' },
//       { sender: 'user', text: 'Yes, I tried that and still no luck.' },
//       { sender: 'ai', text: 'Okay. Can you verify your username and which SSO provider you are trying to use?' },
//     ],
//   },
//   {
//     id: 'CONV002',
//     ticketId: 'TKT002',
//     ticketTitle: 'Dashboard Loading Slowly',
//     startDate: '2024-01-14',
//     isResolved: true,
//     resolvedDate: '2024-01-15',
//     messages: [
//       { sender: 'user', text: 'My dashboard is loading very slowly, takes forever to show data.' },
//       { sender: 'ai', text: 'I see. This sounds like a performance issue. Have you tried using a different browser or checking your internet speed?' },
//       { sender: 'user', text: 'Yes, confirmed it\'s slow on multiple browsers and my internet is fast.' },
//       { sender: 'ai', text: 'Thank you for the details. The engineering team is investigating. In the meantime, try reducing the data range you are viewing. If you need a quick overview, the summarized reports might be faster.' },
//       { sender: 'user', text: 'Okay, I\'ll try that. Thanks for the tip!' }
//     ],
//     resolutionNotes: `Solution for Dashboard Loading Slowly:
// 1. Try refreshing the page after 5 minutes.
// 2. Check your internet connection speed.
// 3. If using a VPN, try disconnecting and reconnecting.
// 4. Reduce the data range of the dashboard view if possible.
// 5. The IT team is aware of potential performance issues and is working on database optimization. Your patience is appreciated.`
//   },
// ];


// const drawerWidth = 280; // Define drawer width for consistent layout
// const appBarHeight = 64; // Standard MUI AppBar height

// function App() {
//   const [tickets, setTickets] = useState(initialTickets);
//   const [conversations, setConversations] = useState(initialConversations);
//   const [currentUserRole, setCurrentUserRole] = useState('user'); // Default to 'user'
//   const [openCreateTicketModal, setOpenCreateTicketModal] = useState(false);
//   const [selectedEngineerTicket, setSelectedEngineerTicket] = useState(null); // This will now be for Admin use

//   const [currentConversationId, setCurrentConversationId] = useState(
//     initialConversations.length > 0 ? initialConversations[0].id : null
//   );
//   const [chatInput, setChatInput] = useState('');
//   const [chatLoading, setChatLoading] = useState(false);

//   const stats = useMemo(() => {
//     const open = tickets.filter(t => t.status === 'open').length;
//     const inProgress = tickets.filter(t => t.status === 'in-progress').length;
//     const resolved = tickets.filter(t => t.status === 'resolved').length;
//     const aiAssisted = tickets.filter(t => t.aiAssisted).length;
//     const aiCosts = tickets.reduce((sum, t) => sum + t.llmCost, 0);
//     return { open, inProgress, resolved, aiAssisted, aiCosts };
//   }, [tickets]);

//   useEffect(() => {
//     // Only auto-select for user role
//     if (currentUserRole === 'user' && !currentConversationId && conversations.length > 0) {
//       setCurrentConversationId(conversations[0].id);
//     }
//     // Also clear selected ticket when switching away from engineer/admin view
//     if (currentUserRole === 'user' && selectedEngineerTicket) {
//       setSelectedEngineerTicket(null);
//     }
//   }, [currentUserRole, currentConversationId, conversations, selectedEngineerTicket]);

//   const handleNewTicket = (newTicketData) => { /* ... (ticket creation remains the same) ... */
//     const newId = `TKT${String(tickets.length + 1).padStart(3, '0')}`;
//     const newTicket = {
//       id: newId,
//       title: newTicketData.title,
//       description: newTicketData.description,
//       status: 'open',
//       priority: newTicketData.priority || 'medium',
//       category: newTicketData.category || 'General',
//       user: 'Current End User',
//       createdAt: new Date().toISOString().split('T')[0],
//       engineerNotes: '',
//       llmSuggestion: '',
//       llmCost: 0,
//       llmTokens: 0,
//       llmModel: '',
//       aiAssisted: false,
//     };
//     setTickets((prevTickets) => [...prevTickets, newTicket]);

//     const newConvId = `CONV${String(conversations.length + 1).padStart(3, '0')}`;
//     const newConversation = {
//       id: newConvId,
//       ticketId: newTicket.id,
//       ticketTitle: newTicket.title,
//       startDate: newTicket.createdAt,
//       isResolved: false,
//       messages: [
//         { sender: 'ai', text: `Hello! I've noted your new ticket #${newTicket.id}: "${newTicket.title}". How can I assist you with this issue?` }
//       ],
//     };
//     setConversations((prevConversations) => [newConversation, ...prevConversations]);
//     setCurrentConversationId(newConvId); // Auto-select the newly created conversation
//     setOpenCreateTicketModal(false); // Close the modal
//   };

//   const handleResolveTicket = (ticketId, resolutionNotes) => { /* ... (ticket resolution remains the same) ... */
//     setTickets((prevTickets) =>
//       prevTickets.map((ticket) =>
//         ticket.id === ticketId
//           ? {
//               ...ticket,
//               status: 'resolved',
//               engineerNotes: resolutionNotes,
//               engineer: 'Current Engineer', // This would now be "Current Admin"
//               resolvedDate: new Date().toLocaleDateString(),
//             }
//           : ticket
//       )
//     );
//     setConversations(prevConversations =>
//       prevConversations.map(conv =>
//         conv.ticketId === ticketId && !conv.isResolved
//           ? { ...conv, isResolved: true, resolvedDate: new Date().toLocaleDateString(), resolutionNotes: resolutionNotes }
//           : conv
//       )
//     );
//     setSelectedEngineerTicket(null); // Clears the ticket detail view
//     alert(`Ticket ${ticketId} resolved successfully!`);
//   };

//   const handleLLMSuggestion = (ticketId, suggestion, model, cost, tokens) => { /* ... (LLM suggestion remains the same) ... */
//     setTickets((prevTickets) =>
//       prevTickets.map((ticket) =>
//         ticket.id === ticketId
//           ? {
//               ...ticket,
//               llmSuggestion: suggestion,
//               llmModel: model,
//               llmCost: cost,
//               llmTokens: tokens,
//               status: 'in-progress',
//               aiAssisted: true,
//             }
//           : ticket
//       )
//     );
//   };

//   const handleRoleChange = (event, newRole) => {
//     if (newRole !== null) {
//       setCurrentUserRole(newRole);
//       setOpenCreateTicketModal(false);
//       setSelectedEngineerTicket(null); // Always clear when role changes
//       if (newRole === 'user') {
//           setCurrentConversationId(initialConversations.length > 0 ? initialConversations[0].id : null);
//       } else {
//           setCurrentConversationId(null); // Clear conversation when not in user role
//       }
//     }
//   };

//   const handleNewChat = () => { /* ... (new chat remains the same) ... */
//     const newConvId = `CONV${String(conversations.length + 1).padStart(3, '0')}`;
//     const newConversation = {
//       id: newConvId,
//       ticketId: null, // No associated ticket yet
//       ticketTitle: 'New Chat',
//       startDate: new Date().toISOString().split('T')[0],
//       isResolved: false,
//       messages: [{ sender: 'ai', text: "Hello! How can I help you with a new issue today?" }],
//     };
//     setConversations((prevConversations) => [newConversation, ...prevConversations]);
//     setCurrentConversationId(newConvId);
//   };

//   const handleSendMessageToChatbot = async (message) => { /* ... (send message remains the same) ... */
//     if (message.trim() === '' || !currentConversationId) return;

//     setChatLoading(true);
//     const userMessage = message.trim();

//     setConversations(prev => prev.map(conv =>
//       conv.id === currentConversationId
//         ? { ...conv, messages: [...conv.messages, { sender: 'user', text: userMessage }] }
//         : conv
//     ));

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 1500));
//       const dummyChatResponses = [
//         "Hello! I'm your TicketAI assistant. How can I help you today?",
//         "Please provide more details.",
//         "I can summarize information or suggest next steps.",
//         "That's an interesting problem. Let me check the knowledge base...",
//         "Could you elaborate more on the symptoms?",
//         "Thank you for the information. I'm processing your request.",
//         "I am just a demo chatbot for now, but I can simulate helpful responses!",
//       ];
//       const randomIndex = Math.floor(Math.random() * dummyChatResponses.length);
//       const aiResponseText = dummyChatResponses[randomIndex];

//       setConversations(prev => prev.map(conv =>
//         conv.id === currentConversationId
//           ? { ...conv, messages: [...conv.messages, { sender: 'ai', text: aiResponseText }] }
//           : conv
//       ));
//     } catch (error) {
//       console.error('Error simulating chatbot response:', error);
//       setConversations(prev => prev.map(conv =>
//         conv.id === currentConversationId
//           ? { ...conv, messages: [...conv.messages, { sender: 'ai', text: 'Oops! Something went wrong. Please try again.' }] }
//           : conv
//       ));
//     } finally {
//       setChatLoading(false);
//       setChatInput('');
//     }
//   };

//   const handleMarkConversationResolved = (conversationId, solutionText) => { /* ... (mark resolved remains the same) ... */
//     setConversations(prevConversations =>
//       prevConversations.map(conv => {
//         if (conv.id === conversationId) {
//           setTickets(prevTickets =>
//             prevTickets.map(ticket =>
//               ticket.id === conv.ticketId
//                 ? { ...ticket, status: 'resolved', engineerNotes: solutionText, resolvedDate: new Date().toLocaleDateString() }
//                 : ticket
//             )
//           );
//           return {
//             ...conv,
//             isResolved: true,
//             resolvedDate: new Date().toLocaleDateString(),
//             resolutionNotes: solutionText,
//           };
//         }
//         return conv;
//       })
//     );
//     alert(`Conversation ${conversationId} marked as resolved!`);
//   };

//   const currentConversation = useMemo(() => { /* ... (current conversation memo remains the same) ... */
//     return conversations.find(conv => conv.id === currentConversationId) || null;
//   }, [currentConversationId, conversations]);


//   return (
//     <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
//       <CssBaseline />
//       <AppBar
//         position="fixed"
//         sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'grey.200' }}
//         elevation={1}
//       >
//         <Toolbar>
//           <Header
//             currentUserRole={currentUserRole}
//             onRoleChange={handleRoleChange}
//           />
//         </Toolbar>
//       </AppBar>

//       <Box sx={{ display: 'flex', flexGrow: 1, mt: `${appBarHeight}px` }}> {/* Use mt to push content below AppBar */}

//         {currentUserRole === 'user' && (
//           <>
//             <UserSidebar
//               conversations={conversations}
//               onNewChat={handleNewChat}
//               onSelectConversation={setCurrentConversationId}
//               currentConversationId={currentConversationId}
//               userDisplayName="John Doe"
//               userEmail="john.doe@company.com"
//             />
//             <Box
//               component="main"
//               sx={{
//                 flexGrow: 1,
//                 bgcolor: 'background.default',
//                 ml: `${drawerWidth}px`,
//                 display: 'flex',
//                 flexDirection: 'column',
//                 height: `calc(100vh - ${appBarHeight}px)`,
//                 overflow: 'hidden',
//               }}
//             >
//               <Chatbot
//                 currentConversation={currentConversation}
//                 onSendMessage={handleSendMessageToChatbot}
//                 chatInput={chatInput}
//                 setChatInput={setChatInput}
//                 chatLoading={chatLoading}
//                 onMarkConversationResolved={handleMarkConversationResolved}
//               />
//             </Box>
//           </>
//         )}

//         {/* ADMIN CONTENT AREA (now includes previous Engineer content) */}
//         {currentUserRole === 'admin' && (
//           <Container maxWidth="lg" sx={{ mt: 4, pb: 4, flexGrow: 1 }}>
//             <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
//             <AdminPanel /> {/* Placeholder for unique admin tools */}
//             <Box sx={{ mt: 4 }}>
//                 <Typography variant="h5" gutterBottom>Ticket Management (Engineer Features)</Typography>
//                 {selectedEngineerTicket ? (
//                   <EngineerTicketDetail
//                     ticket={selectedEngineerTicket}
//                     onBack={() => setSelectedEngineerTicket(null)}
//                     onResolveTicket={handleResolveTicket}
//                     onLLMSuggestion={handleLLMSuggestion}
//                   />
//                 ) : (
//                   <>
//                     <DashboardStats stats={stats} />
//                     <RecentTicketList tickets={tickets} onTicketClick={setSelectedEngineerTicket} />
//                   </>
//                 )}
//             </Box>
//           </Container>
//         )}
//       </Box>

//       {openCreateTicketModal && (
//         <TicketFormModal
//           open={openCreateTicketModal}
//           onClose={() => {
//             setOpenCreateTicketModal(false);
//           }}
//           onSubmit={handleNewTicket}
//         />
//       )}
//     </Box>
//   );
// }

// export default App;

// // src/App.js
// import React, { useState, useMemo, useEffect } from 'react';
// import {
//   Box,
//   Container,
//   CssBaseline,
//   Typography,
//   AppBar,
//   Toolbar,
//   IconButton // NEW: Import IconButton for the menu button
// } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu'; // NEW: Import MenuIcon

// import Header from './components/Header';
// import DashboardStats from './components/DashboardStats';
// import RecentTicketList from './components/RecentTicketList';
// import TicketFormModal from './components/TicketFormModal';
// import EngineerTicketDetail from './components/EngineerTicketDetail';
// import AdminPanel from './components/AdminPanel';

// import Chatbot from './components/Chatbot/Chatbot'; // Chatbot is now the main chat display component
// import UserSidebar from './components/UserSidebar';


// // --- Mock Data for Tickets ---
// const initialTickets = [
//   {
//     id: 'TKT001',
//     title: 'Login Issues with SSO',
//     description: 'Unable to authenticate using company SSO credentials. Tried resetting password, clearing cache, and different browsers. Still no access.',
//     status: 'open', // 'open', 'in-progress', 'resolved'
//     priority: 'high', // 'low', 'medium', 'high', 'critical'
//     category: 'Authentication',
//     user: 'Alice',
//     createdAt: '2024-01-15',
//     engineerNotes: '',
//     llmSuggestion: '',
//     llmCost: 0,
//     llmTokens: 0,
//     llmModel: '',
//     aiAssisted: false,
//   },
//   {
//     id: 'TKT002',
//     title: 'Dashboard Loading Slowly',
//     description: 'Main dashboard takes 30+ seconds to load data. It used to be much faster. Affects daily reporting.',
//     status: 'in-progress',
//     priority: 'medium',
//     category: 'Performance',
//     user: 'Bob',
//     createdAt: '2024-01-14',
//     engineerNotes: 'Initial check indicates potential database query optimization needed. Running diagnostics.',
//     llmSuggestion: "For dashboard loading issues: 1. Optimize database queries (add indexes, reduce joins). 2. Cache frequently accessed data. 3. Lazy load components. 4. Reduce data transferred by pagination or server-side filtering.",
//     llmCost: 0.0375,
//     llmTokens: 1250,
//     llmModel: 'GPT-4',
//     aiAssisted: true,
//   },
//   {
//     id: 'TKT003',
//     title: 'API Rate Limiting Error',
//     description: 'Getting 429 errors when making API calls to the external service. Our application is becoming unstable due to this.',
//     status: 'resolved',
//     priority: 'critical',
//     category: 'API Integration',
//     user: 'Charlie',
//     createdAt: '2024-01-13',
//     engineerNotes: 'Increased API rate limit with vendor. Implemented retry mechanism with exponential backoff in our client code. Monitored for 24 hours, no further errors.',
//     llmSuggestion: "To handle API rate limits: 1. Implement exponential backoff for retries. 2. Use client-side rate limiting. 3. Request higher limits from API provider. 4. Cache API responses where possible.",
//     llmCost: 0.0220,
//     llmTokens: 800,
//     llmModel: 'Claude-3',
//     aiAssisted: true,
//   },
//   {
//     id: 'TKT004',
//     title: 'Email Notifications Failing',
//     description: 'Users are not receiving email notifications for critical system events. Checked email server, seems fine.',
//     status: 'open',
//     priority: 'high',
//     category: 'Notifications',
//     user: 'David',
//     createdAt: '2024-01-16',
//     engineerNotes: '',
//     llmSuggestion: '',
//     llmCost: 0,
//     llmTokens: 0,
//     llmModel: '',
//     aiAssisted: false,
//   },
// ];

// // --- Mock Data for Conversations ---
// const initialConversations = [
//   {
//     id: 'CONV001',
//     ticketId: 'TKT001',
//     ticketTitle: 'Login Issues with SSO',
//     startDate: '2024-01-15',
//     isResolved: false,
//     messages: [
//       { sender: 'user', text: 'I cannot log in using SSO. Password reset not working.' },
//       { sender: 'ai', text: 'I understand. Have you tried clearing your browser cache and cookies?' },
//       { sender: 'user', text: 'Yes, I tried that and still no luck.' },
//       { sender: 'ai', text: 'Okay. Can you verify your username and which SSO provider you are trying to use?' },
//     ],
//   },
//   {
//     id: 'CONV002',
//     ticketId: 'TKT002',
//     ticketTitle: 'Dashboard Loading Slowly',
//     startDate: '2024-01-14',
//     isResolved: true,
//     resolvedDate: '2024-01-15',
//     messages: [
//       { sender: 'user', text: 'My dashboard is loading very slowly, takes forever to show data.' },
//       { sender: 'ai', text: 'I see. This sounds like a performance issue. Have you tried using a different browser or checking your internet speed?' },
//       { sender: 'user', text: 'Yes, confirmed it\'s slow on multiple browsers and my internet is fast.' },
//       { sender: 'ai', text: 'Thank you for the details. The engineering team is investigating. In the meantime, try reducing the data range you are viewing. If you need a quick overview, the summarized reports might be faster.' },
//       { sender: 'user', text: 'Okay, I\'ll try that. Thanks for the tip!' }
//     ],
//     resolutionNotes: `Solution for Dashboard Loading Slowly:
// 1. Try refreshing the page after 5 minutes.
// 2. Check your internet connection speed.
// 3. If using a VPN, try disconnecting and reconnecting.
// 4. Reduce the data range of the dashboard view if possible.
// 5. The IT team is aware of potential performance issues and is working on database optimization. Your patience is appreciated.`
//   },
// ];


// const drawerWidth = 280; // Define drawer width for consistent layout
// const collapsedDrawerWidth = 60; // Width when collapsed (just enough for icons)
// const appBarHeight = 64; // Standard MUI AppBar height

// function App() {
//   const [tickets, setTickets] = useState(initialTickets);
//   const [conversations, setConversations] = useState(initialConversations);
//   const [currentUserRole, setCurrentUserRole] = useState('user'); // Default to 'user'
//   const [openCreateTicketModal, setOpenCreateTicketModal] = useState(false);
//   const [selectedEngineerTicket, setSelectedEngineerTicket] = useState(null); // This will now be for Admin use

//   const [currentConversationId, setCurrentConversationId] = useState(
//     initialConversations.length > 0 ? initialConversations[0].id : null
//   );
//   const [chatInput, setChatInput] = useState('');
//   const [chatLoading, setChatLoading] = useState(false);

//   // NEW: State for sidebar collapse
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   const stats = useMemo(() => {
//     const open = tickets.filter(t => t.status === 'open').length;
//     const inProgress = tickets.filter(t => t.status === 'in-progress').length;
//     const resolved = tickets.filter(t => t.status === 'resolved').length;
//     const aiAssisted = tickets.filter(t => t.aiAssisted).length;
//     const aiCosts = tickets.reduce((sum, t) => sum + t.llmCost, 0);
//     return { open, inProgress, resolved, aiAssisted, aiCosts };
//   }, [tickets]);

//   useEffect(() => {
//     // Only auto-select for user role
//     if (currentUserRole === 'user' && !currentConversationId && conversations.length > 0) {
//       setCurrentConversationId(conversations[0].id);
//     }
//     // Also clear selected ticket when switching away from engineer/admin view
//     if (currentUserRole !== 'admin' && selectedEngineerTicket) {
//       setSelectedEngineerTicket(null);
//     }
//     // Clear conversation selection if role is not user, or if selected conversation gets deleted
//     if (currentUserRole !== 'user' && currentConversationId) {
//       setCurrentConversationId(null);
//     }
//   }, [currentUserRole, currentConversationId, conversations, selectedEngineerTicket]);

//   const handleNewTicket = (newTicketData) => {
//     const newId = `TKT${String(tickets.length + 1).padStart(3, '0')}`;
//     const newTicket = {
//       id: newId,
//       title: newTicketData.title,
//       description: newTicketData.description,
//       status: 'open',
//       priority: newTicketData.priority || 'medium',
//       category: newTicketData.category || 'General',
//       user: 'Current End User',
//       createdAt: new Date().toISOString().split('T')[0],
//       engineerNotes: '',
//       llmSuggestion: '',
//       llmCost: 0,
//       llmTokens: 0,
//       llmModel: '',
//       aiAssisted: false,
//     };
//     setTickets((prevTickets) => [...prevTickets, newTicket]);

//     const newConvId = `CONV${String(conversations.length + 1).padStart(3, '0')}`;
//     const newConversation = {
//       id: newConvId,
//       ticketId: newTicket.id,
//       ticketTitle: newTicket.title,
//       startDate: newTicket.createdAt,
//       isResolved: false,
//       messages: [
//         { sender: 'ai', text: `Hello! I've noted your new ticket #${newTicket.id}: "${newTicket.title}". How can I assist you with this issue?` }
//       ],
//     };
//     setConversations((prevConversations) => [newConversation, ...prevConversations]);
//     setCurrentConversationId(newConvId); // Auto-select the newly created conversation
//     setOpenCreateTicketModal(false); // Close the modal
//   };

//   const handleResolveTicket = (ticketId, resolutionNotes) => {
//     setTickets((prevTickets) =>
//       prevTickets.map((ticket) =>
//         ticket.id === ticketId
//           ? {
//               ...ticket,
//               status: 'resolved',
//               engineerNotes: resolutionNotes,
//               engineer: 'Current Admin', // Resolved by Admin
//               resolvedDate: new Date().toLocaleDateString(),
//             }
//           : ticket
//       )
//     );
//     setConversations(prevConversations =>
//       prevConversations.map(conv =>
//         conv.ticketId === ticketId && !conv.isResolved
//           ? { ...conv, isResolved: true, resolvedDate: new Date().toLocaleDateString(), resolutionNotes: resolutionNotes }
//           : conv
//       )
//     );
//     setSelectedEngineerTicket(null); // Clears the ticket detail view
//     alert(`Ticket ${ticketId} resolved successfully!`);
//   };

//   const handleLLMSuggestion = (ticketId, suggestion, model, cost, tokens) => {
//     setTickets((prevTickets) =>
//       prevTickets.map((ticket) =>
//         ticket.id === ticketId
//           ? {
//               ...ticket,
//               llmSuggestion: suggestion,
//               llmModel: model,
//               llmCost: cost,
//               llmTokens: tokens,
//               status: 'in-progress',
//               aiAssisted: true,
//             }
//           : ticket
//       )
//     );
//   };

//   const handleRoleChange = (event, newRole) => {
//     if (newRole !== null) {
//       setCurrentUserRole(newRole);
//       setOpenCreateTicketModal(false);
//       setSelectedEngineerTicket(null); // Always clear when role changes
//       if (newRole === 'user') {
//           setCurrentConversationId(initialConversations.length > 0 ? initialConversations[0].id : null);
//       } else {
//           setCurrentConversationId(null); // Clear conversation when not in user role
//       }
//     }
//   };

//   const handleNewChat = () => {
//     const newConvId = `CONV${String(conversations.length + 1).padStart(3, '0')}`;
//     const newConversation = {
//       id: newConvId,
//       ticketId: null, // No associated ticket yet
//       ticketTitle: 'New Chat',
//       startDate: new Date().toISOString().split('T')[0],
//       isResolved: false,
//       messages: [{ sender: 'ai', text: "Hello! How can I help you with a new issue today?" }],
//     };
//     setConversations((prevConversations) => [newConversation, ...prevConversations]);
//     setCurrentConversationId(newConvId);
//   };

//   const handleSendMessageToChatbot = async (message) => {
//     if (message.trim() === '' || !currentConversationId) return;

//     setChatLoading(true);
//     const userMessage = message.trim();

//     setConversations(prev => prev.map(conv =>
//       conv.id === currentConversationId
//         ? { ...conv, messages: [...conv.messages, { sender: 'user', text: userMessage }] }
//         : conv
//     ));

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 1500));
//       const dummyChatResponses = [
//         "Hello! I'm your TicketAI assistant. How can I help you today?",
//         "Please provide more details.",
//         "I can summarize information or suggest next steps.",
//         "That's an interesting problem. Let me check the knowledge base...",
//         "Could you elaborate more on the symptoms?",
//         "Thank you for the information. I'm processing your request.",
//         "I am just a demo chatbot for now, but I can simulate helpful responses!",
//       ];
//       const randomIndex = Math.floor(Math.random() * dummyChatResponses.length);
//       const aiResponseText = dummyChatResponses[randomIndex];

//       setConversations(prev => prev.map(conv =>
//         conv.id === currentConversationId
//           ? { ...conv, messages: [...conv.messages, { sender: 'ai', text: aiResponseText }] }
//           : conv
//       ));
//     } catch (error) {
//       console.error('Error simulating chatbot response:', error);
//       setConversations(prev => prev.map(conv =>
//         conv.id === currentConversationId
//           ? { ...conv, messages: [...conv.messages, { sender: 'ai', text: 'Oops! Something went wrong. Please try again.' }] }
//           : conv
//       ));
//     } finally {
//       setChatLoading(false);
//       setChatInput('');
//     }
//   };

//   const handleMarkConversationResolved = (conversationId, solutionText) => {
//     setConversations(prevConversations =>
//       prevConversations.map(conv => {
//         if (conv.id === conversationId) {
//           setTickets(prevTickets =>
//             prevTickets.map(ticket =>
//               ticket.id === conv.ticketId
//                 ? { ...ticket, status: 'resolved', engineerNotes: solutionText, resolvedDate: new Date().toLocaleDateString() }
//                 : ticket
//             )
//           );
//           return {
//             ...conv,
//             isResolved: true,
//             resolvedDate: new Date().toLocaleDateString(),
//             resolutionNotes: solutionText,
//           };
//         }
//         return conv;
//       })
//     );
//     alert(`Conversation ${conversationId} marked as resolved!`);
//   };

//   const currentConversation = useMemo(() => {
//     return conversations.find(conv => conv.id === currentConversationId) || null;
//   }, [currentConversationId, conversations]);


//   return (
//     <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
//       <CssBaseline />

//       <AppBar
//         position="fixed"
//         sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'grey.200', borderRadius: 0 }}
//         elevation={1}
//       >
//         <Toolbar>
//           {currentUserRole === 'user' && ( // NEW: Show menu button only for user role
//             <IconButton
//               color="inherit"
//               aria-label="open drawer"
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               edge="start"
//               sx={{ mr: 2, color: 'text.primary' }} // Adjust color to be visible on white background
//             >
//               <MenuIcon />
//             </IconButton>
//           )}
//           <Header
//             currentUserRole={currentUserRole}
//             onRoleChange={handleRoleChange}
//           />
//         </Toolbar>
//       </AppBar>

//       {/* Main content area below the AppBar */}
//       <Box sx={{ display: 'flex', flexGrow: 1, mt: `${appBarHeight}px` }}> {/* Use mt to push content below AppBar */}

//         {currentUserRole === 'user' && (
//           <>
//             <UserSidebar
//               conversations={conversations}
//               onNewChat={handleNewChat}
//               onSelectConversation={setCurrentConversationId}
//               currentConversationId={currentConversationId}
//               userDisplayName="John Doe"
//               userEmail="john.doe@company.com"
//               sidebarOpen={sidebarOpen} // NEW: Pass sidebar state
//               appBarHeight={appBarHeight}
//             />
//             <Box
//               component="main"
//               sx={{
//                 flexGrow: 1,
//                 bgcolor: 'background.default',
//                 //ml: sidebarOpen ? `${drawerWidth}px` : `${collapsedDrawerWidth}px`, // NEW: Adjust margin based on sidebar state
//                 //transition: (theme) => theme.transitions.create('margin', { // Smooth transition
//                 //  easing: theme.transitions.easing.easeOut,
//                 //  duration: theme.transitions.duration.enteringScreen,
//                 //}),
//                 display: 'flex',
//                 flexDirection: 'column',
//                 height: `calc(100vh - ${appBarHeight}px)`, // Adjust height to fill remaining space
//                 overflow: 'hidden', // Ensure no overflow from messages
//               }}
//             >
//               {/* The main chat content area, now fully handled by Chatbot */}
//               <Chatbot
//                 currentConversation={currentConversation}
//                 onSendMessage={handleSendMessageToChatbot}
//                 chatInput={chatInput}
//                 setChatInput={setChatInput}
//                 chatLoading={chatLoading}
//                 onMarkConversationResolved={handleMarkConversationResolved}
//               />
//             </Box>
//           </>
//         )}

//         {/* ADMIN CONTENT AREA (now includes previous Engineer content) */}
//         {currentUserRole === 'admin' && (
//           <Container maxWidth="lg" sx={{ mt: 4, pb: 4, flexGrow: 1 }}>
//             <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
//             <AdminPanel /> {/* Placeholder for unique admin tools */}
//             <Box sx={{ mt: 4 }}>
//                 <Typography variant="h5" gutterBottom>Ticket Management (Engineer Features)</Typography>
//                 {selectedEngineerTicket ? (
//                   <EngineerTicketDetail
//                     ticket={selectedEngineerTicket}
//                     onBack={() => setSelectedEngineerTicket(null)}
//                     onResolveTicket={handleResolveTicket}
//                     onLLMSuggestion={handleLLMSuggestion}
//                   />
//                 ) : (
//                   <>
//                     <DashboardStats stats={stats} />
//                     <RecentTicketList tickets={tickets} onTicketClick={setSelectedEngineerTicket} />
//                   </>
//                 )}
//             </Box>
//           </Container>
//         )}
//       </Box>

//       {openCreateTicketModal && (
//         <TicketFormModal
//           open={openCreateTicketModal}
//           onClose={() => {
//             setOpenCreateTicketModal(false);
//           }}
//           onSubmit={handleNewTicket}
//         />
//       )}
//     </Box>
//   );
// }

// export default App;

// // src/App.js
// import React, { useState, useMemo, useEffect } from 'react';
// import {
//   Box,
//   Container,
//   CssBaseline,
//   Typography,
//   AppBar,
//   Toolbar,
//   IconButton // NEW: Import IconButton for the menu button
// } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu'; // NEW: Import MenuIcon

// import Header from './components/Header';
// import DashboardStats from './components/DashboardStats';
// import RecentTicketList from './components/RecentTicketList';
// import TicketFormModal from './components/TicketFormModal';
// import EngineerTicketDetail from './components/EngineerTicketDetail';
// import AdminPanel from './components/AdminPanel'; // We'll modify this later if needed

// // Chatbot is now the main chat display component
// import Chatbot from './components/Chatbot/Chatbot';

// // UserSidebar will list conversations and launch new ones
// import UserSidebar from './components/UserSidebar';

// // NEW IMPORT for Admin Management Panel
// import AdminManagementPanel from './components/Admin/AdminManagementPanel';

// import KnowledgeBaseManagement from './components/Admin/KnowledgeBaseManagement';


// // --- Mock Data for Tickets ---
// const initialTickets = [
//   {
//     id: 'TKT001',
//     title: 'Login Issues with SSO',
//     description: 'Unable to authenticate using company SSO credentials. Tried resetting password, clearing cache, and different browsers. Still no access.',
//     status: 'open', // 'open', 'in-progress', 'resolved'
//     priority: 'high', // 'low', 'medium', 'high', 'critical'
//     category: 'Authentication',
//     user: 'Alice',
//     createdAt: '2024-01-15',
//     engineerNotes: '',
//     llmSuggestion: '',
//     llmCost: 0,
//     llmTokens: 0,
//     llmModel: '',
//     aiAssisted: false,
//   },
//   {
//     id: 'TKT002',
//     title: 'Dashboard Loading Slowly',
//     description: 'Main dashboard takes 30+ seconds to load data. It used to be much faster. Affects daily reporting.',
//     status: 'in-progress',
//     priority: 'medium',
//     category: 'Performance',
//     user: 'Bob',
//     createdAt: '2024-01-14',
//     engineerNotes: 'Initial check indicates potential database query optimization needed. Running diagnostics.',
//     llmSuggestion: "For dashboard loading issues: 1. Optimize database queries (add indexes, reduce joins). 2. Cache frequently accessed data. 3. Lazy load components. 4. Reduce data transferred by pagination or server-side filtering.",
//     llmCost: 0.0375,
//     llmTokens: 1250,
//     llmModel: 'GPT-4',
//     aiAssisted: true,
//   },
//   {
//     id: 'TKT003',
//     title: 'API Rate Limiting Error',
//     description: 'Getting 429 errors when making API calls to the external service. Our application is becoming unstable due to this.',
//     status: 'resolved',
//     priority: 'critical',
//     category: 'API Integration',
//     user: 'Charlie',
//     createdAt: '2024-01-13',
//     engineerNotes: 'Increased API rate limit with vendor. Implemented retry mechanism with exponential backoff in our client code. Monitored for 24 hours, no further errors.',
//     llmSuggestion: "To handle API rate limits: 1. Implement exponential backoff for retries. 2. Use client-side rate limiting. 3. Request higher limits from API provider. 4. Cache API responses where possible.",
//     llmCost: 0.0220,
//     llmTokens: 800,
//     llmModel: 'Claude-3',
//     aiAssisted: true,
//   },
//   {
//     id: 'TKT004',
//     title: 'Email Notifications Failing',
//     description: 'Users are not receiving email notifications for critical system events. Checked email server, seems fine.',
//     status: 'open',
//     priority: 'high',
//     category: 'Notifications',
//     user: 'David',
//     createdAt: '2024-01-16',
//     engineerNotes: '',
//     llmSuggestion: '',
//     llmCost: 0,
//     llmTokens: 0,
//     llmModel: '',
//     aiAssisted: false,
//   },
// ];

// // --- Mock Data for Conversations ---
// const initialConversations = [
//   {
//     id: 'CONV001',
//     ticketId: 'TKT001',
//     ticketTitle: 'Login Issues with SSO',
//     startDate: '2024-01-15',
//     isResolved: false,
//     messages: [
//       { sender: 'user', text: 'I cannot log in using SSO. Password reset not working.' },
//       { sender: 'ai', text: 'I understand. Have you tried clearing your browser cache and cookies?' },
//       { sender: 'user', text: 'Yes, I tried that and still no luck.' },
//       { sender: 'ai', text: 'Okay. Can you verify your username and which SSO provider you are trying to use?' },
//     ],
//   },
//   {
//     id: 'CONV002',
//     ticketId: 'TKT002',
//     ticketTitle: 'Dashboard Loading Slowly',
//     startDate: '2024-01-14',
//     isResolved: true,
//     resolvedDate: '2024-01-15',
//     messages: [
//       { sender: 'user', text: 'My dashboard is loading very slowly, takes forever to show data.' },
//       { sender: 'ai', text: 'I see. This sounds like a performance issue. Have you tried using a different browser or checking your internet speed?' },
//       { sender: 'user', text: 'Yes, confirmed it\'s slow on multiple browsers and my internet is fast.' },
//       { sender: 'ai', text: 'Thank you for the details. The engineering team is investigating. In the meantime, try reducing the data range you are viewing. If you need a quick overview, the summarized reports might be faster.' },
//       { sender: 'user', text: 'Okay, I\'ll try that. Thanks for the tip!' }
//     ],
//     resolutionNotes: `Solution for Dashboard Loading Slowly:
// 1. Try refreshing the page after 5 minutes.
// 2. Check your internet connection speed.
// 3. If using a VPN, try disconnecting and reconnecting.
// 4. Reduce the data range of the dashboard view if possible.
// 5. The IT team is aware of potential performance issues and is working on database optimization. Your patience is appreciated.`
//   },
// ];

// // NEW: Mock User Data for the system
// const initialUsers = [
//   { id: 'usr001', name: 'John Doe', email: 'john.doe@company.com', role: 'user' },
//   { id: 'usr002', name: 'Hrishikesh Kumar', email: 'hrishikeskumar@it.com', role: 'admin' }, // Changed to admin
//   { id: 'usr003', name: 'Alice Smith', email: 'alice.smith@company.com', role: 'user' },
//   { id: 'usr004', name: 'Bob Engineer', email: 'bob@company.com', role: 'user' }, // Changed to user, as engineer role is absorbed
// ];


// const drawerWidth = 280; // Standard open width
// const collapsedDrawerWidth = 60; // Width when collapsed (just enough for icons)
// const appBarHeight = 64; // Standard MUI AppBar height

// function App() {
//   const [tickets, setTickets] = useState(initialTickets);
//   const [conversations, setConversations] = useState(initialConversations);
//   const [users, setUsers] = useState(initialUsers); // NEW STATE FOR USERS
//   const [currentUserRole, setCurrentUserRole] = useState('user'); // Default to 'user'
//   const [openCreateTicketModal, setOpenCreateTicketModal] = useState(false);
//   const [selectedEngineerTicket, setSelectedEngineerTicket] = useState(null); // This will now be for Admin use

//   const [currentConversationId, setCurrentConversationId] = useState(
//     initialConversations.length > 0 ? initialConversations[0].id : null
//   );
//   const [chatInput, setChatInput] = useState('');
//   const [chatLoading, setChatLoading] = useState(false);

//   // NEW: State for sidebar collapse
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   const stats = useMemo(() => {
//     const open = tickets.filter(t => t.status === 'open').length;
//     const inProgress = tickets.filter(t => t.status === 'in-progress').length;
//     const resolved = tickets.filter(t => t.status === 'resolved').length;
//     const aiAssisted = tickets.filter(t => t.aiAssisted).length;
//     const aiCosts = tickets.reduce((sum, t) => sum + t.llmCost, 0);
//     return { open, inProgress, resolved, aiAssisted, aiCosts };
//   }, [tickets]);

//   useEffect(() => {
//     // Only auto-select for user role
//     if (currentUserRole === 'user' && !currentConversationId && conversations.length > 0) {
//       setCurrentConversationId(conversations[0].id);
//     }
//     // Also clear selected ticket when switching away from admin view
//     if (currentUserRole !== 'admin' && selectedEngineerTicket) {
//       setSelectedEngineerTicket(null);
//     }
//     // Clear conversation selection if role is not user, or if selected conversation gets deleted
//     if (currentUserRole !== 'user' && currentConversationId) {
//       setCurrentConversationId(null);
//     }
//   }, [currentUserRole, currentConversationId, conversations, selectedEngineerTicket]);

//   const handleNewTicket = (newTicketData) => {
//     const newId = `TKT${String(tickets.length + 1).padStart(3, '0')}`;
//     const newTicket = {
//       id: newId,
//       title: newTicketData.title,
//       description: newTicketData.description,
//       status: 'open',
//       priority: newTicketData.priority || 'medium',
//       category: newTicketData.category || 'General',
//       user: 'Current End User', // For user created tickets
//       createdAt: new Date().toISOString().split('T')[0],
//       engineerNotes: '',
//       llmSuggestion: '',
//       llmCost: 0,
//       llmTokens: 0,
//       llmModel: '',
//       aiAssisted: false,
//     };
//     setTickets((prevTickets) => [...prevTickets, newTicket]);

//     const newConvId = `CONV${String(conversations.length + 1).padStart(3, '0')}`;
//     const newConversation = {
//       id: newConvId,
//       ticketId: newTicket.id,
//       ticketTitle: newTicket.title,
//       startDate: newTicket.createdAt,
//       isResolved: false,
//       messages: [
//         { sender: 'ai', text: `Hello! I've noted your new ticket #${newTicket.id}: "${newTicket.title}". How can I assist you with this issue?` }
//       ],
//     };
//     setConversations((prevConversations) => [newConversation, ...prevConversations]);
//     setCurrentConversationId(newConvId); // Auto-select the newly created conversation
//     setOpenCreateTicketModal(false); // Close the modal
//   };

//   const handleResolveTicket = (ticketId, resolutionNotes) => {
//     setTickets((prevTickets) =>
//       prevTickets.map((ticket) =>
//         ticket.id === ticketId
//           ? {
//               ...ticket,
//               status: 'resolved',
//               engineerNotes: resolutionNotes,
//               engineer: 'Current Admin', // Resolved by Admin
//               resolvedDate: new Date().toLocaleDateString(),
//             }
//           : ticket
//       )
//     );
//     setConversations(prevConversations =>
//       prevConversations.map(conv =>
//         conv.ticketId === ticketId && !conv.isResolved
//           ? { ...conv, isResolved: true, resolvedDate: new Date().toLocaleDateString(), resolutionNotes: resolutionNotes }
//           : conv
//       )
//     );
//     setSelectedEngineerTicket(null); // Clears the ticket detail view
//     alert(`Ticket ${ticketId} resolved successfully!`);
//   };

//   const handleLLMSuggestion = (ticketId, suggestion, model, cost, tokens) => {
//     setTickets((prevTickets) =>
//       prevTickets.map((ticket) =>
//         ticket.id === ticketId
//           ? {
//               ...ticket,
//               llmSuggestion: suggestion,
//               llmModel: model,
//               llmCost: cost,
//               llmTokens: tokens,
//               status: 'in-progress',
//               aiAssisted: true,
//             }
//           : ticket
//       )
//     );
//   };

//   const handleRoleChange = (event, newRole) => {
//     if (newRole !== null) {
//       setCurrentUserRole(newRole);
//       setOpenCreateTicketModal(false);
//       setSelectedEngineerTicket(null); // Always clear when role changes
//       if (newRole === 'user') {
//           setCurrentConversationId(initialConversations.length > 0 ? initialConversations[0].id : null);
//       } else {
//           setCurrentConversationId(null); // Clear conversation when not in user role
//       }
//     }
//   };

//   const handleNewChat = () => {
//     const newConvId = `CONV${String(conversations.length + 1).padStart(3, '0')}`;
//     const newConversation = {
//       id: newConvId,
//       ticketId: null, // No associated ticket yet
//       ticketTitle: 'New Chat',
//       startDate: new Date().toISOString().split('T')[0],
//       isResolved: false,
//       messages: [{ sender: 'ai', text: "Hello! How can I help you with a new issue today?" }],
//     };
//     setConversations((prevConversations) => [newConversation, ...prevConversations]);
//     setCurrentConversationId(newConvId);
//   };

//   const handleSendMessageToChatbot = async (message) => {
//     if (message.trim() === '' || !currentConversationId) return;

//     setChatLoading(true);
//     const userMessage = message.trim();

//     setConversations(prev => prev.map(conv =>
//       conv.id === currentConversationId
//         ? { ...conv, messages: [...conv.messages, { sender: 'user', text: userMessage }] }
//         : conv
//     ));

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 1500));
//       const dummyChatResponses = [
//         "Hello! I'm your TicketAI assistant. How can I help you today?",
//         "Please provide more details.",
//         "I can summarize information or suggest next steps.",
//         "That's an interesting problem. Let me check the knowledge base...",
//         "Could you elaborate more on the symptoms?",
//         "Thank you for the information. I'm processing your request.",
//         "I am just a demo chatbot for now, but I can simulate helpful responses!",
//       ];
//       const randomIndex = Math.floor(Math.random() * dummyChatResponses.length);
//       const aiResponseText = dummyChatResponses[randomIndex];

//       setConversations(prev => prev.map(conv =>
//         conv.id === currentConversationId
//           ? { ...conv, messages: [...conv.messages, { sender: 'ai', text: aiResponseText }] }
//           : conv
//       ));
//     } catch (error) {
//       console.error('Error simulating chatbot response:', error);
//       setConversations(prev => prev.map(conv =>
//         conv.id === currentConversationId
//           ? { ...conv, messages: [...conv.messages, { sender: 'ai', text: 'Oops! Something went wrong. Please try again.' }] }
//           : conv
//       ));
//     } finally {
//       setChatLoading(false);
//       setChatInput('');
//     }
//   };

//   const handleMarkConversationResolved = (conversationId, solutionText) => {
//     setConversations(prevConversations =>
//       prevConversations.map(conv => {
//         if (conv.id === conversationId) {
//           setTickets(prevTickets =>
//             prevTickets.map(ticket =>
//               ticket.id === conv.ticketId
//                 ? { ...ticket, status: 'resolved', engineerNotes: solutionText, resolvedDate: new Date().toLocaleDateString() }
//                 : ticket
//             )
//           );
//           return {
//             ...conv,
//             isResolved: true,
//             resolvedDate: new Date().toLocaleDateString(),
//             resolutionNotes: solutionText,
//           };
//         }
//         return conv;
//       })
//     );
//     alert(`Conversation ${conversationId} marked as resolved!`);
//   };

//   // User management handlers
//   const handleAddUser = (newUser) => {
//     const newId = `usr${String(users.length + 1).padStart(3, '0')}`;
//     setUsers((prevUsers) => [...prevUsers, { ...newUser, id: newId }]);
//   };

//   const handleUpdateUser = (userId, updatedUser) => {
//     setUsers((prevUsers) =>
//       prevUsers.map((user) => (user.id === userId ? updatedUser : user))
//     );
//   };

//   const handleDeleteUser = (userId) => {
//     setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
//   };


//   const currentConversation = useMemo(() => {
//     return conversations.find(conv => conv.id === currentConversationId) || null;
//   }, [currentConversationId, conversations]);


//   return (
//     <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
//       <CssBaseline />

//       <AppBar
//         position="fixed"
//         sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'grey.200', borderRadius: 0 }}
//         elevation={1}
//       >
//         <Toolbar>
//           {currentUserRole === 'user' && (
//             <IconButton
//               color="inherit"
//               aria-label="open drawer"
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               edge="start"
//               sx={{ mr: 2, color: 'text.primary' }}
//             >
//               <MenuIcon />
//             </IconButton>
//           )}
//           <Header
//             currentUserRole={currentUserRole}
//             onRoleChange={handleRoleChange}
//           />
//         </Toolbar>
//       </AppBar>

//       {/* Main content area below the AppBar */}
//       <Box sx={{ display: 'flex', flexGrow: 1, mt: `${appBarHeight}px` }}> {/* Use mt to push content below AppBar */}

//         {currentUserRole === 'user' && (
//           <>
//             <UserSidebar
//               conversations={conversations}
//               onNewChat={handleNewChat}
//               onSelectConversation={setCurrentConversationId}
//               currentConversationId={currentConversationId}
//               userDisplayName="John Doe"
//               userEmail="john.doe@company.com"
//               sidebarOpen={sidebarOpen}
//               appBarHeight={appBarHeight}
//             />
//             <Box
//               component="main"
//               sx={{
//                 flexGrow: 1,
//                 bgcolor: 'background.default',
//                 ml: sidebarOpen ? `${drawerWidth}px` : `${collapsedDrawerWidth}px`,
//                 transition: (theme) => theme.transitions.create('margin', {
//                   easing: theme.transitions.easing.easeOut,
//                   duration: theme.transitions.duration.enteringScreen,
//                 }),
//                 display: 'flex',
//                 flexDirection: 'column',
//                 height: `calc(100vh - ${appBarHeight}px)`,
//                 overflow: 'hidden',
//               }}
//             >
//               <Chatbot
//                 currentConversation={currentConversation}
//                 onSendMessage={handleSendMessageToChatbot}
//                 chatInput={chatInput}
//                 setChatInput={setChatInput}
//                 chatLoading={chatLoading}
//                 onMarkConversationResolved={handleMarkConversationResolved}
//               />
//             </Box>
//           </>
//         )}

//         {/* ADMIN CONTENT AREA (now includes previous Engineer content) */}
//         {currentUserRole === 'admin' && (
//           <Container maxWidth="lg" sx={{ mt: 4, pb: 4, flexGrow: 1 }}>
//             <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
//             {/* The AdminPanel content */}
//             <AdminPanel />

//             {/* Knowledge Base Management Section */}
//             <Box sx={{ mt: 4 }}>
//                 <KnowledgeBaseManagement />
//             </Box>

//             {/* User Management Panel */}
//             <Box sx={{ mt: 4 }}>
//                 <AdminManagementPanel
//                     users={users}
//                     onAddUser={handleAddUser}
//                     onUpdateUser={handleUpdateUser}
//                     onDeleteUser={handleDeleteUser}
//                 />
//             </Box>

//             {/* Ticket Management (Engineer Features) */}
//             <Box sx={{ mt: 4 }}>
//                 <Typography variant="h5" gutterBottom>Ticket Management (Engineer Features)</Typography>
//                 {selectedEngineerTicket ? (
//                   <EngineerTicketDetail
//                     ticket={selectedEngineerTicket}
//                     onBack={() => setSelectedEngineerTicket(null)}
//                     onResolveTicket={handleResolveTicket}
//                     onLLMSuggestion={handleLLMSuggestion}
//                   />
//                 ) : (
//                   <>
//                     <DashboardStats stats={stats} />
//                     <RecentTicketList tickets={tickets} onTicketClick={setSelectedEngineerTicket} />
//                   </>
//                 )}
//             </Box>
//           </Container>
//         )}
//       </Box>

//       {openCreateTicketModal && (
//         <TicketFormModal
//           open={openCreateTicketModal}
//           onClose={() => {
//             setOpenCreateTicketModal(false);
//           }}
//           onSubmit={handleNewTicket}
//         />
//       )}
//     </Box>
//   );
// }

// export default App;

// src/App.js
// import React, { useState, useMemo, useEffect } from 'react';
// import {
//   Box,
//   Container,
//   CssBaseline,
//   Typography,
//   AppBar,
//   Toolbar,
//   IconButton
// } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';

// import Header from './components/Header';
// import DashboardStats from './components/DashboardStats'; // Still useful for conversation stats
// // import RecentTicketList from './components/RecentTicketList'; // NO LONGER NEEDED
// import TicketFormModal from './components/TicketFormModal'; // Still useful for admin to create a formal ticket (if needed)
// import EngineerTicketDetail from './components/EngineerTicketDetail'; // NO LONGER NEEDED
// import AdminPanel from './components/AdminPanel';

// import Chatbot from './components/Chatbot/Chatbot';
// import UserSidebar from './components/UserSidebar';

// import AdminManagementPanel from './components/Admin/AdminManagementPanel';
// import KnowledgeBaseManagement from './components/Admin/KnowledgeBaseManagement';
// import RecentConversationList from './components/Admin/RecentConversationList';


// // --- Mock Data for Conversations --- (This will be the primary data source now)
// const initialConversations = [
//   {
//     id: 'CONV001',
//     // Removed ticketId, ticketTitle might become topic or main issue
//     topic: 'Login Issues with SSO', // New field
//     startDate: '2024-01-15',
//     isResolved: false,
//     messages: [
//       { sender: 'user', text: 'I cannot log in using SSO. Password reset not working.' },
//       { sender: 'ai', text: 'I understand. Have you tried clearing your browser cache and cookies?' },
//       { sender: 'user', text: 'Yes, I tried that and still no luck.' },
//       { sender: 'ai', text: 'Okay. Can you verify your username and which SSO provider you are trying to use?' },
//     ],
//     user: 'John Doe',
//     category: 'Account Access', // New field
//     priority: 'High', // New field
//   },
//   {
//     id: 'CONV002',
//     topic: 'Dashboard Loading Slowly',
//     startDate: '2024-01-14',
//     isResolved: true,
//     resolvedDate: '2024-01-15',
//     messages: [
//       { sender: 'user', text: 'My dashboard is loading very slowly, takes forever to show data.' },
//       { sender: 'ai', text: 'I see. This sounds like a performance issue. Have you tried using a different browser or checking your internet speed?' },
//       { sender: 'user', text: 'Yes, confirmed it\'s slow on multiple browsers and my internet is fast.' },
//       { sender: 'ai', text: 'Thank you for the details. The engineering team is investigating. In the meantime, try reducing the data range you are viewing. If you need a quick overview, the summarized reports might be faster.' },
//       { sender: 'user', text: 'Okay, I\'ll try that. Thanks for the tip!' }
//     ],
//     resolutionNotes: `Solution for Dashboard Loading Slowly:
// 1. Try refreshing the page after 5 minutes.
// 2. Check your internet connection speed.
// 3. If using a VPN, try disconnecting and reconnecting.
// 4. Reduce the data range of the dashboard view if possible.
// 5. The IT team is aware of potential performance issues and is working on database optimization. Your patience is appreciated.`,
//     user: 'Alice Smith',
//     category: 'Performance',
//     priority: 'Medium',
//   },
//   {
//     id: 'CONV003',
//     topic: 'API Rate Limiting Error',
//     startDate: '2024-01-13',
//     isResolved: false, // This conversation is still open
//     messages: [
//       { sender: 'user', text: 'Getting 429 errors when making API calls to the external service. Our application is becoming unstable due to this.' },
//       { sender: 'ai', text: 'I understand you are encountering API rate limiting issues. Can you provide the API endpoint and the approximate time the errors started?' }
//     ],
//     user: 'Hrishikesh Kumar',
//     category: 'API Integration',
//     priority: 'Critical',
//   },
//   {
//     id: 'CONV004',
//     topic: 'Email Notifications Failing',
//     startDate: '2024-01-16',
//     isResolved: false,
//     messages: [
//       { sender: 'user', text: 'Users are not receiving email notifications for critical system events. Checked email server, seems fine.' },
//     ],
//     user: 'Bob Engineer',
//     category: 'Notifications',
//     priority: 'High',
//   },
// ];


// // Mock User Data for the system (used for displaying user names in conversations)
// const initialUsers = [
//   { id: 'usr001', name: 'John Doe', email: 'john.doe@company.com', role: 'user' },
//   { id: 'usr002', name: 'Hrishikesh Kumar', email: 'hrishikeskumar@it.com', role: 'admin' },
//   { id: 'usr003', name: 'Alice Smith', email: 'alice.smith@company.com', role: 'user' },
//   { id: 'usr004', name: 'Bob Engineer', email: 'bob@company.com', role: 'user' },
// ];


// const drawerWidth = 280;
// const collapsedDrawerWidth = 60;
// const appBarHeight = 64;

// function App() {
//   // Removed `tickets` state
//   const [conversations, setConversations] = useState(initialConversations);
//   const [users, setUsers] = useState(initialUsers);
//   const [currentUserRole, setCurrentUserRole] = useState('user');
//   const [openCreateTicketModal, setOpenCreateTicketModal] = useState(false); // Still available for admin to formally create a "ticket" (now conversation)
//   // Removed `selectedEngineerTicket` - details for conversation will be handled by selecting a conversation
//   const [selectedConversationForAdmin, setSelectedConversationForAdmin] = useState(null); // New state for admin to view specific conversation details

//   const [currentConversationId, setCurrentConversationId] = useState(
//     initialConversations.length > 0 ? initialConversations[0].id : null
//   );
//   const [chatInput, setChatInput] = useState('');
//   const [chatLoading, setChatLoading] = useState(false);

//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   // Stats calculation now based on conversations
//   const stats = useMemo(() => {
//     const totalConversations = conversations.length;
//     const openConversations = conversations.filter(c => !c.isResolved).length;
//     const resolvedConversations = conversations.filter(c => c.isResolved).length;
//     // AI assisted conversations and costs would come from conversation metadata.
//     // We'll simulate these for now as we don't have explicit fields on conversation objects.
//     const aiAssistedConversations = conversations.filter(c => c.messages.some(m => m.sender === 'ai')).length; // Simple heuristic
//     const aiCosts = conversations.reduce((sum, c) => {
//         // If conversations had a specific 'llmCost' field, we'd use that.
//         // For now, let's just mock a cost per AI message for demonstration.
//         const aiMessagesCount = c.messages.filter(m => m.sender === 'ai').length;
//         return sum + (aiMessagesCount * 0.005); // Mock cost per AI message
//     }, 0);


//     return {
//       open: openConversations,
//       inProgress: 0, // In this simplified model, 'in progress' is just part of 'open'
//       resolved: resolvedConversations,
//       total: totalConversations, // Add total for a possible new stat card
//       aiAssisted: aiAssistedConversations,
//       aiCosts: aiCosts
//     };
//   }, [conversations]);

//   // useEffect for cleanup/auto-selection
//   useEffect(() => {
//     // For User role: auto-select first conversation
//     if (currentUserRole === 'user' && !currentConversationId && conversations.length > 0) {
//       setCurrentConversationId(conversations[0].id);
//     }
//     // Clear conversation selection if role is not user
//     if (currentUserRole !== 'user' && currentConversationId) {
//       setCurrentConversationId(null);
//     }
//     // Clear admin-selected conversation if role is not admin
//     if (currentUserRole !== 'admin' && selectedConversationForAdmin) {
//         setSelectedConversationForAdmin(null);
//     }
//   }, [currentUserRole, currentConversationId, conversations, selectedConversationForAdmin]);


//   // handleNewTicket is now more like "Create Formal Issue" from a conversation
//   const handleNewTicket = (newIssueData) => { // Renamed from newTicketData to newIssueData
//     const newConvId = `CONV${String(conversations.length + 1).padStart(3, '0')}`;
//     const newConversation = {
//       id: newConvId,
//       // topic can be taken from the form, or default to a generic "New Issue"
//       topic: newIssueData.title || 'New Formal Issue',
//       startDate: new Date().toISOString().split('T')[0],
//       isResolved: false,
//       messages: [{ sender: 'ai', text: `A formal issue #${newConvId} has been created. We will get back to you.` }],
//       user: 'Current Admin', // Assuming admin creates it
//       category: newIssueData.category || 'General',
//       priority: newIssueData.priority || 'Medium',
//     };
//     setConversations((prevConversations) => [newConversation, ...prevConversations]);
//     // The admin might not immediately jump into this new conversation, so no setCurrentConversationId
//     setOpenCreateTicketModal(false); // Close the modal
//     alert(`Formal Issue/Conversation "${newIssueData.title}" created.`);
//   };

//   // handleResolveTicket is now handleResolveConversation (for Admin)
//   const handleResolveConversationForAdmin = (conversationId, resolutionNotes) => {
//     setConversations(prevConversations =>
//       prevConversations.map(conv =>
//         conv.id === conversationId && !conv.isResolved
//           ? {
//               ...conv,
//               isResolved: true,
//               resolvedDate: new Date().toLocaleDateString(),
//               // Update user field to reflect admin resolution
//               messages: [...conv.messages, {sender: 'ai', text: `This conversation was marked as resolved by Admin with notes: "${resolutionNotes}"`}],
//               resolutionNotes: resolutionNotes,
//             }
//           : conv
//       )
//     );
//     setSelectedConversationForAdmin(null); // Clear the detail view
//     alert(`Conversation ${conversationId} resolved successfully by Admin!`);
//   };

//   // handleLLMSuggestion is removed as it was for tickets

//   const handleRoleChange = (event, newRole) => {
//     if (newRole !== null) {
//       setCurrentUserRole(newRole);
//       setOpenCreateTicketModal(false);
//       setSelectedConversationForAdmin(null); // Clear admin-selected conversation on role change
//       if (newRole === 'user') {
//           setCurrentConversationId(initialConversations.length > 0 ? initialConversations[0].id : null);
//       } else {
//           setCurrentConversationId(null);
//       }
//     }
//   };

//   const handleNewChat = () => {
//     const newConvId = `CONV${String(conversations.length + 1).padStart(3, '0')}`;
//     const newConversation = {
//       id: newConvId,
//       topic: 'New Chat',
//       startDate: new Date().toISOString().split('T')[0],
//       isResolved: false,
//       messages: [{ sender: 'ai', text: "Hello! How can I help you with a new issue today?" }],
//       user: 'John Doe', // Assume 'John Doe' is the current user for new chats
//       category: 'General Inquiry',
//       priority: 'Low',
//     };
//     setConversations((prevConversations) => [newConversation, ...prevConversations]);
//     setCurrentConversationId(newConvId);
//   };

//   const handleSendMessageToChatbot = async (message) => {
//     if (message.trim() === '' || !currentConversationId) return;

//     setChatLoading(true);
//     const userMessage = message.trim();

//     setConversations(prev => prev.map(conv =>
//       conv.id === currentConversationId
//         ? { ...conv, messages: [...conv.messages, { sender: 'user', text: userMessage }] }
//         : conv
//     ));

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 1500));
//       const dummyChatResponses = [
//         "Hello! I'm your TicketAI assistant. How can I help you today?",
//         "Please provide more details.",
//         "I can summarize information or suggest next steps.",
//         "That's an interesting problem. Let me check the knowledge base...",
//         "Could you elaborate more on the symptoms?",
//         "Thank you for the information. I'm processing your request.",
//         "I am just a demo chatbot for now, but I can simulate helpful responses!",
//       ];
//       const randomIndex = Math.floor(Math.random() * dummyChatResponses.length);
//       const aiResponseText = dummyChatResponses[randomIndex];

//       setConversations(prev => prev.map(conv =>
//         conv.id === currentConversationId
//           ? { ...conv, messages: [...conv.messages, { sender: 'ai', text: aiResponseText }] }
//           : conv
//       ));
//     } catch (error) {
//       console.error('Error simulating chatbot response:', error);
//       setConversations(prev => prev.map(conv =>
//         conv.id === currentConversationId
//           ? { ...conv, messages: [...conv.messages, { sender: 'ai', text: 'Oops! Something went wrong. Please try again.' }] }
//           : conv
//       ));
//     } finally {
//       setChatLoading(false);
//       setChatInput('');
//     }
//   };

//   const handleMarkConversationResolved = (conversationId, solutionText) => {
//     setConversations(prevConversations =>
//       prevConversations.map(conv => {
//         if (conv.id === conversationId) {
//           return {
//             ...conv,
//             isResolved: true,
//             resolvedDate: new Date().toLocaleDateString(),
//             resolutionNotes: solutionText,
//             messages: [...conv.messages, {sender: 'ai', text: `This conversation was marked as resolved by the user.`}],
//           };
//         }
//         return conv;
//       })
//     );
//     alert(`Conversation ${conversationId} marked as resolved by user!`);
//   };

//   const handleAddUser = (newUser) => {
//     const newId = `usr${String(users.length + 1).padStart(3, '0')}`;
//     setUsers((prevUsers) => [...prevUsers, { ...newUser, id: newId }]);
//   };

//   const handleUpdateUser = (userId, updatedUser) => {
//     setUsers((prevUsers) =>
//       prevUsers.map((user) => (user.id === userId ? updatedUser : user))
//     );
//   };

//   const handleDeleteUser = (userId) => {
//     setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
//   };


//   const currentConversation = useMemo(() => {
//     return conversations.find(conv => conv.id === currentConversationId) || null;
//   }, [currentConversationId, conversations]);

//   // Admin selected conversation details for EngineerTicketDetail-like view
//   const adminSelectedConversation = useMemo(() => {
//     return conversations.find(conv => conv.id === selectedConversationForAdmin?.id) || null;
//   }, [selectedConversationForAdmin, conversations]);


//   return (
//     <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
//       <CssBaseline />

//       <AppBar
//         position="fixed"
//         sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'grey.200', borderRadius: 0 }}
//         elevation={1}
//       >
//         <Toolbar>
//           {currentUserRole === 'user' && (
//             <IconButton
//               color="inherit"
//               aria-label="open drawer"
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               edge="start"
//               sx={{ mr: 2, color: 'text.primary' }}
//             >
//               <MenuIcon />
//             </IconButton>
//           )}
//           <Header
//             currentUserRole={currentUserRole}
//             onRoleChange={handleRoleChange}
//           />
//         </Toolbar>
//       </AppBar>

//       <Box sx={{ display: 'flex', flexGrow: 1, mt: `${appBarHeight}px` }}>

//         {currentUserRole === 'user' && (
//           <>
//             <UserSidebar
//               conversations={conversations}
//               onNewChat={handleNewChat}
//               onSelectConversation={setCurrentConversationId}
//               currentConversationId={currentConversationId}
//               userDisplayName="John Doe"
//               userEmail="john.doe@company.com"
//               sidebarOpen={sidebarOpen}
//               appBarHeight={appBarHeight}
//             />
//             <Box
//               component="main"
//               sx={{
//                 flexGrow: 1,
//                 bgcolor: 'background.default',
//                 ml: sidebarOpen ? `${drawerWidth}px` : `${collapsedDrawerWidth}px`,
//                 transition: (theme) => theme.transitions.create('margin', {
//                   easing: theme.transitions.easing.easeOut,
//                   duration: theme.transitions.duration.enteringScreen,
//                 }),
//                 display: 'flex',
//                 flexDirection: 'column',
//                 height: `calc(100vh - ${appBarHeight}px)`,
//                 overflow: 'hidden',
//               }}
//             >
//               <Chatbot
//                 currentConversation={currentConversation}
//                 onSendMessage={handleSendMessageToChatbot}
//                 chatInput={chatInput}
//                 setChatInput={setChatInput}
//                 chatLoading={chatLoading}
//                 onMarkConversationResolved={handleMarkConversationResolved}
//               />
//             </Box>
//           </>
//         )}

//         {/* ADMIN CONTENT AREA */}
//         {currentUserRole === 'admin' && (
//           <Container maxWidth="lg" sx={{ mt: 4, pb: 4, flexGrow: 1 }}>
//             <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
//             <AdminPanel />

//             {/* Knowledge Base Management Section */}
//             <Box sx={{ mt: 4 }}>
//                 <KnowledgeBaseManagement />
//             </Box>

//             {/* User Management Panel */}
//             <Box sx={{ mt: 4 }}>
//                 <AdminManagementPanel
//                     users={users}
//                     onAddUser={handleAddUser}
//                     onUpdateUser={handleUpdateUser}
//                     onDeleteUser={handleDeleteUser}
//                 />
//             </Box>

//             {/* Conversation Management (Replacing Ticket Management) */}
//             <Box sx={{ mt: 4 }}>
//                 <Typography variant="h5" gutterBottom>Conversation Management</Typography>
//                 {selectedConversationForAdmin ? (
//                     // We'll reuse EngineerTicketDetail for now, but it will need to be adapted or a new component created
//                     // to properly display conversation history and actions for Admin.
//                     // For now, it will receive the adminSelectedConversation.
//                   <EngineerTicketDetail
//                     // The EngineerTicketDetail expects a 'ticket' object, so we'll map conversation fields to ticket fields
//                     ticket={{
//                         id: adminSelectedConversation.id,
//                         title: adminSelectedConversation.topic,
//                         description: adminSelectedConversation.messages.map(m => `${m.sender}: ${m.text}`).join('\n'), // Combine messages
//                         status: adminSelectedConversation.isResolved ? 'Resolved' : 'Open',
//                         priority: adminSelectedConversation.priority || 'Medium',
//                         user: adminSelectedConversation.user,
//                         createdAt: adminSelectedConversation.startDate,
//                         engineerNotes: adminSelectedConversation.resolutionNotes || '',
//                         llmSuggestion: 'N/A', // No LLM suggestion directly on conversation here
//                         llmCost: 0,
//                         llmTokens: 0,
//                         llmModel: '',
//                     }}
//                     onBack={() => setSelectedConversationForAdmin(null)}
//                     // Pass a handler to resolve conversation, mapping it to handleResolveConversationForAdmin
//                     onResolveTicket={(convId, resolutionNotes) => handleResolveConversationForAdmin(convId, resolutionNotes)}
//                     // LLM Suggestion on tickets is removed, so this is just a placeholder
//                     onLLMSuggestion={() => alert('LLM Suggestion not available directly for conversation view in this proto.')}
//                   />
//                 ) : (
//                   <>
//                     <DashboardStats stats={stats} />
//                     <RecentConversationList
//                         conversations={conversations}
//                         users={users}
//                         onConversationClick={(conv) => setSelectedConversationForAdmin(conv)}
//                     />
//                   </>
//                 )}
//             </Box>
//           </Container>
//         )}
//       </Box>

//       {openCreateTicketModal && (
//         <TicketFormModal
//           open={openCreateTicketModal}
//           onClose={() => {
//             setOpenCreateTicketModal(false);
//           }}
//           onSubmit={handleNewTicket} // This modal can still be used by Admin to "create formal issues"
//         />
//       )}
//     </Box>
//   );
// }

// export default App;

// src/App.js
import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Container,
  CssBaseline,
  Typography,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import Header from './components/Header';
import DashboardStats from './components/DashboardStats'; // Now for Conversation Stats
// Removed RecentTicketList
// Removed TicketFormModal
// Removed EngineerTicketDetail
import EngineerTicketDetail from './components/EngineerTicketDetail';
import AdminPanel from './components/AdminPanel';

import Chatbot from './components/Chatbot/Chatbot';
import UserSidebar from './components/UserSidebar';

import AdminManagementPanel from './components/Admin/AdminManagementPanel';
import KnowledgeBaseManagement from './components/Admin/KnowledgeBaseManagement';
import RecentConversationList from './components/Admin/RecentConversationList';


// --- Mock Data for Conversations --- (This is the primary data source now)
const initialConversations = [
  {
    id: 'CONV001',
    topic: 'Login Issues with SSO', // Use topic instead of ticketTitle
    startDate: '2024-01-15',
    isResolved: false,
    messages: [
      { sender: 'user', text: 'I cannot log in using SSO. Password reset not working.' },
      { sender: 'ai', text: 'I understand. Have you tried clearing your browser cache and cookies?' },
      { sender: 'user', text: 'Yes, I tried that and still no luck.' },
      { sender: 'ai', text: 'Okay. Can you verify your username and which SSO provider you are trying to use?' },
    ],
    user: 'John Doe',
    category: 'Account Access',
    priority: 'High',
  },
  {
    id: 'CONV002',
    topic: 'Dashboard Loading Slowly',
    startDate: '2024-01-14',
    isResolved: true,
    resolvedDate: '2024-01-15',
    messages: [
      { sender: 'user', text: 'My dashboard is loading very slowly, takes forever to show data.' },
      { sender: 'ai', text: 'I see. This sounds like a performance issue. Have you tried using a different browser or checking your internet speed?' },
      { sender: 'user', text: 'Yes, confirmed it\'s slow on multiple browsers and my internet is fast.' },
      { sender: 'ai', text: 'Thank you for the details. The engineering team is investigating. In the meantime, try reducing the data range you are viewing. If you need a quick overview, the summarized reports might be faster.' },
      { sender: 'user', text: 'Okay, I\'ll try that. Thanks for the tip!' }
    ],
    resolutionNotes: `Solution for Dashboard Loading Slowly:
1. Try refreshing the page after 5 minutes.
2. Check your internet connection speed.
3. If using a VPN, try disconnecting and reconnecting.
4. Reduce the data range of the dashboard view if possible.
5. The IT team is aware of potential performance issues and is working on database optimization. Your patience is appreciated.`,
    user: 'Alice Smith',
    category: 'Performance',
    priority: 'Medium',
  },
  {
    id: 'CONV003',
    topic: 'API Rate Limiting Error',
    startDate: '2024-01-13',
    isResolved: false, // This conversation is still open
    messages: [
      { sender: 'user', text: 'Getting 429 errors when making API calls to the external service. Our application is becoming unstable due to this.' },
      { sender: 'ai', text: 'I understand you are encountering API rate limiting issues. Can you provide the API endpoint and the approximate time the errors started?' }
    ],
    user: 'Hrishikesh Kumar',
    category: 'API Integration',
    priority: 'Critical',
  },
  {
    id: 'CONV004',
    topic: 'Email Notifications Failing',
    startDate: '2024-01-16',
    isResolved: false,
    messages: [
      { sender: 'user', text: 'Users are not receiving email notifications for critical system events. Checked email server, seems fine.' },
    ],
    user: 'Bob Engineer',
    category: 'Notifications',
    priority: 'High',
  },
];


// Mock User Data for the system (used for displaying user names in conversations)
const initialUsers = [
  { id: 'usr001', name: 'John Doe', email: 'john.doe@company.com', role: 'user' },
  { id: 'usr002', name: 'Hrishikesh Kumar', email: 'hrishikeskumar@it.com', role: 'admin' },
  { id: 'usr003', name: 'Alice Smith', email: 'alice.smith@company.com', role: 'user' },
  { id: 'usr004', name: 'Bob Engineer', email: 'bob@company.com', role: 'user' },
];


const drawerWidth = 280;
const collapsedDrawerWidth = 60;
const appBarHeight = 64;

function App() {
  // REMOVED `tickets` state
  const [conversations, setConversations] = useState(initialConversations);
  const [users, setUsers] = useState(initialUsers);
  const [currentUserRole, setCurrentUserRole] = useState('user');
  // Removed `openCreateTicketModal` as it was for tickets
  // Removed `selectedEngineerTicket` as it was for tickets
  const [selectedConversationForAdmin, setSelectedConversationForAdmin] = useState(null); // New state for admin to view specific conversation details

  const [currentConversationId, setCurrentConversationId] = useState(
    initialConversations.length > 0 ? initialConversations[0].id : null
  );
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Stats calculation now based on conversations
  const stats = useMemo(() => {
    const totalConversations = conversations.length;
    const openConversations = conversations.filter(c => !c.isResolved).length;
    const resolvedConversations = conversations.filter(c => c.isResolved).length;
    const aiAssistedConversations = conversations.filter(c => c.messages.some(m => m.sender === 'ai')).length; // Simple heuristic
    const aiCosts = conversations.reduce((sum, c) => {
        const aiMessagesCount = c.messages.filter(m => m.sender === 'ai').length;
        return sum + (aiMessagesCount * 0.005); // Mock cost per AI message
    }, 0);

    return {
      open: openConversations,
      inProgress: 0, // In this simplified model, 'in progress' is just part of 'open'
      resolved: resolvedConversations,
      total: totalConversations, // Add total for a possible new stat card
      aiAssisted: aiAssistedConversations,
      aiCosts: aiCosts
    };
  }, [conversations]);

  // UseEffect for cleanup/auto-selection
  useEffect(() => {
    if (currentUserRole === 'user' && !currentConversationId && conversations.length > 0) {
      setCurrentConversationId(conversations[0].id);
    }
    // No selectedEngineerTicket check as it's removed
    if (currentUserRole !== 'admin' && selectedConversationForAdmin) {
      setSelectedConversationForAdmin(null);
    }
    if (currentUserRole !== 'user' && currentConversationId) {
      setCurrentConversationId(null);
    }
  }, [currentUserRole, currentConversationId, conversations, selectedConversationForAdmin]);


  // REMOVED handleNewTicket (ticket creation)
  // REMOVED handleResolveTicket (ticket resolution)
  // REMOVED handleLLMSuggestion (LLM suggestion for tickets)

  const handleRoleChange = (event, newRole) => {
    if (newRole !== null) {
      setCurrentUserRole(newRole);
      // Removed setOpenCreateTicketModal
      // Removed setSelectedEngineerTicket
      setSelectedConversationForAdmin(null); // Clear admin-selected conversation on role change
      if (newRole === 'user') {
          setCurrentConversationId(initialConversations.length > 0 ? initialConversations[0].id : null);
      } else {
          setCurrentConversationId(null);
      }
    }
  };

  const handleNewChat = () => {
    const newConvId = `CONV${String(conversations.length + 1).padStart(3, '0')}`;
    const newConversation = {
      id: newConvId,
      topic: 'New Chat',
      startDate: new Date().toISOString().split('T')[0],
      isResolved: false,
      messages: [{ sender: 'ai', text: "Hello! How can I help you with a new issue today?" }],
      user: 'John Doe', // Assume 'John Doe' is the current user for new chats
      category: 'General Inquiry',
      priority: 'Low',
    };
    setConversations((prevConversations) => [newConversation, ...prevConversations]);
    setCurrentConversationId(newConvId);
  };

  const handleSendMessageToChatbot = async (message) => {
    if (message.trim() === '' || !currentConversationId) return;

    setChatLoading(true);
    const userMessage = message.trim();

    setConversations(prev => prev.map(conv =>
      conv.id === currentConversationId
        ? { ...conv, messages: [...conv.messages, { sender: 'user', text: userMessage }] }
        : conv
    ));

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const dummyChatResponses = [
        "Hello! I'm your TicketAI assistant. How can I help you today?",
        "Please provide more details.",
        "I can summarize information or suggest next steps.",
        "That's an interesting problem. Let me check the knowledge base...",
        "Could you elaborate more on the symptoms?",
        "Thank you for the information. I'm processing your request.",
        "I am just a demo chatbot for now, but I can simulate helpful responses!",
      ];
      const randomIndex = Math.floor(Math.random() * dummyChatResponses.length);
      const aiResponseText = dummyChatResponses[randomIndex];

      setConversations(prev => prev.map(conv =>
        conv.id === currentConversationId
          ? { ...conv, messages: [...conv.messages, { sender: 'ai', text: aiResponseText }] }
          : conv
      ));
    } catch (error) {
      console.error('Error simulating chatbot response:', error);
      setConversations(prev => prev.map(conv =>
        conv.id === currentConversationId
          ? { ...conv, messages: [...conv.messages, { sender: 'ai', text: 'Oops! Something went wrong. Please try again.' }] }
          : conv
      ));
    } finally {
      setChatLoading(false);
      setChatInput('');
    }
  };

  const handleMarkConversationResolved = (conversationId, solutionText) => {
    setConversations(prevConversations =>
      prevConversations.map(conv => {
        if (conv.id === conversationId) {
          // No interaction with `tickets` needed here
          return {
            ...conv,
            isResolved: true,
            resolvedDate: new Date().toLocaleDateString(),
            resolutionNotes: solutionText,
            messages: [...conv.messages, {sender: 'ai', text: `This conversation was marked as resolved by the user.`}],
          };
        }
        return conv;
      })
    );
    alert(`Conversation ${conversationId} marked as resolved!`);
  };

  // Admin-specific conversation resolution
  const handleResolveConversationForAdmin = (conversationId, resolutionNotes) => {
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === conversationId && !conv.isResolved
          ? {
              ...conv,
              isResolved: true,
              resolvedDate: new Date().toLocaleDateString(),
              messages: [...conv.messages, {sender: 'ai', text: `This conversation was marked as resolved by Admin with notes: "${resolutionNotes}"`}],
              resolutionNotes: resolutionNotes,
            }
          : conv
      )
    );
    setSelectedConversationForAdmin(null); // Clear the detail view
    alert(`Conversation ${conversationId} resolved successfully by Admin!`);
  };

  const handleAddUser = (newUser) => {
    const newId = `usr${String(users.length + 1).padStart(3, '0')}`;
    setUsers((prevUsers) => [...prevUsers, { ...newUser, id: newId }]);
  };

  const handleUpdateUser = (userId, updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === userId ? updatedUser : user))
    );
  };

  const handleDeleteUser = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };


  const currentConversation = useMemo(() => {
    return conversations.find(conv => conv.id === currentConversationId) || null;
  }, [currentConversationId, conversations]);

  const adminSelectedConversation = useMemo(() => {
    return conversations.find(conv => conv.id === selectedConversationForAdmin?.id) || null;
  }, [selectedConversationForAdmin, conversations]);


  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'grey.200', borderRadius: 0 }}
        elevation={1}
      >
        <Toolbar>
          {currentUserRole === 'user' && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              edge="start"
              sx={{ mr: 2, color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Header
            currentUserRole={currentUserRole}
            onRoleChange={handleRoleChange}
          />
        </Toolbar>
      </AppBar>

      {/* Main content area below the AppBar */}
      <Box sx={{ display: 'flex', flexGrow: 1, mt: `${appBarHeight}px`, width: '100%' }}>

        {currentUserRole === 'user' && (
          <>
            <UserSidebar
              conversations={conversations}
              onNewChat={handleNewChat}
              onSelectConversation={setCurrentConversationId}
              currentConversationId={currentConversationId}
              userDisplayName="Hrishikesh Kumar"
              userEmail="hrishikeshkumar@it.com"
              sidebarOpen={sidebarOpen}
              appBarHeight={appBarHeight}
            />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                bgcolor: 'background.default',
                ml: sidebarOpen ? `${drawerWidth}px` : `${collapsedDrawerWidth}px`,
                transition: (theme) => theme.transitions.create('margin', {
                  easing: theme.transitions.easing.easeOut,
                  duration: theme.transitions.duration.enteringScreen,
                }),
                display: 'flex',
                flexDirection: 'column',
                height: `calc(100vh - ${appBarHeight}px)`,
                overflow: 'hidden',
              }}
            >
              <Chatbot
                currentConversation={currentConversation}
                onSendMessage={handleSendMessageToChatbot}
                chatInput={chatInput}
                setChatInput={setChatInput}
                chatLoading={chatLoading}
                onMarkConversationResolved={handleMarkConversationResolved}
              />
            </Box>
          </>
        )}

        {/* ADMIN CONTENT AREA */}
        {currentUserRole === 'admin' && (
          <Container maxWidth="lg" sx={{ mt: 4, pb: 4, flexGrow: 1 }}>
            <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
            <AdminPanel />

            <Box sx={{ mt: 4 }}>
                <KnowledgeBaseManagement />
            </Box>

            <Box sx={{ mt: 4 }}>
                <AdminManagementPanel
                    users={users}
                    onAddUser={handleAddUser}
                    onUpdateUser={handleUpdateUser}
                    onDeleteUser={handleDeleteUser}
                />
            </Box>

            {/* Conversation Management */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>Conversation Management</Typography>
                {adminSelectedConversation ? (
                    // This is where you would ideally have a dedicated AdminConversationDetail component
                    // For now, we are adapting EngineerTicketDetail, which expects a 'ticket' object.
                    // We must map conversation fields to match the 'ticket' structure it expects.
                  <EngineerTicketDetail
                    ticket={{
                        id: adminSelectedConversation.id,
                        title: adminSelectedConversation.topic,
                        // Combine conversation messages into a single string for description
                        description: adminSelectedConversation.messages.map(m => `${m.sender}: ${m.text}`).join('\n\n'),
                        status: adminSelectedConversation.isResolved ? 'resolved' : 'open', // Lowercase to match internal status values
                        priority: adminSelectedConversation.priority || 'Medium',
                        user: adminSelectedConversation.user,
                        createdAt: adminSelectedConversation.startDate,
                        engineerNotes: adminSelectedConversation.resolutionNotes || '',
                        llmSuggestion: 'AI Chat conversation. Review messages above.', // Custom suggestion
                        llmCost: 0, // No direct LLM cost on conversation here
                        llmTokens: 0,
                        llmModel: '',
                    }}
                    onBack={() => setSelectedConversationForAdmin(null)}
                    // Pass a handler to resolve conversation, mapping it to handleResolveConversationForAdmin
                    onResolveTicket={(convId, resolutionNotes) => handleResolveConversationForAdmin(convId, resolutionNotes)}
                    // LLM Suggestion on tickets is removed, so this is just a placeholder
                    onLLMSuggestion={() => alert('LLM Suggestion not directly applicable here; conversation history provides context.')}
                  />
                ) : (
                  <>
                    <DashboardStats stats={stats} />
                    <RecentConversationList
                        conversations={conversations}
                        users={users}
                        onConversationClick={(conv) => setSelectedConversationForAdmin(conv)}
                    />
                  </>
                )}
            </Box>
          </Container>
        )}
      </Box>

      {/* Removed TicketFormModal as tickets concept is gone */}
      {/* openCreateTicketModal is also removed, so this block should be deleted */}
      {/* If an Admin still needs to "create a formal issue", they'd use a new dedicated form */}
    </Box>
  );
}

export default App;