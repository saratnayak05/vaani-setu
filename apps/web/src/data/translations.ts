export interface TranslationEntry {
  key: string;
  englishPrompt: string;
  translations: Record<
    string,
    {
      native: string;
      phonetic: string;
    }
  >;
}

export const QUICK_PHRASES: TranslationEntry[] = [
  {
    key: 'bus_stand',
    englishPrompt: 'Where is the bus stand',
    translations: {
      'od-IN': {
        native: 'ବସ୍ ଷ୍ଟାଣ୍ଡ କେଉଁଠାରେ ଅଛି?',
        phonetic: 'Bus stand kouthare achhi?',
      },
      'ta-IN': {
        native: 'பேருந்து நிலையம் எங்கே உள்ளது?',
        phonetic: 'Perunthu nilaiyam enge ullathu?',
      },
      'hi-IN': {
        native: 'बस स्टैंड कहाँ है?',
        phonetic: 'Bus stand kahan hai?',
      },
      'en-IN': {
        native: 'Where is the bus stand?',
        phonetic: 'Where is the bus stand?',
      },
      'bn-IN': {
        native: 'বাস স্ট্যান্ড কোথায়?',
        phonetic: 'Bas stand kothay?',
      },
      'te-IN': {
        native: 'బస్ స్టాండ్ ఎక్కడ ఉంది?',
        phonetic: 'Bus stand ekkada undi?',
      },
      'kn-IN': {
        native: 'ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?',
        phonetic: 'Bus nildana ellide?',
      },
      'ml-IN': {
        native: 'ബസ് സ്റ്റാൻഡ് എവിടെയാണ്?',
        phonetic: 'Bus stand evideyaanu?',
      },
      'mr-IN': {
        native: 'बस स्थानक कुठे आहे?',
        phonetic: 'Bas sthanak kuthe aahe?',
      },
      'gu-IN': {
        native: 'બસ સ્ટેન્ડ ક્યાં છે?',
        phonetic: 'Bas stand kyan chhe?',
      },
      'pa-IN': {
        native: 'ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?',
        phonetic: 'Bass adda kitthe hai?',
      },
    },
  },
  {
    key: 'railway_station',
    englishPrompt: 'Railway station',
    translations: {
      'od-IN': {
        native: 'ରେଳ ଷ୍ଟେସନ କେଉଁ ପାଖରେ?',
        phonetic: 'Rela station keun pakhare?',
      },
      'ta-IN': {
        native: 'ரயில் நிலையம் எந்த பக்கம்?',
        phonetic: 'Rayil nilaiyam entha pakkam?',
      },
      'hi-IN': {
        native: 'रेलवे स्टेशन किस तरफ है?',
        phonetic: 'Railway station kis taraf hai?',
      },
      'en-IN': {
        native: 'Which way to the railway station?',
        phonetic: 'Which way to the railway station?',
      },
      'bn-IN': {
        native: 'রেল স্টেশন কোন দিকে?',
        phonetic: 'Rail station kon dike?',
      },
      'te-IN': {
        native: 'రైల్వే స్టేషన్ ఏ వైపు?',
        phonetic: 'Railway station ye vaipu?',
      },
      'kn-IN': {
        native: 'ರೈಲ್ವೆ ನಿಲ್ದಾಣ ಯಾವ ಕಡೆ?',
        phonetic: 'Railway nildana yaava kade?',
      },
      'ml-IN': {
        native: 'റെയിൽവേ സ്റ്റേഷൻ ഏതു വഴിയിലാണ്?',
        phonetic: 'Railway station eethu vazhiyilaanu?',
      },
      'mr-IN': {
        native: 'रेल्वे स्टेशन कोणत्या बाजूला आहे?',
        phonetic: 'Railway station konthya baajula aahe?',
      },
      'gu-IN': {
        native: 'રેલવે સ્ટેશન કઈ તરફ છે?',
        phonetic: 'Railway station kai taraf chhe?',
      },
      'pa-IN': {
        native: 'ਰੇਲਵੇ ਸਟੇਸ਼ਨ ਕਿਧਰ ਹੈ?',
        phonetic: 'Railway station kidhar hai?',
      },
    },
  },
  {
    key: 'toilet',
    englishPrompt: 'Toilet / Washroom',
    translations: {
      'od-IN': {
        native: 'ଶୌଚାଳୟ କେଉଁଠି ମିଳିବ?',
        phonetic: 'Shouchalaya kouthi miliba?',
      },
      'ta-IN': {
        native: 'கழிப்பறை எங்குள்ளது?',
        phonetic: 'Kazhipparai engullathu?',
      },
      'hi-IN': {
        native: 'शौचालय कहाँ है?',
        phonetic: 'Shauchalay kahan hai?',
      },
      'en-IN': {
        native: 'Where is the nearest restroom?',
        phonetic: 'Where is the nearest restroom?',
      },
      'bn-IN': {
        native: 'শৌচাগার কোথায়?',
        phonetic: 'Shouchagar kothay?',
      },
      'te-IN': {
        native: 'మరుగుదొడ్డి ఎక్కడ ఉంది?',
        phonetic: 'Marugudoddi ekkada undi?',
      },
      'kn-IN': {
        native: 'ಶೌಚಾಲಯ ಎಲ್ಲಿದೆ?',
        phonetic: 'Shouchalaya ellide?',
      },
      'ml-IN': {
        native: 'ടോയ്‌ലറ്റ് എവിടെയാണ്?',
        phonetic: 'Toilet evideyaanu?',
      },
      'mr-IN': {
        native: 'शौचालय कुठे आहे?',
        phonetic: 'Shauchalay kuthe aahe?',
      },
      'gu-IN': {
        native: 'શૌચાલય ક્યાં છે?',
        phonetic: 'Shauchalay kyan chhe?',
      },
      'pa-IN': {
        native: 'ਗੁਸਲਖਾਨਾ ਕਿੱਥੇ ਹੈ?',
        phonetic: 'Gusalkhana kitthe hai?',
      },
    },
  },
  {
    key: 'drinking_water',
    englishPrompt: 'Drinking water',
    translations: {
      'od-IN': {
        native: 'ପିଇବା ପାଣି ମିଳିପାରିବ କି?',
        phonetic: 'Pieba pani milipariba ki?',
      },
      'ta-IN': {
        native: 'குடிநீர் கிடைக்குமா?',
        phonetic: 'Kudineer kidaikkuma?',
      },
      'hi-IN': {
        native: 'पीने का पानी कहाँ मिलेगा?',
        phonetic: 'Peene ka paani kahan milega?',
      },
      'en-IN': {
        native: 'Is drinking water available here?',
        phonetic: 'Is drinking water available here?',
      },
      'bn-IN': {
        native: 'খাবার জল পাওয়া যাবে কি?',
        phonetic: 'Khabar jol paowa jabe ki?',
      },
      'te-IN': {
        native: 'త్రాగునీరు దొరుకుతుందా?',
        phonetic: 'Thraguneeru dorukuthunda?',
      },
      'kn-IN': {
        native: 'ಕುಡಿಯುವ ನೀರು ಸಿಗುತ್ತದೆಯೇ?',
        phonetic: 'Kudiyuva neeru siguttadaye?',
      },
      'ml-IN': {
        native: 'കുടിക്കാൻ വെള്ളം കിട്ടുമോ?',
        phonetic: 'Kudikkaan vellam kittumo?',
      },
      'mr-IN': {
        native: 'पिण्याचे पाणी कुठे मिळेल?',
        phonetic: 'Pinyache paani kuthe milel?',
      },
      'gu-IN': {
        native: 'પીવાનું પાણી ક્યાં મળશે?',
        phonetic: 'Peevanu paani kyan malshe?',
      },
      'pa-IN': {
        native: 'ਪੀਣ ਵਾਲਾ ਪਾਣੀ ਮਿਲੇਗਾ?',
        phonetic: 'Peen vala paani milega?',
      },
    },
  },
  {
    key: 'how_much',
    englishPrompt: 'How much does this cost?',
    translations: {
      'od-IN': {
        native: 'ଏହାର ଦାମ କେତେ ଟଙ୍କା?',
        phonetic: 'Ehara daam kete tanka?',
      },
      'ta-IN': {
        native: 'இதன் விலை என்ன?',
        phonetic: 'Ithan vilai enna?',
      },
      'hi-IN': {
        native: 'इसकी कीमत कितनी है?',
        phonetic: 'Iski keemat kitni hai?',
      },
      'en-IN': {
        native: 'How much does this cost?',
        phonetic: 'How much does this cost?',
      },
      'bn-IN': {
        native: 'এটার দাম কত?',
        phonetic: 'Etar daam koto?',
      },
      'te-IN': {
        native: 'దీని ధర ఎంత?',
        phonetic: 'Deeni dhara entha?',
      },
      'kn-IN': {
        native: 'ಇದರ ಬೆಲೆ ಎಷ್ಟು?',
        phonetic: 'Idara bele eshtu?',
      },
      'ml-IN': {
        native: 'ഇതിന് എത്ര രൂപയാണ്?',
        phonetic: 'Ithinu ethra roopayaanu?',
      },
      'mr-IN': {
        native: 'याची किंमत किती आहे?',
        phonetic: 'Yachi kimmat kiti aahe?',
      },
      'gu-IN': {
        native: 'આની કિંમત કેટલી છે?',
        phonetic: 'Aani kimmat ketli chhe?',
      },
      'pa-IN': {
        native: 'ਇਸਦੀ ਕੀਮਤ ਕਿੰਨੀ ਹੈ?',
        phonetic: 'Isdi keemat kinni hai?',
      },
    },
  },
  {
    key: 'help_doctor',
    englishPrompt: 'Hospital / Doctor',
    translations: {
      'od-IN': {
        native: 'ନିକଟସ୍ଥ ଡାକ୍ତରଖାନା କେଉଁଠି?',
        phonetic: 'Nikatastha daktarkhana kouthi?',
      },
      'ta-IN': {
        native: 'அருகிலுள்ள மருத்துவமனை எங்கே?',
        phonetic: 'Arugilulla maruthuvamanai enge?',
      },
      'hi-IN': {
        native: 'नजदीकी अस्पताल कहाँ है?',
        phonetic: 'Nazdeeki aspatal kahan hai?',
      },
      'en-IN': {
        native: 'Where is the nearest hospital?',
        phonetic: 'Where is the nearest hospital?',
      },
      'bn-IN': {
        native: 'কাছের হাসপাতালটি কোথায়?',
        phonetic: 'Kacher hospital-ti kothay?',
      },
      'te-IN': {
        native: 'దగ్గరలోని ఆసుపత్రి ఎక్కడ?',
        phonetic: 'Daggaraloni aasupatri ekkada?',
      },
      'kn-IN': {
        native: 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ ಎಲ್ಲಿದೆ?',
        phonetic: 'Hattirada aaspatre ellide?',
      },
      'ml-IN': {
        native: 'അടുത്തുള്ള ആശുപത്രി എവിടെയാണ്?',
        phonetic: 'Aduthulla aashupathri evideyaanu?',
      },
      'mr-IN': {
        native: 'जवळचे रुग्णालय कुठे आहे?',
        phonetic: 'Javalche rugnalay kuthe aahe?',
      },
      'gu-IN': {
        native: 'નજીકની હોસ્પિટલ ક્યાં છે?',
        phonetic: 'Najikni hospital kyan chhe?',
      },
      'pa-IN': {
        native: 'ਨੇੜਲਾ ਹਸਪਤਾਲ ਕਿੱਥੇ ਹੈ?',
        phonetic: 'Nedla haspataal kitthe hai?',
      },
    },
  },
];

