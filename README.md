
# Prova de Conceito (POC) SENEA

## Visão Geral

Esta Prova de Conceito (POC) foi desenvolvida para a Clínica-Escola de Nutrição (SENEA) da UFPE, com o objetivo de demonstrar a viabilidade da transformação digital no atendimento nutricional. O foco principal é automatizar e agilizar a geração de planos alimentares personalizados, superando os gargalos do processo manual anterior.

---

## 1. O Problema (Cenário "As-Is")

- **Processos Lentos:** A elaboração de planos alimentares era manual e complexa, podendo levar até 15 dias.
- **Dados Fragmentados:** Informações de pacientes, agendamentos e prontuários estavam dispersas em múltiplas planilhas de Excel, dificultando o acesso e a continuidade do atendimento.
- **Falta de Ferramentas Digitais:** Alunos e professores não dispunham de sistemas integrados para cálculos nutricionais e supervisão em tempo real.

---

## 2. A Solução Proposta (Cenário "To-Be")

A POC apresenta uma aplicação web moderna, composta por:

- **Automação do Plano Alimentar:** Geração automática e personalizada de planos alimentares.
- **Centralização dos Dados:** Armazenamento seguro e centralizado das informações dos pacientes.
- **Ferramentas Digitais Integradas:** Interface intuitiva para nutricionistas, alunos e professores, com recursos de cálculo nutricional e acompanhamento.

---

## 3. Arquitetura e Tecnologias

### Front-end

- **Tecnologias:** React + Vite
- **Descrição:** Interface moderna, responsiva e interativa para inserção de dados e visualização dos planos alimentares.

### Back-end

- **Tecnologias:** Node.js + Express
- **Descrição:** API RESTful robusta, com camadas bem definidas (controllers, services, models), responsável pela lógica de negócio e integração com serviços externos.

### Banco de Dados

- **Tecnologia:** MongoDB
- **Descrição:** Armazenamento NoSQL para dados de usuários, formulários e receitas.

### Integração Externa

- **Serviço:** FatSecret API (OAuth 1.0)
- **Descrição:** Fonte confiável de dados nutricionais, utilizada para recomendações de receitas com base em filtros personalizados.

---

## 4. Fluxo Principal da Aplicação

1. O nutricionista insere as preferências do paciente no Front-end.
2. O Front-end envia a requisição para a API Back-end.
3. O Back-end:
	 - Busca dados do usuário no MongoDB.
	 - Utiliza o FoodService e o FatSecretAPIService para buscar receitas na API externa.
	 - Salva as recomendações no MongoDB, associando ao perfil do usuário.
4. A API retorna o plano alimentar completo para o Front-end, que exibe ao usuário.

---

## 5. Estrutura do Projeto

```
back-end/
	app.js
	server.js
	config/
	controllers/
	models/
	routes/
	services/
front-end/
	src/
		components/
		hooks/
		lib/
		pages/
		services/
	public/
```

---

## 6. Como Executar Localmente

### Pré-requisitos

- Node.js (v18+ recomendado)
- MongoDB em execução local ou remoto

### Instalação

1. Clone o repositório:
	 ```sh
	 git clone https://github.com/JosiasNetto/poc-senea.git
	 cd poc-senea
	 ```

2. Instale as dependências do back-end:
	 ```sh
	 cd back-end
	 npm install
	 ```

3. Instale as dependências do front-end:
	 ```sh
	 cd ../front-end
	 npm install
	 ```

### Execução

- **Back-end:**
	```sh
	cd back-end
	npm start
	```

- **Front-end:**
	```sh
	cd front-end
	npm run dev
	```

Acesse o front-end em `http://localhost:5173` (ou porta configurada pelo Vite).

---

## 7. Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

## 8. Licença

Este projeto é apenas para fins de demonstração acadêmica.
