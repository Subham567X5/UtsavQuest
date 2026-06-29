export interface TranslationSet {
  // Common / Navigation
  creatorSuite: string;
  tester: string;
  creatorCustomizer: string;
  testView: string;
  specialInvitation: string;
  backToCreator: string;

  // Welcome Intro
  welcomeTitle: string;
  welcomeSubtitle: string;

  // Customizer Engine
  customizerTitle: string;
  whoIsFor: string;
  nameLabel: string;
  namePlaceholder: string;
  nameHelper: string;
  wishLabel: string;
  wishPlaceholder: string;
  wishHelper: string;
  wishRevert: string;
  secretLabel: string;
  secretDesc: string;
  secretPlaceholder: string;

  // Countdown Customizer
  countdownTitle: string;
  countdownDesc: string;
  targetDateLabel: string;
  presetsLabel: string;
  presetNone: string;
  preset1Min: string;
  preset1Hour: string;
  presetTomorrow: string;
  lockToggleLabel: string;
  lockToggleDesc: string;

  // Share area
  generateTitle: string;
  generateDesc: string;
  copyBtn: string;
  copiedBtn: string;
  copiedTooltip: string;
  resetBtn: string;

  // Drum & Melody preview
  drumTitle: string;
  drumDesc: string;
  kick: string;
  snare: string;
  hihat: string;
  crash: string;
  tomHigh: string;
  tomMid: string;
  tomLow: string;
  drumRoll: string;
  melodyTitle: string;
  melodyTest: string;
  melodyPaused: string;
  melodyDefaultLyric: string;
  backingTrackLabel: string;
  previewCardLabel: string;
  previewCountdownLabel: string;
  polaroidPlaceholder: string;
  polaroidTitle: string;

  // Sister / Recipient View
  questLockedTitle: string;
  questLockedDesc: string;
  stageLabel: string;
  congratsUnwrapped: string;
  continueToNext: string;

  // Levels & Games
  // Gift Box
  giftTitle: string;
  giftDesc: string;

  // Cake Screen
  cakeTitle: string;
  cakeDescUnlit: string;
  cakeDescLit: string;
  cakeClosedEyesWish: string;
  cakeBlowBtn: string;
  cakeWishSent: string;
  cakeCutTitle: string;
  cakeCutDescUncut: string;
  cakeCutDescCut: string;
  cakeCutBtn: string;

  // Balloon Game
  balloonTitle: string;
  balloonDesc: string;
  balloonsPopped: string;
  wordsCollected: string;
  balloonWinMsg: string;

  // Blessing Catcher
  catcherTitle: string;
  catcherScore: string;
  catcherDesc: string;
  catcherWinMsg: string;

  // Sister Quiz
  quizTitle: string;
  quizDesc: string;
  quizScore: string;
  quizCorrect: string;
  quizIncorrect: string;
  quizExplanationTitle: string;
  quizNextBtn: string;
  quizPerfect: string;
  quizPass: string;
  quizRetryBtn: string;
  quizUnlockBtn: string;

  // Memory Wall (Sticky board)
  boardTitleWrite: string;
  boardTitleRead: string;
  boardDescWrite: string;
  boardDescRead: string;
  boardFormMessage: string;
  boardFormMessagePlaceholder: string;
  boardFormName: string;
  boardFormNamePlaceholder: string;
  boardFormColor: string;
  boardPinBtn: string;
  boardEmpty: string;
  boardFrom: string;

  // Footer / Guide
  guideHowToShare: string;
}

