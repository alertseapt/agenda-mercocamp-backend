# 📚 Documentação da API - Agenda Mercocamp Backend

## 🚀 Visão Geral

Esta API gerencia agendamentos e clientes para o sistema de logística da Mercocamp. Desenvolvida em Node.js com Express e Firebase Firestore.

**Base URL**: `http://localhost:3000` (ou sua URL de produção)

---

## 📋 Índice

1. [Configuração](#configuração)
2. [Rotas de Clientes](#rotas-de-clientes)
3. [Rotas de Agendamentos](#rotas-de-agendamentos)
4. [Rotas de Histórico de Status](#rotas-de-histórico-de-status)
5. [Códigos de Status HTTP](#códigos-de-status-http)
6. [Estruturas de Dados](#estruturas-de-dados)

---

## ⚙️ Configuração

### Instalação
```bash
npm install
```

### Configuração do Firebase
Certifique-se de que o arquivo `config/firebase.js` está configurado corretamente com suas credenciais do Firebase.

### Executar o Servidor
```bash
npm start
```

---

## 👥 Rotas de Clientes

### 1. Listar Todos os Clientes
**GET** `/clientes`

**Resposta de Sucesso (200):**
```json
[
  {
    "id": "cliente123",
    "nome": "Empresa ABC Ltda",
    "cnpj": "12.345.678/0001-90",
    "observacoes": "Cliente preferencial"
  },
  {
    "id": "cliente456",
    "nome": "Comércio XYZ",
    "cnpj": "98.765.432/0001-10",
    "observacoes": ""
  }
]
```

### 2. Obter Cliente por ID
**GET** `/clientes/:id`

**Exemplo:** `GET /clientes/cliente123`

**Resposta de Sucesso (200):**
```json
{
  "id": "cliente123",
  "nome": "Empresa ABC Ltda",
  "cnpj": "12.345.678/0001-90",
  "observacoes": "Cliente preferencial"
}
```

**Resposta de Erro (404):**
```json
{
  "error": "Cliente não encontrado"
}
```

### 3. Criar Novo Cliente
**POST** `/clientes`

**Corpo da Requisição:**
```json
{
  "nome": "Nova Empresa Ltda",
  "cnpj": "11.222.333/0001-44",
  "observacoes": "Cliente novo"
}
```

**Resposta de Sucesso (201):**
```json
{
  "id": "novoClienteId",
  "nome": "Nova Empresa Ltda",
  "cnpj": "11.222.333/0001-44",
  "observacoes": "Cliente novo"
}
```

**Resposta de Erro (400):**
```json
{
  "error": "CNPJ já cadastrado"
}
```

### 4. Atualizar Cliente
**PUT** `/clientes/:id`

**Corpo da Requisição:**
```json
{
  "nome": "Empresa Atualizada Ltda",
  "cnpj": "11.222.333/0001-44",
  "observacoes": "Observações atualizadas"
}
```

**Resposta de Sucesso (200):**
```json
{
  "id": "cliente123",
  "nome": "Empresa Atualizada Ltda",
  "cnpj": "11.222.333/0001-44",
  "observacoes": "Observações atualizadas"
}
```

### 5. Excluir Cliente
**DELETE** `/clientes/:id`

**Resposta de Sucesso (200):**
```json
{
  "message": "Cliente excluído com sucesso"
}
```

**Resposta de Erro (400):**
```json
{
  "error": "Não é possível excluir o cliente pois existem agendamentos associados"
}
```

---

## 📅 Rotas de Agendamentos

### 1. Listar Agendamentos
**GET** `/agendamentos`

**Parâmetros de Query (opcionais):**
- `status`: Filtrar por status
- `cliente`: Filtrar por ID do cliente
- `data`: Filtrar por data específica (YYYY-MM-DD)
- `mes`: Filtrar por mês (YYYY-MM)

**Exemplos:**
```
GET /agendamentos
GET /agendamentos?status=agendado
GET /agendamentos?cliente=cliente123
GET /agendamentos?data=2024-01-15
GET /agendamentos?mes=2024-01
```

**Resposta de Sucesso (200):**
```json
[
  {
    "id": "agendamento123",
    "numeroNF": "123456",
    "chaveAcesso": "12345678901234567890123456789012345678901234",
    "data": "2024-01-15T12:00:00.000Z",
    "ePrevisao": false,
    "volumes": 10,
    "clienteId": "cliente123",
    "cliente": {
      "nome": "Empresa ABC Ltda",
      "cnpj": "12.345.678/0001-90"
    },
    "status": "agendado",
    "observacoes": "Entrega urgente",
    "historicoStatus": [
      {
        "status": "agendado",
        "timestamp": "2024-01-15T10:00:00.000Z"
      }
    ]
  }
]
```

### 2. Obter Agendamento por ID
**GET** `/agendamentos/:id`

**Resposta de Sucesso (200):**
```json
{
  "id": "agendamento123",
  "numeroNF": "123456",
  "chaveAcesso": "12345678901234567890123456789012345678901234",
  "data": "2024-01-15T12:00:00.000Z",
  "ePrevisao": false,
  "volumes": 10,
  "clienteId": "cliente123",
  "cliente": {
    "nome": "Empresa ABC Ltda",
    "cnpj": "12.345.678/0001-90"
  },
  "status": "agendado",
  "observacoes": "Entrega urgente",
  "historicoStatus": [...]
}
```

### 3. Criar Novo Agendamento
**POST** `/agendamentos`

**Corpo da Requisição:**
```json
{
  "numeroNF": "123456",
  "chaveAcesso": "12345678901234567890123456789012345678901234",
  "data": "2024-01-20",
  "ePrevisao": false,
  "volumes": 15,
  "clienteId": "cliente123",
  "observacoes": "Entrega com prioridade"
}
```

**Resposta de Sucesso (201):**
```json
{
  "id": "novoAgendamentoId",
  "numeroNF": "123456",
  "chaveAcesso": "12345678901234567890123456789012345678901234",
  "data": "2024-01-20T12:00:00.000Z",
  "ePrevisao": false,
  "volumes": 15,
  "clienteId": "cliente123",
  "cliente": {
    "nome": "Empresa ABC Ltda",
    "cnpj": "12.345.678/0001-90"
  },
  "status": "agendado",
  "observacoes": "Entrega com prioridade",
  "historicoStatus": [
    {
      "status": "agendado",
      "timestamp": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

### 4. Atualizar Agendamento
**PUT** `/agendamentos/:id`

**Corpo da Requisição:**
```json
{
  "numeroNF": "123456",
  "chaveAcesso": "12345678901234567890123456789012345678901234",
  "data": "2024-01-22",
  "volumes": 20,
  "observacoes": "Observações atualizadas"
}
```

### 5. Atualizar Status do Agendamento
**PATCH** `/agendamentos/:id/status`

**Corpo da Requisição:**
```json
{
  "status": "recebido"
}
```

**Status Permitidos:**
- `agendado`
- `recebido`
- `informado`
- `em tratativa`
- `a paletizar`
- `paletizado`
- `fechado`

**Resposta de Sucesso (200):**
```json
{
  "id": "agendamento123",
  "numeroNF": "123456",
  "status": "recebido",
  "historicoStatus": [
    {
      "status": "agendado",
      "timestamp": "2024-01-15T10:00:00.000Z"
    },
    {
      "status": "recebido",
      "timestamp": "2024-01-15T14:30:00.000Z"
    }
  ]
}
```

### 6. Buscar por NF ou Chave de Acesso
**GET** `/agendamentos/busca/nf?termo=123456`

**Resposta de Sucesso (200):**
```json
[
  {
    "id": "agendamento123",
    "numeroNF": "123456",
    "status": "agendado"
  }
]
```

### 7. Excluir Agendamento
**DELETE** `/agendamentos/:id`

**Resposta de Sucesso (200):**
```json
{
  "message": "Agendamento excluído com sucesso"
}
```

---

## 📊 Rotas de Histórico de Status

### 1. Obter Histórico de Status
**GET** `/agendamentos/:id/historico-status`

**Resposta de Sucesso (200):**
```json
{
  "agendamentoId": "agendamento123",
  "statusAtual": "recebido",
  "historico": [
    {
      "status": "agendado",
      "timestamp": "2024-01-15T10:00:00.000Z"
    },
    {
      "status": "recebido",
      "timestamp": "2024-01-15T14:30:00.000Z"
    },
    {
      "status": "informado",
      "timestamp": "2024-01-15T16:00:00.000Z",
      "observacao": "Nota fiscal processada",
      "adicionadoManualmente": true
    }
  ]
}
```

### 2. Adicionar Entrada Manual ao Histórico
**POST** `/agendamentos/:id/historico-status`

**Corpo da Requisição:**
```json
{
  "status": "em tratativa",
  "observacao": "Problema identificado na documentação",
  "timestamp": "2024-01-15T17:00:00.000Z"
}
```

**Resposta de Sucesso (201):**
```json
{
  "message": "Entrada adicionada ao histórico com sucesso",
  "entrada": {
    "status": "em tratativa",
    "timestamp": "2024-01-15T17:00:00.000Z",
    "observacao": "Problema identificado na documentação",
    "adicionadoManualmente": true
  }
}
```

### 3. Editar Entrada do Histórico
**PUT** `/agendamentos/:id/historico-status/:index`

**Exemplo:** `PUT /agendamentos/agendamento123/historico-status/2`

**Corpo da Requisição:**
```json
{
  "status": "a paletizar",
  "observacao": "Observação atualizada",
  "timestamp": "2024-01-15T18:00:00.000Z"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Entrada do histórico atualizada com sucesso",
  "entrada": {
    "status": "a paletizar",
    "timestamp": "2024-01-15T18:00:00.000Z",
    "observacao": "Observação atualizada",
    "adicionadoManualmente": true,
    "editadoEm": "2024-01-15T19:00:00.000Z"
  }
}
```

### 4. Remover Entrada do Histórico
**DELETE** `/agendamentos/:id/historico-status/:index`

**Exemplo:** `DELETE /agendamentos/agendamento123/historico-status/2`

**Resposta de Sucesso (200):**
```json
{
  "message": "Entrada removida do histórico com sucesso",
  "entradaRemovida": {
    "status": "em tratativa",
    "timestamp": "2024-01-15T17:00:00.000Z",
    "observacao": "Problema identificado na documentação"
  }
}
```

### 5. Limpar Histórico (Manter Apenas Primeira Entrada)
**DELETE** `/agendamentos/:id/historico-status`

**Resposta de Sucesso (200):**
```json
{
  "message": "Histórico limpo com sucesso",
  "historicoAtual": [
    {
      "status": "agendado",
      "timestamp": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

## 🔢 Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro interno do servidor |

---

## 📋 Estruturas de Dados

### Cliente
```json
{
  "id": "string",
  "nome": "string (obrigatório)",
  "cnpj": "string (obrigatório, único)",
  "observacoes": "string (opcional)"
}
```

### Agendamento
```json
{
  "id": "string",
  "numeroNF": "string (opcional)",
  "chaveAcesso": "string (opcional)",
  "data": "timestamp (opcional se ePrevisao = true)",
  "ePrevisao": "boolean",
  "volumes": "number",
  "clienteId": "string (obrigatório)",
  "cliente": {
    "nome": "string",
    "cnpj": "string"
  },
  "status": "string",
  "observacoes": "string (opcional)",
  "historicoStatus": [
    {
      "status": "string",
      "timestamp": "timestamp",
      "observacao": "string (opcional)",
      "adicionadoManualmente": "boolean (opcional)",
      "editadoEm": "timestamp (opcional)"
    }
  ]
}
```

### Entrada do Histórico
```json
{
  "status": "string",
  "timestamp": "timestamp",
  "observacao": "string (opcional)",
  "adicionadoManualmente": "boolean (opcional)",
  "editadoEm": "timestamp (opcional)"
}
```

---

## 🚨 Observações Importantes

1. **Status de Agendamentos**: Não há mais restrições para alteração de status. Qualquer status pode ser alterado para qualquer outro status.

2. **Histórico de Status**: Todas as alterações de status são automaticamente registradas no histórico com timestamp.

3. **Validações**:
   - CNPJ deve ser único entre clientes
   - Cliente deve existir para criar agendamento
   - Status deve ser um dos valores permitidos

4. **Timestamps**: Todos os timestamps são armazenados no formato Firestore Timestamp.

5. **Primeira Entrada do Histórico**: Não pode ser removida, pois representa a criação do agendamento.

---

## 🔧 Exemplos de Uso com cURL

### Criar Cliente
```bash
curl -X POST http://localhost:3000/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Empresa Teste Ltda",
    "cnpj": "12.345.678/0001-90",
    "observacoes": "Cliente de teste"
  }'
```

### Criar Agendamento
```bash
curl -X POST http://localhost:3000/agendamentos \
  -H "Content-Type: application/json" \
  -d '{
    "numeroNF": "123456",
    "data": "2024-01-20",
    "volumes": 10,
    "clienteId": "cliente123",
    "observacoes": "Entrega urgente"
  }'
```

### Alterar Status
```bash
curl -X PATCH http://localhost:3000/agendamentos/agendamento123/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "recebido"
  }'
```

### Adicionar Histórico Manual
```bash
curl -X POST http://localhost:3000/agendamentos/agendamento123/historico-status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "em tratativa",
    "observacao": "Problema na documentação"
  }'
```

---

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação do Firebase ou entre em contato com a equipe de desenvolvimento. 