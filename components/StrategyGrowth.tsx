
import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Rocket, ShieldAlert, Zap, TrendingUp, MessageSquare, 
  ListTodo, Share2, Sparkles, Loader2, ChevronRight, 
  Target, Globe, Calendar, Mail, Megaphone, Copy, Check, RefreshCcw, BarChart3, ArrowRight
} from 'lucide-react';
import { Month, ClientProfile } from '../types';

interface StrategyGrowthProps {
  monthStats: { revenue: number, target: number, percent: number };
  selectedMonth: Month;
  topClients: ClientProfile[];
  quarterStats?: { name: string, Meta: number, Realizado: number, Atingimento: number };
}

export const StrategyGrowth: React.FC<StrategyGrowthProps> = ({ monthStats, selectedMonth, topClients, quarterStats }) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const performanceStatus = useMemo(() => {
    if (monthStats.percent < 80) return 'ALERTA';
    if (monthStats.percent >= 100) return 'OPORTUNIDADE';
    return 'ESTABILIDADE';
  }, [monthStats]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateInsights = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inactiveClients = topClients.filter(c => !c.history[2025] || c.history[2025] === 0).map(c => c.name).slice(0, 3).join(', ');
      
      const prompt = `
        Atue como o CCO (Chief Growth Officer) da V4 Company em consultoria exclusiva para a SK-G Automação. 
        Utilize a metodologia V4 (Tráfego, Engajamento, Conversão e Retenção).

        CONTEXTO ATUAL (${selectedMonth}):
        - Faturamento Real: R$ ${monthStats.revenue.toLocaleString('pt-BR')}
        - Atingimento: ${monthStats.percent.toFixed(1)}% (Status: ${performanceStatus})
        - Quarter Trend: ${quarterStats?.Atingimento.toFixed(1)}%
        - Clientes Inativos (Oportunidade de Retenção): ${inactiveClients}

        TAREFAS OBRIGATÓRIAS NA RESPOSTA (Formato Markdown Rico):

        1. INTELIGÊNCIA MACROECONÔMICA: Analise como a Taxa Selic e o IPCA atual impactam a decisão de compra de automação industrial hoje. Gere um gatilho mental para o Syllas usar em reuniões (ex: Proteção de margem vs Inflação).
        
        2. CALENDÁRIO EDITORIAL SEMANAL (LINKEDIN): 
           - Semana 1 (Autoridade): Case focado em um setor do T20.
           - Semana 2 (Educação): Como automação reduz custos operacionais.
           - Semana 3 (Tendência): Futuro da indústria 4.0 no Brasil.
           - Semana 4 (Conversão): CTA agressivo baseado no status ${performanceStatus}.

        3. MOTOR DE E-MAIL MARKETING: Rascunho de e-mail para reativar: ${inactiveClients}. Use um tom de "Consultoria Técnica" e não apenas venda.

        4. ORQUESTRADOR DE ADS: Onde alocar R$ 5.000,00 de verba extra esta semana? (Google Search, Meta Ads ou LinkedIn Sales Navigator?) Justifique com base no atingimento de ${monthStats.percent.toFixed(1)}%.

        Mantenha o tom profissional, direto e focado em execução (High Output Management).
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });

      setInsight(response.text);
    } catch (error) {
      console.error("Erro ao gerar estratégias:", error);
      setInsight("Houve um erro ao conectar com o motor de inteligência industrial. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateInsights();
  }, [selectedMonth, performanceStatus]);

  const getStatusTheme = () => {
    switch (performanceStatus) {
      case 'ALERTA': return { gradient: 'from-rose-600 to-red-900', border: 'border-rose-500', icon: <ShieldAlert className="w-12 h-12" /> };
      case 'OPORTUNIDADE': return { gradient: 'from-emerald-600 to-green-900', border: 'border-emerald-500', icon: <Rocket className="w-12 h-12" /> };
      default: return { gradient: 'from-blue-600 to-indigo-900', border: 'border-blue-500', icon: <TrendingUp className="w-12 h-12" /> };
    }
  };

  const theme = getStatusTheme();

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      
      {/* 1. Header de Performance Tática */}
      <section className={`bg-gradient-to-br ${theme.gradient} p-12 rounded-[3.5rem] border-4 ${theme.border} shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden`}>
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Zap className="w-64 h-64 text-white" />
        </div>
        
        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-center gap-10">
           <div className="flex items-center gap-8">
              <div className="p-6 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20">
                 {theme.icon}
              </div>
              <div className="space-y-2">
                 <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Estratégia & Growth V4</h2>
                 <p className="text-white/70 font-black uppercase text-[10px] tracking-[0.4em]">Status de Operação: {performanceStatus}</p>
              </div>
           </div>

           <div className="flex flex-wrap justify-center gap-6">
              <div className="bg-black/20 backdrop-blur-md px-10 py-6 rounded-[2rem] border border-white/10 text-center">
                 <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">Taxa de Atingimento</p>
                 <p className="text-4xl font-black text-white font-mono">{monthStats.percent.toFixed(1)}%</p>
              </div>
              <div className="bg-black/20 backdrop-blur-md px-10 py-6 rounded-[2rem] border border-white/10 text-center">
                 <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">GAP p/ Meta</p>
                 <p className="text-4xl font-black text-white font-mono">
                    {monthStats.revenue < monthStats.target ? `R$ ${((monthStats.target - monthStats.revenue)/1000).toFixed(0)}k` : 'FULL'}
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* 2. Grid de Inteligência Macroeconômica e Canais */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         <div className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-10 space-y-6">
            <h4 className="text-sm font-black text-white flex items-center gap-3 uppercase tracking-widest">
               <Globe className="w-5 h-5 text-blue-400" /> Inteligência Industrial
            </h4>
            <div className="space-y-4">
               <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5 group hover:border-blue-500/30 transition-all">
                  <span className="text-[9px] text-slate-500 font-black uppercase mb-1 block">Contexto Selic</span>
                  <p className="text-xs font-bold text-slate-300 leading-relaxed italic">
                     "Com juros em patamar restritivo, o foco do cliente muda de expansão para eficiência. Venda economia de energia e ROI rápido."
                  </p>
               </div>
               <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5 group hover:border-emerald-500/30 transition-all">
                  <span className="text-[9px] text-emerald-500 font-black uppercase mb-1 block">Gatilho de Conversão</span>
                  <p className="text-xs font-bold text-slate-200">
                     {performanceStatus === 'ALERTA' ? 
                       'Ataque o OPEX: Mostre como a paragem de máquina custa mais que o investimento hoje.' : 
                       'Ataque o Crescimento: Oportunidade de modernização para ganhar fatia de mercado.'}
                  </p>
               </div>
            </div>
         </div>

         <div className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-10 space-y-6">
            <h4 className="text-sm font-black text-white flex items-center gap-3 uppercase tracking-widest">
               <Megaphone className="w-5 h-5 text-purple-400" /> Orquestrador de Ads
            </h4>
            <div className="grid grid-cols-1 gap-4">
               <div className="flex items-center justify-between p-5 bg-slate-950/60 rounded-2xl border-l-4 border-blue-500">
                  <span className="text-xs font-black text-slate-300">Google Search (Fundo de Funil)</span>
                  <div className={`w-2.5 h-2.5 rounded-full ${performanceStatus === 'ALERTA' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-800'}`}></div>
               </div>
               <div className="flex items-center justify-between p-5 bg-slate-950/60 rounded-2xl border-l-4 border-purple-500">
                  <span className="text-xs font-black text-slate-300">LinkedIn Ads (Decision Makers)</span>
                  <div className={`w-2.5 h-2.5 rounded-full ${performanceStatus === 'ESTABILIDADE' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-800'}`}></div>
               </div>
               <div className="flex items-center justify-between p-5 bg-slate-950/60 rounded-2xl border-l-4 border-amber-500">
                  <span className="text-xs font-black text-slate-300">Retargeting T20 (E-mail + WhatsApp)</span>
                  <div className={`w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse`}></div>
               </div>
            </div>
         </div>

         <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-[3rem] p-10 flex flex-col justify-center gap-6">
            <h4 className="text-sm font-black text-white flex items-center gap-3 uppercase tracking-widest">
               <Sparkles className="w-5 h-5 text-blue-400" /> Mindset V4 do Dia
            </h4>
            <p className="text-lg font-black text-white italic leading-tight">
               {performanceStatus === 'ALERTA' ? 
                 '"Não espere o lead qualificado. Crie a necessidade através da dor financeira do cliente."' : 
                 '"Escalar não é gastar mais, é otimizar o que já funciona para extrair o máximo LTV."'}
            </p>
            <div className="flex items-center gap-4 text-blue-400">
               <div className="h-[2px] w-12 bg-blue-500"></div>
               <span className="text-[10px] font-black uppercase tracking-widest">Estratégia SK-G</span>
            </div>
         </div>
      </section>

      {/* 3. Central de Conteúdo e Calendário Editorial */}
      <section className="bg-slate-900/40 border border-slate-800 rounded-[4rem] p-16 shadow-2xl relative">
         <div className="flex items-center justify-between mb-16">
            <div className="space-y-2">
               <h3 className="text-3xl font-black text-white flex items-center gap-6">
                  <Calendar className="w-10 h-10 text-blue-500" /> CALENDÁRIO & MARKETING ASSETS
               </h3>
               <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em]">Gerador de autoridade e demanda semanal</p>
            </div>
            
            <button 
              onClick={generateInsights}
              disabled={loading}
              className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all text-slate-200 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCcw className="w-5 h-5" />} Sincronizar IA
            </button>
         </div>

         {loading ? (
           <div className="flex flex-col items-center justify-center py-48 gap-10">
              <div className="relative">
                 <Loader2 className="w-20 h-20 text-blue-600 animate-spin" />
                 <Sparkles className="absolute -top-4 -right-4 w-10 h-10 text-blue-400 animate-pulse" />
              </div>
              <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs">Cruzando faturamento com indicadores macroeconômicos...</p>
           </div>
         ) : (
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
              <div className="space-y-12">
                 <div className="prose prose-invert prose-blue max-w-none">
                    {insight ? (
                       <div className="space-y-10">
                          {insight.split('\n').filter(l => l.trim()).map((line, i) => {
                             if (line.startsWith('#')) {
                                return (
                                   <div key={i} className="flex items-center gap-4 border-b border-slate-800 pb-4 mt-12 first:mt-0">
                                      <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                                      <h4 className="text-2xl font-black text-white uppercase tracking-tighter m-0">{line.replace(/#/g, '').trim()}</h4>
                                   </div>
                                );
                             }
                             if (line.match(/^\d\./) || line.startsWith('-')) {
                                const cleanLine = line.replace(/^\d\./, '').replace(/^-/, '').trim();
                                return (
                                   <div key={i} className="group relative bg-slate-950/40 p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all flex justify-between items-start gap-6">
                                      <div className="flex gap-4">
                                         <ChevronRight className="w-5 h-5 text-blue-500 shrink-0 mt-1" />
                                         <span className="text-[15px] font-bold text-slate-200 leading-relaxed">{cleanLine}</span>
                                      </div>
                                      <button 
                                        onClick={() => handleCopy(cleanLine, `insight-${i}`)}
                                        className="p-2 text-slate-600 hover:text-blue-400 transition-colors"
                                      >
                                         {copiedId === `insight-${i}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                      </button>
                                   </div>
                                );
                             }
                             return <p key={i} className="text-[15px] text-slate-400 leading-relaxed m-0 font-medium">{line}</p>;
                          })}
                       </div>
                    ) : (
                       <div className="text-center py-20 opacity-20">
                          <Rocket className="w-20 h-20 mx-auto mb-6" />
                          <p className="font-black uppercase tracking-widest">Nenhuma estratégia gerada</p>
                       </div>
                    )}
                 </div>
              </div>

              <div className="space-y-10">
                 <div className="bg-slate-950/60 rounded-[3rem] border border-slate-800 p-12 space-y-10">
                    <div className="flex items-center justify-between">
                       <h5 className="text-xl font-black text-white flex items-center gap-4">
                          <Mail className="w-7 h-7 text-emerald-500" /> E-MAIL MARKETING (RETENÇÃO)
                       </h5>
                       <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 text-[9px] font-black rounded-full uppercase tracking-widest border border-emerald-500/20">Active Campaign Style</span>
                    </div>
                    
                    <div className="space-y-8">
                       <div className="space-y-4">
                          <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Assunto do E-mail</label>
                          <div className="bg-slate-900 p-5 rounded-xl border border-white/5 flex justify-between items-center group">
                             <p className="text-sm font-bold text-white italic">
                                {performanceStatus === 'ALERTA' ? 
                                  'A eficiência da sua planta está sendo drenada?' : 
                                  'Projeção Técnica: Redução de 15% no OPEX industrial em 2026'}
                             </p>
                             <button onClick={() => handleCopy("Assunto e-mail", "email-sub")} className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Copy className="w-4 h-4 text-blue-500" />
                             </button>
                          </div>
                       </div>
                       
                       <div className="space-y-4">
                          <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Corpo do Texto (Preview)</label>
                          <div className="bg-slate-900 p-8 rounded-2xl border border-white/5 space-y-4">
                             <p className="text-sm text-slate-400 font-medium leading-relaxed">
                                Olá [Nome do Cliente],<br/><br/>
                                Estive analisando o histórico de automação da <b>[Nome da Empresa]</b> e percebi que sua última atualização técnica ocorreu há mais de 12 meses...
                             </p>
                             <div className="h-[2px] w-full bg-slate-800"></div>
                             <p className="text-xs text-blue-500 font-black uppercase tracking-widest">Foco: Reativação T20 Inativos</p>
                          </div>
                       </div>

                       <button className="w-full bg-emerald-600 hover:bg-emerald-500 py-6 rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] transition-all text-white shadow-xl shadow-emerald-600/20 active:scale-95">
                          Gerar Texto Completo (Copy V4)
                       </button>
                    </div>
                 </div>

                 <div className="bg-gradient-to-br from-slate-900 to-blue-900/40 p-12 rounded-[3rem] border border-blue-500/10 space-y-8">
                    <h5 className="text-xl font-black text-white flex items-center gap-4">
                       <BarChart3 className="w-7 h-7 text-blue-400" /> KPI DE MARKETING SEMANAL
                    </h5>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-1">
                          <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Leads Qualificados</span>
                          <p className="text-3xl font-black text-white">42</p>
                       </div>
                       <div className="space-y-1">
                          <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Custo por Lead (CPL)</span>
                          <p className="text-3xl font-black text-white text-blue-400">R$ 118</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 text-emerald-400 text-[10px] font-black uppercase">
                       <TrendingUp className="w-4 h-4" /> 12% superior à semana anterior
                    </div>
                 </div>
              </div>
           </div>
         )}
      </section>

      {/* Footer Branding */}
      <footer className="flex flex-col items-center gap-6 pt-10 opacity-40">
         <div className="flex items-center gap-4">
            <div className="h-[1px] w-20 bg-slate-700"></div>
            <p className="text-[11px] font-black uppercase tracking-[0.5em]">V4 Performance Engine • SK-G Automação</p>
            <div className="h-[1px] w-20 bg-slate-700"></div>
         </div>
         <p className="text-[9px] text-slate-600 font-bold max-w-lg text-center leading-relaxed">
            Todas as recomendações são geradas através de cruzamento de dados de faturamento interno com indicadores econômicos em tempo real. Consulte sempre a engenharia antes de executar mudanças técnicas críticas.
         </p>
      </footer>

    </div>
  );
};

const RefreshCcwIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>;
