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
  TextInput, // input
  ScrollView, // 스크롤 가능한 뷰
  Alert // 알림 모달 창을 띄울 수 있음
} from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage"; // 브라우저의 로컬 스토리지 기능 제공
import { useState, useEffect } from 'react';
import { theme } from './colors';

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true); // 할 일 목록인지 여행 목록인지 구분하기 위한 상태
  const [text, setText] = useState(""); // 내용
  const [toDos, setToDos] = useState({}); // 목록 정보
  
  useEffect(() => {
    loadToDos(); // 스토리지에 있는 toDos를 로드함
  }, []);

  const travel = () => setWorking(false); // 헤더 토글 버튼 1 
  const work = () => setWorking(true); // 헤더 토글 버튼 2
  const onChangeText = (payload) => setText(payload); // text state를 업데이트하기 위한 함수
  
  const saveToDos = async (toSave) => { // toDos를 storage에 저장하는 함수
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave)); // 문자열을 저장해야하므로, JSON(객체)에서 문자열로 변환
  };

  const loadToDos = async () => { // toDos를 storage에서 불러오는 함수
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY); // 문자열로 저장되어 있으므로, 문자열에서 JSON(객체)로 변경
      setToDos(JSON.parse(s)); // string to Javascript Object
    } catch (err) { // 저장 공간이 모자르거나 기타 원인으로 저장에 실패했다면
      console.log(err);
    }
  };
  
  const addToDo = async () => { // toDo를 추가하는 함수
    if (text === "") return;
    // work는 할 일인지 여행인지 구분하기 위해 들어감
    // Date.now()로 id가 중복되지 않도록 설정
    const newToDos = {...toDos, 
      [Date.now()] : {text, work: working},  
    };
    setToDos(newToDos); // state에 새로운 toDos를 반영
    await saveToDos(newToDos); // toDos를 storage에 저장함
    setText("");
  };
  
  const deleteToDo = async (key) => {
    Alert.alert( // 삭제하기 전 모달창을 띄워줌
      "삭제", // 제목
      "정말 삭제하시겠습니까?", [ // 내용
      { text: "취소" }, // 취소 버튼
      { text: "확인", onPress: () => { // 확인 버튼 (눌렀을 경우 삭제 기능 작동함)
        const newToDos = {...toDos};
        delete newToDos[key]; // toDos 중에서 key에 해당하는 데이터만 삭제함
        setToDos(newToDos); // 새롭게 반영된 toDos로 state를 업데이트
        saveToDos(newToDos); // toDos를 storage에 저장함
      }}
    ]);
  };
  

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
          toDos[key].work === working ? (
            <View key={key} style={styles.toDo}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <TouchableOpacity
                onPress={() => deleteToDo(key)}
              >
                <Text><Fontisto name="trash" size={18} color={theme.white} /></Text>
              </TouchableOpacity>
            </View>
          ) : null
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: { 
    color: theme.white,
    fontSize: 16,
    fontWeight: "500",
  }
});
