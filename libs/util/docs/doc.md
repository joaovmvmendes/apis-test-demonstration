# Apresentação do repositório

## Estrutura

O repositório conta com uma estrutura modular para reaproveitamento de código
utilizando libs. A proposta final, é ter services de disparo para apis de uma 
empresa X afim de possibilitar a criação de fluxos automatizados, complexos, 
de teste, validando dados de ponta a ponta.

Para isto, foi criada uma estrutura com base em nodeJs com Typescript. Utilizando
para os testes, Jest, Supertest e Pg (para conexões com banco de dados Postgres) e
jest-html-reporters para geração de um relatório do teste rodado.

### - Services

Cada service traz uma chamada de api ou consulta em banco, possibilitando validações
durante o fluxo.

### - Payloads

Arquivos de payload foram criados para manter uma padronização das requisições, ainda
possibilitando a utilização de classes extendidas para intefaces.

### - Environments

Nesse setor, temos a divisão das envs para utilização em diferentes ambientes durante
o fluxo do teste e também possibilitando a configuração para utilização em pipeline.

### - .env

Este arquivo irá controlar o ambiente selecionado durante o desenvolvimento dos fluxos
e também ira direcionar o ambiente para utilização na pipeline.

## Demonstração

Passo 1: npm i
 
Passo 2: npm run test demonstration.test.ts

Ao final do fluxo de demonstração, será gerado um relatório em formato html dentro da 
pasta test-reports. Vá até o local de destino e abra o arquivo em seu navegador para
visualização.