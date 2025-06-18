// for styling 
import styles from '../loginStyling/login.module.css';

//importing hooks
import {  useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';

//importing AuthContext that has shared validation logic
import  AuthContext  from '../../../ContextAPI/AuthenticationContext';

//importing form login components
import Email from '../../sharedComponents/Email';
import Password from '../../sharedComponents/Password';
import LoginWithGoogle from './LoginWithGoogle';
import LoginIcon from '@mui/icons-material/Login';
import Button from '../../sharedComponents/Button';



export default function Login() {

  const {validateEmail , validatePassword , login , user , isAuthenticated }= useContext(AuthContext);

  const navigate = useNavigate();

  //handling email validation 
  // take the email value fron the input by state
  const [email , setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);

  // paseeword
  const [password , setPassword] = useState('');
  const [isPasswordValid ,setIsPasswordValid] = useState(true);

  // for user existing errors 
  const [errorMessage, setErrorMessage] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  // form Submission handler
  async function handleSubmit(e) {
    e.preventDefault();
  
    // Validate inputs
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setIsEmailValid(!emailError);
    setIsPasswordValid(!passwordError);

    if (emailError || passwordError) {
      return; // Stop if validation fails
    }

    const result =await login(email , password);
    if (result.success) {
      if (result.profileCompleted) {
        navigate("/dashboard");
      } else {
        navigate("/signup");
      }
    } else {
      setPassword(''); // Clear password field on error
      setEmail(''); // Clear email field on error
      handleLoginError(result.error); 
    }
  }


  function handleLoginError(error){
    let userFriendlyMessage = "Login failed. Please try again.";

    // Extract the clean error code without 'auth/' prefix
    const errorCode = error.code.replace('auth/', '');
    
    switch(errorCode){
      case 'invalid-credential':
      case 'invalid-login-credentials':
        userFriendlyMessage = "Invalid email or password. Please check your credentials.";
        break;
      case 'wrong-password':
        userFriendlyMessage = "Incorrect password. Please try again.";
        break;
      case 'invalid-email':
        userFriendlyMessage = "Invalid email format. Please enter a valid email.";
        break;
      case 'too-many-requests':
        userFriendlyMessage = "Too many login attempts. Please try again later.";
        break;
      case 'user-disabled':
        userFriendlyMessage = "This account has been disabled. Please contact support.";
        break;
      case 'account-exists-with-different-credential':
        userFriendlyMessage = "already in use";
        break;
      default:
        userFriendlyMessage = error.message || userFriendlyMessage;
        break;
    }

    setErrorMessage(userFriendlyMessage);
  }


  function handleClickToSign(){
    navigate("/signup");
  }


  return (
    <div className={styles.Container}>
      <div className={styles.LoginContainer}>
        <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.text}>
          <div className={styles.con}>
            <LoginIcon className={styles.loginIcon} sx={{fontSize:50}}/>
            <h1>Login</h1>
          </div>

          {/* display error */}
          {errorMessage && <p className={styles.errorMsg}>{errorMessage}</p>}
        </div>
        {/* login form */}
        <div className={styles.emailConatiner}>
          <Email email={email} setEmail={setEmail} isEmailValid={isEmailValid}/>
        </div>
        <div className={styles.passwordContainer}>
          <Password password={password} setPassword={setPassword} isPasswordValid={isPasswordValid}/>
        </div>
        {/* login btn */}
        <div className={styles.btnContainer}>
          <Button type="submit" name="Login" />
        </div>
        <div className={styles.OR}>
          OR
        </div>
        <div className={styles.btnContainer}>
          <LoginWithGoogle />
        </div>
        <div className={styles.signUpOption}>
          Don&apos;t have an account? <strong className={styles.SginUp} onClick={handleClickToSign}>Sign up here</strong>
        </div>
        </form>
      </div>
    </div>
  )
}
