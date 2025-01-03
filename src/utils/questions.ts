export const initialQuestions = [
  {
    id: 'neurologicalDisease',
    text: 'Do you have peripheral neurological disease?',
    type: 'boolean',
  },
  {
    id: 'amputation',
    text: 'Have you had any amputations?',
    type: 'boolean',
  },
  {
    id: 'amputationCount',
    text: 'How many amputations have you had?',
    type: 'number',
    condition: (answers: Record<string, any>) => answers.amputation === true,
  },
  {
    id: 'smoking',
    text: 'Are you currently smoking?',
    type: 'boolean',
  },
  {
    id: 'ulcer',
    text: 'Do you have any ulcers on your feet?',
    type: 'boolean',
  },
];

export const rightFootQuestions = [
  {
    id: 'brokenNumbness',
    text: 'Broken, numbness or tingling in the feet',
    image: require('../assets/foot1.png'),
  },
  {
    id: 'colorChange',
    text: 'Changes in color or temperature (coldness)',
    image: require('../assets/foot2.png'),
  },
  {
    id: 'drySkin',
    text: 'Dry skin and cracked skin',
    image: require('../assets/foot3.png'),
  },
  {
    id: 'lossSensation',
    text: 'Loss of sensation, insensitivity to heat and cold',
    image: require('../assets/foot4.png'),
  },
  {
    id: 'thickeningNails',
    text: 'Thickening, yellowing in the nails of the feet',
    image: require('../assets/foot5.png'),
  },
  {
    id: 'hairloss',
    text: 'Hair loss of the lower part of the foot, leg',
    image: require('../assets/foot6.png'),
  },
  {
    id: 'fungusToes',
    text: 'Fungus between toes',
    image: require('../assets/foot7.png'),
  },
  {
    id: 'ingrownToenail',
    text: 'Ingrown toenail, ulcer, or infected toenail',
    image: require('../assets/foot8.png'),
  },
];

export const leftFootQuestions = [
  {
    id: 'swolleL',
    text: 'Are your feet swollen?',
  },
  {
    id: 'painfulL',
    text: 'Are your feet painful?',
  },
  {
    id: 'numbL',
    text: 'Do you feel numbness in your feet?',
  },
  {
    id: 'tinglingL',
    text: 'Do you feel tingling in your feet?',
  },
];