export const translations: Record<'en' | 'bn', TranslationSet> = {
  en: {
    creatorSuite: "Creator Suite",
    tester: "Tester",
    creatorCustomizer: "Creator Customizer",
    testView: "Test Recipient View",
    specialInvitation: "Special Invitation: Complete all 4 levels to unlock your custom birthday wishes!",
    backToCreator: "👈 Back to Design workspace",

    welcomeTitle: "Welcome to UtsavQuest!",
    welcomeSubtitle: "Design an interactive, gamified birthday quest for your loved one. Customize their name, upload their photo, write private wishes, and share a gorgeous hand-crafted digital keepsake.",

    customizerTitle: "Wishes Customizer Engine",
    whoIsFor: "Who is this birthday quest for?",
    nameLabel: "Celebrant's Name",
    namePlaceholder: "e.g. Sreeja, Bunu, Di",
    nameHelper: "Defaults to 'Sister' if left empty.",
    wishLabel: "Birthday Greeting Message",
    wishPlaceholder: "Type your warm birthday messages here...",
    wishHelper: "Feel free to write in Bengali or English!",
    wishRevert: "Revert to Default Wish",
    secretLabel: "🤫 Secret Message (গোপন বার্তা)",
    secretDesc: "Add a super special, private secret message! The birthday recipient will be able to unlock and read this with an interactive tap.",
    secretPlaceholder: "Type your secret memories, private blessings, or funny birthday girl/boy inside jokes here...",

    countdownTitle: "Magic Birthday Countdown ⏰",
    countdownDesc: "Add a real-time countdown to the birthday party! You can even lock her quest until the exact second!",
    targetDateLabel: "Target Celebration Date & Time:",
    presetsLabel: "Presets:",
    presetNone: "None",
    preset1Min: "In 1 Min (Test)",
    preset1Hour: "In 1 Hour",
    presetTomorrow: "Tomorrow Midnight",
    lockToggleLabel: "Lock Game Quest Until Countdown Ends",
    lockToggleDesc: "Locks levels until the countdown reaches 00:00:00",

    generateTitle: "Generate Link",
    generateDesc: "Every customization is saved in a lightweight URL below. Click copy, send it, and let them unlock this birthday quest!",
    copyBtn: "Copy Shareable Link",
    copiedBtn: "Copied Link!",
    copiedTooltip: "Copied to clipboard! Send this URL to begin their magical levels!",
    resetBtn: "Reset Customizer Defaults",

    drumTitle: "Interactive Drum Kit 🥁",
    drumDesc: "Tap pads or press keyboard [A, S, D, F, G, H] to play personalized beats for the birthday celebrant!",
    kick: "Kick [A]",
    snare: "Snare [S]",
    hihat: "Hi-Hat [D]",
    crash: "Crash [F]",
    tomHigh: "Tom-H [G]",
    tomMid: "Tom-M [H]",
    tomLow: "Tom-L [J]",
    drumRoll: "Drumroll 🥁",
    melodyTitle: "Synth Melody & Lyrics Checker",
    melodyTest: "Try Happy Birthday Melody",
    melodyPaused: "Song paused ⏸️",
    melodyDefaultLyric: "Let's play the song! 🎵",
    backingTrackLabel: "Unique Drum Backing Track",
    previewCardLabel: "Live Greeting Card Preview",
    previewCountdownLabel: "Live Countdown Timer Preview",
    polaroidPlaceholder: "📷 Polaroid Image Place",
    polaroidTitle: "Select Polaroid Photo Frame style",

    questLockedTitle: "Surprise is Locked! 🎁",
    questLockedDesc: "A magical birthday surprise has been prepared for you! It will unlock in exactly:",
    stageLabel: "Stage",
    congratsUnwrapped: "Congratulations! Level Unwrapped! 🎉",
    continueToNext: "Continue to Next Level ➔",

    giftTitle: "Birthday Surprise! 🎁✨",
    giftDesc: "A magical box filled with love, laughter, and wishes! Tap the box repeatedly to unwrap!",

    cakeTitle: "Step 2: Light the Birthday Cake! 🎂",
    cakeDescUnlit: "Tap on each of the 5 candles to light them up!",
    cakeDescLit: "All candles are lit! Close your eyes and make a beautiful wish!",
    cakeClosedEyesWish: "Close your eyes, think of your sweetest birthday wish... May all your dreams come true! 🎂💜✨",
    cakeBlowBtn: "💨 Make a Wish & Blow!",
    cakeWishSent: "✨ Wish Sent to Heaven! 🎉",
    cakeCutTitle: "Step 2.5: Cut the Birthday Cake! 🍰🔪",
    cakeCutDescUncut: "Trace a slice or click the button to cut the cake virtual style!",
    cakeCutDescCut: "Spectacularly Cut! Let's celebrate!",
    cakeCutBtn: "🔪 Cut the Cake",

    balloonTitle: "Stage 3: Pop the Blessing Balloons! 🎈",
    balloonDesc: "Pop 10 rising balloons to gather your heartfelt birthday blessings! Tap or hover to pop!",
    balloonsPopped: "Balloons Popped",
    wordsCollected: "Blessings Collected",
    balloonWinMsg: "Fantastic! You popped all the balloons and gathered all the beautiful blessings! 🎈✨",

    catcherTitle: "Stage 4: Catch the Blessings! 🧺",
    catcherScore: "Score",
    catcherDesc: "🧺 Drag or tap buttons to move the basket. Catch Hearts ❤️, Gifts 🎁, and Flowers 🌸. Avoid the Worries/Clouds 🌧️!",
    catcherWinMsg: "Incredible catcher skill! You caught enough pure blessings to unlock the final reveal! 🌟🏆",

    quizTitle: "Stage 5: Ultimate Birthday Trivia! 🏆🧠",
    quizDesc: "Answer these 3 special questions to prove your connection and unlock the final letter! Let's see if you can score 3/3!",
    quizScore: "Quiz Progress",
    quizCorrect: "Correct! 🎉",
    quizIncorrect: "Incorrect! ❌",
    quizExplanationTitle: "Insight:",
    quizNextBtn: "Next Question ➔",
    quizPerfect: "Perfect 3/3! You are officially the ultimate connection! 🌟✨",
    quizPass: "Great job! You passed the quiz! Let's unwrap your special letter now!",
    quizRetryBtn: "🔄 Retry Quiz",
    quizUnlockBtn: "🎁 Open Final Birthday Keepsake ➔",

    boardTitleWrite: "Write a Secret Birthday Wish! 📝",
    boardTitleRead: "Birthday Wish Board! 📝✨",
    boardDescWrite: "Pin a heartwarming memory, prayer, or surprise message on the board. It will be saved locally as a sweet keepsake sticky note!",
    boardDescRead: "Loved ones have pinned sweet memories, blessings, and private birthday wishes here for you! Enjoy reading them! 💖",
    boardFormMessage: "Your Message (Bengali or English)",
    boardFormMessagePlaceholder: "Write a sweet memory or birthday message here...",
    boardFormName: "Your Name",
    boardFormNamePlaceholder: "Name",
    boardFormColor: "Sticky Color",
    boardPinBtn: "Pin Sticky Wish",
    boardEmpty: "The board is currently empty.",
    boardFrom: "— From",

    guideHowToShare: "How to share: When you are satisfied with the customized name and wish, click the Copy Shareable Link button above. Then send it directly to your recipient! They will be launched into their quest, complete 4 interactive levels to unwrap, blow candles, pop balloons, catch blessings, and finally unlock this gorgeous letter."
  },
  bn: {
    creatorSuite: "ক্রিয়েটর স্যুইট",
    tester: "টেস্টার",
    creatorCustomizer: "ক্রিয়েটর কাস্টমাইজার",
    testView: "টেস্ট ভিউ (পরীক্ষা করুন)",
    specialInvitation: "বিশেষ আমন্ত্রণ: কাস্টম জন্মদিন শুভেচ্ছা আনলক করতে ৪টি স্তর সম্পূর্ণ করুন!",
    backToCreator: "👈 কাস্টমাইজার উইন্ডোতে ফিরে যান",

    welcomeTitle: "স্বাগতম UtsavQuest-এ! 🌸",
    welcomeSubtitle: "আপনার প্রিয়জনের জন্য একটি আকর্ষণীয় ও চমৎকার গেম-ভিত্তিক জন্মদিনের উপহার তৈরি করুন। নাম কাস্টমাইজ করুন, ছবি আপলোড করুন, গোপন শুভেচ্ছা বার্তা লিখুন এবং একটি দৃষ্টিনন্দন ডিজিটাল উপহার উপহার দিন।",

    customizerTitle: "শুভেচ্ছা কাস্টমাইজার ইঞ্জিন",
    whoIsFor: "এই জন্মদিনের কোয়েস্টটি কার জন্য?",
    nameLabel: "জন্মদিনের ব্যক্তির নাম",
    namePlaceholder: "যেমন: সৃজা, বুনু, দিদিভাই",
    nameHelper: "কিছু না দিলে স্বয়ংক্রিয়ভাবে 'বোন' (Sister) হিসেবে সেট হবে।",
    wishLabel: "জন্মদিনের শুভেচ্ছা বার্তা",
    wishPlaceholder: "এখানে আপনার সুন্দর শুভেচ্ছা বার্তাটি লিখুন (বাংলা বা ইংরেজি সমর্থন করে)...",
    wishHelper: "নির্দ্বিধায় বাংলা বা ইংরেজিতে আপনার বার্তাটি লিখুন!",
    wishRevert: "ডিফল্ট শুভেচ্ছা বার্তায় ফিরে যান",
    secretLabel: "🤫 গোপন বার্তা (Secret Message)",
    secretDesc: "একটি অত্যন্ত বিশেষ এবং ব্যক্তিগত গোপন বার্তা যোগ করুন! জন্মদিনের ব্যক্তি একটি স্পর্শের মাধ্যমে এটি আনলক করে পড়তে পারবেন।",
    secretPlaceholder: "আপনাদের সুন্দর কোনো স্মৃতি, আশিস বা জন্মদিনের মজার কোনো কথা এখানে লিখে রাখুন...",

    countdownTitle: "ম্যাজিকাল বার্থডে কাউন্টডাউন ⏰",
    countdownDesc: "জন্মদিনের মূল উদযাপনের জন্য একটি রিয়েল-টাইম কাউন্টডাউন যোগ করুন! এমনকি জন্মদিন শুরু হওয়ার সঠিক সেকেন্ড পর্যন্ত গেমটি লকও করে রাখতে পারেন!",
    targetDateLabel: "উদযাপনের তারিখ ও সময়:",
    presetsLabel: "প্রিসেটসমূহ:",
    presetNone: "কোনোটিই নয়",
    preset1Min: "১ মিনিট পর (টেস্ট)",
    preset1Hour: "১ ঘণ্টা পর",
    presetTomorrow: "আগামীকাল মধ্যরাত",
    lockToggleLabel: "কাউন্টডাউন শেষ না হওয়া পর্যন্ত কোয়েস্ট লক রাখুন",
    lockToggleDesc: "কাউন্টডাউন ০০:০০:০০ তে না পৌঁছানো পর্যন্ত গেমের লেভেলগুলো লক থাকবে",

    generateTitle: "লিঙ্ক তৈরি করুন",
    generateDesc: "আপনার সমস্ত কাস্টমাইজেশন নিচের লিঙ্কে সংরক্ষিত রয়েছে। লিঙ্কটি কপি করে পাঠিয়ে দিন, এবং তাদের জন্মদিনের চমৎকার উপহারটি আনলক করতে দিন!",
    copyBtn: "শেয়ার করার লিঙ্ক কপি করুন",
    copiedBtn: "লিঙ্ক কপি হয়েছে!",
    copiedTooltip: "ক্লিপবোর্ডে কপি হয়েছে! জন্মদিনের ব্যক্তিকে এই লিঙ্কটি পাঠান ম্যাজিকাল লেভেল শুরু করতে!",
    resetBtn: "কাস্টমাইজার ডিফল্ট রিসেট করুন",

    drumTitle: "ইন্টারেক্টিভ ড্রাম কিট 🥁",
    drumDesc: "প্যাডে স্পর্শ করুন অথবা কিবোর্ডের [A, S, D, F, G, H] টিপে জন্মদিনের ব্যক্তির জন্য সুর তৈরি করুন!",
    kick: "কিক [A]",
    snare: "স্নিয়ার [S]",
    hihat: "হাই-হ্যাট [D]",
    crash: "ক্র্যাশ [F]",
    tomHigh: "টম-হাই [G]",
    tomMid: "টম-মিড [H]",
    tomLow: "টম-লো [J]",
    drumRoll: "ড্রামরোল 🥁",
    melodyTitle: "সিন্থ সুর ও লিরিক্স চেকার",
    melodyTest: "শুভ জন্মদিন সুর বাজান",
    melodyPaused: "গানটি পজ করা হয়েছে ⏸️",
    melodyDefaultLyric: "চলুন গানটি বাজানো যাক! 🎵",
    backingTrackLabel: "অনন্য ড্রাম ব্যাকিং ট্র্যাক",
    previewCardLabel: "লাইভ গ্রিটিং কার্ড প্রিভিউ",
    previewCountdownLabel: "লাইভ কাউন্টডাউন প্রিভিউ",
    polaroidPlaceholder: "📷 পোলারয়েড ছবি ফ্রেম",
    polaroidTitle: "পোলারয়েড ছবির ফ্রেম স্টাইল নির্বাচন করুন",

    questLockedTitle: "সারপ্রাইজটি এখনো লকড! 🎁",
    questLockedDesc: "আপনার জন্য একটি চমৎকার ম্যাজিকাল বার্থডে সারপ্রাইজ তৈরি করা হয়েছে! এটি আনলক হতে আর মাত্র বাকি:",
    stageLabel: "স্তর",
    congratsUnwrapped: "অভিনন্দন! লেভেল সম্পন্ন হয়েছে! 🎉",
    continueToNext: "পরবর্তী স্তরে যান ➔",

    giftTitle: "বার্থডে সারপ্রাইজ! 🎁✨",
    giftDesc: "ভালোবাসা, হাসি ও শুভকামনায় ভরা একটি জাদুকরী বাক্স! এটি আনলক করতে বারবার বাক্সের ওপর ক্লিক বা স্পর্শ করুন!",

    cakeTitle: "ধাপ ২: জন্মদিনের কেকের মোমবাতি জ্বালান! 🎂",
    cakeDescUnlit: "৫টি মোমবাতি জ্বালাতে প্রতিটিতে স্পর্শ বা ক্লিক করুন!",
    cakeDescLit: "সব মোমবাতি জ্বলে উঠেছে! এবার চোখ বন্ধ করে একটি সুন্দর ইচ্ছে মনে মনে ভাবুন!",
    cakeClosedEyesWish: "চোখ বন্ধ করুন, মনের সবচেয়ে সুন্দর মিষ্টি ইচ্ছেটা ভাবুন... ঈশ্বরের কাছে প্রার্থনা করি আপনার সব স্বপ্ন সত্যি হোক! 🎂💜✨",
    cakeBlowBtn: "💨 ইচ্ছে পূরণ করে ফুঁ দিন!",
    cakeWishSent: "✨ ইচ্ছে স্বর্গে পৌঁছে গেছে! 🎉",
    cakeCutTitle: "ধাপ ২.৫: জন্মদিনের কেক কাটুন! 🍰🔪",
    cakeCutDescUncut: "কেকের উপর দাগ কেটে বা বাটনটি ক্লিক করে ভার্চুয়াল উপায়ে কেকটি কাটুন!",
    cakeCutDescCut: "চমৎকারভাবে কাটা হয়েছে! চলুন উদযাপন করি!",
    cakeCutBtn: "🔪 কেক কাটুন",

    balloonTitle: "স্তর ৩: বেলুন ফাটিয়ে আশিস সংগ্রহ করুন! 🎈",
    balloonDesc: "আকাশে উড়ন্ত ১০টি মোমবাতি-রঙিন বেলুন ফাটিয়ে জন্মদিনের আশিস সংগ্রহ করুন! মাউস বা স্পর্শ দিয়ে ফাটান!",
    balloonsPopped: "ফাটানো বেলুন",
    wordsCollected: "সংগৃহীত আশীর্বাদ",
    balloonWinMsg: "দুর্দান্ত! আপনি সবকটি বেলুন ফাটিয়ে সুন্দর সব শুভকামনা ও আশীর্বাদ সংগ্রহ করেছেন! 🎈✨",

    catcherTitle: "স্তর ৪: আশিস ও ভালোবাসা লুফে নিন! 🧺",
    catcherScore: "স্কোর",
    catcherDesc: "🧺 ঝুড়িটি সরাতে মাউস বা বোতাম স্পর্শ করুন। হৃদয় ❤️, উপহার 🎁 ও ফুল 🌸 কুড়িয়ে নিন। মেঘ বা দুশ্চিন্তা 🌧️ এড়িয়ে চলুন!",
    catcherWinMsg: "অসাধারণ দক্ষতা! আপনি সমস্ত শুভকামনা ঝুড়িতে ভরেছেন! এবার চূড়ান্ত সারপ্রাইজ উপহারটি দেখার পালা! 🌟🏆",

    quizTitle: "স্তর ৫: জন্মদিনের মজার কুইজ! 🏆🧠",
    quizDesc: "চূড়ান্ত শুভেচ্ছা চিঠিটি আনলক করতে এই ৩টি বিশেষ প্রশ্নের সঠিক উত্তর দিন! দেখা যাক আপনি ৩/৩ পান কি না!",
    quizScore: "কুইজ অগ্রগতি",
    quizCorrect: "সঠিক উত্তর! 🎉",
    quizIncorrect: "ভুল উত্তর! ❌",
    quizExplanationTitle: "ব্যাখ্যা:",
    quizNextBtn: "পরবর্তী প্রশ্ন ➔",
    quizPerfect: "দুর্দান্ত কুইজ ৩/৩! আপনি সত্যিই সম্পর্কের মূল্য সবচেয়ে ভালো বোঝেন! 🌟✨",
    quizPass: "দারুণ খেলেছেন! আপনি কুইজে উত্তীর্ণ হয়েছেন! চলুন আপনার জন্য তৈরি বিশেষ শুভেচ্ছা চিঠিটি এখন পড়া যাক!",
    quizRetryBtn: "🔄 আবার চেষ্টা করুন",
    quizUnlockBtn: "🎁 চূড়ান্ত জন্মদিনের উপহার ও চিঠি আনলক করুন ➔",

    boardTitleWrite: "একটি গোপন জন্মদিনের শুভেচ্ছা লিখুন! 📝",
    boardTitleRead: "জন্মদিনের শুভেচ্ছা বোর্ড! 📝✨",
    boardDescWrite: "বোর্ডে একটি সুন্দর স্মৃতি, আশিস বা শুভেচ্ছা বার্তা পিন করুন। এটি একটি সুন্দর স্টিকি নোট হিসেবে সংরক্ষিত থাকবে!",
    boardDescRead: "আপনার প্রিয়জনেরা এখানে আপনার জন্য মিষ্টি সব স্মৃতি, আশীর্বাদ ও জন্মদিনের শুভেচ্ছা বার্তা পিন করে গেছেন! আনন্দ নিয়ে সেগুলো পড়ুন! 💖",
    boardFormMessage: "আপনার বার্তা (বাংলা বা ইংরেজি)",
    boardFormMessagePlaceholder: "এখানে একটি সুন্দর স্মৃতি বা শুভকামনা লিখুন...",
    boardFormName: "আপনার নাম",
    boardFormNamePlaceholder: "নাম",
    boardFormColor: "স্টিকি নোটের রঙ",
    boardPinBtn: "স্টিকি নোট পিন করুন",
    boardEmpty: "বোর্ডটি বর্তমানে খালি আছে।",
    boardFrom: "— ইতি,",

    guideHowToShare: "কীভাবে শেয়ার করবেন: যখন আপনি আপনার কাস্টম নাম ও শুভেচ্ছা নিয়ে সন্তুষ্ট হবেন, উপরের 'শেয়ার করার লিঙ্ক কপি করুন' বোতামটি ক্লিক করুন। তারপর লিঙ্কটি সরাসরি আপনার প্রিয়জনকে পাঠিয়ে দিন! তারা তাদের জন্মদিনের গেম কোয়েস্টে প্রবেশ করবে, কেক কাটবে, বেলুন ফাটাবে, আশিস সংগ্রহ করবে এবং পরিশেষে আপনার সুন্দর চিঠিটি আনলক করবে।"
  }
};
