// import React, { useState } from 'react';
// import axios from 'axios';
// import './Signup.css';

// const Signup = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
  
//     const handleSubmit = async (event) => {
//       event.preventDefault();
//       try {
//         const response = await axios.post('http://localhost:5000/api/users/signup', {
//           email,
//           password,
//         });
//         console.log('Sign up successful:', response.data);
//         // Handle successful login (e.g., save token, redirect)
//       } catch (error) {
//         console.error('Error signing up:', error);
//         // Handle error (e.g., show error message)
//       }
//     };
  
//     return (
//       <div className="login-container">
//         <h1 className="logo">daiw</h1>
//         <form onSubmit={handleSubmit}>
//           <h2>Sign up</h2>
//           <div className="form-floating">
//             <input
//               type="email"
//               className="form-control"
//               id="floatingInput"
//               placeholder="Email or Phone"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <label htmlFor="floatingInput">Email or Phone</label>
//           </div>
//           <div className="form-floating">
//             <input
//               type="password"
//               className="form-control"
//               id="floatingPassword"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <label htmlFor="floatingPassword">Password</label>
//           </div>
//           <button className="btn btn-primary w-100 py-2" type="submit">
//             Sign up
//           </button>
//         </form>
//       </div>
//     );
//   };
  
//   export default Signup;

import React, { useState } from 'react';
import axios from 'axios';
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
    <div className="login-container">
      <h1 className="logo">daiw</h1>
      <form onSubmit={handleSubmit}>
        <h2>Sign up</h2>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="floatingUsername"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="floatingUsername">Username</label>
        </div>
        <div className="form-floating">
          <input
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="Email or Phone"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="floatingInput">Email or Phone</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>
        <button className="btn btn-primary w-100 py-2" type="submit">
          Sign up
        </button>
      </form>
    </div>
  );
};

export default Signup;
