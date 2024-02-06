type consentQuestionsType = {
  id: string;
  type: 'radio' | 'checkbox';
  required: boolean;
  question: string;
  description: string | null;
  options: any[];
};

export const consentQuestions: consentQuestionsType[] = [
  {
    id: 'give_consent',
    type: 'radio',
    required: true,
    question: 'Do you give consent?',
    description: null,
    options: [
      {
        name: 'give_consent',
        value: 'yes',
        label: 'Yes, I agree to provide consent to collect, store and process information I provide',
      },
      {
        name: 'give_consent',
        value: 'no',
        label: 'No, I do not agree to provide consent to collect, store and process information I provide',
      },
    ],
  },
  {
    id: 'review_documentation',
    type: 'checkbox',
    required: true,
    question: 'Please review the following documentation...?',
    description: 'Check each box after you have reviewed the material',
    options: [
      { id: 'code_of_conduct', label: 'HOT Code of Conduct https://www.hotosm.org/code-of-conduct' },
      { id: 'learn_osm', label: 'LearnOSM https://learnosm.org/en/coordination/humanitarian/ and associated modules' },
      {
        id: 'compliance_guide',
        label:
          'HOT Suggested OEG Compliance Guide https://docs.google.com/document/d/1IIrR75Cmy92giXLa9hCVIur0wJ3HU4nTZoq6zQWyrEU/edit?usp=sharing',
      },
    ],
  },
  {
    id: 'log_into',
    type: 'checkbox',
    required: true,
    question: 'Also, please log-into...?',
    description:
      'You do not have to map/take any action - logging in adds your username to the TM database for permissions, etc.',
    options: [
      { id: 'staging_site', label: 'The staging site https://stage.fmtm.hotosm.org/' },
      { id: 'main_site', label: 'The main Field Mapping Tasking Manager https://fmtm.hotosm.org/' },
    ],
  },
  {
    id: 'participated_in',
    type: 'checkbox',
    required: true,
    question: 'Have you participated in...?',
    description: 'These are not required but helpful in assessing on-boarding pathways.',
    options: [
      { id: 'mapathon', label: 'Participated in a Mapathon (in person or remote)' },
      { id: 'field_survey', label: 'Organized or helped facilitate a Field Survey (in person or remote)' },
      { id: 'validation_qa', label: 'Organized or helped coordinate a validation / quality assurance effort' },
      { id: 'tm_josm', label: 'Contributed to OpenStreetMap via different mapping tools such as TM, JOSM' },
    ],
  },
];
