
const Storage = {
  obter(chave, valorPadrao = []) {
    try {
      const dados = localStorage.getItem(chave);

      if (dados === null) {
        return valorPadrao;
      }

      return JSON.parse(dados);
    } catch (erro) {
      console.error("Erro ao ler os dados:", erro);
      return valorPadrao;
    }
  },

  salvar(chave, dados) {
    try {
      localStorage.setItem(chave, JSON.stringify(dados));
      return true;
    } catch (erro) {
      console.error("Erro ao salvar os dados:", erro);
      alert("Não foi possível salvar os dados neste navegador.");
      return false;
    }
  }
};
