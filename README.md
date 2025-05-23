# Transaction Statistics API

Uma API RESTful construída com NestJS que recebe transações e retorna estatísticas baseadas nessas transações. O projeto segue os princípios de Clean Architecture e boas práticas de desenvolvimento backend.

## 🚀 Características

- **Clean Architecture**: Separação clara entre domínio, aplicação, infraestrutura e apresentação
- **Armazenamento em Memória**: Dados armazenados em memória conforme especificação
- **Documentação Swagger**: API documentada automaticamente
- **Validação Rigorosa**: Validação robusta de dados usando class-validator
- **Logs Estruturados**: Logging com Pino para melhor observabilidade
- **Rate Limiting**: Proteção contra abuso da API
- **Segurança**: Implementação do Helmet.js para proteção básica
- **Testes Completos**: Testes unitários e de integração
- **Docker**: Containerização completa

## 🛠️ Tecnologias

- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem de programação
- **Pino** - Logging estruturado
- **Helmet** - Segurança básica
- **Throttler** - Rate limiting
- **Swagger** - Documentação da API
- **Jest** - Testes
- **Docker** - Containerização
- **pnpm** - Gerenciador de pacotes

## 📦 Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd processo-seletivo

# Instale as dependências
pnpm install

# Inicie o servidor
pnpm start:dev
```

## 🔧 Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
NODE_ENV=development
```

## 🚀 Uso
Link para API em produção: https://transactions-api-nest-production.up.railway.app/api/docs
### Iniciar o servidor

```bash
# Desenvolvimento
pnpm start:dev

# Produção
pnpm build
pnpm start:prod
```

O servidor estará disponível em `http://localhost:3000`

### Documentação da API

Acesse a documentação Swagger em: `http://localhost:3000/api/docs`

## 📚 Endpoints da API

### Transações

- `POST /transactions` - Criar nova transação
- `DELETE /transactions` - Deletar todas as transações

### Estatísticas

- `GET /statistics` - Obter estatísticas dos últimos 60 segundos

### Health Check

- `GET /health` - Status de saúde da aplicação

## 🏗️ Arquitetura

O projeto segue os princípios de Clean Architecture:

```
src/
├── domain/                 # Camada de domínio
│   ├── entities/          # Entidades de negócio
│   └── repositories/      # Interfaces dos repositórios
├── application/           # Camada de aplicação
│   ├── dtos/             # Data Transfer Objects
│   └── use-cases/        # Casos de uso da aplicação
├── infrastructure/       # Camada de infraestrutura
│   └── repositories/    # Implementação dos repositórios
└── presentation/        # Camada de apresentação
    └── controllers/     # Controladores HTTP
```

## 🧪 Testes

```bash
# Testes unitários
pnpm test

# Testes e2e
pnpm test:e2e

# Coverage
pnpm test:cov
```

## 🐳 Docker

### Executar com Docker

```bash
# Build e start
docker-compose up --build

# Apenas start (se já foi feito build)
docker-compose up

# Em background
docker-compose up -d
```

### Build manual

```bash
# Build da imagem
docker build -t transaction-api .

# Executar container
docker run -p 3000:3000 transaction-api
```
