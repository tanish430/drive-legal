const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function evaluateRideSnapshot(snapshot) {
  const speed = Number(snapshot.speedKmh || 0);
  const limit = Number(snapshot.speedLimitKmh || 0);
  const motion = Number(snapshot.swervingScore || 0);
  const phoneHandling = Boolean(snapshot.phoneInUse);
  const helmetMissing = Boolean(snapshot.helmetMissing);

  const alerts = [];

  if (limit > 0 && speed > limit) {
    const overBy = Math.round(speed - limit);
    alerts.push({
      tone: overBy > 15 ? 'danger' : 'warning',
      title: 'Overspeeding detected',
      detail: `Speed is ${overBy} km/h above the posted limit. Slow down and keep the road-specific limit in view.`,
    });
  }

  if (phoneHandling) {
    alerts.push({
      tone: 'danger',
      title: 'Possible phone handling',
      detail: 'Motion and manual interaction indicate the driver may be using a phone. Stop safely before using the device.',
    });
  }

  if (helmetMissing) {
    alerts.push({
      tone: 'warning',
      title: 'Helmet risk',
      detail: 'Camera or user input suggests a helmet may be missing. Wear an approved helmet before moving.',
    });
  }

  if (motion >= 7) {
    alerts.push({
      tone: 'warning',
      title: 'Erratic swerving',
      detail: 'Accelerometer/gyroscope data shows unstable motion. Reduce speed and check road conditions.',
    });
  }

  if (!alerts.length) {
    alerts.push({
      tone: 'success',
      title: 'Ride within safe range',
      detail: 'No obvious violation signal is active right now. Keep monitoring speed, posture, and device use.',
    });
  }

  return {
    alerts,
    riskScore: clamp(Math.round((speed > limit && limit > 0 ? (speed - limit) * 3 : 0) + (motion * 6) + (phoneHandling ? 38 : 0) + (helmetMissing ? 22 : 0)), 0, 100),
  };
}

export function buildRideReport(context) {
  const evaluation = evaluateRideSnapshot(context);

  return {
    generatedAt: new Date().toISOString(),
    location: context.locationLabel || 'Unknown location',
    speed: `${Math.round(context.speedKmh || 0)} km/h`,
    speedLimit: `${Math.round(context.speedLimitKmh || 0)} km/h`,
    riskScore: evaluation.riskScore,
    alerts: evaluation.alerts,
  };
}
