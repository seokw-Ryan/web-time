// import React, { useState } from 'react';
// import axios from 'axios';
// import './Signup.css';

// const Signup = () => {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:5000/api/users/signup', {
//         username,
//         email,
//         password,
//       });
//       console.log('Sign up successful:', response.data);
//       // Handle successful login (e.g., save token, redirect)
//     } catch (error) {
//       console.error('Error signing up:', error);
//       // Handle error (e.g., show error message)
//     }
//   };

//   return (
//     <div className="login-container">
//       <h1 className="logo">daiw</h1>
//       <form onSubmit={handleSubmit}>
//         <h2>Sign up</h2>
//         <div className="form-floating">
//           <input
//             type="text"
//             className="form-control"
//             id="floatingUsername"
//             placeholder="Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//           <label htmlFor="floatingUsername">Username</label>
//         </div>
//         <div className="form-floating">
//           <input
//             type="email"
//             className="form-control"
//             id="floatingInput"
//             placeholder="Email or Phone"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <label htmlFor="floatingInput">Email or Phone</label>
//         </div>
//         <div className="form-floating">
//           <input
//             type="password"
//             className="form-control"
//             id="floatingPassword"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <label htmlFor="floatingPassword">Password</label>
//         </div>
//         <button className="btn btn-primary w-100 py-2" type="submit">
//           Sign up
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Signup;
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, Card, CardContent } from '@mui/material';
import './Signup.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/signup', {
        username,
        email,
        password,
      });
      console.log('Sign up successful:', response.data);
      // Handle successful login (e.g., save token, redirect)
    } catch (error) {
      console.error('Error signing up:', error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 8,
        }}
      >
        <Typography component="h1" variant="h4" className="logo">
          daiw
        </Typography>
        <Card sx={{ mt: 3, width: '100%' }}>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Signup;

