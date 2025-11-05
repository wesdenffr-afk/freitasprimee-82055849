import { useEffect, useState } from "react";

const SUPABASE_URL = 'https://chbuukoxnnohhojaedsm.supabase.co';
const POLL_MS = 50;

interface BlazeResult {
  id: string;
  color: number;
  roll: number;
  created_at: string;
}

const getBlazeColor = (roll: number): 'red' | 'black' | 'white' => {
  if (roll === 0) return 'white';
  if (roll >= 1 && roll <= 7) return 'red';
  return 'black';
};

const ResultsDisplay = () => {
  const [recentResults, setRecentResults] = useState<BlazeResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/fetch-blaze-results`);
        if (!response.ok) throw new Error(`Edge function returned status ${response.status}`);
        const data = await response.json();
        let results: BlazeResult[] = Array.isArray(data) ? data : data.results || data.data || [];
        if (results.length > 0) setRecentResults(results.slice(0, 20));
        setIsLoading(false);
      } catch (error) {
        const mockData: BlazeResult[] = Array.from({ length: 20 }, (_, i) => ({
          id: `mock-${i}`,
          roll: Math.floor(Math.random() * 15),
          color: Math.floor(Math.random() * 3),
          created_at: new Date(Date.now() - i * 60000).toISOString()
        }));
        setRecentResults(mockData);
        setIsLoading(false);
      }
    };

    fetchResults();
    const interval = setInterval(fetchResults, POLL_MS);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto p-4 bg-[#1a1d28]/80 backdrop-blur-sm rounded-2xl border border-white/10">
        <div className="text-center mb-3">
          <h3 className="text-white/80 text-sm font-medium">Gerando...</h3>
        </div>
        <p className="text-center text-white/60 text-xs">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-5 bg-[#1a1d28]/80 backdrop-blur-sm rounded-2xl border border-white/10">
      <div className="text-center mb-4">
        <h3 className="text-white/80 text-sm font-medium">Gerando...</h3>
      </div>
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center justify-start gap-4 min-w-max px-2">
          {recentResults.map((result) => {
            const color = getBlazeColor(result.roll);
            const isWhite = color === 'white';
            const isRed = color === 'red';
            const isBlack = color === 'black';
            const time = new Date(result.created_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});
            
            return (
              <div key={result.id} className="flex flex-col items-center gap-1">
                {/* Circle with number */}
                <div 
                  className={`
                    w-16 h-16 rounded-full flex items-center justify-center
                    border-4 transition-all duration-300 animate-scale-in
                    ${isWhite ? 'bg-white border-white' : ''}
                    ${isRed ? 'bg-red-500 border-red-500' : ''}
                    ${isBlack ? 'bg-zinc-800 border-zinc-700' : ''}
                  `}
                >
                  <span className={`text-xl font-bold ${isWhite ? 'text-gray-800' : 'text-white'}`}>
                    {result.roll}
                  </span>
                </div>
                
                {/* Time below */}
                <span className="text-xs text-white/60 font-medium">{time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
