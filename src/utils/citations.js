// Citations for medical information used in the application
// This file contains references to all medical sources used in diagnostic criteria and recommendations

export const citations = {
  general: [
    {
      title: "IWGDF Guidelines 2023",
      description: "International Working Group on the Diabetic Foot (IWGDF) Guidelines on prevention and management of diabetic foot disease. These are the primary guidelines used for diabetic foot risk assessment and recommendations in this application.",
      url: "https://iwgdfguidelines.org/wp-content/uploads/2023/07/IWGDF-Guidelines-2023.pdf",
      date: "2023"
    },
    {
      title: "International Working Group on the Diabetic Foot (IWGDF) Guidelines",
      url: "https://iwgdfguidelines.org/",
      description: "Comprehensive guidelines for prevention and management of diabetic foot disease"
    },
    {
      title: "American Diabetes Association Standards of Medical Care in Diabetes",
      url: "https://professional.diabetes.org/content-page/practice-guidelines-resources",
      description: "Clinical practice recommendations for diabetes care, including foot examination and care"
    },
    {
      title: "National Institute for Health and Care Excellence (NICE) Guidelines",
      url: "https://www.nice.org.uk/guidance/ng19",
      description: "Guidelines on diabetic foot problems prevention and management"
    }
  ],
  skin: [
    {
      title: "Diabetic Foot Ulcers: Prevention, Diagnosis and Classification",
      url: "https://www.aafp.org/pubs/afp/issues/1998/0315/p1325.html",
      description: "American Family Physician resource on diabetic foot ulcer diagnosis and classification"
    },
    {
      title: "Comprehensive Foot Examination and Risk Assessment",
      url: "https://care.diabetesjournals.org/content/31/8/1679",
      description: "Diabetes Care publication on foot examination protocol"
    }
  ],
  nail: [
    {
      title: "Clinical Guidelines for the Management of Toenail Disorders",
      url: "https://academic.oup.com/bjd/article/171/2/238/6888393",
      description: "Guidelines for toenail management and disorder assessment"
    }
  ],
  deformity: [
    {
      title: "Foot Deformities in Diabetes",
      url: "https://clinical.diabetesjournals.org/content/26/4/152",
      description: "Clinical Diabetes resource on foot deformities in diabetic patients"
    },
    {
      title: "Charcot Neuroarthropathy of the Foot and Ankle",
      url: "https://www.aofas.org/footcaremd/conditions/diabetic-foot/Pages/Charcot-Foot.aspx",
      description: "American Orthopaedic Foot & Ankle Society resource on Charcot foot"
    }
  ],
  footwear: [
    {
      title: "IWGDF guidance on footwear and offloading interventions",
      url: "https://iwgdfguidelines.org/wp-content/uploads/2019/05/05-IWGDF-offloading-guideline-2019.pdf",
      description: "Guidelines on appropriate footwear for diabetes patients"
    }
  ],
  temperature: [
    {
      title: "Temperature as a biomarker for diabetic foot assessment",
      url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6961614/",
      description: "Research on foot temperature assessment in diabetic patients"
    }
  ],
  motion: [
    {
      title: "Limited Joint Mobility in Diabetes",
      url: "https://care.diabetesjournals.org/content/36/8/2143",
      description: "Research on limited joint mobility in diabetic patients"
    }
  ],
  sensation: [
    {
      title: "Assessment of peripheral neuropathy in the diabetic foot",
      url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5687923/",
      description: "Comprehensive review of peripheral neuropathy assessment"
    },
    {
      title: "10-g monofilament testing for diabetic peripheral neuropathy",
      url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4821505/",
      description: "Research on monofilament testing protocols"
    }
  ],
  ipswich: [
    {
      title: "The Ipswich Touch Test: a simple and novel method to identify inpatients with diabetes at risk of foot ulceration",
      url: "https://care.diabetesjournals.org/content/34/7/1517",
      description: "Original research on the Ipswich Touch Test methodology"
    }
  ],
  pedal: [
    {
      title: "Diabetic Foot Exam and Pulse Assessment",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK482367/",
      description: "Clinical protocol for pedal pulse examination"
    }
  ],
  rubor: [
    {
      title: "Peripheral Arterial Disease (PAD) in Diabetic Patients",
      url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5652614/",
      description: "Research on assessment of peripheral arterial disease in diabetic patients"
    }
  ],
  erythema: [
    {
      title: "Erythema in the diabetic foot: A clinical sign of infection",
      url: "https://www.woundsresearch.com/article/erythema-diabetic-foot-clinical-sign-infection",
      description: "Research on erythema as a clinical sign in diabetic foot assessment"
    }
  ],
  recommendations: [
    {
      title: "Diabetic Foot Care Guidelines",
      url: "https://www.diabetes.org/diabetes/complications/foot-complications",
      description: "American Diabetes Association guidelines on diabetic foot care"
    },
    {
      title: "Prevention and Management of Foot Problems in Diabetes",
      url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5298009/",
      description: "Research on prevention and management strategies for diabetic foot problems"
    }
  ]
};

// Helper function to get citations for a specific category
export const getCitationsForCategory = (category) => {
  return citations[category] || citations.general;
};

// Helper function to format citations for display
export const formatCitationsForDisplay = (category) => {
  const relevantCitations = getCitationsForCategory(category);
  
  return relevantCitations.map((citation, index) => ({
    id: index,
    title: citation.title,
    url: citation.url,
    description: citation.description
  }));
};
