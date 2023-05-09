# API de controle financeiro

A API de controle financeiro é uma aplicação que permite aos usuários manter um registro de suas transações econômicas, bem como monitorar seus ganhos e gastos mensais.

## Recursos

A API oferece os seguintes recursos:

- Autenticação usando JWT
- Gerenciamento de transações
- Obtenção de saldo mensal, total ganho e total gasto

## Tecnologia

A API de controle financeiro foi desenvolvida usando as seguintes tecnologias:

- Typescript
- NestJS
- TypeORM
- SQLite (para desenvolvimento)
- PostgreSQL (para produção)

## Instalação

Para executar a API em seu ambiente local, siga as etapas abaixo:

1. Clone o repositório para sua máquina local
2. Execute o comando `npm install` para instalar as dependências necessárias
3. Configure as variáveis de ambiente de acordo com as suas preferências (por exemplo, informações de conexão com o banco de dados)
4. Execute o comando `npm run typeorm migration:run` para realizar as migrations e criar as tabelas no banco de dados.
5. Execute o comando `npm run start:dev` para iniciar a API em modo de desenvolvimento