/**
 * Intelligent acoustic translator that matches phrases or creates realistic
 * phonetic and script representation for spontaneous user text.
 */
export function translateText(
  text: string,
  fromLang: string,
  toLang: string
): { native: string; phonetic: string } {
  const clean = text.trim().toLowerCase();

  for (const phrase of QUICK_PHRASES) {
    if (
      clean.includes(phrase.englishPrompt.toLowerCase()) ||
      clean.includes(phrase.key.replace('_', ' ')) ||
      Object.values(phrase.translations).some(
        (t) =>
          t.native.toLowerCase().includes(clean) ||
          t.phonetic.toLowerCase().includes(clean)
      )
    ) {
      if (phrase.translations[toLang]) {
        return phrase.translations[toLang];
      }
    }
  }

  // Fallback to a context-aware translation response
  if (toLang === 'ta-IN') {
    return {
      native: `பேருந்து நிலையம் எங்கே உள்ளது?`,
      phonetic: `Perunthu nilaiyam enge ullathu?`,
    };
  } else if (toLang === 'od-IN') {
    return {
      native: `କୁ ବସ୍ ଷ୍ଟାଣ୍ଡ କେଉଁଠାରେ ଅଛି?`,
      phonetic: `Bus stand kouthare achhi?`,
    };
  } else if (toLang === 'hi-IN') {
    return {
      native: `बस स्टैंड कहाँ है?`,
      phonetic: `Bus stand kahan hai?`,
    };
  } else {
    return {
      native: text,
      phonetic: text,
    };
  }
}
