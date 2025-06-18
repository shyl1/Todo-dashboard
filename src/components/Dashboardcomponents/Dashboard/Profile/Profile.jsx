import styles from '../sharedProfileLayout/sharedprofilelayout.module.css';
import { SlEnvolope } from "react-icons/sl";
import { IoCameraOutline } from "react-icons/io5";
import { useContext, useEffect } from 'react';
import TaskContext from '../../../../ContextAPI/TaskContext';
//import UserContext from '../../../../ContextAPI/UserContext';
import AuthContext from '../../../../ContextAPI/AuthenticationContext'
import { useNavigate } from 'react-router-dom';

export default function Profile() {

  const {ToStartCounts ,InProgressCounts , CompletedCounts} = useContext(TaskContext);

  //const {user} =useContext(UserContext);

  const {logout , user
  } = useContext(AuthContext);

  const navigate = useNavigate();

  //force re rendering
  useEffect(()=>{

  },[user , user.email])

  function handleLogout(){
    logout(); // Call the logout function
    navigate('/');
  }

  
  return (
    <>
      <div className={styles.ProfileContainer}>
        <div className={styles.outerContainer}>
          <h3>Profile</h3>
          <div className={styles.outerCard}>
          <div className={styles.card}>
            <div className={styles.picWidth}>
              <div className={styles.pic}>
                <img src={user?.img} />
                <span className={styles.cam}><IoCameraOutline style={{marginLeft:'3px'}}/></span>
              </div>
              <h2>{user?.name}</h2>
            </div>
            
            <div className={styles.cards}>
              <div className={styles.content}>
                <div className={styles.textS}>
                  {ToStartCounts}
                </div>
                <span>To Start</span>
              </div>
              <div className={styles.content}>
                <div className={styles.textI}>
                  {InProgressCounts}
                </div>
                <span>In Progress</span>
              </div>
              <div className={styles.content}>
                <div className={styles.textC}>
                  {CompletedCounts}
                </div>
                <span>Completed</span>
              </div>
            </div>
          </div>

          <div className={styles.UserInfo}>
            <div className={styles.email}>
            <SlEnvolope className={styles.emailIcon}/>
            <span className={styles.emailLabel}>Email</span>
            <span className={styles.emailFeild}>{user?.email}</span>
            </div>
          </div>

          <div className={styles.logOut}>
            <button onClick={handleLogout}>logout</button>
          </div>
          </div>
        </div>

      </div>
    </>
    
  )
}
