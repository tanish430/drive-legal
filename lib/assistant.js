import { lawData } from '../data/laws';

const stateOrder = lawData.jurisdictions;

function normalize(text) {
  return String(text || '').toLowerCase();
}

export function inferJurisdiction(locationText) {
  const raw = normalize(locationText);

  if (!raw) {
    return {
      state: 'India-wide',
      city: 'Unknown',
      notes: 'Share a city or turn on location for a tighter answer.',
      source: 'Fallback',
      match: null,
    };
  }

  const match = stateOrder.find((entry) => entry.aliases.some((alias) => raw.includes(alias)));

  if (!match) {
    return {
      state: 'India-wide',
      city: locationText,
      notes: 'No local jurisdiction match found. Falling back to national rules.',
      source: 'Fallback',
      match: null,
    };
  }

  return {
    state: match.state,
    city: match.city,
    notes: match.notes,
    source: 'Local law dataset',
    match,
  };
}

function detectIntent(query) {
  const text = normalize(query);

  if (text.includes('speed') || text.includes('overspeed')) return 'speed';
  if (text.includes('helmet')) return 'helmet';
  if (text.includes('phone') || text.includes('mobile')) return 'phone';
  if (text.includes('triple') || text.includes('three people') || text.includes('two-wheeler')) return 'triple-riding';
  if (text.includes('fine') || text.includes('penalty') || text.includes('violation')) return 'fine';
  if (text.includes('license') || text.includes('licence') || text.includes('document') || text.includes('registration')) return 'documents';
  if (text.includes('police') || text.includes('stop') || text.includes('officer') || text.includes('caught')) return 'encounter';
  return 'general';
}

function formatRuleBullet(rule) {
  return `• ${rule}`;
}

export function extractKmhFromText(text) {
  const match = String(text || '').match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export function answerQuestion({ question, location, language = 'en' }) {
  const jurisdiction = inferJurisdiction(location);
  const intent = detectIntent(question);
  const query = normalize(question);
  const local = jurisdiction.match;

  const matchedNationalRule = lawData.national.find((entry) => entry.keywords.some((keyword) => query.includes(keyword)));

  const lines = [];
  const citations = [];

  if (local) {
    lines.push(`For ${jurisdiction.city}, ${jurisdiction.state}: ${jurisdiction.notes}`);
    citations.push(`${jurisdiction.state} road safety dataset`);
  } else {
    lines.push('I could not confirm a city match from the location you entered, so I am using national rules only.');
    citations.push('MoRTH / national rules summary');
  }

  if (intent === 'speed' && local) {
    lines.push(`Highway speed: ${local.speedLimits.highway}`);
    lines.push(`City speed: ${local.speedLimits.city}`);
    citations.push(`${jurisdiction.state} local speed notifications`);
  }

  if ((intent === 'phone' || intent === 'fine') && matchedNationalRule) {
    lines.push(`${matchedNationalRule.summary}`);
    lines.push(`Fine guidance: ${matchedNationalRule.fine}`);
    if (matchedNationalRule.article && matchedNationalRule.section) {
      lines.push(`📋 Legal Reference: ${matchedNationalRule.article}, ${matchedNationalRule.section}`);
    }
    citations.push(...matchedNationalRule.sources);
  }

  if (intent === 'triple-riding') {
    const rule = lawData.national.find((entry) => entry.id === 'triple-riding');
    lines.push(rule.summary);
    lines.push(`Fine guidance: ${rule.fine}`);
    if (rule.article && rule.section) {
      lines.push(`📋 Legal Reference: ${rule.article}, ${rule.section}`);
    }
    citations.push(...rule.sources);
    if (local) {
      lines.push(`Local notes: ${local.localRules.map(formatRuleBullet).join(' ')}`);
    }
  }

  if (intent === 'helmet') {
    const rule = lawData.national.find((entry) => entry.id === 'helmet');
    lines.push(rule.summary);
    lines.push(`Fine guidance: ${rule.fine}`);
    if (rule.article && rule.section) {
      lines.push(`📋 Legal Reference: ${rule.article}, ${rule.section}`);
    }
    citations.push(...rule.sources);
  }

  if (intent === 'documents') {
    lines.push('🚨 IMPORTANT: You should NEVER give your original license, registration, or other documents to a traffic police officer on the road. The law does not require you to hand over original documents at a traffic stop.');
    lines.push('✅ What you should do: Politely ask the officer to note down your details and verify them through official channels. You can offer to go to the nearest police station with your documents if needed.');
    lines.push('⚖️ Legal Right: Under the MVA 1988, police can check documents but you have the right to refuse to hand over originals. They can take photocopies instead.');
    lines.push('📋 Legal Reference: Motor Vehicles Act 1988, Section 136 (Production of documents) & Section 141 (Police powers)');
    citations.push('Motor Vehicles Act 1988 - Section 136, Section 141');
  }

  if (intent === 'encounter') {
    lines.push('📋 If you are stopped by traffic police: Stay calm and cooperative.');
    lines.push('✅ Keep your license, registration, and insurance documents accessible but safe.');
    lines.push('📞 Know your rights: You can ask for the officer\'s ID and badge number. Request a written challan if you disagree.');
    lines.push('🚫 Never give cash or original documents. Ask for an official receipt if any fine is collected.');
    lines.push('📜 Legal Reference: Motor Vehicles Act 1988, Section 204 (Written challan requirement), Section 206 (Penalty provisions)');
    citations.push('Motor Vehicles Act 1988 - Section 204, Section 206');
  }

  if (intent === 'general') {
    lines.push('I help with speed limits, helmet rules, phone use, triple riding, fines, documents, and traffic encounters. Ask with a city or state for a more specific answer.');
  }

  const followUp = local
    ? 'If you want a stricter answer, share the exact road name or turn on GPS so I can cross-check the posted limit.'
    : 'Share a city or use GPS so I can narrow the state-level enforcement rules.';

  return {
    answer: lines.join(' '),
    jurisdiction,
    citations: [...new Set(citations)],
    confidence: local ? 0.86 : 0.58,
    language,
    followUp,
    intent,
  };
}

export function buildQuiz() {
  return [
    {
      question: 'What should you do if a traffic rule differs between your state law and road signage?',
      options: ['Follow the posted road signage and check the local notification', 'Use any rule from another state', 'Ignore the signage'],
      answerIndex: 0,
      explanation: 'Road-specific signage and local notifications control the exact limit.',
    },
    {
      question: 'Which data processing model fits DriveLegal best?',
      options: ['Cloud-first storage of ride history', 'Edge-first, privacy-preserving monitoring with only transient processing', 'Manual logging of every trip'],
      answerIndex: 1,
      explanation: 'The project is designed for local inference and no persistent ride storage.',
    },
  ];
}
