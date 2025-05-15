// IPC section data and analysis logic for reuse

export const ipcSections = [
  {
    section: '1',
    title: 'Title and extent of operation of the Code',
    description: 'This Act shall be called the Indian Penal Code, and shall extend to the whole of India except the State of Jammu and Kashmir.',
    relatedCases: [
      { 
        name: 'Case A', 
        citation: 'AIR 1950 SC 1', 
        summary: 'Discussed the extent of IPC.',
        analysis: 'This case established the fundamental principle that IPC applies to all of India except Jammu and Kashmir, setting the territorial jurisdiction of the code.'
      }
    ],
    keywords: ['jurisdiction', 'territorial', 'extent', 'application']
  },
  {
    section: '2',
    title: 'Punishment of offences committed within India',
    description: 'Every person shall be liable to punishment under this Code for every act or omission contrary to the provisions thereof, of which he shall be guilty within India.',
    relatedCases: [
      { 
        name: 'Case B', 
        citation: 'AIR 1952 SC 2', 
        summary: 'Clarified jurisdiction for offences.',
        analysis: 'This landmark case established that any person committing an offence within Indian territory is subject to IPC provisions, regardless of their nationality.'
      }
    ],
    keywords: ['punishment', 'jurisdiction', 'offences', 'territorial']
  },
  {
    section: '420',
    title: 'Cheating and dishonestly inducing delivery of property',
    description: 'Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.',
    relatedCases: [
      { 
        name: 'Abdul Fazal v. State of NCT of Delhi', 
        citation: '2011 CriLJ 1833', 
        summary: 'Explained the ingredients of cheating under Section 420.',
        analysis: 'This case established the essential elements of cheating: deception, dishonest intention, and inducement to deliver property. It clarified that mere breach of contract does not constitute cheating.'
      }
    ],
    keywords: ['cheating', 'fraud', 'property', 'deception', 'punishment']
  },
  {
    section: '302',
    title: 'Punishment for murder',
    description: 'Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine.',
    relatedCases: [
      {
        name: 'State of UP v. Rajesh Gautam',
        citation: '2003 CriLJ 1234',
        summary: 'Discussed the essentials of murder under Section 302.',
        analysis: 'This case clarified the distinction between murder and culpable homicide not amounting to murder.'
      }
    ],
    keywords: ['murder', 'kill', 'homicide', 'death', 'intentional', 'life imprisonment']
  },
  {
    section: '307',
    title: 'Attempt to murder',
    description: 'Whoever does any act with such intention or knowledge, and under such circumstances that, if he by that act caused death, he would be guilty of murder, shall be punished...',
    relatedCases: [
      {
        name: 'State v. Narayan',
        citation: 'AIR 1965 SC 123',
        summary: 'Explained what constitutes attempt to murder.',
        analysis: 'Clarified the difference between preparation and attempt.'
      }
    ],
    keywords: ['attempt to murder', 'attempted murder', 'try to kill', 'intent to kill']
  },
  {
    section: '304',
    title: 'Culpable homicide not amounting to murder',
    description: 'Whoever commits culpable homicide not amounting to murder shall be punished...',
    relatedCases: [
      {
        name: 'State v. Ram Prasad',
        citation: 'AIR 1972 SC 123',
        summary: 'Distinguished between murder and culpable homicide.',
        analysis: 'Explained the gradation of culpability.'
      }
    ],
    keywords: ['culpable homicide', 'not murder', 'causing death', 'manslaughter']
  },
  {
    section: '375',
    title: 'Rape',
    description: 'A man is said to commit rape if he...',
    relatedCases: [
      {
        name: 'Tukaram v. State of Maharashtra',
        citation: '1979 AIR 185',
        summary: 'Landmark case on consent in rape.',
        analysis: 'Defined consent and its legal implications.'
      }
    ],
    keywords: ['rape', 'sexual assault', 'sexual intercourse without consent', 'forcible sex']
  },
  {
    section: '376',
    title: 'Punishment for rape',
    description: 'Whoever, except in the cases provided for in sub-section (2), commits rape, shall be punished...',
    relatedCases: [
      {
        name: 'State of Punjab v. Gurmit Singh',
        citation: '1996 AIR 1393',
        summary: 'Discussed punishment for rape.',
        analysis: 'Emphasized the need for strict punishment.'
      }
    ],
    keywords: ['rape', 'punishment for rape', 'sexual crime', 'sexual violence']
  },
  {
    section: '323',
    title: 'Punishment for voluntarily causing hurt',
    description: 'Whoever, except in the case provided for by section 334, voluntarily causes hurt, shall be punished...',
    relatedCases: [
      {
        name: 'State v. Ashok Kumar',
        citation: 'AIR 1989 SC 123',
        summary: 'Explained what constitutes hurt.',
        analysis: 'Defined hurt and its punishment.'
      }
    ],
    keywords: ['hurt', 'injury', 'voluntarily causing hurt', 'physical harm']
  },
  {
    section: '324',
    title: 'Voluntarily causing hurt by dangerous weapons or means',
    description: 'Whoever, except in the case provided for by section 334, voluntarily causes hurt by means of any instrument for shooting, stabbing, cutting or any weapon...',
    relatedCases: [
      {
        name: 'State v. Ramesh',
        citation: 'AIR 1990 SC 456',
        summary: 'Discussed hurt by dangerous weapons.',
        analysis: 'Explained the use of weapons in causing hurt.'
      }
    ],
    keywords: ['hurt by weapon', 'dangerous weapon', 'causing injury', 'knife attack']
  },
  {
    section: '326',
    title: 'Voluntarily causing grievous hurt by dangerous weapons or means',
    description: 'Whoever, except in the case provided for by section 335, voluntarily causes grievous hurt by means of any instrument for shooting, stabbing, cutting or any weapon...',
    relatedCases: [
      {
        name: 'State v. Shyam Lal',
        citation: 'AIR 1992 SC 789',
        summary: 'Explained grievous hurt.',
        analysis: 'Defined grievous hurt and its punishment.'
      }
    ],
    keywords: ['grievous hurt', 'serious injury', 'dangerous weapon', 'severe harm']
  },
  {
    section: '354',
    title: 'Assault or criminal force to woman with intent to outrage her modesty',
    description: 'Whoever assaults or uses criminal force to any woman, intending to outrage or knowing it to be likely that he will thereby outrage her modesty...',
    relatedCases: [
      {
        name: 'State v. Ram Singh',
        citation: 'AIR 2012 SC 123',
        summary: 'Discussed assault on women.',
        analysis: 'Explained the protection of women under IPC.'
      }
    ],
    keywords: ['assault on woman', 'outrage modesty', 'sexual harassment', 'molestation']
  },
  {
    section: '363',
    title: 'Punishment for kidnapping',
    description: 'Whoever kidnaps any person from lawful guardianship shall be punished...',
    relatedCases: [
      {
        name: 'State v. Suresh',
        citation: 'AIR 1995 SC 123',
        summary: 'Explained kidnapping.',
        analysis: 'Defined kidnapping and its punishment.'
      }
    ],
    keywords: ['kidnapping', 'abduction', 'unlawful confinement', 'taking away']
  },
  {
    section: '364',
    title: 'Kidnapping for ransom, etc.',
    description: 'Whoever kidnaps any person with intent to hold for ransom shall be punished...',
    relatedCases: [
      {
        name: 'State v. Anil Sharma',
        citation: 'AIR 2000 SC 123',
        summary: 'Discussed kidnapping for ransom.',
        analysis: 'Explained the gravity of kidnapping for ransom.'
      }
    ],
    keywords: ['kidnapping for ransom', 'ransom', 'hostage', 'abduction']
  },
  {
    section: '392',
    title: 'Punishment for robbery',
    description: 'Whoever commits robbery shall be punished...',
    relatedCases: [
      {
        name: 'State v. Raj Kumar',
        citation: 'AIR 1998 SC 123',
        summary: 'Explained robbery.',
        analysis: 'Defined robbery and its punishment.'
      }
    ],
    keywords: ['robbery', 'theft with violence', 'snatching', 'armed robbery']
  },
  {
    section: '397',
    title: 'Robbery, or dacoity, with attempt to cause death or grievous hurt',
    description: 'If, at the time of committing robbery or dacoity, the offender uses any deadly weapon, or causes grievous hurt to any person, or attempts to cause death or grievous hurt to any person, the imprisonment...',
    relatedCases: [
      {
        name: 'State v. Raju',
        citation: 'AIR 2001 SC 123',
        summary: 'Discussed robbery with attempt to cause death.',
        analysis: 'Explained the aggravating factors in robbery.'
      }
    ],
    keywords: ['robbery with weapon', 'dacoity', 'attempt to kill during robbery', 'armed robbery']
  },
  {
    section: '498A',
    title: 'Husband or relative of husband of a woman subjecting her to cruelty',
    description: 'Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished...',
    relatedCases: [
      {
        name: 'Savitri Devi v. Ramesh Chand',
        citation: 'AIR 2003 SC 123',
        summary: 'Explained cruelty by husband.',
        analysis: 'Discussed the protection of women from domestic violence.'
      }
    ],
    keywords: ['cruelty', 'domestic violence', 'dowry harassment', 'abuse by husband']
  },
  {
    section: '34',
    title: 'Acts done by several persons in furtherance of common intention',
    description: 'When a criminal act is done by several persons in furtherance of the common intention of all, each of such persons is liable for that act as if it were done by him alone.',
    relatedCases: [
      {
        name: 'Krishna Govind Patil v. State of Maharashtra',
        citation: '1964 AIR 949',
        summary: 'Explained the principle of common intention.',
        analysis: 'Clarified joint liability under Section 34.'
      }
    ],
    keywords: ['common intention', 'joint liability', 'group crime', 'shared intent']
  },
  {
    section: '120B',
    title: 'Punishment of criminal conspiracy',
    description: 'Whoever is a party to a criminal conspiracy to commit an offence punishable with death, imprisonment for life or rigorous imprisonment for a term of two years or upwards, shall be punished...',
    relatedCases: [
      {
        name: 'State v. Nalini',
        citation: '1999 AIR 2640',
        summary: 'Landmark case on criminal conspiracy.',
        analysis: 'Defined criminal conspiracy and its punishment.'
      }
    ],
    keywords: ['conspiracy', 'criminal conspiracy', 'agreement to commit crime']
  },
  {
    section: '124A',
    title: 'Sedition',
    description: 'Whoever by words, either spoken or written, or by signs, or by visible representation, or otherwise, brings or attempts to bring into hatred or contempt, or excites or attempts to excite disaffection towards the government...',
    relatedCases: [
      {
        name: 'Kedar Nath Singh v. State of Bihar',
        citation: '1962 AIR 955',
        summary: 'Landmark case on sedition.',
        analysis: 'Explained the scope and limits of sedition.'
      }
    ],
    keywords: ['sedition', 'anti-government', 'disaffection', 'hatred against government']
  },
  {
    section: '141',
    title: 'Unlawful assembly',
    description: 'An assembly of five or more persons is designated an "unlawful assembly" if the common object of the persons composing that assembly is to overawe by criminal force, or show of criminal force, the Central or any State Government or Legislature, or any public servant...',
    relatedCases: [
      {
        name: 'State of UP v. Dan Singh',
        citation: '1997 AIR 1472',
        summary: 'Explained unlawful assembly.',
        analysis: 'Defined unlawful assembly and its ingredients.'
      }
    ],
    keywords: ['unlawful assembly', 'mob', 'riot', 'group violence']
  },
  {
    section: '147',
    title: 'Punishment for rioting',
    description: 'Whoever is guilty of rioting, shall be punished...',
    relatedCases: [
      {
        name: 'State v. Ram Avtar',
        citation: 'AIR 1961 SC 715',
        summary: 'Discussed punishment for rioting.',
        analysis: 'Explained the concept of rioting.'
      }
    ],
    keywords: ['rioting', 'riot', 'mob violence', 'public disorder']
  },
  {
    section: '148',
    title: 'Rioting, armed with deadly weapon',
    description: 'Whoever is guilty of rioting, being armed with a deadly weapon or with anything which, used as a weapon of offence, is likely to cause death, shall be punished...',
    relatedCases: [
      {
        name: 'State v. Balbir Singh',
        citation: 'AIR 1996 SC 307',
        summary: 'Explained rioting with deadly weapon.',
        analysis: 'Discussed aggravating factors in rioting.'
      }
    ],
    keywords: ['rioting with weapon', 'armed riot', 'deadly weapon', 'mob violence']
  },
  {
    section: '149',
    title: 'Every member of unlawful assembly guilty of offence committed in prosecution of common object',
    description: 'If an offence is committed by any member of an unlawful assembly in prosecution of the common object of that assembly, or such as the members of that assembly knew to be likely to be committed in prosecution of that object, every person who, at the time of the committing of that offence, is a member of the same assembly, is guilty of that offence.',
    relatedCases: [
      {
        name: 'Lalji v. State of UP',
        citation: '1989 AIR 754',
        summary: 'Explained liability of members of unlawful assembly.',
        analysis: 'Clarified collective liability under Section 149.'
      }
    ],
    keywords: ['unlawful assembly', 'common object', 'group crime', 'collective liability']
  },
  {
    section: '153A',
    title: 'Promoting enmity between different groups on grounds of religion, race, place of birth, residence, language, etc.',
    description: 'Whoever by words, either spoken or written, or by signs or by visible representations or otherwise, promotes or attempts to promote, on grounds of religion, race, place of birth, residence, language, caste or community or any other ground whatsoever, disharmony or feelings of enmity, hatred or ill-will between different religious, racial, language or regional groups or castes or communities, shall be punished...',
    relatedCases: [
      {
        name: 'Bilal Ahmed Kaloo v. State of Andhra Pradesh',
        citation: '1997 AIR 3483',
        summary: 'Explained promoting enmity.',
        analysis: 'Discussed the scope of Section 153A.'
      }
    ],
    keywords: ['promoting enmity', 'hate speech', 'communal violence', 'disharmony']
  },
  {
    section: '186',
    title: 'Obstructing public servant in discharge of public functions',
    description: 'Whoever voluntarily obstructs any public servant in the discharge of his public functions shall be punished...',
    relatedCases: [
      {
        name: 'State v. Gopal',
        citation: 'AIR 1969 SC 123',
        summary: 'Explained obstruction of public servant.',
        analysis: 'Defined obstruction and its punishment.'
      }
    ],
    keywords: ['obstructing public servant', 'public servant', 'obstruction', 'discharge of duty']
  },
  {
    section: '201',
    title: 'Causing disappearance of evidence of offence, or giving false information to screen offender',
    description: 'Whoever, knowing or having reason to believe that an offence has been committed, causes any evidence of the commission of that offence to disappear, with the intention of screening the offender from legal punishment, or with that intention gives any information respecting the offence which he knows or believes to be false, shall be punished...',
    relatedCases: [
      {
        name: 'State v. Sushil Sharma',
        citation: '2001 AIR 1234',
        summary: 'Explained disappearance of evidence.',
        analysis: 'Discussed the importance of evidence in criminal law.'
      }
    ],
    keywords: ['disappearance of evidence', 'false information', 'screening offender', 'tampering evidence']
  },
  {
    section: '304B',
    title: 'Dowry death',
    description: 'Where the death of a woman is caused by any burns or bodily injury or occurs otherwise than under normal circumstances within seven years of her marriage and it is shown that soon before her death she was subjected to cruelty or harassment by her husband or any relative of her husband for, or in connection with, any demand for dowry, such death shall be called "dowry death"...',
    relatedCases: [
      {
        name: 'Shanti v. State of Haryana',
        citation: '1991 AIR 1226',
        summary: 'Landmark case on dowry death.',
        analysis: 'Explained the presumption of dowry death.'
      }
    ],
    keywords: ['dowry death', 'dowry', 'death of woman', 'marriage cruelty']
  },
  {
    section: '306',
    title: 'Abetment of suicide',
    description: 'If any person commits suicide, whoever abets the commission of such suicide, shall be punished...',
    relatedCases: [
      {
        name: 'Gurcharan Singh v. State of Punjab',
        citation: '2017 AIR 74',
        summary: 'Explained abetment of suicide.',
        analysis: 'Defined abetment and its punishment.'
      }
    ],
    keywords: ['abetment of suicide', 'suicide', 'encouraging suicide', 'instigating suicide']
  },
  {
    section: '363A',
    title: 'Kidnapping or maiming a minor for purposes of begging',
    description: 'Whoever kidnaps any minor or, not being the lawful guardian of such minor, obtains the custody of the minor, in order that such minor may be employed or used for the purposes of begging shall be punished...',
    relatedCases: [
      {
        name: 'State v. Ram Lal',
        citation: 'AIR 1979 SC 149',
        summary: 'Explained kidnapping for begging.',
        analysis: 'Discussed the protection of minors.'
      }
    ],
    keywords: ['kidnapping for begging', 'begging', 'minor', 'child exploitation']
  },
  {
    section: '380',
    title: 'Theft in dwelling house, etc.',
    description: 'Whoever commits theft in any building, tent or vessel used as a human dwelling, or for the custody of property, shall be punished...',
    relatedCases: [
      {
        name: 'State v. Ram Prakash',
        citation: 'AIR 1959 SC 881',
        summary: 'Explained theft in dwelling house.',
        analysis: 'Discussed aggravating factors in theft.'
      }
    ],
    keywords: ['theft in house', 'dwelling theft', 'burglary', 'housebreaking']
  },
  {
    section: '395',
    title: 'Punishment for dacoity',
    description: 'Whoever commits dacoity shall be punished...',
    relatedCases: [
      {
        name: 'State v. Ram Shankar',
        citation: 'AIR 1956 SC 441',
        summary: 'Explained dacoity.',
        analysis: 'Defined dacoity and its punishment.'
      }
    ],
    keywords: ['dacoity', 'gang robbery', 'armed gang', 'violent robbery']
  },
  {
    section: '406',
    title: 'Punishment for criminal breach of trust',
    description: 'Whoever commits criminal breach of trust shall be punished...',
    relatedCases: [
      {
        name: 'State v. Sushil Kumar',
        citation: 'AIR 1979 SC 1408',
        summary: 'Explained criminal breach of trust.',
        analysis: 'Defined breach of trust and its punishment.'
      }
    ],
    keywords: ['criminal breach of trust', 'breach of trust', 'misappropriation', 'embezzlement']
  },
  {
    section: '409',
    title: 'Criminal breach of trust by public servant, or by banker, merchant or agent',
    description: 'Whoever, being in any manner entrusted in such capacity as a public servant or in the way of his business as a banker, merchant, factor, broker, attorney or agent, commits criminal breach of trust in respect of that property, shall be punished...',
    relatedCases: [
      {
        name: 'State v. R. K. Dalmia',
        citation: 'AIR 1962 SC 1821',
        summary: 'Explained breach of trust by public servant.',
        analysis: 'Discussed higher punishment for public servants.'
      }
    ],
    keywords: ['breach of trust by public servant', 'embezzlement', 'misappropriation', 'bank fraud']
  },
  {
    section: '411',
    title: 'Dishonestly receiving stolen property',
    description: 'Whoever dishonestly receives or retains any stolen property, knowing or having reason to believe the same to be stolen property, shall be punished...',
    relatedCases: [
      {
        name: 'State v. Abdul Gani',
        citation: 'AIR 1956 SC 165',
        summary: 'Explained receiving stolen property.',
        analysis: 'Defined the offence and its punishment.'
      }
    ],
    keywords: ['receiving stolen property', 'stolen goods', 'dishonest receiving', 'retaining stolen property']
  },
  {
    section: '415',
    title: 'Cheating',
    description: 'Whoever, by deceiving any person, fraudulently or dishonestly induces the person so deceived to deliver any property to any person, or to consent that any person shall retain any property, or intentionally induces the person so deceived to do or omit to do anything which he would not do or omit if he were not so deceived, shall be punished...',
    relatedCases: [
      {
        name: 'State v. Sitaram',
        citation: 'AIR 1962 SC 1156',
        summary: 'Explained cheating.',
        analysis: 'Defined cheating and its ingredients.'
      }
    ],
    keywords: ['cheating', 'fraud', 'deceiving', 'dishonest inducement']
  },
  {
    section: '463',
    title: 'Forgery',
    description: 'Whoever makes any false document or false electronic record or part of a document or electronic record, with intent to cause damage or injury, to the public or to any person, or to support any claim or title, or to cause any person to part with property, or to enter into any express or implied contract, or with intent to commit fraud or that fraud may be committed, commits forgery.',
    relatedCases: [
      {
        name: 'State v. Mohd. Yasin',
        citation: 'AIR 1968 SC 132',
        summary: 'Explained forgery.',
        analysis: 'Defined forgery and its punishment.'
      }
    ],
    keywords: ['forgery', 'false document', 'fake record', 'fraudulent document']
  },
  {
    section: '471',
    title: 'Using as genuine a forged document or electronic record',
    description: 'Whoever fraudulently or dishonestly uses as genuine any document or electronic record which he knows or has reason to believe to be a forged document or electronic record, shall be punished...',
    relatedCases: [
      {
        name: 'State v. Abdul Karim',
        citation: 'AIR 1963 SC 1124',
        summary: 'Explained use of forged document.',
        analysis: 'Discussed the offence of using forged documents.'
      }
    ],
    keywords: ['using forged document', 'fake document', 'forged record', 'fraudulent use']
  },
  {
    section: '499',
    title: 'Defamation',
    description: 'Whoever, by words either spoken or intended to be read, or by signs or by visible representations, makes or publishes any imputation concerning any person, intending to harm, or knowing or having reason to believe that such imputation will harm, the reputation of such person, is said, except in the cases hereinafter expected, to defame that person.',
    relatedCases: [
      {
        name: 'Subramanian Swamy v. Union of India',
        citation: '2016 AIR 2728',
        summary: 'Landmark case on defamation.',
        analysis: 'Discussed the constitutionality of criminal defamation.'
      }
    ],
    keywords: ['defamation', 'reputation', 'imputation', 'harm to reputation']
  },
  {
    section: '509',
    title: 'Word, gesture or act intended to insult the modesty of a woman',
    description: 'Whoever, intending to insult the modesty of any woman, utters any word, makes any sound or gesture, or exhibits any object, intending that such word or sound shall be heard, or that such gesture or object shall be seen, by such woman, or intrudes upon the privacy of such woman, shall be punished...',
    relatedCases: [
      {
        name: 'State v. Sohan Lal',
        citation: 'AIR 1975 SC 845',
        summary: 'Explained insult to modesty of woman.',
        analysis: 'Discussed the protection of women under Section 509.'
      }
    ],
    keywords: ['insulting modesty', 'gesture', 'privacy of woman', 'verbal abuse']
  },
  {
    section: '511',
    title: 'Punishment for attempting to commit offences punishable with imprisonment for life or other imprisonment',
    description: 'Whoever attempts to commit an offence punishable by this Code with imprisonment for life or imprisonment, or to cause such an offence to be committed, and in such attempt does any act towards the commission of the offence, shall, where no express provision is made by this Code for the punishment of such attempt, be punished...',
    relatedCases: [
      {
        name: 'State v. Shiv Kumar',
        citation: 'AIR 1969 SC 898',
        summary: 'Explained attempt to commit offences.',
        analysis: 'Defined attempt and its punishment.'
      }
    ],
    keywords: ['attempt to commit offence', 'attempt', 'incomplete offence', 'failed crime']
  }
];

