const extrairNumeroNF = (input) => {
  // Verifica se é chave de acesso (44 dígitos)
  if (input.length === 44 && /^\d+$/.test(input)) {
    // Extrai número da NF da chave de acesso
    // Posições 26 a 34 da chave de acesso
    const numeroNF = input.substring(25, 34);
    // Remove zeros à esquerda
    return numeroNF.replace(/^0+/, '');
  }
  
  // Caso não seja chave de acesso, remove caracteres não numéricos
  const numeros = input.replace(/\D/g, '');
  // Remove zeros à esquerda
  return numeros.replace(/^0+/, '');
};

module.exports = { extrairNumeroNF };