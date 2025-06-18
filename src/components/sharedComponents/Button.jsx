import styles from '../sharedStyling/buttonStyling.module.css';

export default function Button({type , name}) {
  return (
    <>
      <button type={type} className={styles.btn}>{name}</button>
    </>
  )
}
