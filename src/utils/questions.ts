import {useTranslation} from 'react-i18next';

const {t} = useTranslation();

export const initialQuestions = [
  {
    id: 'neurologicalDisease',
    text: t('BasicQes.qes1'),
    type: 'boolean',
  },
  {
    id: 'amputation',
    text: t('BasicQes.qes2'),
    type: 'boolean',
  },
  {
    id: 'amputationCount',
    text: t('BasicQes.qes3'),
    type: 'number',
    condition: (answers: Record<string, any>) => answers.amputation === true,
  },
  {
    id: 'smoking',
    text: t('BasicQes.qes4'),
    type: 'boolean',
  },
  {
    id: 'ulcer',
    text: t('BasicQes.qes5'),
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
