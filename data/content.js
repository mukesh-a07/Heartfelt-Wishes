/**
 * ============================================================================
 * CINEMATIC 21: MASTER PERSONAL CONTENT CONFIGURATION
 * ============================================================================
 * 
 * Welcome to the central personalization file for the website.
 * Every visible piece of personal content—her name, dates, poems, memories,
 * letters, easter eggs, audio files, and photo paths—is configured right here.
 * 
 * To customize any part of the site, simply edit the values below.
 */

export const contentData = {
  // --------------------------------------------------------------------------
  // 1. Recipient & Personal Identity
  // --------------------------------------------------------------------------
  person: {
    name: 'Lakshu',
    fullName: 'Lakshu',
    nickname: 'Lakshu',
    age: 21,
    pronoun: 'she'
  },

  // --------------------------------------------------------------------------
  // 2. Birthday Milestone & Vault Gate
  // --------------------------------------------------------------------------
  birthday: {
    // The exact Date of Birth required to unlock the Gatekeeper vault
    dob: {
      day: '23',
      month: '09',
      year: '2005'
    },
    // The milestone birthday date
    milestoneYear: 2026,
    celebrationDate: '23 September 2026',
    formattedDate: '23 · 09 · 2026'
  },

  // --------------------------------------------------------------------------
  // 3. Audio & Music Soundtrack
  // --------------------------------------------------------------------------
  audio: {
    // Primary audio file path (Kannana Kanne uploaded track)
    soundtrackPath: 'assets/music/kannana-kanne.mp3',
    fallbackPath: 'assets/music/kannana kanne.mp3',
    title: 'Kannana Kanne',
    artist: 'D. Imman / Sid Sriram',
    album: 'Viswasam'
  },

  // --------------------------------------------------------------------------
  // 4. Gatekeeper (DOB Entry Vault)
  // --------------------------------------------------------------------------
  gatekeeper: {
    badge: 'A Private Memory',
    title: 'Before we begin…',
    subtitle: 'There is one date only you should know, Lakshu.',
    hint: 'Enter the date that started your story.',
    placeholderDay: 'DD',
    placeholderMonth: 'MM',
    placeholderYear: 'YYYY',
    buttonText: 'Unlock'
  },

  // --------------------------------------------------------------------------
  // 5. Cinematic Hero Section
  // --------------------------------------------------------------------------
  hero: {
    portraitImage: 'assets/images/hero-portrait.png',
    portraitAlt: 'Portrait of Lakshu',
    mastheadDate: '23 / 09 / 2005',
    storyTag: 'A Story Still Being Written',
    issueTags: [
      { text: 'Issue 21', highlight: true },
      { text: 'September 2026' },
      { text: 'For Lakshu' },
      { text: 'Limited Edition' }
    ],
    title: 'Lakshu.',
    subtitle: '“Twenty-one years of light, laughter, and timeless grace.”',
    scrollHint: 'Scroll to enter the story'
  },

  // --------------------------------------------------------------------------
  // 6. Tamil Poetry Chamber (Kavithai)
  // --------------------------------------------------------------------------
  poetry: [
    {
      id: 'kavithai-01',
      chapter: 'Kavithai — 01',
      theme: 'Unspoken Bond',
      tamilLines: [
        'வாழ்க்கையில் சந்திக்கும் பலர்',
        'நினைவாக மாறிவிடுகிறார்கள்…',
        'ஆனால் நீயோ, என் வாழ்க்கையையே',
        'அழகான நினைவுகளின் கூடாரமாய் மாற்றிவிட்டாய் Lakshu.'
      ],
      highlightIndex: 3,
      translation: 'Many people we cross paths with simply become memories… but you, Lakshu, turned my whole life into a sanctuary of beautiful memories.',
      signature: '— With a thousand memories'
    },
    {
      id: 'kavithai-02',
      chapter: 'Kavithai — 02',
      theme: 'Timelessness & Distance',
      tamilLines: [
        'நாட்கள் நகர்ந்தாலும், வருடங்கள் மாறினாலும்,',
        'நம் நட்பிற்கு காலம் வயதை மட்டும் கூட்டும் Lakshu…',
        'தூரத்தை அல்ல.'
      ],
      highlightIndex: 2,
      translation: 'Days may pass and years may change, but for our bond, time only adds years, Lakshu—never distance.',
      signature: '— Written in gratitude'
    },
    {
      id: 'kavithai-03',
      chapter: 'Kavithai — 03',
      theme: 'Kannana Kanne',
      tamilLines: [
        'கடல் அலை போல கால்களை நனைத்துவிட்டு',
        'விலகிச் செல்லும் மனிதர்கள் மத்தியில்…',
        'கடல் மண்ணாய் எப்போதுமே துணை நிற்கும்',
        'என் கண்ணான கண்ணே நீ.'
      ],
      highlightIndex: 3,
      translation: 'In a world of people who brush by like ocean waves and disappear, you are the steadfast shore that always stays—my dearest soul.',
      signature: '— For twenty one and beyond'
    }
  ],

  // --------------------------------------------------------------------------
  // 7. Nostalgia Memory Timeline Archive (2021 – 2026)
  // Each chapter: front face (curiosity) → back face (full memory)
  // --------------------------------------------------------------------------
  memories: [
    {
      id: 'memory-2021',
      year: '2021',
      chapter: 'Chapter 01',
      accentColor: '#D9B56D',
      image: 'assets/images/memory-2021.png',
      showPhotoOnFront: false,
      // Front face
      frontSubtitle: 'Before everything had a name.',
      frontTagline: 'The year I first noticed you.',
      // Back face
      title: 'The First Notice',
      story: [
        'The year I first joined your school and stepped into 11th.',
        'You were in the Bio-Maths class, and I was in CS — just the class next door.',
        'I didn\'t really know you yet. You were simply someone I had started noticing.',
        'I never knew that the girl from the neighbouring class would slowly become such an important part of my story.'
      ],
      cinematicLines: [
        'Different classes. Different worlds.',
        'I was in CS, you were in Bio-Maths — just one class away.',
        'I barely knew you then…',
        'but somehow, I already liked having you around.'
      ],
      closingLine: 'Some stories begin long before we realise they have started.'
    },
    {
      id: 'memory-2022',
      year: '2022',
      chapter: 'Chapter 02',
      accentColor: '#C9829B',
      image: 'assets/images/memory-2022.png',
      showPhotoOnFront: false,
      // Front face
      frontSubtitle: 'The year our friendship found its first words.',
      frontTagline: '12th · Conversations · Friendship',
      // Back face
      title: 'The Beginning',
      story: [
        '12th was when we actually started talking.',
        'I still didn\'t know everything about you, but there was already something about you that I liked.',
        'Slowly, conversations became longer, comfort became natural,',
        'and somewhere between all those little talks, you became a real friend to me.'
      ],
      cinematicLines: [
        'We started talking in 12th.',
        'I didn\'t know you completely yet,',
        'but I already knew I liked talking to you.',
        'Slowly, "just someone I knew" became my friend.'
      ],
      closingLine: 'We didn\'t know where it was going. We just kept talking.'
    },
    {
      id: 'memory-2023',
      year: '2023',
      chapter: 'Chapter 03',
      accentColor: '#D9B56D',
      image: 'assets/images/memory-2023.png',
      showPhotoOnFront: false,
      // Front face
      frontSubtitle: 'The year distance quietly entered our story.',
      frontTagline: 'School ended · New beginnings · Finding each other again',
      // Back face
      title: 'The Gap',
      story: [
        'School ended, and life suddenly moved in different directions.',
        'I joined college, you joined another college, and for a while there was a little distance between us.',
        'Then we got back in touch.',
        'That was when I started knowing the real you — not just the person I knew from school, but the person behind all those conversations.'
      ],
      cinematicLines: [
        'School ended. Life changed. We drifted a little.',
        'Different colleges. Different routines.',
        'Then somehow, we found our way back to talking.',
        'And that was when I started discovering the real you.'
      ],
      closingLine: 'Sometimes distance doesn\'t end a friendship. It shows you whether you will find your way back.'
    },
    {
      id: 'memory-2024',
      year: '2024',
      chapter: 'Chapter 04',
      accentColor: '#E8CF96',
      image: 'assets/images/memory-2024.png',
      showPhotoOnFront: false,
      // Front face
      frontSubtitle: 'Somewhere along the way, you became one of my people.',
      frontTagline: 'Friendship · Trust · First meeting',
      // Back face
      title: 'Closer',
      story: [
        'By 2024, you weren\'t just a friend anymore.',
        'You had become someone I genuinely looked for, someone whose presence mattered to me.',
        'And then came the day we finally met in person.',
        'One ordinary day became one of those memories that quietly stays with you.'
      ],
      cinematicLines: [
        'By then, you weren\'t just a friend.',
        'You had become someone I genuinely cared about.',
        'And then, one day, we finally met.',
        'A simple day… that somehow became a memory worth keeping.'
      ],
      closingLine: 'Some friendships are built through conversations. Others become real the moment you finally meet.'
    },
    {
      id: 'memory-2025',
      year: '2025',
      chapter: 'Chapter 05',
      accentColor: '#C9829B',
      image: 'assets/images/memory-2025.png',
      showPhotoOnFront: false,
      // Front face
      frontSubtitle: 'The year friendship became even more familiar.',
      frontTagline: 'More memories · More closeness · Two unforgettable days',
      // Back face
      title: 'Two Days to Remember',
      story: [
        'We became even closer.',
        'Then came your college function — and I came to see you.',
        'Those two days were simple, but they became special because I got to be there.',
        'And after that, somehow, the question became less "Will we meet?" and more "When are we meeting again?"'
      ],
      cinematicLines: [
        'We got closer.',
        'Then came your college function — two days I won\'t forget.',
        'I came to see you, we spent those days together,',
        'and somewhere after that, "When will we meet again?" became a question I actually wanted answered.'
      ],
      closingLine: 'Some days end. The memories they leave behind don\'t.'
    },
    {
      id: 'memory-2026',
      year: '2026',
      chapter: 'Chapter 06',
      accentColor: '#D9B56D',
      image: 'assets/images/memory-2026.png',
      showPhotoOnFront: false,
      // Front face
      frontSubtitle: 'And somehow, we\'re still writing it.',
      frontTagline: '21 · Today · Still us',
      // Back face
      title: 'Still Here',
      story: [
        'You\'re 21 now, and somehow we\'re still here — still talking, still laughing, still creating memories, and yes… occasionally fighting over the smallest things.',
        'Sometimes I care a little too intensely, and that has probably started more than a few of our little wars.',
        'Sometimes I realise it, understand where I went wrong, and try to make things right.',
        'You may stay quiet for a while… but eventually, the storm passes. And somehow, that\'s one of the things I value most about us.'
      ],
      cinematicLines: [
        'And somehow, we\'re still here.',
        'You\'re 21 now.',
        'We\'ve had laughter, memories, distance, closeness… and yes, our little wars too.',
        'But somehow — I still want you in my life.'
      ],
      closingLine: 'Not a perfect story. Just a real one — and one I hope keeps going.'
    }
  ],

  // --------------------------------------------------------------------------
  // 7b. "Things I Learned About You" — Subtle Observation Cards
  // --------------------------------------------------------------------------
  aboutHer: [
    {
      id: 'about-01',
      observation: 'You enjoy your own company.',
      supporting: 'You don\'t always need a crowd around you.'
    },
    {
      id: 'about-02',
      observation: 'You have your own world.',
      supporting: 'Quiet, independent, and perfectly comfortable in your own space.'
    },
    {
      id: 'about-03',
      observation: 'You care about what you do.',
      supporting: 'Especially when it comes to your studies and the things that matter to you.'
    },
    {
      id: 'about-04',
      observation: 'You don\'t let everyone get close.',
      supporting: 'And maybe that\'s why the people you truly allow into your world matter more.'
    },
    {
      id: 'about-05',
      observation: 'When you\'re hurt or angry, you need your own time.',
      supporting: 'I know better than to expect an instant reply after one of our little wars.'
    },
    {
      id: 'about-06',
      observation: 'And somehow…',
      supporting: null,
      isSpecial: true,
      specialText: 'I still want to be there.'
    }
  ],

  // --------------------------------------------------------------------------
  // 8. Memory Constellation (8 Stars forming "21")
  // --------------------------------------------------------------------------
  constellation: [
    // Digit "2"
    {
      id: 1, x: 26, y: 28, group: '2',
      title: 'Next-Door Classes',
      text: 'CS class and Bio-Maths class — one corridor apart. I barely knew you, but somehow I already liked having you around.',
      image: 'assets/images/memory-2021.png',
      unlocked: false
    },
    {
      id: 2, x: 42, y: 26, group: '2',
      title: 'When We Actually Talked',
      text: '12th grade changed things. Conversations got longer, comfort came naturally, and somewhere along the way, you became a real friend.',
      image: 'assets/images/memory-2022.png',
      unlocked: false
    },
    {
      id: 3, x: 38, y: 48, group: '2',
      title: 'The Gap We Crossed',
      text: 'Different colleges, different worlds — but we found our way back. That reconnection showed me the real you, not just the version I knew from school.',
      image: 'assets/images/memory-2023.png',
      unlocked: false
    },
    {
      id: 4, x: 25, y: 72, group: '2',
      title: 'The Day We Met',
      text: 'We had talked for years before we ever met in person. That first time changed something. A simple day that quietly became a memory.',
      image: 'assets/images/memory-2024.png',
      unlocked: false
    },
    {
      id: 5, x: 44, y: 72, group: '2',
      title: 'Two Days That Stayed',
      text: 'Your college function. Two days together. I came to see you — and somehow those two days became the kind of memory that does not fade.',
      image: 'assets/images/memory-2025.png',
      unlocked: false
    },
    // Digit "1"
    {
      id: 6, x: 65, y: 34, group: '1',
      title: 'Our Little Wars',
      text: 'We are not perfect. We have had our silences, our disagreements, our little wars. But somehow, every time, we find our way back to each other.',
      image: 'assets/images/memory-2026.png',
      unlocked: false
    },
    {
      id: 7, x: 73, y: 24, group: '1',
      title: 'What I See in You',
      text: 'You are quieter than most, stronger than you let on, and far more important to me than I probably say out loud. That is the truth, Lakshu.',
      image: 'assets/images/hero-portrait.png',
      unlocked: false
    },
    {
      id: 8, x: 73, y: 72, group: '1',
      title: 'Still Here at 21',
      text: 'Six years. One friendship. Still here. I hope there are many more chapters left — and I hope I am there for all of them. Happy 21st, Lakshu.',
      image: 'assets/images/memory-2026.png',
      unlocked: false
    }
  ],

  // --------------------------------------------------------------------------
  // 9. The Personal Letter
  // --------------------------------------------------------------------------
  letter: {
    openingHook: 'There are things I may never say out loud every day, Lakshu…',
    paragraphs: [
      {
        id: 'p1',
        lines: [
          'In the rush of ordinary days, it is easy to let the most important words stay quiet.',
          'We tease each other, we share countless moments, we move through time—',
          'and sometimes we forget to pause and say what truly matters.'
        ]
      },
      {
        id: 'p2',
        lines: [
          'You have been a constant warmth through every season, Lakshu—',
          'the kind of person whose presence makes everything feel a little lighter, a little gentler,',
          'and infinitely more meaningful.'
        ]
      },
      {
        id: 'p3',
        lines: [
          'Twenty-one years of life have made you rare:',
          'full of quiet strength, boundless grace, and a heart that leaves an imprint on everyone you touch.',
          'Watching you step into this milestone is nothing short of an honor.'
        ]
      },
      {
        id: 'p4',
        lines: [
          'Like the words of Kannana Kanne, no matter where time takes our stories,',
          'no matter how many years gather on the calendar,',
          'know that you are seen, you are celebrated, and you are cherished beyond measure.'
        ]
      }
    ],
    gratitudeStatement: 'Thank you for being such an irreplaceable part of my life, Lakshu.',
    signature: {
      signoff: 'With timeless gratitude & love,',
      author: 'Always in your corner, Lakshu. ✦'
    },
    transitionBridge: {
      leadIn: 'And now, there is one last thing waiting for you…',
      actionText: 'Step into the Finale',
      targetSceneId: 'scene-finale'
    }
  },

  // --------------------------------------------------------------------------
  // 10. Hidden Messages & Easter Eggs
  // --------------------------------------------------------------------------
  hiddenMessages: {
    // Micro-discovery toast revealed when clicking the hero date badge
    microWhisper: '“7,670 days. 184,000 hours. And every single second, someone has been profoundly grateful that you were born, Lakshu.”',

    // Private handwritten keepsake revealed when clicking the wax seal button
    keepsakeLetter: {
      badge: 'A KEEPSAKE // ISSUE 21',
      salutation: 'To You, Lakshu — At Twenty-One.',
      body: [
        'If you have found your way into this quiet corner, it means you took the time to look a little closer—just as you always do with the people and moments around you.',
        'Twenty-one years is not merely a milestone on a calendar; it is thousands of quiet kindnesses, shared laughter that echoed down empty streets, late-night conversations where the world fell away, and the rare gift of your presence.',
        'Thank you for being someone who makes the world gentler, brighter, and infinitely more meaningful simply by being in it. May this new chapter bring you the same peace, laughter, and wonder that you give so freely to others.'
      ],
      signoff: 'With timeless gratitude & love,',
      author: 'Always in your corner, Lakshu. ✦'
    }
  },

  // --------------------------------------------------------------------------
  // 11. The Birthday Finale & Climax
  // --------------------------------------------------------------------------
  finale: {
    badge: 'Scene 07 // The Milestone',
    title: 'Twenty-One Years of Light',
    subtitle: 'Every moment, every silence, and every quiet kindness has led to this horizon, Lakshu.',
    buttonText: 'One Last Thing',
    climaxLines: [
      'For every laugh, Lakshu.',
      'Every conversation.',
      'Every memory.',
      'Every version of us.',
      'Thank you for being part of my life.',
      'Happy 21st Birthday, Lakshu.'
    ],
    milestoneCrest: 'The Milestone',
    milestoneDate: '23 · 09 · 2026',
    closingText: 'May the year ahead bring you all the warmth, joy, and peace you so effortlessly give to the world, Lakshu.',
    returnButtonText: '↺ Return to Story'
  }
};

// Re-exports for modular backwards compatibility
export const letterContent = contentData.letter;
export const poetryData = contentData.poetry;
export const memoriesData = contentData.memories;
export const constellationData = contentData.constellation;
