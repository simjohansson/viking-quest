import { useState, useEffect, useCallback } from 'react';
import { createNewPlayer, loadGame, saveGame, LOCATIONS, VIKING_AVATARS, calculateLevel, xpToNextLevel } from './data/gameData';
import type { Player, Location, Quest, Question, MemoryPair } from './data/gameData';
import './App.css';

const XP_PER_QUESTION = 20;

interface MemoryCard {
  id: string;
  pairId: string;
  emoji: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function App() {
  const [gameState, setGameState] = useState<'menu' | 'create' | 'playing' | 'loading'>('loading');
  const [player, setPlayer] = useState<Player | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showFact, setShowFact] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [newItem, setNewItem] = useState<string | null>(null);
  
  // Memory game state
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [memoryFlipped, setMemoryFlipped] = useState<number[]>([]);
  const [memoryMatches, setMemoryMatches] = useState<string[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);

  // Character creation state
  const [charName, setCharName] = useState('');
  const [charAvatar, setCharAvatar] = useState('🪓');

  // Handle keyboard escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (currentQuestion) {
        setCurrentQuestion(null);
        setSelectedQuest(null);
        setFeedback(null);
        setShowFact(null);
      }
    }
  }, [currentQuestion]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const saved = loadGame();
    if (saved) {
      setPlayer(saved);
      setGameState('playing');
    } else {
      setGameState('menu');
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
    
    // Initialize memory game if first question is memory
    if (quest.questions[0].type === 'memory' && quest.questions[0].memoryPairs) {
      initMemoryGame(quest.questions[0].memoryPairs);
    }
  };

  const initMemoryGame = (pairs: MemoryPair[]) => {
    const cards: MemoryCard[] = [];
    
    // Create two cards for each pair (emoji and name)
    pairs.forEach(pair => {
      cards.push({
        id: `${pair.id}-emoji`,
        pairId: pair.id,
        emoji: pair.emoji,
        name: pair.name,
        isFlipped: false,
        isMatched: false
      });
      cards.push({
        id: `${pair.id}-name`,
        pairId: pair.id,
        emoji: pair.name,
        name: pair.name,
        isFlipped: false,
        isMatched: false
      });
    });
    
    // Shuffle cards
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    setMemoryCards(cards);
    setMemoryFlipped([]);
    setMemoryMatches([]);
    setMemoryMoves(0);
  };

  const handleMemoryCardClick = (cardIndex: number) => {
    if (feedback !== null) return; // Already answering
    if (memoryCards[cardIndex].isMatched) return;
    if (memoryFlipped.includes(cardIndex)) return;
    if (memoryFlipped.length >= 2) return;
    
    // Flip the card
    const newCards = [...memoryCards];
    newCards[cardIndex].isFlipped = true;
    setMemoryCards(newCards);
    
    const newFlipped = [...memoryFlipped, cardIndex];
    setMemoryFlipped(newFlipped);
    
    if (newFlipped.length === 2) {
      setMemoryMoves(memoryMoves + 1);
      
      const [first, second] = newFlipped;
      const firstCard = memoryCards[first];
      const secondCard = memoryCards[second];
      
      if (firstCard.pairId === secondCard.pairId) {
        // Match found!
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setMemoryCards(newCards);
        setMemoryMatches([...memoryMatches, firstCard.pairId]);
        setMemoryFlipped([]);
        
        // Check if all pairs matched
        if (memoryMatches.length + 1 === currentQuestion?.memoryPairs?.length) {
          // Memory game complete!
          answerQuestion(0);
        }
      } else {
        // No match - flip back after delay
        setTimeout(() => {
          const resetCards = [...memoryCards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setMemoryCards(resetCards);
          setMemoryFlipped([]);
        }, 1000);
      }
    }
  };

  const answerQuestion = (answer: number) => {
    if (!currentQuestion || !player || !selectedQuest) return;

    const isCorrect = answer === currentQuestion.correctAnswer;
    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      // Add XP for correct answer
      const totalXp = player.xp + XP_PER_QUESTION;
      const newLevel = calculateLevel(totalXp);
      
      const updatedPlayer: Player = {
        ...player,
        xp: totalXp,
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
          const nextQuestion = selectedQuest.questions[questionIndex + 1];
          setCurrentQuestion(nextQuestion);
          
          // Initialize memory game if next question is memory
          if (nextQuestion.type === 'memory' && nextQuestion.memoryPairs) {
            initMemoryGame(nextQuestion.memoryPairs);
          }
        } else {
          // Quest complete! Add quest XP reward
          const finalXp = totalXp + selectedQuest.xpReward;
          const finalLevel = calculateLevel(finalXp);
          
          let newInventory = [...player.inventory];
          let itemMsg: string | null = null;
          
          if (selectedQuest.itemReward) {
            newInventory.push(selectedQuest.itemReward);
            itemMsg = selectedQuest.itemReward.name;
          }

          const completedPlayer: Player = {
            ...updatedPlayer,
            xp: finalXp,
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
  if (gameState === 'loading') {
    return (
      <div className="game-container">
        <div className="menu">
          <p>Laddar...</p>
        </div>
      </div>
    );
  }

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
            <button className="back-btn" onClick={() => { 
              setCurrentQuestion(null); 
              setSelectedQuest(null); 
              setFeedback(null); 
              setShowFact(null);
              setMemoryCards([]);
              setMemoryFlipped([]);
              setMemoryMatches([]);
            }}>
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

            {currentQuestion.type === 'memory' && currentQuestion.memoryPairs && (
              <div className="memory-game">
                <p className="memory-info">Para ihop symbolen med namnet! 🧠</p>
                <p className="memory-moves">Drag: {memoryMoves}</p>
                <div className="memory-grid">
                  {memoryCards.map((card, index) => (
                    <button
                      key={card.id}
                      className={`memory-card ${card.isFlipped || card.isMatched ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
                      onClick={() => handleMemoryCardClick(index)}
                      disabled={card.isMatched}
                    >
                      <span className="card-content">
                        {card.isFlipped || card.isMatched ? card.emoji : '❓'}
                      </span>
                    </button>
                  ))}
                </div>
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
          <span className="xp-next">→ {player ? xpToNextLevel(player.xp) : 0} till nästa</span>
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
