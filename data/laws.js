export const lawData = {
  national: [
    {
      id: 'phone-use',
      topic: 'phone use while driving',
      summary: 'Handheld mobile use while driving is prohibited; hands-free use rules vary by state enforcement.',
      fine: 'Typically Rs 1,000 to Rs 5,000 depending on offense category and repeat violations.',
      sources: ['MoRTH road safety guidance', 'State traffic enforcement circulars'],
      keywords: ['phone', 'mobile', 'calling', 'texting', 'call'],
      article: 'Motor Vehicles Act 1988',
      section: 'Section 184 (Use of wireless telegraphy apparatus)',
    },
    {
      id: 'triple-riding',
      topic: 'triple riding on two-wheelers',
      summary: 'Carrying more than the permitted passengers on a two-wheeler is a traffic offense across India.',
      fine: 'Commonly Rs 1,000 plus possible vehicle seizure / court proceedings in repeat cases.',
      sources: ['Motor Vehicles Act enforcement practice'],
      keywords: ['triple riding', 'three people', 'overload', 'two-wheeler'],
      article: 'Motor Vehicles Act 1988',
      section: 'Section 128 (Passenger seat requirement on two-wheelers)',
    },
    {
      id: 'helmet',
      topic: 'helmet mandate',
      summary: 'ISI-marked helmets are required for rider and pillion in most jurisdictions, subject to local exemptions and enforcement rules.',
      fine: 'Usually Rs 1,000 for helmet-related violations in many states.',
      sources: ['Motor Vehicles Act', 'State traffic police notices'],
      keywords: ['helmet', 'helmetless', 'pillion'],
      article: 'Motor Vehicles Act 1988',
      section: 'Section 129 (Helmet requirement)',
    },
    {
      id: 'overspeed',
      topic: 'speeding and overspeeding',
      summary: 'Speeding fines depend on the notified road class and the amount above the posted limit.',
      fine: 'Fines vary by speed band; serious cases can attract summons and suspension.',
      sources: ['Local speed notifications', 'National Highway authority advisories'],
      keywords: ['speed', 'overspeed', 'fast', 'limit'],
      article: 'Motor Vehicles Act 1988',
      section: 'Section 188 (Speed regulation)',
    },
  ],
  jurisdictions: [
    {
      state: 'Delhi',
      aliases: ['delhi', 'new delhi', 'ncr'],
      city: 'Delhi',
      notes: 'Highway speed limits depend on the notified stretch and road category.',
      speedLimits: {
        highway: '100 km/h on many expressway sections, subject to signage and notification.',
        city: '50 km/h on major city roads unless posted otherwise.',
      },
      localRules: [
        'Phone use while driving is enforced strictly with electronic challans.',
        'Helmet and seat belt checks are common near congestion points.',
      ],
    },
    {
      state: 'Karnataka',
      aliases: ['karnataka', 'bengaluru', 'bangalore', 'mangalore', 'mysuru'],
      city: 'Bengaluru',
      notes: 'Local enforcement often includes helmet and pillion checks around IT corridors and arterial roads.',
      speedLimits: {
        highway: 'Typically 80 to 100 km/h depending on the stretch and road classification.',
        city: '30 to 40 km/h on many inner city roads and school zones.',
      },
      localRules: [
        'Triple riding and pillion helmet compliance are heavily enforced.',
        'Do not rely on rural-road norms inside Bengaluru city limits.',
      ],
    },
    {
      state: 'Tamil Nadu',
      aliases: ['tamil nadu', 'tamilnadu', 'chennai', 'coimbatore', 'madurai'],
      city: 'Chennai',
      notes: 'Chennai and district roads can have different posted limits. Always prefer the signage on the road.',
      speedLimits: {
        highway: 'Often 80 to 100 km/h on notified highway sections.',
        city: '40 to 50 km/h on urban roads unless marked otherwise.',
      },
      localRules: [
        'Helmet compliance and lane discipline are major enforcement targets.',
        'Camera-based challans are common on prominent corridors.',
      ],
    },
    {
      state: 'Maharashtra',
      aliases: ['maharashtra', 'mumbai', 'pune', 'nagpur'],
      city: 'Mumbai',
      notes: 'Mumbai has dense enforcement zones and frequent speed-camera coverage.',
      speedLimits: {
        highway: 'Usually 80 to 100 km/h depending on the corridor.',
        city: '40 km/h or as posted on arterial roads and near schools/hospital zones.',
      },
      localRules: [
        'Triple riding, phone use, and overspeeding are actively penalized.',
        'Ride-sharing and cab lanes may have separate restrictions.',
      ],
    },
    {
      state: 'Kerala',
      aliases: ['kerala', 'kochi', 'kozhikode', 'thiruvananthapuram', 'trivandrum'],
      city: 'Kochi',
      notes: 'Kerala frequently enforces helmet and phone-use rules through local patrols and camera systems.',
      speedLimits: {
        highway: '80 to 100 km/h on notified highway stretches.',
        city: '30 to 50 km/h depending on road width and locality.',
      },
      localRules: [
        'Mobile use while driving is not allowed even in slow traffic.',
        'Use the posted limit for the exact road, not a district-wide assumption.',
      ],
    },
  ],
};
