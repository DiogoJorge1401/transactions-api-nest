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

## 📊 Exemplos de Uso

### Criar Transação

```bash
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 123.45,
    "timestamp": "2024-02-20T12:34:56.789Z"
  }'
```

**Resposta**: `201 Created`

### Obter Estatísticas

```bash
curl -X GET http://localhost:3000/statistics
```

**Resposta**:
```json
{
  "count": 10,
  "sum": 1234.56,
  "avg": 123.45,
  "min": 12.34,
  "max": 456.78
}
```

### Deletar Todas as Transações

```bash
curl -X DELETE http://localhost:3000/transactions
```

**Resposta**: `200 OK`

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

## 🔒 Segurança

- **Validação rigorosa** de dados de entrada
- **Rate limiting** (100 requisições por minuto)
- **Helmet.js** para proteção básica contra ataques
- **Validação de timestamp** (não permite transações futuras)
- **Validação de amount** (não permite valores negativos)

## 📝 Regras de Negócio

### Transações

- O `amount` deve ser um número positivo ou zero
- O `timestamp` deve estar no formato ISO 8601 (UTC)
- A transação não pode estar no futuro
- A transação deve ter ocorrido no passado ou presente

### Estatísticas

- Apenas transações dos últimos 60 segundos são consideradas
- Se não houver transações, todos os valores retornam 0
- Precisão de 2 casas decimais nos cálculos

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

## 📊 Logs e Monitoramento

A aplicação utiliza logs estruturados com Pino:

```bash
# Logs em desenvolvimento (formatados)
pnpm start:dev

# Logs em produção (JSON)
NODE_ENV=production pnpm start:prod
```

### Health Check

```bash
curl http://localhost:3000/health
```

## 🔄 Rate Limiting

A API implementa rate limiting de 100 requisições por minuto por IP para evitar abuso.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