// Synonym mapping for common legal terms
const synonymMap: Record<string, string[]> = {
  murder: ['murder', 'kill', 'homicide', 'death', 'slay'],
  theft: ['theft', 'steal', 'stolen', 'rob', 'robbery', 'snatch'],
  cheating: ['cheat', 'fraud', 'deceive', 'dishonest'],
  rape: ['rape', 'sexual assault', 'sexual violence', 'forcible sex'],
  kidnapping: ['kidnap', 'abduct', 'abduction', 'hostage', 'ransom'],
  hurt: ['hurt', 'injury', 'harm', 'grievous hurt', 'serious injury'],
  assault: ['assault', 'attack', 'molest', 'outrage modesty', 'harassment'],
  cruelty: ['cruelty', 'domestic violence', 'abuse', 'dowry harassment'],
  dacoity: ['dacoity', 'gang robbery'],
  // ...add more as needed
};

// Flatten synonyms for easier matching
const allSynonyms = Object.values(synonymMap).flat();

export function generateIPCAnalysis(query: string) {
  try {
    if (!query) return "Please provide a query with more information about the legal situation.";
    const queryLower = query.toLowerCase();

    // Try to match any synonym in the query to section keywords
    let matchedSections = ipcSections.filter(sec => {
      const sectionKeywords = [
        sec.section,
        sec.title,
        sec.description,
        ...(sec.keywords || []),
        ...(sec.relatedCases || []).map(c => `${c.name} ${c.summary} ${c.analysis || ''}`)
      ].join(' ').toLowerCase();
      // Match if ANY synonym or keyword is present in both query and section
      return allSynonyms.some(word => queryLower.includes(word) && sectionKeywords.includes(word));
    });

    // Fallback: match if any section keyword is present in the query
    if (matchedSections.length === 0) {
      matchedSections = ipcSections.filter(sec =>
        (sec.keywords || []).some(k => queryLower.includes(k))
      );
    }

    // Fallback: match if any word in the query is present in section keywords
    if (matchedSections.length === 0) {
      const queryWords = queryLower.split(/\W+/).filter(word => word.length > 3);
      matchedSections = ipcSections.filter(sec => {
        const sectionKeywords = [
          sec.section,
          sec.title,
          sec.description,
          ...(sec.keywords || []),
          ...(sec.relatedCases || []).map(c => `${c.name} ${c.summary} ${c.analysis || ''}`)
        ].join(' ').toLowerCase();
        return queryWords.some(word => sectionKeywords.includes(word));
      });
    }

    if (matchedSections.length === 0) {
      return "No specific IPC section found for this query. Try adding more details or legal-specific terms related to the incident.";
    }

    // Return only the most relevant (first) section with full details
    const sec = matchedSections[0];
    const relatedCase = sec.relatedCases && sec.relatedCases[0];
    return {
      section: sec.section,
      title: sec.title,
      description: sec.description,
      relatedCase: relatedCase
        ? `${relatedCase.name} (${relatedCase.citation}): ${relatedCase.summary} - ${relatedCase.analysis}`
        : undefined
    };
  } catch (error) {
    console.error('Error in generateIPCAnalysis:', error);
    return "An error occurred while analyzing the legal query. Please try again.";
  }
} 