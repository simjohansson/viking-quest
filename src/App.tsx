import { useState, useEffect, useCallback } from 'react';
import { createNewPlayer, loadGame, saveGame, LOCATIONS, VIKING_AVATARS, calculateLevel, xpToNextLevel } from './data/gameData';
import type { Player, Location, Quest, Question, MemoryPair, Item } from './data/gameData';
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
  const [waitingForNext, setWaitingForNext] = useState(false);
  
  // Memory game state
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [memoryFlipped, setMemoryFlipped] = useState<number[]>([]);
  const [memoryMatches, setMemoryMatches] = useState<string[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);

  // Inventory & Equipment state
  const [showInventory, setShowInventory] = useState(false);
  const [activeItemBonus, setActiveItemBonus] = useState(0);

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

  const equipItem = (item: Item) => {
    if (!player) return;
    
    const updatedPlayer = { ...player };
    
    if (item.type === 'weapon') {
      // Swap weapon
      if (updatedPlayer.equipment.weapon) {
        updatedPlayer.inventory.push(updatedPlayer.equipment.weapon);
      }
      updatedPlayer.equipment.weapon = item;
      updatedPlayer.inventory = updatedPlayer.inventory.filter(i => i.id !== item.id);
    } else if (item.type === 'armor') {
      // Swap armor
      if (updatedPlayer.equipment.armor) {
        updatedPlayer.inventory.push(updatedPlayer.equipment.armor);
      }
      updatedPlayer.equipment.armor = item;
      updatedPlayer.inventory = updatedPlayer.inventory.filter(i => i.id !== item.id);
    }
    
    setPlayer(updatedPlayer);
    saveGame(updatedPlayer);
  };

  const useItem = (item: Item) => {
    if (!player || !currentQuestion) return;
    
    // Can only use food/potion during a question
    if (item.type !== 'food' && item.type !== 'potion') return;
    
    // Apply bonus
    const bonusXp = item.bonus;
    setActiveItemBonus(bonusXp);
    
    // Remove item from inventory
    const updatedPlayer = {
      ...player,
      inventory: player.inventory.filter(i => i.id !== item.id)
    };
    setPlayer(updatedPlayer);
    saveGame(updatedPlayer);
    
    // Clear bonus after question is answered
    setTimeout(() => setActiveItemBonus(0), 2000);
  };

  const getEquipmentBonus = (): number => {
    if (!player) return 0;
    const weaponBonus = player.equipment.weapon?.bonus ?? 0;
    const armorBonus = player.equipment.armor?.bonus ?? 0;
    return weaponBonus + armorBonus;
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
      // Add XP for correct answer (base + equipment + active item)
      const equipmentBonus = getEquipmentBonus();
      const totalXpGain = XP_PER_QUESTION + equipmentBonus + activeItemBonus;
      const totalXp = player.xp + totalXpGain;
      const newLevel = calculateLevel(totalXp);
      
      const updatedPlayer: Player = {
        ...player,
        xp: totalXp,
        level: newLevel
      };
      setPlayer(updatedPlayer);
      saveGame(updatedPlayer);

      // Clear active item bonus after getting XP
      setActiveItemBonus(0);

      // Show fact
      if (currentQuestion.facts.length > 0) {
        setShowFact(currentQuestion.facts[0]);
      }

      // Wait for user to click "Next" instead of auto-advancing
      setWaitingForNext(true);
    } else {
      // Wrong answer - try again
      setTimeout(() => {
        setFeedback(null);
      }, 1000);
    }
  };

  const handleNextQuestion = () => {
    if (!currentQuestion || !player || !selectedQuest || !waitingForNext) return;

    setWaitingForNext(false);
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
      const totalXp = player.xp + XP_PER_QUESTION;
      const finalXp = totalXp + selectedQuest.xpReward;
      const finalLevel = calculateLevel(finalXp);
      
      let newInventory = [...player.inventory];
      let itemMsg: string | null = null;
      
      if (selectedQuest.itemReward) {
        newInventory.push(selectedQuest.itemReward);
        itemMsg = selectedQuest.itemReward.name;
      }

      const completedPlayer: Player = {
        ...player,
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
    const totalBonus = getEquipmentBonus() + activeItemBonus;
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
              setActiveItemBonus(0);
            }}>
              ← Tillbaka
            </button>
            <h2>{selectedQuest.name}</h2>
            <div className="progress">Fråga {questionIndex + 1}/{selectedQuest.questions.length}</div>
          </div>

          {totalBonus > 0 && (
            <div className="bonus-display">
              ⚔️ +{totalBonus} XP bonus!
              {activeItemBonus > 0 && <span className="item-bonus-text"> (inkl. föremål)</span>}
            </div>
          )}

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

            {waitingForNext && (
              <button className="next-btn" onClick={handleNextQuestion}>
                {questionIndex < (selectedQuest?.questions.length ?? 0) - 1 ? 'Nästa fråga →' : 'Slutför uppdrag →'}
              </button>
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
            // Location unlock logic: village is always unlocked, others unlock after completing previous location's quests
            const locationOrder = ['village', 'port', 'temple', 'battlefield', 'valhalla'];
            const currentLocationIndex = locationOrder.indexOf(location.id);
            const completedCount = player?.completedQuests?.length ?? 0;
            const isUnlocked = location.id === 'village' || (
              currentLocationIndex > 0 && 
              completedCount >= currentLocationIndex
            );
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

      <div className="equipment">
        <h3>🛡️ Utrustning</h3>
        <div className="equipment-slots">
          <div className="equip-slot weapon">
            <span className="slot-label">Vapen</span>
            <span className="slot-item">
              {player?.equipment.weapon ? player.equipment.weapon.emoji : '❌'}
            </span>
            <span className="slot-bonus">
              +{player?.equipment.weapon?.bonus ?? 0} XP
            </span>
          </div>
          <div className="equip-slot armor">
            <span className="slot-label">Rustning</span>
            <span className="slot-item">
              {player?.equipment.armor ? player.equipment.armor.emoji : '❌'}
            </span>
            <span className="slot-bonus">
              +{player?.equipment.armor?.bonus ?? 0} XP
            </span>
          </div>
        </div>
        <p className="total-bonus">Total bonus: +{getEquipmentBonus()} XP/fråga</p>
      </div>

      <div className="inventory">
        <button className="inventory-toggle" onClick={() => setShowInventory(!showInventory)}>
          🎒 Ryggsäck ({player?.inventory.length}) {showInventory ? '▼' : '▶'}
        </button>
        {showInventory && (
          <div className="inventory-content">
            <div className="inventory-grid">
              {player?.inventory.map((item, index) => (
                <button
                  key={index}
                  className={`inventory-item ${item.type}`}
                  onClick={() => (item.type === 'weapon' || item.type === 'armor') ? equipItem(item) : useItem(item)}
                  title={`${item.name}: ${item.description}`}
                >
                  <span className="item-emoji">{item.emoji || (item.type === 'weapon' ? '⚔️' : item.type === 'armor' ? '🛡️' : item.type === 'food' ? '🍖' : '💎')}</span>
                  <span className="item-name">{item.name}</span>
                  <span className="item-bonus">+{item.bonus} XP</span>
                  {item.type === 'food' || item.type === 'potion' ? (
                    <span className="item-action">Klicka för att använda!</span>
                  ) : (
                    <span className="item-action">Klicka för att utrusta</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
