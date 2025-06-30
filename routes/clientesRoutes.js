const express = require('express');
const router = express.Router();
const { clientesRef, agendamentosRef, db } = require('../config/firebase');

// Obter todos os clientes
router.get('/', async (req, res) => {
  try {
    const snapshot = await clientesRef.get();
    const clientes = [];
    
    snapshot.forEach(doc => {
      clientes.push({ id: doc.id, ...doc.data() });
    });
    
    res.status(200).json(clientes);
  } catch (error) {
    console.error('Erro ao obter clientes:', error);
    res.status(500).json({ error: 'Erro ao obter clientes' });
  }
});

// Obter cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const clienteDoc = await clientesRef.doc(req.params.id).get();
    
    if (!clienteDoc.exists) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    res.status(200).json({ id: clienteDoc.id, ...clienteDoc.data() });
  } catch (error) {
    console.error('Erro ao obter cliente:', error);
    res.status(500).json({ error: 'Erro ao obter cliente' });
  }
});

// Criar novo cliente
router.post('/', async (req, res) => {
  try {
    const { nome, cnpj, observacoes } = req.body;
    
    // Validação dos campos obrigatórios
    if (!nome) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }
    
    if (!cnpj) {
      return res.status(400).json({ error: 'CNPJ é obrigatório' });
    }
    
    // Verifica se já existe um cliente com o mesmo CNPJ
    const cnpjSnapshot = await clientesRef.where('cnpj', '==', cnpj).get();
    
    if (!cnpjSnapshot.empty) {
      return res.status(400).json({ error: 'CNPJ já cadastrado' });
    }
    
    const novoCliente = {
      nome,
      cnpj,
      observacoes: observacoes || ''
    };
    
    const docRef = await clientesRef.add(novoCliente);
    
    res.status(201).json({ id: docRef.id, ...novoCliente });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ error: 'Erro ao criar cliente' });
  }
});

// Atualizar cliente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cnpj, observacoes } = req.body;
    
    const clienteDoc = await clientesRef.doc(id).get();
    
    if (!clienteDoc.exists) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    const clienteAtual = clienteDoc.data();
    
    const atualizacoes = {};
    
    if (nome) atualizacoes.nome = nome;
    if (cnpj && cnpj !== clienteAtual.cnpj) {
      // Verifica se já existe outro cliente com o mesmo CNPJ
      const cnpjSnapshot = await clientesRef
        .where('cnpj', '==', cnpj)
        .get();
      
      if (!cnpjSnapshot.empty) {
        let clienteExistente = false;
        
        cnpjSnapshot.forEach(doc => {
          if (doc.id !== id) {
            clienteExistente = true;
          }
        });
        
        if (clienteExistente) {
          return res.status(400).json({ error: 'CNPJ já cadastrado para outro cliente' });
        }
      }
      
      atualizacoes.cnpj = cnpj;
    }
    
    if (observacoes !== undefined) atualizacoes.observacoes = observacoes;
    
    await clientesRef.doc(id).update(atualizacoes);
    
    // Se o nome ou CNPJ mudou, atualiza as referências nos agendamentos
    if (atualizacoes.nome || atualizacoes.cnpj) {
      const batch = db.batch();
      
      const agendamentosSnapshot = await agendamentosRef.where('clienteId', '==', id).get();
      
      agendamentosSnapshot.forEach(doc => {
        const clienteRef = doc.ref;
        const clienteAtualizado = {
          ...clienteDoc.data().cliente
        };
        
        if (atualizacoes.nome) clienteAtualizado.nome = atualizacoes.nome;
        if (atualizacoes.cnpj) clienteAtualizado.cnpj = atualizacoes.cnpj;
        
        batch.update(clienteRef, { cliente: clienteAtualizado });
      });
      
      await batch.commit();
    }
    
    res.status(200).json({ id, ...clienteAtual, ...atualizacoes });
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
});

// Deletar cliente
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const clienteDoc = await clientesRef.doc(id).get();
    
    if (!clienteDoc.exists) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    // Verifica se existem agendamentos associados a este cliente
    const agendamentosSnapshot = await agendamentosRef.where('clienteId', '==', id).limit(1).get();
    
    if (!agendamentosSnapshot.empty) {
      return res.status(400).json({ 
        error: 'Não é possível excluir o cliente pois existem agendamentos associados' 
      });
    }
    
    await clientesRef.doc(id).delete();
    
    res.status(200).json({ message: 'Cliente excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    res.status(500).json({ error: 'Erro ao excluir cliente' });
  }
});

module.exports = router;