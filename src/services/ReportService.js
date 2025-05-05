import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';

// Function to generate PDF
export const generatePDF = async (reportData) => {
  const htmlContent = `
    <h1>Assessment Report</h1>
    <h2>Left Foot: ${reportData.left_foot.risk_category}</h2>
    <h2>Right Foot: ${reportData.right_foot.risk_category}</h2>
    <p>Details: ${JSON.stringify(reportData)}</p>
  `;

  const options = {
    html: htmlContent,
    fileName: 'AssessmentReport',
    directory: 'Documents',
  };

  try {
    const file = await RNHTMLtoPDF.convert(options);
    return file.filePath;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Function to share PDF via WhatsApp
export const sharePDF = async (filePath) => {
  const options = {
    title: 'Share Assessment Report',
    url: `file://${filePath}`,
    social: Share.Social.WHATSAPP,
  };

  try {
    await Share.open(options);
  } catch (error) {
    console.error('Error sharing PDF:', error);
  }
};
