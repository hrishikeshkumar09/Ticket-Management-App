// src/components/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Box, Avatar, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import CustomLogo from '../images/searching.png';

const Header = ({ currentUserRole, onRoleChange }) => {
  return (
    <AppBar position="static" color="inherit" elevation={1} sx={{ borderBottom: 1, borderColor: 'grey.200' }}>
      <Toolbar sx={{ justifyContent: 'space-between', padding: '16px 24px' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            component="img" // Use Box as an img element for easy MUI styling
            src={CustomLogo} // The imported SVG URL
            alt="Logo"
            sx={{
              height: 50, // Adjust size as needed
              width: 50, // Maintain aspect ratio
              color: 'primary.main', // This will NOT color the SVG directly if it's already colored inside
              margin: 0,
              padding: 0
            }}
          />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Ticket Management App
          </Typography>
          <Box
            sx={{
              bgcolor: currentUserRole === 'user' ? 'success.light' : currentUserRole === 'engineer' ? 'info.light' : 'warning.light',
              color: 'white',
              px: 1.5,
              py: 0.5,
              borderRadius: '6px',
              ml: 2,
              fontSize: '0.8rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          >
            {currentUserRole}
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: 'grey.300', color: 'text.primary', fontWeight: 'bold', width: 40, height: 40 }}>
            HK
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Hrishikesh Kumar</Typography>
            <Typography variant="body2" color="text.secondary">hrishikeshkumar@it.com</Typography>
          </Box>

          <ToggleButtonGroup
            value={currentUserRole}
            exclusive
            onChange={onRoleChange}
            aria-label="user role"
            sx={{
                bgcolor: 'background.paper',
                borderRadius: '8px',
                '& .MuiToggleButton-root': {
                    border: '1px solid',
                    borderColor: 'grey.300',
                    '&.Mui-selected': {
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' }
                    }
                }
            }}
          >
            <ToggleButton value="user" aria-label="user role">
              User
            </ToggleButton>
            <ToggleButton value="engineer" aria-label="engineer role">
              Engineer
            </ToggleButton>
            <ToggleButton value="admin" aria-label="admin role">
              Admin
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

// // src/components/Header.js
// import React from 'react';
// import { AppBar, Toolbar, Typography, Box, Avatar, Stack, ToggleButton, ToggleButtonGroup, IconButton } from '@mui/material';
// import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
// import CustomLogo from '../images/searching.png'; 

// const Header = ({ currentUserRole, onRoleChange, onToggleChatbot }) => {
//   return (
//     <AppBar position="static" color="inherit" elevation={1} sx={{ borderBottom: 1, borderColor: 'grey.200' }}>
//       <Toolbar sx={{ justifyContent: 'space-between', padding: '16px 24px' }}>
//         <Stack direction="row" alignItems="center" spacing={1}>
//           <Box
//             component="img"
//             src={CustomLogo}
//             alt="Logo"
//             sx={{
//               height: 32,
//               width: 'auto',
//               color: 'primary.main',
//             }}
//           />

//           <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
//             TicketAI Pro
//           </Typography>
//           <Box
//             sx={{
//               bgcolor: currentUserRole === 'user' ? 'success.light' : currentUserRole === 'engineer' ? 'info.light' : 'warning.light',
//               color: 'white',
//               px: 1.5,
//               py: 0.5,
//               borderRadius: '6px',
//               ml: 2,
//               fontSize: '0.8rem',
//               fontWeight: 'bold',
//               textTransform: 'uppercase',
//             }}
//           >
//             {currentUserRole}
//           </Box>
//         </Stack>

//         <Stack direction="row" alignItems="center" spacing={2}>
//           {/* New Chatbot Button */}
//           <IconButton color="primary" onClick={onToggleChatbot} sx={{ bgcolor: 'grey.100', '&:hover': { bgcolor: 'grey.200' } }}>
//             <ChatBubbleIcon />
//           </IconButton>

//           <Avatar sx={{ bgcolor: 'grey.300', color: 'text.primary', fontWeight: 'bold', width: 40, height: 40 }}>
//             JD
//           </Avatar>
//           <Box>
//             <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>John Doe</Typography>
//             <Typography variant="body2" color="text.secondary">john@company.com</Typography>
//           </Box>

//           <ToggleButtonGroup
//             value={currentUserRole}
//             exclusive
//             onChange={onRoleChange}
//             aria-label="user role"
//             sx={{
//                 bgcolor: 'background.paper',
//                 borderRadius: '8px',
//                 '& .MuiToggleButton-root': {
//                     border: '1px solid',
//                     borderColor: 'grey.300',
//                     '&.Mui-selected': {
//                         bgcolor: 'primary.main',
//                         color: 'white',
//                         '&:hover': { bgcolor: 'primary.dark' }
//                     }
//                 }
//             }}
//           >
//             <ToggleButton value="user" aria-label="user role">
//               User
//             </ToggleButton>
//             <ToggleButton value="engineer" aria-label="engineer role">
//               Engineer
//             </ToggleButton>
//             <ToggleButton value="admin" aria-label="admin role">
//               Admin
//             </ToggleButton>
//           </ToggleButtonGroup>
//         </Stack>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Header;