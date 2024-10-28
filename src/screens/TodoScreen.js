import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';
import {
  addTask,
  updateTask,
  deleteTask,
  loadTasks,
  saveTasks,
  clearTasksFromStorage,
} from '../store/taskSlice';
import {logout, saveAuthStatus, clearAuthStatus} from '../store/authSlice';

export default function TodoScreen({navigation}) {
  const [task, setTask] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const taskList = useSelector(state => state.tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadTasks());
  }, [dispatch]);

  useEffect(() => {
    dispatch(saveTasks(taskList));
  }, [taskList, dispatch]);

  useEffect(() => {
    if (editingIndex !== null) {
      setTask(taskList[editingIndex]);
    } else {
      setTask('');
    }
  }, [editingIndex, taskList]);

  function handleAddOrUpdateTask() {
    if (editingIndex !== null) {
      dispatch(updateTask({index: editingIndex, task}));
      setEditingIndex(null);
    } else {
      dispatch(addTask(task));
    }
    setTask('');
  }

  function handleDelete(index) {
    dispatch(deleteTask(index));
  }

  function handleEdit(index) {
    setEditingIndex(index);
  }

  function handleLogout() {
    dispatch(logout());
    dispatch(saveAuthStatus(false));
    dispatch(clearAuthStatus());
    dispatch(clearTasksFromStorage());
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  }

  const renderTask = ({item, index}) => (
    <View style={styles.task}>
      <Text style={styles.taskText}>{item}</Text>
      <View style={styles.btn_container}>
        <TouchableOpacity style={styles.btn} onPress={() => handleEdit(index)}>
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => handleDelete(index)}>
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.btnText}>Logout</Text>
        </TouchableOpacity>
        <TextInput
          placeholder="Add your task"
          style={styles.input}
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={styles.btn} onPress={handleAddOrUpdateTask}>
          <Text style={styles.btnText}>
            {editingIndex !== null ? 'Update' : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={taskList}
        renderItem={renderTask}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 10,
  },
  container: {
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    flex: 1,
    marginRight: 10,
    padding: 5,
  },
  btn: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 4,
    borderRadius: 10,
  },
  logoutBtn: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  btnText: {
    color: '#fff',
  },
  task: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  taskText: {
    flex: 1,
  },
  btn_container: {
    flexDirection: 'row',
  },
});
