const admin = require('firebase-admin');

// Inicializa o Firebase Admin com as credenciais do serviceAccount
let serviceAccount;

// Verifica se as credenciais estão nas variáveis de ambiente (para ambiente de produção)
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // Caso contrário, carrega do arquivo local (para ambiente de desenvolvimento)
  try {
    serviceAccount = require('./serviceAccountKey.json');
  } catch (error) {
    console.error('Erro ao carregar serviceAccountKey.json:', error);
    console.error('Certifique-se de que o arquivo existe ou configure a variável de ambiente FIREBASE_SERVICE_ACCOUNT');
    process.exit(1);
  }
}

// Inicializa o Firebase Admin com as credenciais
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error('Erro ao inicializar Firebase Admin:', error);
  process.exit(1);
}

// Obtém referência para o Firestore
const db = admin.firestore();

// Referências para as coleções
const agendamentosRef = db.collection('agendamentos');
const clientesRef = db.collection('clientes');

module.exports = { db, admin, agendamentosRef, clientesRef };