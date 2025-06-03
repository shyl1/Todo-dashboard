//styling
import { useContext } from 'react';
import styles from '../SignUpStyling/signup.module.css';


import  AuthContext  from '../../../ContextAPI/AuthenticationContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";

//improting components
import UserName from "./UserName";
import Email from '../../sharedComponents/Email';
import Password from '../../sharedComponents/Password';
import ButtonSignUp from './ButtonSignUp';
import SignUpWithGoogle from './SignUpWithGoogle.jsx';


export default function SignUp() {

  const {validateEmail , validatePassword , signUp}= useContext(AuthContext);

  const navigate = useNavigate();
  //handling email validation 
  // take the email value fron the input by state
  const [email , setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);

  //password
  const [password , setPassword] = useState('');
  const [isPasswordValid ,setIsPasswordValid] = useState(true);

  //username 
  const [username , setUserName] =useState('');
  const [isUsernameValid, setIsUsernameValid] = useState(true);

  // for firesbase error handling
  const [error ,setError] = useState('');


  // Validate username (example: non-empty)
  function validateUsername(username){
    return username.trim() !== '';
  }
  
  async function handleSubmit(e){
    
    e.preventDefault();
    setError(''); // clear pevious errors

    //validate inputs
    const isValidUsername = validateUsername(username);
    const isValidEmail =validateEmail(email);
    const isValidPassword = validatePassword(password);

    setIsUsernameValid(isValidUsername);
    setIsEmailValid(isValidEmail === null);
    setIsPasswordValid(isValidPassword === null);

    // If any validation fails, stop the submission
    if(!isValidEmail && !isValidPassword && !isValidUsername){
      return;
    };

    try {
      await signUp(email, password, username);
      // If sign up is successful, navigate to the home page
      navigate('/');

    } catch (firesbaseError) {
      console.error("sign up errror:", firesbaseError);
      setError(firesbaseError.message);

      if (firesbaseError.code === 'auth/email-already-in-use') {
        setError('Email already in use');
      } else {
        setError("failed to create account");
      }
    }
  }

  function handleClickToLogin(){
    navigate('/');
  }

  return (
    <div className={styles.Container}>
      <div className={styles.LoginContainer}>
        <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.text}>
          <h1>SignUp</h1>
        </div>

        {/* display error */} 
        {
          error && (
            <div className={styles.error}>{error}</div>
          )
        }
        <div className={styles.nameContainer}>
          <UserName username={username} setUserName={setUserName} isUsernameValid={isUsernameValid}/>
        </div>
        <div className={styles.emailConatiner}>
          <Email email={email} setEmail={setEmail} isEmailValid={isEmailValid}/>
        </div>
        <div className={styles.passwordContainer}>
          <Password password={password} setPassword={setPassword} isPasswordValid={isPasswordValid}/>
        </div>
        {/* sgin up btn */}
        <div className={styles.btnContainer}>
          <ButtonSignUp type="submit" />
        </div>

        <div className={styles.OR}>
          OR
        </div>

        {/* Sign up with google */}
        <div className={styles.btnContainer}>
          <SignUpWithGoogle/>
        </div>

        {/* Login option */}
        <div className={styles.loginOption}>
          Already have an account? <strong className={styles.login} onClick={handleClickToLogin}>Log in</strong>
        </div>
        </form>
      </div>
    </div>
  )
}
