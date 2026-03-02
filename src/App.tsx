import { useState, useEffect } from 'react';
import { createNewPlayer, loadGame, saveGame, LOCATIONS, VIKING_AVATARS, calculateLevel } from './data/gameData';
import type { Player, Location, Quest, Question } from './data/gameData';
import './App.css';

function App() {
  const [gameState, setGameState] = useState<'menu' | 'create' | 'playing'>('menu');
  const [player, setPlayer] = useState<Player | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showFact, setShowFact] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [newItem, setNewItem] = useState<string | null>(null);

  // Character creation state
  const [charName, setCharName] = useState('');
  const [charAvatar, setCharAvatar] = useState('🪓');

  useEffect(() => {
    const saved = loadGame();
    if (saved) {
      setPlayer(saved);
      setGameState('playing');
    }
  }, []);

  const startNewGame = () => {
    setGameState('create');
  };

  const createCharacter = () => {
    if (!charName.trim()) return;
    const newPlayer = createNewPlayer(charName, charAvatar);
    setPlayer(newPlayer);
    saveGame(newPlayer);
    setGameState('playing');
  };

  const selectLocation = (location: Location) => {
    setSelectedLocation(location);
    setSelectedQuest(null);
    setCurrentQuestion(null);
  };

  const startQuest = (quest: Quest) => {
    setSelectedQuest(quest);
    setQuestionIndex(0);
    setCurrentQuestion(quest.questions[0]);
    setShowFact(null);
    setFeedback(null);
  };

  const answerQuestion = (answer: number) => {
    if (!currentQuestion || !player || !selectedQuest) return;

    const isCorrect = answer === currentQuestion.correctAnswer;
    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      const newXp = player.xp + 20; // XP per correct answer
      const newLevel = calculateLevel(newXp);
      
      const updatedPlayer = {
        ...player,
        xp: newXp,
        level: newLevel
      };
      setPlayer(updatedPlayer);
      saveGame(updatedPlayer);

      // Show fact
      if (currentQuestion.facts.length > 0) {
        setShowFact(currentQuestion.facts[0]);
      }

      // Next question or quest complete
      setTimeout(() => {
        setFeedback(null);
        setShowFact(null);
        
        if (questionIndex < selectedQuest.questions.length - 1) {
          setQuestionIndex(questionIndex + 1);
          setCurrentQuestion(selectedQuest.questions[questionIndex + 1]);
        } else {
          // Quest complete!
          const finalXp = selectedQuest.xpReward;
          const finalLevel = calculateLevel(player.xp + finalXp);
          
          let newInventory = [...player.inventory];
          let itemMsg: string | null = null;
          
          if (selectedQuest.itemReward) {
            newInventory.push(selectedQuest.itemReward);
            itemMsg = selectedQuest.itemReward.name;
          }

          const completedPlayer = {
            ...player,
            xp: player.xp + finalXp,
            level: finalLevel,
            inventory: newInventory,
            completedQuests: [...player.completedQuests, selectedQuest.id]
          };
          
          setPlayer(completedPlayer);
          saveGame(completedPlayer);
          setNewItem(itemMsg);
          
          setTimeout(() => {
            setNewItem(null);
            setSelectedQuest(null);
            setCurrentQuestion(null);
          }, 2000);
        }
      }, 1500);
    } else {
      // Wrong answer - try again
      setTimeout(() => {
        setFeedback(null);
      }, 1000);
    }
  };

  // Menu screen
  if (gameState === 'menu') {
    return (
      <div className="game-container">
        <div className="menu">
          <h1>🏴󠁧󠁢󠁳󠁣󠁴󠁿 Viking Quest 🪓</h1>
          <p>Lär dig om vikingatiden!</p>
          <button onClick={startNewGame}>🎮 Starta nytt spel</button>
        </div>
      </div>
    );
  }

  // Character creation
  if (gameState === 'create') {
    return (
      <div className="game-container">
        <div className="create-character">
          <h2>Skapa din viking</h2>
          
          <div className="form-group">
            <label>Ditt namn:</label>
            <input
              type="text"
              value={charName}
              onChange={(e) => setCharName(e.target.value)}
              placeholder="Ange ditt namn"
              maxLength={20}
            />
          </div>

          <div className="form-group">
            <label>Välj din symbol:</label>
            <div className="avatar-grid">
              {VIKING_AVATARS.map(avatar => (
                <button
                  key={avatar}
                  className={`avatar-btn ${charAvatar === avatar ? 'selected' : ''}`}
                  onClick={() => setCharAvatar(avatar)}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <button 
            className="start-btn" 
            onClick={createCharacter}
            disabled={!charName.trim()}
          >
            🚀 Påbörja äventyret!
          </button>
        </div>
      </div>
    );
  }

  // Quest question screen
  if (currentQuestion && selectedQuest) {
    return (
      <div className="game-container">
        <div className="quest-screen">
          <div className="quest-header">
            <button className="back-btn" onClick={() => { setCurrentQuestion(null); setSelectedQuest(null); }}>
              ← Tillbaka
            </button>
            <h2>{selectedQuest.name}</h2>
            <div className="progress">Fråga {questionIndex + 1}/{selectedQuest.questions.length}</div>
          </div>

          <div className="question-box">
            <p className="question">{currentQuestion.question}</p>

            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <div className="options">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-btn ${feedback === 'wrong' ? 'disabled' : ''}`}
                    onClick={() => answerQuestion(index)}
                    disabled={feedback !== null}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'timing' && (
              <div className="timing-game">
                <button 
                  className="timing-btn"
                  onClick={() => answerQuestion(0)}
                  disabled={feedback !== null}
                >
                  👆 TRÄFFA!
                </button>
              </div>
            )}

            {feedback && (
              <div className={`feedback ${feedback}`}>
                {feedback === 'correct' ? '✅ Rätt!' : '❌ Försök igen!'}
              </div>
            )}

            {showFact && (
              <div className="fact-box">
                <h4>📚 Visste du?</h4>
                <p>{showFact}</p>
              </div>
            )}
          </div>

          {newItem && (
            <div className="item-popup">
              🎁 Du fick: {newItem}!
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main playing screen
  return (
    <div className="game-container">
      <div className="game-header">
        <div className="player-info">
          <span className="avatar">{player?.avatar}</span>
          <span className="name">{player?.name}</span>
        </div>
        <div className="stats">
          <span className="level">⭐ Nivå {player?.level}</span>
          <span className="xp">💎 {player?.xp} XP</span>
        </div>
      </div>

      <div className="locations">
        <h3>Välj plats</h3>
        <div className="location-grid">
          {LOCATIONS.map(location => {
            const isUnlocked = location.id === 'village' || player?.completedQuests.some(q => q.includes(location.id.split('-')[0]));
            return (
              <button
                key={location.id}
                className={`location-card ${selectedLocation?.id === location.id ? 'selected' : ''} ${!isUnlocked ? 'locked' : ''}`}
                onClick={() => isUnlocked && selectLocation(location)}
                disabled={!isUnlocked}
              >
                <span className="location-image">{location.image}</span>
                <span className="location-name">{location.name}</span>
                {location.quests.length > 0 && (
                  <span className="quest-count">{location.quests.length} uppdrag</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedLocation && selectedLocation.quests.length > 0 && (
        <div className="quests">
          <h3>Uppdrag i {selectedLocation.name}</h3>
          <div className="quest-list">
            {selectedLocation.quests.map(quest => {
              const isCompleted = player?.completedQuests.includes(quest.id);
              return (
                <button
                  key={quest.id}
                  className={`quest-card ${isCompleted ? 'completed' : ''}`}
                  onClick={() => !isCompleted && startQuest(quest)}
                  disabled={isCompleted}
                >
                  <span className="quest-name">{quest.name}</span>
                  <span className="quest-desc">{quest.description}</span>
                  <span className="quest-reward">+{quest.xpReward} XP</span>
                  {isCompleted && <span className="checkmark">✅</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="inventory">
        <h3>Ryggsäck ({player?.inventory.length})</h3>
        <div className="inventory-grid">
          {player?.inventory.map((item, index) => (
            <span key={index} className={`item ${item.type}`} title={item.description}>
              {item.type === 'weapon' && '⚔️'}
              {item.type === 'armor' && '🛡️'}
              {item.type === 'food' && '🍖'}
              {item.type === 'treasure' && '💎'}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
