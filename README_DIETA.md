# 🍎 EVO - App de Dieta Personalizada

Um app inteligente que gera planos alimentares personalizados baseado na **Pirâmide Alimentar Brasileira**, com histórico completo de evolução do usuário.

## 🚀 Setup

### 1. Criar Projeto no Supabase

1. Acesse https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub
4. Crie um novo projeto
5. Copie a URL e a chave anon do projeto

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

### 3. Executar Schema SQL

1. No dashboard do Supabase, vá em **SQL Editor**
2. Crie uma nova query
3. Cole o conteúdo de `supabase/schema.sql`
4. Clique em **Run**

Isso vai criar:
- Tabelas de usuários, alimentos, planos, refeições
- Banco de alimentos brasileiros
- Políticas de segurança (RLS)

### 4. Instalar Dependências

```bash
npm install
```

## 📋 Estrutura

### Tabelas Principais

- **users**: Dados pessoais e objetivos
- **food_groups**: Grupos da pirâmide (cereais, proteínas, etc)
- **foods**: Banco de 20+ alimentos brasileiros
- **diet_plans**: Planos criados para usuários
- **meals**: Refeições dentro de cada plano
- **meal_foods**: Alimentos em cada refeição
- **weight_history**: Histórico de peso do usuário
- **meal_logs**: Registro do que usuário comeu
- **plan_history**: Histórico de todos os planos

## 🧮 Cálculos Automáticos

O app calcula automaticamente:

1. **TMB (Taxa Metabólica Basal)** - Harris-Benedict
2. **TDEE (Gasto Calórico Total)** - baseado em nível de atividade
3. **Calorias Diárias** - ajustado para objetivo (perda/ganho/manutenção)
4. **Macronutrientes** - distribuição ideal de proteína/carb/gordura
5. **Distribuição por Refeição** - % de macros para cada refeição

## 🎯 Objetivos Suportados

- Perda de peso (-15% de calorias)
- Ganho de massa (+10% de calorias)
- Manutenção (TDEE)

## 🚫 Restrições Alimentares

- Vegetariano
- Vegano
- Sem glúten
- Sem lactose

## 📊 Histórico do Usuário

O app rastreia:

- ✅ Peso ao longo do tempo
- ✅ Todos os planos criados
- ✅ Data de início/fim de cada plano
- ✅ Registro de refeições consumidas
- ✅ Aderência à dieta (%)
- ✅ Taxa de perda/ganho por semana

## 🔐 Segurança

- Autenticação via Supabase Auth
- Row Level Security (RLS) ativado
- Usuários só veem seus próprios dados

## 🛠️ Usar o App

### 1. Componente `DietGenerator`

```tsx
import DietGenerator from '@/components/DietGenerator';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  if (!user) return <div>Faça login</div>;

  return <DietGenerator user={user} />;
}
```

### 2. Gerar Dieta

1. Usuário preenche dados pessoais
2. App calcula macros automaticamente
3. Sistema gera cardápio para 7 dias
4. Usuário confirma ou gera novamente

### 3. Rastrear Evolução

Use as tabelas de histórico para:
- Gráficos de peso
- Taxa de aderência
- Progresso em relação aos objetivos

## 📈 Próximos Passos

- [ ] Página de login/cadastro
- [ ] Dashboard com histórico
- [ ] Gráficos de evolução
- [ ] Registrar refeições consumidas
- [ ] Ajustar plano em tempo real
- [ ] Exportar plano em PDF

## 📚 Referências

- Pirâmide Alimentar Brasileira (MNCR)
- TBCA - Tabela Brasileira de Composição de Alimentos (UNIFESP)
- Equação Harris-Benedict para TMB

---

**Desenvolvido com ❤️ para uma nutrição melhor**
