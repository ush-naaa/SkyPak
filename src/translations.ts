export const translations = {
  en: {
    // Page titles
    findInSky: 'Find It In The Sky',
    findSubtitle: "Select an event — we'll tell you if it's visible and where to look",
    pakistanSkyEvents: 'Pakistan Sky Events',
    eventsSubtitle: 'Tap Navigate on any event to find it in your sky',

    // Status
    visible: 'Visible',
    notVisible: 'Not Visible',
    loading: 'Loading sky data for',
    checkingVisibility: 'Checking visibility for',
    computingEvents: 'Computing events for',

    // Event selector
    pickEvent: 'Pick an event',
    selectEvent: 'Select an event',

    // Compass
    rotatePhone: 'Rotate your phone until the needle points straight up',
    pointPhone: 'Point your phone toward',
    lookAbove: 'above the horizon',
    nearGround: 'near the ground',
    halfwayUp: 'halfway up',
    highUp: 'high up',
    calibrating: 'Slowly rotate your phone to calibrate...',
    aligned: '✓ Aligned! Look up',
    enableCompass: 'Tap to Enable Compass',
    compassSettings: 'Settings → Safari → Motion & Orientation',

    // Not visible
    belowHorizon: 'is below the horizon from',
    tonight: 'tonight.',
    tryCity: 'Try switching to',
    betterSky: '— they often have clearer skies and better viewing angles.',

    // Calendar badges
    moonInterference: 'Moon too bright',
    darkSky: 'Good dark sky',
    noEquipment: 'No equipment needed',
    bestViewing: 'Best time to watch',
    navigate: 'Navigate',
    height: 'Height',
    direction: 'Direction',
    moon: 'Moon',

    // Filters
    all: 'All',
    eclipse: 'Eclipse',
    meteorShower: 'Meteor Shower',
    moonFilter: 'Moon',

    // Descriptions
    descEclipse: "The Moon passes between Earth and the Sun, casting a shadow across Earth's surface. Never look directly without a solar filter.",
    descLunarEclipse: "Earth moves between the Sun and Moon, turning the Moon a deep blood red. Perfectly safe to view with naked eyes.",
    descMeteorShower: "Earth passes through debris left by a comet. Dozens of shooting stars per hour streak across the sky — no equipment needed, just dark skies.",
    descMoon: "The Moon reaches a key phase — either fully illuminated for a bright Full Moon, or completely dark for a New Moon perfect for deep sky viewing.",
    descPlanet: "A planet reaches an optimal position for viewing from Earth, appearing unusually bright and clear in the night sky.",
    descOther: "A notable astronomical event worth watching from Pakistan's skies.",
  },
  ur: {
    // Page titles
    findInSky: 'آسمان میں ڈھونڈیں',
    findSubtitle: 'واقعہ منتخب کریں — ہم بتائیں گے کہ نظر آئے گا یا نہیں',
    pakistanSkyEvents: 'پاکستان آسمانی واقعات',
    eventsSubtitle: 'کسی بھی واقعے پر "راستہ" دبائیں تاکہ اسے آسمان میں ڈھونڈ سکیں',

    // Status
    visible: 'نظر آئے گا',
    notVisible: 'نظر نہیں آئے گا',
    loading: 'لوڈ ہو رہا ہے',
    checkingVisibility: 'جانچ ہو رہی ہے',
    computingEvents: 'واقعات حساب ہو رہے ہیں',

    // Event selector
    pickEvent: 'واقعہ منتخب کریں',
    selectEvent: 'واقعہ چنیں',

    // Compass
    rotatePhone: 'فون گھمائیں جب تک سوئی سیدھی اوپر نہ ہو',
    pointPhone: 'فون کا رخ کریں',
    lookAbove: 'افق سے اوپر',
    nearGround: 'افق کے قریب',
    halfwayUp: 'درمیان میں',
    highUp: 'بہت اوپر',
    calibrating: 'فون آہستہ گھمائیں...',
    aligned: '✓ بالکل صحیح! اوپر دیکھیں',
    enableCompass: 'قطب نما چالو کریں',
    compassSettings: 'ترتیبات ← سفاری ← حرکت',

    // Not visible
    belowHorizon: 'افق سے نیچے ہے',
    tonight: 'آج رات۔',
    tryCity: 'دوسرا شہر آزمائیں',
    betterSky: '— وہاں آسمان زیادہ صاف ہو سکتا ہے۔',

    // Calendar badges
    moonInterference: 'چاند بہت روشن ہے',
    darkSky: 'صاف آسمان',
    noEquipment: 'کوئی آلہ درکار نہیں',
    bestViewing: 'بہترین وقت',
    navigate: 'راستہ',
    height: 'بلندی',
    direction: 'سمت',
    moon: 'چاند',

    // Filters
    all: 'سب',
    eclipse: 'گرہن',
    meteorShower: 'شہاب ثاقب',
    moonFilter: 'چاند',

    // Descriptions
    descEclipse: 'چاند زمین اور سورج کے درمیان آ جاتا ہے۔ براہ کرم سورج گرہن بغیر خاص عینک کے نہ دیکھیں۔',
    descLunarEclipse: 'زمین سورج اور چاند کے درمیان آ جاتی ہے جس سے چاند سرخ ہو جاتا ہے۔ ننگی آنکھ سے دیکھنا بالکل محفوظ ہے۔',
    descMeteorShower: 'زمین دمدار ستارے کے ملبے سے گزرتی ہے۔ فی گھنٹہ درجنوں شہاب ثاقب آسمان میں چمکتے ہیں — کوئی آلہ نہیں چاہیے۔',
    descMoon: 'چاند اپنے اہم مرحلے پر پہنچتا ہے — یا تو پورا چاند یا بالکل اندھیرا جو گہرے آسمان کے لیے بہترین ہے۔',
    descPlanet: 'ایک سیارہ زمین سے دیکھنے کے لیے بہترین پوزیشن میں آتا ہے اور آسمان میں بہت روشن نظر آتا ہے۔',
    descOther: 'پاکستان کے آسمان سے دیکھنے کے قابل ایک خاص فلکیاتی واقعہ۔',
  }
};

export type TranslationKey = keyof typeof translations.en;
