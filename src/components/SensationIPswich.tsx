import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef} from 'react';
import {colors} from '../utils/colors';
import Icon from 'react-native-vector-icons/AntDesign';
import VideoPlayer, {type VideoPlayerRef} from 'react-native-video-player';
import { useTranslation } from 'react-i18next';

interface SensationIPswichProps {
  answers: Record<string, any>;
  handleAnswer: (id: string, value: any) => void;
  setCurrentStep: (step: string) => void;
  popUp: boolean;
  setPopUp: (value: boolean) => void;
}

const SensationIPswich: React.FC<SensationIPswichProps> = ({
  answers,
  handleAnswer,
  setCurrentStep,
  popUp,
  setPopUp,
}) => {
  const {t} = useTranslation();
  const questions = [
    {
      id: 'ipswich3',
      text: t('Ipswich.qes1'),
    },
    {
      id: 'ipswich2',
      text: t('Ipswich.qes2'),
    },
    {
      id: 'ipswich1',
      text: t('Ipswich.qes3'),
    },
    {
      id: 'ipswich',
      text: t('Ipswich.qes4'),
    },
  ];
  const playerRef = useRef<VideoPlayerRef>(null);
  const regionsL = [
    {id: 'region3', number: 3, x: '25%', y: '5%'},
    {id: 'region6', number: 6, x: '51%', y: '13%'},
    {id: 'region4', number: 4, x: '65%', y: '24%'},
  ];
  const regionsR = [
    {id: 'region2', number: 2, x: '22%', y: '24%'},
    {id: 'region5', number: 5, x: '36%', y: '13%'},
    {id: 'region1', number: 1, x: '62%', y: '5%'},
  ];
  const toggleRegion = (regionId: string) => {
    handleAnswer(`ipswich_${regionId}`, !answers[`ipswich_${regionId}`]);
  };
  return (
    <>
      <View style={styles.titleBox}>
        <Text style={styles.titleTxt}>{t('Ipswich.title8')}</Text>
      </View>
      <View>
        <Text
          style={{
            color: 'black',
            fontSize: 18,
            fontWeight: '400',
            marginBottom: 20,
          }}>
          {t('Ipswich.text3')}
        </Text>
      </View>
      <View style={{marginBottom: 15, borderWidth: 1}}>
        <VideoPlayer
          ref={playerRef}
          endWithThumbnail
          thumbnail={require('../assets/image.png')}
          source={require('../assets/ipswichvideo.mp4')}
          onError={e => console.log(e)}
          showDuration={true}
        />
        <Text style={{textAlign:'center'}}>{t('Ipswich.text4')}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 15,
        }}>
        <View style={styles.footContainer}>
          <Text
            style={{
              position: 'absolute',
              bottom: 30,
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 40,
              fontWeight: 'bold',
              zIndex: 10,
            }}>
            {t('Ipswich.text5')}
          </Text>
          <Image
            source={require('../assets/foot-outline_Right.png')}
            style={styles.footImage}
            resizeMode="contain"
          />

          {regionsR.map(({id, number, x, y}) => (
            <TouchableOpacity
              key={id}
              style={[
                styles.region,
                {
                  left: x,
                  top: y,
                  backgroundColor: answers[`ipswich_${id}`]
                    ? '#007AFF'
                    : 'white',
                },
              ]}
              onPress={() => toggleRegion(id)}>
              <Text
                style={[
                  styles.regionNumber,
                  {color: answers[`ipswich_${id}`] ? 'white' : '#007AFF'},
                ]}>
                {number}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.footContainer}>
          <Text
            style={{
              position: 'absolute',
              bottom: 30,
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 40,
              fontWeight: 'bold',
              zIndex: 10,
            }}>
            {t('Ipswich.text6')}
          </Text>
          <Image
            source={require('../assets/foot-outline_Left.png')}
            style={styles.footImage}
            resizeMode="contain"
          />

          {regionsL.map(({id, number, x, y}) => (
            <TouchableOpacity
              key={id}
              style={[
                styles.region,
                {
                  left: x,
                  top: y,
                  backgroundColor: answers[`ipswich_${id}`]
                    ? '#007AFF'
                    : 'white',
                },
              ]}
              onPress={() => toggleRegion(id)}>
              <Text
                style={[
                  styles.regionNumber,
                  {color: answers[`ipswich_${id}`] ? 'white' : '#007AFF'},
                ]}>
                {number}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.heading}>
        <Text style={styles.headingTxt}>{t('Ipswich.text1')}</Text>
        <Text style={styles.headingTxt}>{t('Ipswich.text2')}</Text>
      </View>
      {questions.map(item => (
        <View style={styles.questionRow} key={item.id}>
          <Text style={styles.questionTxt}>{item.text}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              handleAnswer(item.id, {
                ...answers[item.id],
                value: !answers[item.id]?.value,
              })
            }>
            <View
              style={[
                styles.checkbox,
                answers[item.id]?.value && styles.checkboxChecked,
              ]}>
              {answers[item.id]?.value && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      ))}
      {/* Add instructions for checkbox interaction */}
      {/* <View style={styles.instructionBox}>
        <Text style={styles.instructionText}>
          <Text style={styles.boldText}>For "Yes":</Text> 
          Click the checkbox (<Text style={styles.checkmarkSymbol}>✓</Text>).
        </Text>
        <Text style={styles.instructionText}>
          <Text style={styles.boldText}>For "No":</Text> 
          Leave the checkbox unfilled (<Text style={styles.uncheckedSymbol}>◻</Text>).
        </Text>
      </View> */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => setCurrentStep('sensation')}>
        <Text style={styles.nextButtonText}>{t('Skin.btn3')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.nextButton, {marginBottom: 40}]}
        onPress={() => {
          setCurrentStep('pedal');
        }}>
        <Text style={styles.nextButtonText}>{t('Skin.btn4')}</Text>
      </TouchableOpacity>
    </>
  );
};

export default SensationIPswich;

const styles = StyleSheet.create({
  titleBox: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginBottom: 30,
  },
  titleTxt: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'semibold',
    textAlign: 'center',
    padding: 8,
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 1,
    marginBottom: 15,
  },
  headingTxt: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  questionTxt: {
    fontSize: 17,
    fontWeight: '400',
    maxWidth: '80%',
  },
  button: {
    padding: 0,
    borderRadius: '50%',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
  },
  footContainer: {
    position: 'relative',
    width: 180,
    height: 300,
    alignItems: 'center',
  },
  footImage: {
    width: '100%',
    height: '100%',
  },
  region: {
    position: 'absolute',
    width: 25,
    height: 25,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  regionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructionBox: {
    marginTop: 5,
    marginBottom: 20,
    paddingHorizontal: -200,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#555',
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#000',
  },
  checkmarkSymbol: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  uncheckedSymbol: {
    color: '#000',
    fontWeight: 'bold',
  },
});