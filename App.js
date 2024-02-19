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
  TextInput
} from 'react-native';
import { useState } from 'react';
import { theme } from './colors';

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
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
          onChangeText={(payload) => onChangeText(payload)}
          value={text}
          placeholder={working ? "할 일을 추가하세요" : "가고 싶은 곳을 추가하세요"}
          style={styles.input}
        />
      </View>
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
    marginTop: 20,
    fontSize: 18,
  }
});
