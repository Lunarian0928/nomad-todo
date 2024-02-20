import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  // 터치 이벤트를 listen할 준비가 된 View
  TouchableOpacity, // 투명도만 변경
  TouchableHighlight, // 다양한 속성을 변경 가능
  TouchableWithoutFeedback, // UI 반응이 따로 나타나지 않음
  Pressable, // 확장성이 있고 미래에도 사용가능
  TextInput,
  ScrollView,
} from 'react-native';
import { useState, useEffect } from 'react';
import { theme } from './colors';

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  const addToDo = () => {
    if (text === "") return;
    // const newToDos = Object.assign({}, toDos, {
    //   [Date.now()]: { text, work: working },
    // });
    const newToDos = {...toDos, 
      [Date.now()] : {text, work: working},
    };
    setToDos(newToDos);
    setText("");
  }

  useEffect(() => {
    console.log(toDos);
  }, [toDos])
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => work()}
        >
          <Text 
            style={{...styles.btnText, color: working ? theme.white : theme.gray}}>
              Work
            </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => travel()}
        >
          <Text 
            style={{...styles.btnText, color: !working ? theme.white : theme.gray}}>
              Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput 
          onSubmitEditing={() => addToDo()}
          onChangeText={(payload) => onChangeText(payload)}
          returnKeyType="done"
          value={text}
          placeholder={working ? "할 일을 추가하세요" : "가고 싶은 곳을 추가하세요"}
          style={styles.input}
        />
      </View>
      <ScrollView>
      { Object.keys(toDos).map(key => (
        <View style={styles.toDo}>
          <Text style={styles.toDoText}>{toDos[key].text}</Text>
        </View>
      ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 15,
  },
  toDoText: { 
    color: theme.white,
    fontSize: 16,
    fontWeight: "500",
  }
});
