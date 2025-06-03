import styles from '../../sharedStyling/loginwithgoogle.module.css';

export default function ButtonSignUp({type}) {
  return (
    <>
      <button type={type} className={styles.btn}>Signup</button>
    </>
  )
}
