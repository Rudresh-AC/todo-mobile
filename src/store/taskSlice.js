import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {
    setTasks: (state, action) => {
      return action.payload;
    },
    addTask: (state, action) => {
      state.push(action.payload);
    },
    updateTask: (state, action) => {
      const {index, task} = action.payload;
      state[index] = task;
    },
    deleteTask: (state, action) => {
      const index = action.payload;
      state.splice(index, 1);
    },
    clearTasks: () => {
      return [];
    },
  },
});

export const {setTasks, addTask, updateTask, deleteTask, clearTasks} =
  tasksSlice.actions;

export const loadTasks = () => async dispatch => {
  try {
    const storedTasks = await AsyncStorage.getItem('tasks');
    const tasks = storedTasks ? JSON.parse(storedTasks) : [];
    dispatch(setTasks(tasks));
  } catch (error) {
    console.error('Failed to load tasks:', error);
  }
};

export const saveTasks = tasks => async () => {
  try {
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks:', error);
  }
};

export const clearTasksFromStorage = () => async dispatch => {
  try {
    await AsyncStorage.removeItem('tasks');
    dispatch(clearTasks());
  } catch (error) {
    console.error('Failed to clear tasks from storage:', error);
  }
};

export default tasksSlice.reducer;
