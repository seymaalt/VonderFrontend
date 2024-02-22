import { useState,useEffect,useContext } from 'react';
import axios from 'axios';
import styles from '../login.module.css';
import AuthContext from '../context/AuthContext';
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [userName, setuserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const storeduserName = localStorage.getItem('userName');
    const storedemail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');

    if (storedemail && storedPassword && storeduserName) {
      setEmail(storedemail);
      setPassword(storedPassword);
      setuserName(storeduserName);
    }
  }, []);
  
  const [wrongCredentials, setWrongCredentials] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    //check password and confirm password
    if (password !== confirmPassword) {
      setWrongCredentials(true);
      return;
    } else {
      setWrongCredentials(false);
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_PORT}/api/users/register`,  { userName, email, password }).then(result =>{
        const jwtToken = result.data.accessToken;
        localStorage.setItem('token', jwtToken);
  
        if (result.status == 201) {
          navigate("/");
          setToken(result.data.accessToken)
        }else{
          console.log("kayıt başarısız");
        }
      });
    } catch (error) {
      console.error('Registration failed:', error.response.data);
      setErrorMessage(error.response.data);
    }
  };

  return (
    <div className={styles.content}>
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit}>
       <div className={styles.logo}>
          <img src="src/images/vhlogo.png" alt="Logo" className={styles.logo} />
        </div>
        <h1>Register</h1>
        <label>
          
          <div className={styles.inputbox}>
          <input
            type="userName"
            placeholder="Username"
            value={userName}
            onChange={(e) => setuserName(e.target.value)}
          />
          <i className='bx bxs-user'></i>
          </div>
        </label>
        <label>
          
          <div className={styles.inputbox}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <i className='bx bxs-envelope'></i>
          </div>
        </label>
        <label>
          
          <div className={styles.inputbox}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i className='bx bxs-lock-alt' ></i>
          </div>
        </label>
        <label>
          
          <div className={styles.inputbox}>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <i className='bx bxs-lock-alt' ></i>
          </div>
        </label>
        <div className={styles.register}>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage.error}</p>}
          {wrongCredentials && <p style={{ color: 'red' }}>Passwords do not match.</p>}
        </div>
        <div className={styles.button}>
        <button type="submit">Register</button>
        </div>
        <div className={styles.register}>
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </form>
    </div>
    </div>
  );
}

export default RegisterPage;