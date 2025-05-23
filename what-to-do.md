Desafio Técnico - Desenvolvedor Pleno - NestJS
1. Introdução
Sua missão é criar uma API RESTful que recebe transações e retorna estatiticas baseadas nessas
transações. O objetivo deste desafio é avaliar sua capacidade técnica, qualidade de código, organização,
boas práticas e segurança.
A API deve ser desenvolvida utilizando NestJS com TypeScript, seguindo os padrões da Clean
Architecture e boas práticas de desenvolvimento backend.
Dica: Não existe uma única forma correta de resolver esse desafio. Avaliaremos a qualidade do código,
organização, clareza, segurança e robustez.
2. Requisitos Técnicos
O desafio segue regras e restrições que devem ser seguidas:
- DEVE ser desenvolvido utilizando NestJS com TypeScript.
- DEVE estar em um repositório público no GitHub ou GitLab.
- DEVE conter ao menos 1 commit por cada endpoint (mínimo de 3 commits).
- DEVE utilizar o gerenciador de pacotes yarn ou pnpm .
- NÃO DEVE utilizar um banco de dados externo ou local (PostgreSQL, MongoDB, MySQL, etc.).
- DEVE armazenar os dados em memória.
- DEVE aceitar e responder apenas com JSON.
- DEVE seguir os padrões RESTful na construção dos endpoints.
- DEVE conter tratamento de erros adequado e respostas HTTP apropriadas.
- DEVE ser testável e conter testes unitários e de integração.
- DEVE ser containerizável usando Docker.
- DEVE conter documentação usando Swagger.
- DEVE conter logs estruturados utilizando Winston ou Pino.
- DEVE seguir a Clean Architecture, separando adequadamente Controllers, Use Cases, Entities,
Repositories e Interfaces.
3. Endpoints da API
A API deve conter os seguintes endpoints:

3.1 Create Transaction - POST /transactions
Este endpoint recebe transações que consistem em um amount e um timestamp.
Exemplo de requisição:
{
"amount": 123.45,
"timestamp": "2024-02-20T12:34:56.789Z"
}
Campo Descrição Obrigatório?
amount Valor decimal da transação (positivo ou zero). Sim
timestamp Data e hora da transação no formato ISO 8601 (UTC). Sim
Regras de negócio:
- A transação NÃO PODE estar no futuro.
- A transação DEVE ter ocorrido no passado ou no presente.
- O amount NÃO PODE ser negativo.
Respostas esperadas:
- 201 Created: Transação aceita e registrada.
- 422 Unprocessable Entity: Transação rejeitada por violar alguma regra.
- 400 Bad Request: JSON malformado.
3.2 Delete All Transactions - DELETE /transactions
Este endpoint remove todas as transações armazenadas em memória.
Resposta esperada:
- 200 OK: Todas as transações foram apagadas com sucesso.
3.3 Get Statistics - GET /statistics
Este endpoint retorna estatísticas das transações que ocorreram nos últimos 60 segundos.
Exemplo de resposta:
{
"count": 10,
"sum": 1234.56,
"avg": 123.45,
"min": 12.34,
"max": 456.78
}

Campo Descrição Obrigatório?
count Quantidade total de transações nos últimos 60s. Sim
sum Soma total dos valores transacionados. Sim
avg Média dos valores transacionados. Sim
min Menor valor transacionado. Sim
max Maior valor transacionado. Sim
Regras de negócio:
- Apenas transações dos últimos 60 segundos devem ser consideradas.
- Se não houver transações, todos os valores devem ser 0.
Resposta esperada:
- 200 OK: Estatísticas retornadas com sucesso.
4. Requisitos para Desenvolvedor Pleno
Para garantir a senioridade esperada para um desenvolvedor pleno, sua solução deve contemplar os
seguintes aspectos:
4.1. Arquitetura
- Seguir a estrutura da Clean Architecture.
o Controllers: Responsáveis por lidar com as requisições HTTP.
o Use Cases: Implementação da lógica de negócios.
o Entities: Definições de objetos de domínio.
o Repositories: Manipulação de dados em memória.
o Interfaces: Definição de contratos e serviços externos.
- Utilizar Inversão de Dependência (Dependency Injection).
- Criar interfaces e DTOs para validação e tipagem.
- Aplicar princípios SOLID e Clean Code.
4.2. Testes Automatizados
- Testes unitários utilizando Jest.
- Testes de integração garantindo cobertura total da API.
- Utilização de mocks e stubs para evitar dependências externas.

4.3. Segurança
- Aplicar validação rigorosa nos dados recebidos.
- Utilizar Rate Limiting para evitar abusos da API.
- Implementar Helmet.js para proteção básica contra ataques.
4.4. Logs e Monitoramento
- Adicionar logs estruturados usando Winston ou Pino.
- Implementar um endpoint de healthcheck (GET /health).
- Utilizar dotenv para gerenciamento de variáveis de ambiente.
4.5. Documentação
- Criar documentação da API com Swagger.
- Criar um README com instruções de execução e configuração.
4.6. Docker e Containerização
- Criar um Dockerfile funcional.
- Criar um docker-compose.yml para fácil execução do projeto.
5. Diferenciais
Os seguintes itens não são obrigatórios, mas podem destacar sua solução:
- Boas práticas de CI/CD usando GitHub Actions ou GitLab CI.
- Configuração de métricas usando Prometheus e Grafana.
- Uso de WebSockets para atualização em tempo real das estatísticas.
6. Como Entregar o Desafio
1. Faça um fork ou crie um repositório público no GitHub/GitLab.
2. Implemente o desafio seguindo todas as especificações.
3. Certifique-se de que seu código está bem documentado e testado.
4. Envie o link do repositório para avaliação.
Atenção: Desafios com código confuso, sem testes ou sem boas práticas podem ser desqualificados.