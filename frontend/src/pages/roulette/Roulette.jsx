import React, { useState } from "react";
import { authFetch } from "../../services/authService"; 
import "../../styles/Roulette.css";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

export default function Roulette() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [rewardMessage, setRewardMessage] = useState("");
  const [error, setError] = useState("");

  const totalSectors = 10;
  const degreesPerSector = 360 / totalSectors;

  const handleSpin = async () => {
    if (spinning) return;
    setError("");
    setRewardMessage("");
    setSpinning(true);

    try {
      const res = await authFetch("roulette/spin/", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ya has girado hoy.");
        setSpinning(false);
        return;
      }

      const prizeNumber = data.reward;
      const sectorStartDegree = (prizeNumber - 1) * degreesPerSector;
      const halfSector = degreesPerSector / 2;
      const targetDegree = 360 - sectorStartDegree - halfSector;

      const spins = 360 * 5;
      const finalRotation = rotation + spins + (targetDegree - (rotation % 360));

      setRotation(finalRotation);

      setTimeout(() => {
        setSpinning(false);
        setRewardMessage(`¡Enhorabuena! Has ganado ${prizeNumber} puntos.`);
      }, 4000);
    } catch (err) {
      setError("Error de conexión.");
      setSpinning(false);
    }
  };

  return (
    <div className="roulette-page">
      <Header />
      
      <main className="roulette-content">
        <h1 className="roulette-title">Ruleta de Premios</h1>

        <div className="roulette-card">
          <div className="roulette-pointer"></div>
          
          <div 
            className="roulette-wheel" 
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {[...Array(totalSectors)].map((_, i) => (
              <div 
                key={i} 
                className="roulette-sector-label" 
                style={{ transform: `rotate(${i * degreesPerSector + (degreesPerSector / 2)}deg)` }}
              >
                ?
              </div>
            ))}
          </div>

          <button 
            className="roulette-spin-button" 
            onClick={handleSpin} 
            disabled={spinning}
          >
            {spinning ? "Girando..." : "¡Probar suerte!"}
          </button>

          {error && <p className="roulette-error">{error}</p>}
          {rewardMessage && <p className="roulette-success">{rewardMessage}</p>}
        </div>
      </main>

      <Footer />
    </div>
  );
}