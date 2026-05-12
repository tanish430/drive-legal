'use client';

import { useEffect, useMemo, useState } from 'react';
import { buildQuiz, extractKmhFromText, inferJurisdiction } from '../lib/assistant';
import { buildRideReport, evaluateRideSnapshot } from '../lib/monitoring';
import { getT } from '../lib/translations';

const emptyRide = {
  speedKmh: 0,
  speedLimitKmh: 0,
  phoneInUse: false,
  helmetMissing: false,
  swervingScore: 0,
  locationLabel: 'GPS disabled',
};

const languageChoices = [
  { label: 'English', value: 'en' },
  { label: 'हिंदी', value: 'hi' },
  { label: 'தமிழ்', value: 'ta' },
  { label: 'ಕನ್ನಡ', value: 'kn' },
];

function resolveLanguageLabel(value) {
  return languageChoices.find((option) => option.value === value)?.label ?? 'English';
}

function speak(text, language = 'en') {
  if (!('speechSynthesis' in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : language === 'kn' ? 'kn-IN' : 'en-IN';
  utterance.rate = 0.98;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export default function HomePage() {
  const quiz = useMemo(() => buildQuiz(), []);
  const [language, setLanguage] = useState('en');
  const t = useMemo(() => getT(language), [language]);
  const [location, setLocation] = useState('Bengaluru, Karnataka');
  const [question, setQuestion] = useState('Fine for triple-riding in Bangalore?');
  const [answer, setAnswer] = useState({
    answer: 'Ask a location-specific question to get a law summary.',
    citations: [],
    confidence: 0,
    followUp: 'Share a city or turn on GPS for a tighter result.',
  });
  const [isListening, setIsListening] = useState(false);
  const [monitoring, setMonitoring] = useState(false);
  const [ride, setRide] = useState(emptyRide);
  const [monitorResult, setMonitorResult] = useState(() => evaluateRideSnapshot(emptyRide));
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState('');
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [report, setReport] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  
  useEffect(() => {
    setStatusMessage(t.alerts?.ready || 'Ready. Ask a rule question or enter Ride Mode.');
  }, [language, t]);

  useEffect(() => {
    const jurisdiction = inferJurisdiction(location);
    const limitText = jurisdiction.match?.speedLimits?.city || jurisdiction.match?.speedLimits?.highway || '';
    const speedLimitKmh = extractKmhFromText(limitText);

    setRide((current) => ({
      ...current,
      speedLimitKmh,
    }));
  }, [location]);

  useEffect(() => {
    setMonitorResult(evaluateRideSnapshot(ride));
  }, [ride]);

  useEffect(() => {
    if (!monitoring || !('geolocation' in navigator)) return undefined;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const speed = Number.isFinite(position.coords.speed) ? Math.round((position.coords.speed || 0) * 3.6) : 0;
        setRide((current) => {
          const nextRide = {
            ...current,
            speedKmh: speed,
            locationLabel: `${position.coords.latitude.toFixed(3)}, ${position.coords.longitude.toFixed(3)}`,
            swervingScore: Math.min(10, Math.max(0, Math.round(((position.coords.accuracy || 20) / 10) - 1))),
          };
          const reportData = buildRideReport(nextRide);
          setReport(reportData);
          if (reportData.riskScore >= 70) {
            setStatusMessage(t.alerts?.highRiskDetected || 'High-risk signal detected.');
          }
          return nextRide;
        });
      },
      () => {
        setStatusMessage(t.alerts?.locationAccessNeeded || 'Location access is needed.');
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 12000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [monitoring]);

  useEffect(() => {
    const handleMotion = (event) => {
      if (!monitoring) return;
      const total = Math.abs(event.accelerationIncludingGravity?.x || 0) + Math.abs(event.accelerationIncludingGravity?.y || 0) + Math.abs(event.accelerationIncludingGravity?.z || 0);
      setRide((current) => ({ ...current, swervingScore: Math.min(10, Math.round(total / 3)) }));
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [monitoring]);

  async function askLaw(event) {
    event.preventDefault();
    setStatusMessage(t.alerts?.checkingLaws || 'Checking laws...');

    const response = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, location, language }),
    });

    const payload = await response.json();
    setAnswer(payload);
    setStatusMessage(t.alerts?.answerUpdated || 'Answer updated.');
    speak(payload.answer, language);
  }

  async function startVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatusMessage(t.alerts?.voiceNotAvailable || 'Voice input not available.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : language === 'kn' ? 'kn-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript);
      setStatusMessage(`Heard: ${transcript}`);
    };

    recognition.onerror = () => {
      setStatusMessage(t.alerts?.voiceCaptureFailed || 'Voice capture failed.');
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  }

  async function beginMonitoring() {
    setStatusMessage(t.alerts?.requestingAccess || 'Requesting access...');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const speed = Number.isFinite(position.coords.speed) ? Math.round((position.coords.speed || 0) * 3.6) : 0;
          const jurisdiction = inferJurisdiction(location);
          const limitText = jurisdiction.match?.speedLimits?.city || jurisdiction.match?.speedLimits?.highway || '';
          setRide((current) => ({
            ...current,
            speedKmh: speed,
            speedLimitKmh: extractKmhFromText(limitText),
            locationLabel: `${position.coords.latitude.toFixed(3)}, ${position.coords.longitude.toFixed(3)}`,
          }));
          setMonitoring(true);
          setStatusMessage(t.alerts?.rideMode || 'Ride Mode active.');
        },
        () => {
          setStatusMessage(t.alerts?.locationDenied || 'Location permission denied.');
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 12000 }
      );
    }

    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }

  function stopMonitoring() {
    setMonitoring(false);
    setRide(emptyRide);
    setReport(null);
    setStatusMessage(t.alerts?.rideModeStopped || 'Ride Mode stopped.');
  }

  function answerQuiz(selectedIndex) {
    const current = quiz[0];
    setSelectedQuiz(selectedIndex);
    if (selectedIndex === current.answerIndex) {
      setQuizScore((value) => value + 1);
      setQuizFeedback(current.explanation);
    } else {
      setQuizFeedback(`Correct answer: ${current.options[current.answerIndex]}. ${current.explanation}`);
    }
  }

  return (
    <>
      <div className="page-header">
        <select className="language-selector" value={language} onChange={(event) => setLanguage(event.target.value)}>
          {languageChoices.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    <main className="page">
      <section className="hero">
        <span className="eyebrow">{t.tagline}</span>
        <div className="hero-grid">
          <div>
            <h1 className="title">{t.subtitle}</h1>
            <p className="lede">
              {t.description}
            </p>
            <div className="pill-row">
              <span className="pill">{t.pills.noStorage}</span>
              <span className="pill">{t.pills.edgeFirst}</span>
              <span className="pill">{t.pills.multiLang}</span>
              <span className="pill">{t.pills.pwa}</span>
            </div>
          </div>
          <div className="stat-grid">
            <div className="stat">
              <strong>{monitorResult.riskScore}%</strong>
              <span>{t.stats.riskScore}</span>
            </div>
            <div className="stat">
              <strong>{resolveLanguageLabel(language)}</strong>
              <span>{t.stats.language}</span>
            </div>
            <div className="stat">
              <strong>{monitoring ? 'On' : 'Off'}</strong>
              <span>{t.stats.rideMode}</span>
            </div>
            <div className="stat">
              <strong>{answer.confidence ? `${Math.round(answer.confidence * 100)}%` : '—'}</strong>
              <span>{t.stats.confidence}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="section-grid">
        <section className="chat">
          <h2 className="section-title">{t.askSection.title}</h2>
          <p className="section-copy">{t.askSection.description}</p>

          <form className="form-grid" onSubmit={askLaw}>
            <div className="field-row" style={{gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              <input className="field" value={location} onChange={(event) => setLocation(event.target.value)} placeholder={t.askSection.locationPlaceholder} />
              <button type="button" className="button button-secondary" onClick={startVoiceInput} disabled={isListening}>
                {isListening ? t.askSection.listening : t.askSection.voiceInput}
              </button>
            </div>
            <textarea className="textarea" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={t.askSection.questionPlaceholder} />
            <div className="button-row">
              <button type="submit" className="button button-primary">{t.askSection.getAnswer}</button>
              <button type="button" className="button button-secondary" onClick={() => speak(answer.answer, language)}>{t.askSection.readAloud}</button>
              <button type="button" className="button button-secondary" onClick={beginMonitoring}>{t.askSection.startRideMode}</button>
              <button type="button" className="button button-danger" onClick={stopMonitoring}>{t.askSection.stopRideMode}</button>
            </div>
          </form>

          <div className="tag-list">
            {[t.questionChips.q1, t.questionChips.q2, t.questionChips.q3].map((chip) => (
              <button key={chip} type="button" className="tag" onClick={() => setQuestion(chip)}>
                {chip}
              </button>
            ))}
          </div>

          <div className="result">
            <h3>{t.answerSection.title}</h3>
            <p>{answer.answer}</p>
            <div className="answer-list">
              <div className="answer-item">{t.answerSection.jurisdiction}: {answer.jurisdiction?.city || 'Unknown'}, {answer.jurisdiction?.state || 'India-wide'}</div>
              <div className="answer-item">{t.answerSection.citations}: {answer.citations?.length ? answer.citations.join(' | ') : 'National rules summary'}</div>
              <div className="answer-item">{t.answerSection.followUp}: {answer.followUp}</div>
            </div>
          </div>
        </section>

        <aside className="panel">
          <h2 className="section-title">{t.monitorSection.title}</h2>
          <p className="section-copy">{t.monitorSection.description}</p>

          <div className="monitor-grid">
            <div className="meter">
              <label>{t.monitorSection.speed}</label>
              <strong>{ride.speedKmh} km/h</strong>
            </div>
            <div className="meter">
              <label>{t.monitorSection.limit}</label>
              <strong>{ride.speedLimitKmh || t.monitorSection.setRouteLimit}</strong>
            </div>
            <div className="meter">
              <label>{t.monitorSection.location}</label>
              <strong>{ride.locationLabel}</strong>
            </div>
          </div>

          <div className="alert-list">
            {monitorResult.alerts.map((alert) => (
              <div key={alert.title} className="alert" data-tone={alert.tone}>
                <h4>{alert.title}</h4>
                <p>{alert.detail}</p>
              </div>
            ))}
          </div>

          <div className="footer-note">{t.monitorSection.status}: {statusMessage}</div>
          {report ? (
            <div className="result" style={{ marginTop: 16 }}>
              <h4>{t.monitorSection.currentReport}</h4>
              <p>
                Generated for {report.location}. Risk score {report.riskScore}. Speed {report.speed} against limit {report.speedLimit}.
              </p>
            </div>
          ) : null}
        </aside>
      </div>

      <div className="section-grid" style={{ marginTop: 18 }}>
        <section className="card">
          <h3>{t.quizSection.title}</h3>
          <p>{t.quizSection.subtitle}</p>
          <div className="quiz-grid" style={{ marginTop: 12 }}>
            <h4>{quiz[0].question}</h4>
            {quiz[0].options.map((option, index) => {
              const isCorrect = selectedQuiz === index && index === quiz[0].answerIndex;
              const isWrong = selectedQuiz === index && index !== quiz[0].answerIndex;
              return (
                <button key={option} type="button" className={`quiz-option ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`} onClick={() => answerQuiz(index)}>
                  {option}
                </button>
              );
            })}
          </div>
          <div className="footer-note">{t.quizSection.score}: {quizScore}. {quizFeedback || t.quizSection.pickAnswer}</div>
        </section>

        <section className="card">
          <h3>{t.techSection.title}</h3>
          <p>{t.techSection.subtitle}</p>
          <div className="tag-list">
            <span className="tag">App Router</span>
            <span className="tag">Service worker</span>
            <span className="tag">Geolocation</span>
            <span className="tag">DeviceMotion</span>
            <span className="tag">Web Speech API</span>
            <span className="tag">No server-side storage</span>
          </div>
          <div className="result" style={{ marginTop: 16 }}>
            <h4>{t.techSection.deploymentTitle}</h4>
            <p>{t.techSection.deploymentText}</p>
          </div>
        </section>
      </div>
    </main>
    </>
  );
}
