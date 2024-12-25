import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {colors} from '../utils/colors';
import Icon from 'react-native-vector-icons/Entypo';
import MediaPopup from './MediaPopUp';
import ImagePicker from 'react-native-image-crop-picker';

const HomeScreen = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [image, setImage] = useState('');

  const handleTakePhoto = () => {
    // Implement photo capture logic here
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(img => {
      console.log(image);
      setImage(img.path);
      setIsPopupVisible(false);
    });
  };

  const handleChooseFromGallery = () => {
    // Implement gallery selection logic here
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(img => {
      console.log(image);
      setImage(img.path);
      setIsPopupVisible(false);
    });
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Account details</Text>
      </View>

      {/* Greeting Section */}
      <View style={styles.greetingContainer}>
        <TouchableOpacity style={styles.greetingButton}>
          <View style={styles.greetingContent}>
            <Text style={styles.greetingText}>Hello Abdulaziz</Text>
            <View style={styles.userIcon}>
              <View style={styles.userIconCircle} />
              <View style={styles.userIconBody} />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Camera Section */}
      <View style={styles.cameraSection}>
        <Text style={styles.instructionText}>To check,</Text>
        <Text style={styles.instructionText}>click on the icon.</Text>
        <View style={styles.arrowContainer}>
          <View style={styles.arrow} />
        </View>
        <TouchableOpacity
          onPress={() => setIsPopupVisible(true)}
          style={styles.cameraButton}>
          <Icon name="camera" size={40} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Media Pop Up */}
      <MediaPopup
        isVisible={isPopupVisible}
        onClose={() => setIsPopupVisible(false)}
        onTakePhoto={handleTakePhoto}
        onChooseFromGallery={handleChooseFromGallery}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 20,
    marginTop: 20,
  },
  headerText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#000',
  },
  greetingContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  greetingButton: {
    backgroundColor: '#2196F3',
    borderRadius: 15,
    padding: 15,
  },
  greetingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingText: {
    color: '#fff',
    fontSize: 18,
  },
  userIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  userIconCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    left: 6,
  },
  userIconBody: {
    width: 24,
    height: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
  },
  cameraSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  instructionText: {
    fontSize: 24,
    color: '#333',
    textAlign: 'center',
  },
  arrowContainer: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  arrow: {
    width: 30,
    height: 30,
    borderColor: '#2196F3',
    borderWidth: 4,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    transform: [{rotate: '45deg'}],
  },
  cameraButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default HomeScreen;
