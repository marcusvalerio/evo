exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': 'https://projetofluxo.netlify.app',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // Validate Netlify Identity token
  const authHeader = event.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  let userData;
  try {
    userData = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid body' }) };
  }

  const { nome, peso, altura, idade, objetivo, atividade, diasTreino, restricoes } = userData;

  const objetivoMap = {
    emagrecimento: 'emagrecimento e perda de gordura',
    hipertrofia: 'hipertrofia e ganho de massa muscular',
    manutencao: 'saúde e manutenção do peso',
  };
  const atividadeMap = {
    sedentario: 'sedentário (pouco ou nenhum exercício)',
    leve: 'levemente ativo (1-3 dias de treino por semana)',
    ativo: 'muito ativo (4-6 dias de treino por semana)',
  };

  const prompt = `Você é um nutricionista especialista em nutrição esportiva e emagrecimento. 
Com base nos dados do usuário abaixo, monte um plano alimentar completo e personalizado.

DADOS DO USUÁRIO:
- Nome: ${nome}
- Peso: ${peso}kg
- Altura: ${altura}cm
- Idade: ${idade} anos
- Objetivo: ${objetivoMap[objetivo] || objetivo}
- Nível de atividade: ${atividadeMap[atividade] || atividade}
- Dias de treino por semana: ${diasTreino}
- Restrições alimentares: ${restricoes || 'nenhuma'}

INSTRUÇÕES:
1. Monte um plano de segunda a domingo com exatamente 4 refeições: "Café da Manhã", "Almoço", "Lanche", "Jantar"
2. Cada refeição deve ter de 3 a 5 itens com quantidades específicas
3. Monte uma lista de compras dividida em categorias
4. Sugira 3 receitas práticas para congelar, compatíveis com o objetivo
5. Calcule e informe a TMB e o gasto calórico diário estimado

Sua resposta deve ser ESTRITAMENTE um objeto JSON válido, sem nenhum texto antes ou depois, sem markdown, sem blocos de código. Siga EXATAMENTE esta estrutura:

{
  "tmb": 1800,
  "calorias_dia": 2200,
  "meals": {
    "Segunda": {
      "Café da Manhã": [{"item": "nome do alimento", "qty": "quantidade"}],
      "Almoço": [{"item": "nome", "qty": "quantidade"}],
      "Lanche": [{"item": "nome", "qty": "quantidade"}],
      "Jantar": [{"item": "nome", "qty": "quantidade"}]
    },
    "Terça": { "Café da Manhã": [], "Almoço": [], "Lanche": [], "Jantar": [] },
    "Quarta": { "Café da Manhã": [], "Almoço": [], "Lanche": [], "Jantar": [] },
    "Quinta": { "Café da Manhã": [], "Almoço": [], "Lanche": [], "Jantar": [] },
    "Sexta": { "Café da Manhã": [], "Almoço": [], "Lanche": [], "Jantar": [] },
    "Sábado": { "Café da Manhã": [], "Almoço": [], "Lanche": [], "Jantar": [] },
    "Domingo": { "Café da Manhã": [], "Almoço": [], "Lanche": [], "Jantar": [] }
  },
  "shopping": [
    {
      "cat": "Proteínas",
      "items": [{"item": "nome", "qty": "quantidade", "tip": "dica rápida"}]
    }
  ],
  "recipes": [
    {
      "name": "nome da receita",
      "cat": "categoria",
      "freeze": true,
      "ingr": "ingredientes separados por ·",
      "steps": ["passo 1", "passo 2"],
      "tip": "dica de armazenamento"
    }
  ],
  "dicas": ["dica personalizada 1", "dica personalizada 2", "dica personalizada 3"]
}`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://projetofluxo.netlify.app',
        'X-Title': 'Fluxo App',
      },
      body: JSON.stringify({
        model: 'google/gemini-flash-1.5',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('OpenRouter error:', err);
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'AI service error', detail: err }) };
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || '';

    // Clean and parse JSON
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    let plan;
    try {
      plan = JSON.parse(cleaned);
    } catch {
      console.error('JSON parse error, raw:', cleaned.slice(0, 500));
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'Invalid AI response format' }) };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, plan }),
    };
  } catch (err) {
    console.error('Function error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal error', detail: err.message }) };
  }
};
