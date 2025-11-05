import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import blazeNewLogo from "@/assets/blaze-new-logo.jpg";
import HackerBackground from "@/components/HackerBackground";

interface User {
  user: string;
  pass: string;
}

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const loggedUser = localStorage.getItem("hackerBlaze_user");
    if (loggedUser) {
      navigate("/dashboard");
    }
  }, [navigate]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes} 🌙`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const validateCredentials = async (username: string, password: string): Promise<boolean> => {
    try {
      // Busca sempre do GitHub para pegar atualizações
      const response = await fetch(
        "https://raw.githubusercontent.com/wesdenffr-afk/2025/refs/heads/main/Users"
      );

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Erro de conexão",
          description: "Não foi possível conectar ao servidor. Tente novamente.",
        });
        return false;
      }

      const text = await response.text();
      const users: User[] = JSON.parse(text);

      return users.some(
        (user) => user.user === username && user.pass === password
      );
    } catch (error) {
      console.error("Erro ao validar credenciais:", error);
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Não foi possível validar as credenciais. Tente novamente.",
      });
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Valida contra a lista do GitHub
      const isValid = await validateCredentials(username, password);

      if (!isValid) {
        toast({
          variant: "destructive",
          title: "Erro ao fazer login",
          description: "Usuário ou senha incorretos",
        });
        setLoading(false);
        return;
      }

      // Login bem-sucedido
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao Freitas Blaze",
      });
      localStorage.setItem("hackerBlaze_user", username);
      navigate("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-foreground p-6 overflow-hidden font-['Poppins',sans-serif] flex items-center justify-center relative">
      <HackerBackground />
      <div className="max-w-md w-full flex flex-col gap-4 relative z-10">
        {/* Login Card with Glassmorphism */}
        <div className="w-full backdrop-blur-xl bg-gradient-to-b from-white/10 to-white/5 rounded-3xl p-6 shadow-2xl border border-white/20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden bg-white/10 p-2">
                <img
                  src={blazeNewLogo}
                  alt="Freitas Blaze"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="text-xl font-black text-white m-0 leading-tight flex items-center gap-2">
                  <span className="text-primary">Freitas</span> White
                </h3>
                <p className="text-white/70 text-sm mt-1 m-0">
                  Cassino Online Premium
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <Input
                type="text"
                placeholder="Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-white/80 border-0 text-gray-800 placeholder:text-gray-500 h-12 rounded-xl shadow-sm"
              />
              <Input
                type="password"
                placeholder="Digite sua Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/80 border-0 text-gray-800 placeholder:text-gray-500 h-12 rounded-xl shadow-sm"
              />
              <Button
                type="submit"
                disabled={loading}
                className="mt-2 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-bold h-12 rounded-xl shadow-lg text-base"
              >
                {loading ? "CARREGANDO..." : "Entrar"}
              </Button>

              <Button
                type="button"
                onClick={() => window.open('https://t.me/freitaswhite', '_blank')}
                className="mt-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold h-12 rounded-xl shadow-lg text-base"
              >
                Cadastrar na Freitas White
              </Button>

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-2xl">🎁</div>
                    <div className="text-xs text-white/70">Bônus</div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-2xl">🔒</div>
                    <div className="text-xs text-white/70">Seguro</div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-2xl">⚡</div>
                    <div className="text-xs text-white/70">Rápido</div>
                  </div>
                </div>
                <p className="text-xs text-white/50 text-center mt-3">
                  🟢 +179 cadastros hoje
                </p>
              </div>
            </form>
          </div>

          <div className="text-center">
            <p className="text-xs text-white/40">
              Termos e Políticas ↓<br/>
              Cadastre-se com Login seguro<br/>
              Cassino com Licença. Todos os direitos reservados<br/>
              © 2023 - Freitas Blaze Bet. Todos os direitos reservados
            </p>
            <div className="text-xs text-white/50 mt-2">{currentTime}</div>
          </div>
      </div>
    </div>
  );
};

export default Login;
