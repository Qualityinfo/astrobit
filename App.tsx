import React, { useState } from 'react';
import GameCanvas from './components/GameCanvas';
import { GameState, MissionData } from './types';
import { generateMissionBriefing } from './services/missionService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [score, setScore] = useState(0);
  const [mission, setMission] = useState<MissionData | null>(null);
  const [loading, setLoading] = useState(false);

  const startBriefing = async () => {
    setLoading(true);
    setGameState(GameState.BRIEFING);
    // Add artificial delay for "decoding" effect if API is fast
    const [data] = await Promise.all([
      generateMissionBriefing(),
      new Promise(resolve => setTimeout(resolve, 1500)) 
    ]);
    setMission(data);
    setLoading(false);
  };

  const startGame = () => {
    setGameState(GameState.PLAYING);
  };

  const returnToMenu = () => {
    setGameState(GameState.MENU);
    setScore(0);
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      {/* CRT Scanline Effect Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none" />
      
      <div className="relative w-full max-w-[850px] flex flex-col items-center">
        
        {/* Game Title Header */}
        <h1 className="text-4xl md:text-5xl text-center mb-6 text-transparent bg-clip-text bg-gradient-to-b from-green-300 to-green-600 font-bold tracking-widest drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]" style={{ fontFamily: '"Press Start 2P"' }}>
          ASTROBIT DEFENDER
        </h1>

        <div className="relative">
          <GameCanvas 
            gameState={gameState} 
            setGameState={setGameState} 
            score={score}
            setScore={setScore}
          />

          {/* MENUS & OVERLAYS */}
          
          {/* Main Menu */}
          {gameState === GameState.MENU && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center space-y-8 backdrop-blur-sm z-10">
              <div className="text-blue-400 text-xs animate-pulse">SISTEMA PRONTO...</div>
              <button 
                onClick={startBriefing}
                className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold border-b-4 border-green-800 active:border-0 active:translate-y-1 transition-all text-xl"
                style={{ fontFamily: '"Press Start 2P"' }}
              >
                INICIAR MISSÃO
              </button>
              <div className="text-gray-500 text-[10px] mt-4 max-w-md text-center">
                Use SETAS ou WASD para Mover <br/> ESPAÇO para Atirar
              </div>
            </div>
          )}

          {/* Mission Briefing */}
          {gameState === GameState.BRIEFING && (
            <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-12 z-20 text-green-500 font-mono border-2 border-green-900 m-4">
              {loading ? (
                <div className="flex flex-col items-center space-y-4">
                   <div className="w-16 h-16 border-4 border-t-green-500 border-green-900 rounded-full animate-spin"></div>
                   <p className="animate-pulse">DECODIFICANDO TRANSMISSÃO...</p>
                </div>
              ) : (
                <div className="flex flex-col h-full w-full max-w-2xl animate-in fade-in duration-500">
                  <div className="border-b-2 border-green-800 pb-4 mb-4 flex justify-between items-end">
                    <h2 className="text-xl md:text-2xl text-white">{mission?.title}</h2>
                    <span className="text-xs text-green-700">CANAL SEGURO // 0X11F</span>
                  </div>
                  
                  <div className="flex-grow overflow-y-auto space-y-6 text-sm md:text-base leading-relaxed">
                    <p className="text-green-300 type-writer">
                      <span className="text-white font-bold">COMANDO:</span> {mission?.description}
                    </p>
                    <p className="text-red-400">
                      <span className="text-white font-bold">OBJETIVO:</span> {mission?.target}
                    </p>
                  </div>

                  <div className="mt-8 flex justify-center">
                    <button 
                      onClick={startGame}
                      className="group relative px-6 py-3 bg-transparent border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-colors"
                      style={{ fontFamily: '"Press Start 2P"' }}
                    >
                      <span className="animate-pulse">LANÇAR NAVE</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Game Over */}
          {gameState === GameState.GAME_OVER && (
            <div className="absolute inset-0 bg-red-900/40 flex flex-col items-center justify-center space-y-6 backdrop-blur-sm z-30">
              <h2 className="text-5xl text-red-500 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]" style={{ fontFamily: '"Press Start 2P"' }}>FIM DE JOGO</h2>
              <div className="text-xl text-white">PONTUAÇÃO FINAL: {score}</div>
              <button 
                onClick={returnToMenu}
                className="mt-4 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold border-b-4 border-gray-900 active:border-0 active:translate-y-1 transition-all"
                style={{ fontFamily: '"Press Start 2P"' }}
              >
                VOLTAR À BASE
              </button>
            </div>
          )}
        </div>
        
        {/* Footer info */}
        <div className="mt-4 text-xs text-gray-600 font-sans">
          Desenvolvido com React, Tailwind e Vite
        </div>
      </div>
    </div>
  );
};

export default App;