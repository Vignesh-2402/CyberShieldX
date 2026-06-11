function ThreatFeed() {

  const threats = [
    "Phishing Email Detected",
    "Suspicious URL Blocked",
    "Weak Password Found",
    "Malware Signature Updated"
  ];

  return (

    <div className="card">

      <h3>Live Threat Feed</h3>

      {threats.map((item, index) => (
        <p key={index}>🚨 {item}</p>
      ))}

    </div>

  );
}

export default ThreatFeed;