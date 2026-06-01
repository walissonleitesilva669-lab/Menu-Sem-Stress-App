import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

// API endpoint for AI query "Não sei o que cozinhar"
app.post('/api/ai/suggest', async (req, res) => {
  try {
    const { ingredients, restrictions, timeAvailable, persons } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === '') {
      return res.json({
        error: "API Key para a Inteligência Artificial não está configurada de forma ativa no servidor. Por favor, adicione sua GEMINI_API_KEY no menu de Secrets do menu de configurações.",
        suggestion: null
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const prompt = `Você é o chef inteligente da plataforma premium de planejamento alimentar "Menu Sem Estresse".
A usuária precisa de uma sugestão de refeição premium baseada no que ela tem em casa.

Ingredientes de preferência ou disponíveis: ${ingredients || 'Nenhum especificado (sugira algo criativo e comum)'}
Restrições alimentares selecionadas: ${restrictions && restrictions.length > 0 ? restrictions.join(', ') : 'Nenhuma'}
Tempo disponível máximo: ${timeAvailable || '30'} minutos
Número de pessoas na casa: ${persons || 2} pessoas

Com base nisso, crie uma sugestão culinária gourmet, rápida e elegante.
Responda APENAS um objeto JSON em formato estrito, sem qualquer markdown (\`\`\`json na frente ou atrás), com exatamente estas chaves:
{
  "recipeName": "Nome da Receita Gourmet",
  "prepTime": 25, // em minutos, número inteiro
  "difficulty": "Fácil", // 'Fácil', 'Médio' ou 'Difícil'
  "category": "Categoria Culinária",
  "calories": 360, // calorias estimadas para cada porção, número inteiro
  "description": "Uma breve descrição da receita de forma persuasiva inspiradora.",
  "ingredients": [
    "Ingrediente com quantidade recomendada para o total de pessoas (ex: 300g de filé de frango)"
  ],
  "instructions": [
    "Passo 1 do preparo rápido",
    "Passo 2 do preparo rápido"
  ],
  "tips": [
    "Uma dica valiosa sobre como armazenar ou congelar em marmita sem amolecer"
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    const resultText = response.text || "{}";
    
    // Clean up markdown block headers if safety levels fail and LLM produces markdown wrappers
    let cleanedJson = resultText.trim();
    if (cleanedJson.startsWith("```json")) {
      cleanedJson = cleanedJson.substring(7);
    }
    if (cleanedJson.startsWith("```")) {
      cleanedJson = cleanedJson.substring(3);
    }
    if (cleanedJson.endsWith("```")) {
      cleanedJson = cleanedJson.substring(0, cleanedJson.length - 3);
    }
    cleanedJson = cleanedJson.trim();

    const parsedData = JSON.parse(cleanedJson);
    res.json({ error: null, suggestion: parsedData });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message || "Erro desconhecido ao processar sugestão com IA.", suggestion: null });
  }
});

export default app;
