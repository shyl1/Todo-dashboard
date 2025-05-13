import { createContext, useState } from "react";


const UserContext = createContext();

function UserProvider({children}){
  //load user data from localStorage 

  const [user , setUser] = useState(()=>{
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : {email : "" , username: ""};
  });

  //function update user data 
  function UpdateUser(email ,username){
    const newUser = {email,username};
    setUser(newUser);
    localStorage.setItem('user' , JSON.stringify(newUser));
  };

  // Function to save user's tasks
  function saveUserTask(email, tasks) {
    const userTasksKey = `tasks_${email}`;
    localStorage.setItem(userTasksKey, JSON.stringify(tasks));
  }

  // Function to get user's tasks
  function getUserTasks(email) {
    const userTasksKey = `tasks_${email}`;
    const tasks = localStorage.getItem(userTasksKey);
    return tasks ? JSON.parse(tasks) : [];
  }

  return(
    <UserContext.Provider value={{user , UpdateUser , saveUserTask , getUserTasks }}>
      {children}
    </UserContext.Provider>
  );

}

export { UserProvider };
export default UserContext; // Default export