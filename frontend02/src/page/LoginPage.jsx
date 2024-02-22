import { useState,useEffect,useContext } from 'react';
import axios from 'axios';
import styles from '../login.module.css';
import AuthContext from '../context/AuthContext';
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const {  token,setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  
  useEffect(() => {
    const storedemail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');
    const storedRememberMe = localStorage.getItem('rememberMe') === 'true';

    if (storedemail && storedPassword && storedRememberMe) {
      setEmail(storedemail);
      setPassword(storedPassword);
      setRememberMe(storedRememberMe);
    }

  }, []);


  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(email,password);
    try {
      
       await axios.post(`${import.meta.env.VITE_API_PORT}/api/users/login`,  { email, password }).then(result =>{
        const jwtToken = result.data.accessToken;
        localStorage.setItem('token', jwtToken);
    
        if (result.status == 200) {
    
          if (rememberMe) {
            localStorage.setItem('email', email);
            localStorage.setItem('password', password);
            localStorage.setItem('rememberMe', true);
          } else {
            localStorage.removeItem('email');
            localStorage.removeItem('password');
            localStorage.removeItem('rememberMe');
          }
          navigate("/");

          setToken(result.data.accessToken)
        }else{
          console.log("giriş başarısız");
        }
    
       });
    } catch (error) {
      console.error('Login failed:', error.response.data);
      setErrorMessage(error.response.data);
    }
  };

  return (
    <>
    <div className={styles.content}>
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit}>
        <div className={styles.logo}>
          <img src="./src/images/vhlogo.png" alt="Logo" className={styles.logo} />
        </div>
        <h1>Login</h1>
        <div className={styles.inputbox}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <i className='bx bxs-envelope'></i>
        </div>
        <div className={styles.inputbox}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i className='bx bxs-lock-alt' ></i>
        </div>
        <div className={styles['remember-forgot']}>
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            remember me
          </label>
          <a href="#">Forgot Password</a>
        </div>
        <div className={styles.register}>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
        <div className={styles.button}>
          <button type="submit">Login</button>
        </div>
        <div className={styles.register}>
          <p>Dont have an account? <a href="/register">Register</a></p>
        </div>
      </form>
    </div>
    </div>
    </>
  );
}

export default Login;
