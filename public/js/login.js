/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// Function to send login request to the server
export const login = async (email, password) => {
  //   console.log(email, password);
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: { email, password },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
    // console.log(res);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// Function to log out the user

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
    });

    if (res.data.status === 'success') {
      location.reload(true);
      showAlert('success', 'Logged out successfully');
      setTimeout(() => {
        location.assign('/');
      }, 2000);
    }
    // console.log(res);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// Function to send sign up request to the server

// export const signUp = async (name, email, password, passwordConfirm) => {
//   //   console.log(name, email, password, passwordConfirm);
//   try {
//     const res = await axios({
//       method: 'POST',
//       url: 'http://127.0.0.1:3000/api/v1/users/signup',
//       data: { name, email, password, passwordConfirm },
//     });

//     if (res.data.status ==='success') {
//       showAlert('success', 'Account created successfully. You can now log in.');
//       setTimeout(() => {
//         location.assign('/login');
//       }, 1500);
//     }
//     // console.log(res);
//   } catch (err) {
//     showAlert('error', err.response.data.message);
//   }
// };
