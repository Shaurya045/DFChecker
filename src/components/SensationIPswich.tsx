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

const questions = [
  {
    id: 'ipswich3',
    text: 'Patient respond to touch for all 6 toes.',
  },
  {
    id: 'ipswich2',
    text: 'Patient respond to touch for 5 out of 6 toes.',
  },
  {
    id: 'ipswich1',
    text: 'Patient respond to touch for 4 out of 6 toes.',
  },
  {
    id: 'ipswich',
    text: 'Patient respond to touch 3 and below toes.',
  },

];

const SensationIPswich = ({
  answers,
  handleAnswer,
  setCurrentStep,
  popUp,
  setPopUp,
}) => {
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
      {/* <Modal
        animationType="fade"
        transparent={true}
        visible={popUp}
        // onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text
              style={{
                color: 'black',
                fontSize: 20,
                fontWeight: '600',
                marginBottom: 10,
              }}>
              Instructions
            </Text>
            <View style={{marginBottom: 15}}>
              <Text style={{fontSize: 15, fontWeight: '400', marginBottom: 7}}>
                1. Mark the questions for both the foot in there respective
                column
              </Text>
              <Text style={{fontSize: 15, fontWeight: '400'}}>
                2. For example if I have heavy callus build up on both foot then
                will select both the foot left and right and if only on the
                right foot then will select it only.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setPopUp(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}
      <View style={styles.titleBox}>
        <Text style={styles.titleTxt}>Diabetic Foot Test - Ipswich</Text>
      </View>
      <View>
        <Text
          style={{
            color: 'black',
            fontSize: 18,
            fontWeight: '400',
            marginBottom: 20,
          }}>
          Ask the patient to close their eyes. Touch must be very light 1 - 2
          seconds. Do not repeat if the patient didn't respond to touch
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
        <Text style={{textAlign:'center'}}>Credit: boureaujulien</Text>
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
            R
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
            L
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
        {/* <TouchableOpacity
          style={{flexDirection: 'row', gap: 10}}
          onPress={() => setPopUp(true)}>
          <Icon name="questioncircle" size={25} color="black" /> */}
        <Text style={styles.headingTxt}>Questions</Text>
        {/* </TouchableOpacity> */}
        <View style={styles.rightHeading}>
          <Text style={styles.headingTxt}>Left</Text>
          <Text style={styles.headingTxt}>Right</Text>
        </View>
      </View>
      {questions.map(item => (
        <View style={styles.heading} key={item.id}>
          <Text style={styles.questionTxt}>{item.text}</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                handleAnswer(item.id, {
                  ...answers[item.id],
                  left: !answers[item.id]?.left,
                })
              }>
              <View
                style={[
                  styles.checkbox,
                  answers[item.id]?.left && styles.checkboxChecked,
                ]}>
                {answers[item.id]?.left && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                handleAnswer(item.id, {
                  ...answers[item.id],
                  right: !answers[item.id]?.right,
                })
              }>
              <View
                style={[
                  styles.checkbox,
                  answers[item.id]?.right && styles.checkboxChecked,
                ]}>
                {answers[item.id]?.right && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      {/* Add instructions for checkbox interaction */}
                  <View style={styles.instructionBox}>
                          <Text style={styles.instructionText}>
                            <Text style={styles.boldText}>For "Yes":</Text> 
                            Click the checkbox (<Text style={styles.checkmarkSymbol}>✓</Text>).
                          </Text>
                          <Text style={styles.instructionText}>
                            <Text style={styles.boldText}>For "No":</Text> 
                            Leave the checkbox unfilled (<Text style={styles.uncheckedSymbol}>◻</Text>).
                          </Text>
                        </View>
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => setCurrentStep('sensation')}>
        <Text style={styles.nextButtonText}>Previous</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.nextButton, {marginBottom: 40}]}
        onPress={() => {
          setCurrentStep('pedal');
        }}>
        <Text style={styles.nextButtonText}>Next</Text>
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
  rightHeading: {
    flexDirection: 'row',
    gap: 20,
  },
  headingTxt: {
    fontSize: 18,
    fontWeight: '600',
  },
  questionTxt: {
    fontSize: 17,
    fontWeight: '400',
    maxWidth: '60%',
  },
  buttonGroup: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    gap: 30,
  },
  button: {
    // backgroundColor: '#e0e0e0',
    padding: 0,
    borderRadius: '50%',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: colors.primary,
  },
  selectedButtonText: {
    color: colors.white,
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    // marginBottom: 40,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkbox: {
    position: 'absolute',
    bottom: -10,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalButton: {
    borderRadius: 10,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
