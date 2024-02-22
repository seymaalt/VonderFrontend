
import {useContext } from 'react';
import AuthContext from '../context/AuthContext';

export default function HomePage() {
  const {  token,setToken } = useContext(AuthContext);

  return (
    <div><a href='/login'>Login</a></div>
  )
}
