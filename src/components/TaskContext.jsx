import { createContext  , useEffect, useState , useMemo, useContext, useRef} from "react";
import UserContext from "./UserContext";

const TaskContext = createContext();



function TaskProvider({children}){

  const {user , getUserTasks , saveUserTask } =useContext(UserContext);

  //ref for the form container
  const formRef = useRef(null);

  // changes are instead to make tasks globally , make it for each user has their own localStoarge tasks
  //set a list of tasks
    const [tasks, setTasks] = useState(() => {
      if(user.email){
        return getUserTasks(user.email);
      }
    //   //load the tasks from localStorage for the current user
    //   if (user.email){
    //     const userTasksKey = `tasks_${user.email}`;
    //     const savedTasks = localStorage.getItem(userTasksKey);
    //     return savedTasks ? JSON.parse(savedTasks) : [];
    //   }
      return [];
    //  // const savedTasks = localStorage.getItem('tasks');
    });

     // set up a form for adding new tasks
    const [showForm , setShowForm] = useState(false); // controls new task form
  
    // tark the task that is being edited
    const [editingTask , setEditingTask] = useState(null); // controls editing form

    const [formColumn, setFormColumn] = useState(null); // Track which column should show the form

    //add search term for global puropesses
    const [searchTerm , setSearchTerm] = useState("");

    // search by date range
    const [fromDate , setFromDate] = useState('');
    const [toDate , setToDate] = useState('');

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // handling the click outside of the form to close it
    useEffect(()=> {
      const handleClickOutside = (event)=> {
        if (formRef.current && !formRef.current.contains(event.target)){
          setShowForm(false); // Close the form if clicked outside
          setEditingTask(null); // Reset editing task
          setFormColumn(null); // Reset form column
        }
      }

      if(showForm) {
        document.addEventListener('mousedown' , handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown' , handleClickOutside); // Clean up the event listener
      };
    }, [showForm]); 



    // // save tasks to LoccalStoarge whenever takes change
    // useEffect(()=>{
    //   localStorage.setItem('tasks' , JSON.stringify(tasks));
    // }, [tasks]);

    //modifing saving to localStorage code
    useEffect(()=>{
      if(user.email){
        saveUserTask(user.email , tasks)
      }
      }, [tasks , user.email]);

      useEffect(()=>{
        const userTasks = getUserTasks(user.email);
        setTasks(userTasks);
      }, [user.email])


    
  // add new task or update
    function addOrUpdateTask(taskId, title , description , currentStatus){
        //create newTask object that contains the info of the task
        if(title && description){
          if(taskId){
            //update existing  task
            setTasks((preTasks)=> preTasks.map((task)=> task.id === taskId ? {...task , title , description , status : currentStatus} : task));
          } else {
            //add new task
            const newTask = {
              id: Date.now() , 
              title,
              description,
              status: currentStatus || "To Start", // default status
              createdAt: new Date().toISOString(), //store the creation Date
            };
            //append the  new task to tasks list
            setTasks([...tasks , newTask]);
          }
          setShowForm(false); // hide the form after adding task
          setEditingTask(null);
          setFormColumn(null); // Reset form column after submission
        }
      }

  //update task status when dragged to a new column
  function updateTaskStatus(taskId , newStatus){
    setTasks((prevTasks)=> prevTasks.map((task) => task.id === taskId ? {...task , status : newStatus} : task));
  }

  // Delete task
  function deleteTask(taskId){
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  }

  // Memoize task counts to avoid recalculating on every render
    const ToStartCounts = useMemo( () => {
      const count = tasks ? tasks.filter((task) => task.status === "To Start").length : 0;
    return count;
    }, [tasks]);
  
  
    const InProgressCounts = useMemo( () => {
      const count = tasks ? tasks.filter((task) => task.status === "in Progress").length : 0;
      return count;
    }, [tasks]);
  
    const CompletedCounts = useMemo( () => {
      const count = tasks ? tasks.filter((task) => task.status === "Completed").length : 0;
      return count;
    }, [tasks]);


  return(
    <TaskContext.Provider 
      value={{
        tasks,
        setTasks,
        editingTask,
        setEditingTask,
        showForm,
        setShowForm,
        addOrUpdateTask,
        updateTaskStatus,
        title,
        setTitle,
        description,
        setDescription,
        formColumn,
        setFormColumn,
        deleteTask,
        searchTerm,
        setSearchTerm,
        fromDate,
        setFromDate,
        toDate,
        setToDate,
        ToStartCounts,
        InProgressCounts,
        CompletedCounts,
        formRef
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export { TaskProvider };
export default TaskContext; // Default export