
/* ==================================================
   DOJOFLOW — APLICAÇÃO PRINCIPAL
   Biblioteca de exercícios
   Montador de rotinas
   Painel inicial
   Histórico de treinos
================================================== */


/* ==================================================
   1. BIBLIOTECA DE EXERCÍCIOS
================================================== */

const CHAVE_EXERCICIOS = "dojoflow_exercicios";

let exercicios = Storage.obter(CHAVE_EXERCICIOS, []);
let idExercicioEmEdicao = null;

const formExercicio = document.querySelector("#form-exercicio");
const campoNomeExercicio = document.querySelector("#nome-exercicio");
const campoCategoriaExercicio = document.querySelector("#categoria-exercicio");
const campoDuracaoExercicio = document.querySelector("#duracao-exercicio");
const campoDescricaoExercicio = document.querySelector("#descricao-exercicio");

const listaExercicios = document.querySelector("#lista-exercicios");
const pesquisaExercicio = document.querySelector("#pesquisa-exercicio");
const filtroCategoria = document.querySelector("#filtro-categoria");
const contadorExercicios = document.querySelector("#contador-exercicios");

const botaoSalvarExercicio = document.querySelector("#btn-salvar");
const botaoCancelarExercicio = document.querySelector("#btn-cancelar");


function salvarExercicios() {
  return Storage.salvar(CHAVE_EXERCICIOS, exercicios);
}


function atualizarDashboard() {
  const totalExercicios = document.querySelector("#total-exercicios");
  const totalRotinas = document.querySelector("#total-rotinas");
  const totalSessoes = document.querySelector("#total-sessoes");

  if (totalExercicios) {
    totalExercicios.textContent = String(exercicios.length);
  }

  if (totalRotinas) {
    totalRotinas.textContent = String(rotinas.length);
  }

  if (totalSessoes) {
    totalSessoes.textContent = String(
      obterSessoesConcluidas().length
    );
  }
}


function renderizarExercicios() {
  listaExercicios.replaceChildren();

  const termo = pesquisaExercicio.value.trim().toLowerCase();
  const categoriaSelecionada = filtroCategoria.value;

  const exerciciosFiltrados = exercicios.filter((exercicio) => {
    const correspondeNome = exercicio.nome
      .toLowerCase()
      .includes(termo);

    const correspondeCategoria =
      !categoriaSelecionada ||
      exercicio.categoria === categoriaSelecionada;

    return correspondeNome && correspondeCategoria;
  });

  contadorExercicios.textContent =
    `${exerciciosFiltrados.length} ` +
    `${exerciciosFiltrados.length === 1 ? "exercício" : "exercícios"}`;

  if (exerciciosFiltrados.length === 0) {
    const mensagem = document.createElement("div");

    mensagem.className = "empty-state";
    mensagem.textContent = exercicios.length === 0
      ? "Você ainda não cadastrou exercícios."
      : "Nenhum exercício encontrado com esses filtros.";

    listaExercicios.appendChild(mensagem);
    atualizarDashboard();
    return;
  }

  exerciciosFiltrados.forEach((exercicio) => {
    const card = document.createElement("article");
    card.className = "exercise-card";

    const titulo = document.createElement("h3");
    titulo.textContent = exercicio.nome;

    const categoria = document.createElement("span");
    categoria.className = "exercise-category";
    categoria.textContent = exercicio.categoria;

    const duracao = document.createElement("p");
    duracao.textContent =
      `Duração: ${formatarTempo(exercicio.duracao)}`;

    const descricao = document.createElement("p");
    descricao.textContent =
      exercicio.descricao || "Nenhuma descrição informada.";

    const acoes = document.createElement("div");
    acoes.className = "exercise-card-actions";

    const botaoEditar = document.createElement("button");
    botaoEditar.type = "button";
    botaoEditar.className = "btn-secondary";
    botaoEditar.textContent = "Editar";

    botaoEditar.addEventListener("click", () => {
      iniciarEdicaoExercicio(exercicio.id);
    });

    const botaoExcluir = document.createElement("button");
    botaoExcluir.type = "button";
    botaoExcluir.className = "btn-danger";
    botaoExcluir.textContent = "Excluir";

    botaoExcluir.addEventListener("click", () => {
      excluirExercicio(exercicio.id);
    });

    acoes.append(botaoEditar, botaoExcluir);
    card.append(titulo, categoria, duracao, descricao, acoes);

    listaExercicios.appendChild(card);
  });

  atualizarDashboard();
}


function limparFormularioExercicio() {
  formExercicio.reset();

  idExercicioEmEdicao = null;

  botaoSalvarExercicio.textContent = "Salvar exercício";
  botaoCancelarExercicio.hidden = true;
}


function iniciarEdicaoExercicio(id) {
  const exercicio = exercicios.find((item) => item.id === id);

  if (!exercicio) return;

  idExercicioEmEdicao = id;

  campoNomeExercicio.value = exercicio.nome;
  campoCategoriaExercicio.value = exercicio.categoria;
  campoDuracaoExercicio.value = exercicio.duracao;
  campoDescricaoExercicio.value = exercicio.descricao || "";

  botaoSalvarExercicio.textContent = "Salvar alterações";
  botaoCancelarExercicio.hidden = false;

  formExercicio.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  campoNomeExercicio.focus();
}


function excluirExercicio(id) {
  const exercicio = exercicios.find((item) => item.id === id);

  if (!exercicio) return;

  const confirmou = confirm(
    `Deseja excluir o exercício "${exercicio.nome}"?`
  );

  if (!confirmou) return;

  const exerciciosAnteriores = exercicios;

  exercicios = exercicios.filter((item) => item.id !== id);

  if (!salvarExercicios()) {
    exercicios = exerciciosAnteriores;
    return;
  }

  if (idExercicioEmEdicao === id) {
    limparFormularioExercicio();
  }

  renderizarExercicios();
  atualizarSeletorExercicios();
  atualizarDashboard();
}


formExercicio.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nome = campoNomeExercicio.value.trim();
  const categoria = campoCategoriaExercicio.value;
  const duracao = Number(campoDuracaoExercicio.value);
  const descricao = campoDescricaoExercicio.value.trim();

  if (
    !nome ||
    !categoria ||
    !Number.isFinite(duracao) ||
    duracao <= 0
  ) {
    alert("Preencha o nome, a categoria e uma duração válida.");
    return;
  }

  const nomeDuplicado = exercicios.some((item) =>
    item.nome.toLowerCase() === nome.toLowerCase() &&
    item.id !== idExercicioEmEdicao
  );

  if (nomeDuplicado) {
    alert("Já existe um exercício com esse nome.");
    return;
  }

  const exercicio = {
    id: idExercicioEmEdicao ?? (
      exercicios.length > 0
        ? Math.max(...exercicios.map((item) => item.id)) + 1
        : 1
    ),
    nome,
    categoria,
    duracao,
    descricao
  };

  const exerciciosAnteriores = exercicios;

  if (idExercicioEmEdicao !== null) {
    exercicios = exercicios.map((item) =>
      item.id === idExercicioEmEdicao ? exercicio : item
    );
  } else {
    exercicios = [...exercicios, exercicio];
  }

  if (!salvarExercicios()) {
    exercicios = exerciciosAnteriores;
    return;
  }

  limparFormularioExercicio();
  renderizarExercicios();
  atualizarSeletorExercicios();
  atualizarDashboard();
});


botaoCancelarExercicio.addEventListener(
  "click",
  limparFormularioExercicio
);

pesquisaExercicio.addEventListener(
  "input",
  renderizarExercicios
);

filtroCategoria.addEventListener(
  "change",
  renderizarExercicios
);


/* ==================================================
   2. MONTADOR DE ROTINAS
================================================== */

const CHAVE_ROTINAS = "dojoflow_rotinas";

let rotinas = Storage.obter(CHAVE_ROTINAS, []);
let itensRotina = [];
let idRotinaEmEdicao = null;

const formRotina = document.querySelector("#form-rotina");
const campoNomeRotina = document.querySelector("#nome-rotina");
const seletorExercicio = document.querySelector("#selecionar-exercicio");

const listaItensRotina = document.querySelector("#lista-itens-rotina");
const listaRotinas = document.querySelector("#lista-rotinas");
const totalTempoRotina = document.querySelector("#total-tempo-rotina");

const botaoSalvarRotina = document.querySelector("#btn-salvar-rotina");
const botaoCancelarRotina = document.querySelector("#btn-cancelar-rotina");

const botaoAdicionarExercicio = document.querySelector(
  "#btn-adicionar-exercicio"
);


/*
  Converte segundos para um formato legível.
  Exemplos:
  45  -> 45 s
  60  -> 1 min
  90  -> 1 min 30 s
  120 -> 2 min
*/

function formatarTempo(segundos) {
  const valor = Number(segundos);

  if (!Number.isFinite(valor) || valor < 0) {
    return "0 s";
  }

  const minutos = Math.floor(valor / 60);
  const resto = Math.floor(valor % 60);

  if (minutos === 0) return `${resto} s`;
  if (resto === 0) return `${minutos} min`;

  return `${minutos} min ${resto} s`;
}


function atualizarSeletorExercicios() {
  const valorAnterior = seletorExercicio.value;

  seletorExercicio.replaceChildren();

  const opcaoInicial = document.createElement("option");
  opcaoInicial.value = "";
  opcaoInicial.textContent = "Selecione um exercício cadastrado";

  seletorExercicio.appendChild(opcaoInicial);

  exercicios.forEach((exercicio) => {
    const opcao = document.createElement("option");

    opcao.value = String(exercicio.id);
    opcao.textContent =
      `${exercicio.nome} (${formatarTempo(exercicio.duracao)})`;

    seletorExercicio.appendChild(opcao);
  });

  if (exercicios.some((item) => String(item.id) === valorAnterior)) {
    seletorExercicio.value = valorAnterior;
  }
}


function calcularTempoRotina() {
  return itensRotina.reduce(
    (total, item) => total + Number(item.duracao),
    0
  );
}


function renderizarItensRotina() {
  listaItensRotina.replaceChildren();

  totalTempoRotina.textContent = formatarTempo(
    calcularTempoRotina()
  );

  if (itensRotina.length === 0) {
    const mensagem = document.createElement("div");

    mensagem.className = "empty-state";
    mensagem.textContent =
      "Adicione exercícios para montar sua rotina.";

    listaItensRotina.appendChild(mensagem);
    return;
  }

  itensRotina.forEach((item, indice) => {
    const linha = document.createElement("div");
    linha.className = "routine-item";

    const posicao = document.createElement("span");
    posicao.className = "routine-position";
    posicao.textContent = String(indice + 1);

    const informacoes = document.createElement("div");
    informacoes.className = "routine-item-info";

    const nome = document.createElement("strong");
    nome.textContent = item.nome;

    const tempo = document.createElement("span");
    tempo.textContent =
      `${item.categoria} · ${formatarTempo(item.duracao)}`;

    informacoes.append(nome, tempo);

    const controles = document.createElement("div");
    controles.className = "routine-item-controls";

    const botaoSubir = document.createElement("button");
    botaoSubir.type = "button";
    botaoSubir.textContent = "↑";
    botaoSubir.title = "Mover para cima";
    botaoSubir.setAttribute(
      "aria-label",
      `Mover ${item.nome} para cima`
    );

    botaoSubir.disabled = indice === 0;

    botaoSubir.addEventListener("click", () => {
      moverItemRotina(indice, -1);
    });

    const botaoDescer = document.createElement("button");
    botaoDescer.type = "button";
    botaoDescer.textContent = "↓";
    botaoDescer.title = "Mover para baixo";
    botaoDescer.setAttribute(
      "aria-label",
      `Mover ${item.nome} para baixo`
    );

    botaoDescer.disabled = indice === itensRotina.length - 1;

    botaoDescer.addEventListener("click", () => {
      moverItemRotina(indice, 1);
    });

    const botaoRemover = document.createElement("button");
    botaoRemover.type = "button";
    botaoRemover.className = "btn-danger";
    botaoRemover.textContent = "Remover";

    botaoRemover.addEventListener("click", () => {
      removerItemRotina(indice);
    });

    controles.append(botaoSubir, botaoDescer, botaoRemover);
    linha.append(posicao, informacoes, controles);

    listaItensRotina.appendChild(linha);
  });
}


function adicionarItemRotina() {
  const idExercicio = Number(seletorExercicio.value);

  if (!idExercicio) {
    alert("Selecione um exercício primeiro.");
    return;
  }

  const exercicio = exercicios.find(
    (item) => item.id === idExercicio
  );

  if (!exercicio) {
    alert("Esse exercício não foi encontrado na biblioteca.");
    atualizarSeletorExercicios();
    return;
  }

  itensRotina.push({
    exercicioId: exercicio.id,
    nome: exercicio.nome,
    categoria: exercicio.categoria,
    duracao: exercicio.duracao
  });

  renderizarItensRotina();
}


function moverItemRotina(indice, direcao) {
  const novoIndice = indice + direcao;

  if (novoIndice < 0 || novoIndice >= itensRotina.length) {
    return;
  }

  [
    itensRotina[indice],
    itensRotina[novoIndice]
  ] = [
    itensRotina[novoIndice],
    itensRotina[indice]
  ];

  renderizarItensRotina();
}


function removerItemRotina(indice) {
  itensRotina.splice(indice, 1);
  renderizarItensRotina();
}


function limparFormularioRotina() {
  formRotina.reset();

  itensRotina = [];
  idRotinaEmEdicao = null;

  botaoSalvarRotina.textContent = "Salvar rotina";
  botaoCancelarRotina.hidden = true;

  renderizarItensRotina();
}


function salvarRotinas() {
  const salvou = Storage.salvar(CHAVE_ROTINAS, rotinas);

  if (salvou) {
    renderizarRotinas();
    atualizarDashboard();
  }

  return salvou;
}


function renderizarRotinas() {
  listaRotinas.replaceChildren();

  // Mantém o seletor do cronômetro sincronizado.
  atualizarSeletorRotinasTimer();

  document.querySelector("#total-rotinas").textContent =
    String(rotinas.length);

  if (rotinas.length === 0) {
    const mensagem = document.createElement("div");

    mensagem.className = "empty-state";
    mensagem.textContent = "Você ainda não salvou nenhuma rotina.";

    listaRotinas.appendChild(mensagem);
    atualizarDashboard();
    return;
  }

  rotinas.forEach((rotina) => {
    const card = document.createElement("article");
    card.className = "routine-card";

    const titulo = document.createElement("h4");
    titulo.textContent = rotina.nome;

    const quantidade = rotina.itens.length;

    const duracaoTotal = rotina.itens.reduce(
      (total, item) => total + Number(item.duracao),
      0
    );

    const resumo = document.createElement("p");

    resumo.textContent =
      `${quantidade} ${quantidade === 1 ? "exercício" : "exercícios"}` +
      ` · ${formatarTempo(duracaoTotal)}`;

    const acoes = document.createElement("div");
    acoes.className = "routine-card-actions";

    const botaoEditar = document.createElement("button");
    botaoEditar.type = "button";
    botaoEditar.className = "btn-secondary";
    botaoEditar.textContent = "Editar";

    botaoEditar.addEventListener("click", () => {
      iniciarEdicaoRotina(rotina.id);
    });

    const botaoExcluir = document.createElement("button");
    botaoExcluir.type = "button";
    botaoExcluir.className = "btn-danger";
    botaoExcluir.textContent = "Excluir";

    botaoExcluir.addEventListener("click", () => {
      excluirRotina(rotina.id);
    });

    acoes.append(botaoEditar, botaoExcluir);
    card.append(titulo, resumo, acoes);

    listaRotinas.appendChild(card);
  });

  atualizarDashboard();
}


function iniciarEdicaoRotina(id) {
  const rotina = rotinas.find((item) => item.id === id);

  if (!rotina) return;

  idRotinaEmEdicao = id;
  campoNomeRotina.value = rotina.nome;

  itensRotina = rotina.itens.map((item) => ({ ...item }));

  botaoSalvarRotina.textContent = "Salvar alterações";
  botaoCancelarRotina.hidden = false;

  renderizarItensRotina();

  formRotina.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  campoNomeRotina.focus();
}


function excluirRotina(id) {
  const rotina = rotinas.find((item) => item.id === id);

  if (!rotina) return;

  const confirmou = confirm(
    `Deseja excluir a rotina "${rotina.nome}"?`
  );

  if (!confirmou) return;

  const rotinasAnteriores = rotinas;

  rotinas = rotinas.filter((item) => item.id !== id);

  if (!salvarRotinas()) {
    rotinas = rotinasAnteriores;
    return;
  }

  if (idRotinaEmEdicao === id) {
    limparFormularioRotina();
  }
}


botaoAdicionarExercicio.addEventListener(
  "click",
  adicionarItemRotina
);

botaoCancelarRotina.addEventListener(
  "click",
  limparFormularioRotina
);


formRotina.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nome = campoNomeRotina.value.trim();

  if (!nome) {
    alert("Digite um nome para a rotina.");
    return;
  }

  if (itensRotina.length === 0) {
    alert("Adicione pelo menos um exercício.");
    return;
  }

  const nomeDuplicado = rotinas.some((item) =>
    item.nome.toLowerCase() === nome.toLowerCase() &&
    item.id !== idRotinaEmEdicao
  );

  if (nomeDuplicado) {
    alert("Já existe uma rotina com esse nome.");
    return;
  }

  const rotina = {
    id: idRotinaEmEdicao ?? (
      rotinas.length > 0
        ? Math.max(...rotinas.map((item) => item.id)) + 1
        : 1
    ),
    nome,
    itens: itensRotina.map((item) => ({ ...item }))
  };

  const rotinasAnteriores = rotinas;

  if (idRotinaEmEdicao !== null) {
    rotinas = rotinas.map((item) =>
      item.id === idRotinaEmEdicao ? rotina : item
    );
  } else {
    rotinas = [...rotinas, rotina];
  }

  if (!salvarRotinas()) {
    rotinas = rotinasAnteriores;
    return;
  }

  limparFormularioRotina();
});


/* ==================================================
   3. ATALHOS DO PAINEL INICIAL
================================================== */

const atalhoExercicios = document.querySelector("#atalho-exercicios");
const atalhoRotinas = document.querySelector("#atalho-rotinas");
const atalhoCronometro = document.querySelector("#atalho-cronometro");


if (atalhoExercicios) {
  atalhoExercicios.addEventListener("click", () => {
    document.querySelector("#exercicios").scrollIntoView({
      behavior: "smooth"
    });
  });
}


if (atalhoRotinas) {
  atalhoRotinas.addEventListener("click", () => {
    document.querySelector("#rotinas").scrollIntoView({
      behavior: "smooth"
    });
  });
}


if (atalhoCronometro) {
  atalhoCronometro.addEventListener("click", () => {
    document.querySelector("#cronometro").scrollIntoView({
      behavior: "smooth"
    });
  });
}


/* ==================================================
   4. HISTÓRICO DE TREINOS
================================================== */

const CHAVE_HISTORICO = "dojoflow_sessoes";

const listaHistorico = document.querySelector("#lista-historico");

const totalHistoricoSessoes = document.querySelector(
  "#historico-total-sessoes"
);

const totalHistoricoTempo = document.querySelector(
  "#historico-tempo-total"
);

const botaoLimparHistorico = document.querySelector(
  "#btn-limpar-historico"
);


/*
  Busca as sessões concluídas, valida os dados
  e organiza da mais recente para a mais antiga.
*/

function obterSessoesConcluidas() {
  const sessoes = Storage.obter(CHAVE_HISTORICO, []);

  if (!Array.isArray(sessoes)) {
    return [];
  }

  return sessoes
    .filter((sessao) =>
      sessao &&
      sessao.status === "concluida" &&
      Number.isFinite(Number(sessao.duracao)) &&
      Number(sessao.duracao) >= 0
    )
    .sort((a, b) => {
      const dataA = new Date(a.data).getTime() || 0;
      const dataB = new Date(b.data).getTime() || 0;

      return dataB - dataA;
    });
}


/*
  Formata a data para o padrão brasileiro.
*/

function formatarDataHistorico(dataISO) {
  const data = new Date(dataISO);

  if (Number.isNaN(data.getTime())) {
    return "Data indisponível";
  }

  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}


/*
  Atualiza os totais exibidos no histórico.
*/

function atualizarResumoHistorico(sessoes) {
  const quantidade = sessoes.length;

  const tempoTotalSegundos = sessoes.reduce(
    (total, sessao) => total + Number(sessao.duracao),
    0
  );

  totalHistoricoSessoes.textContent = String(quantidade);

  totalHistoricoTempo.textContent =
    formatarTempo(tempoTotalSegundos);

  const contadorDashboard = document.querySelector("#total-sessoes");

  if (contadorDashboard) {
    contadorDashboard.textContent = String(quantidade);
  }
}


/*
  Desenha os registros do histórico.
*/

function renderizarHistorico() {
  const sessoes = obterSessoesConcluidas();

  listaHistorico.replaceChildren();

  atualizarResumoHistorico(sessoes);

  if (sessoes.length === 0) {
    const mensagem = document.createElement("div");

    mensagem.className = "history-empty";
    mensagem.textContent =
      "Nenhuma sessão concluída ainda. " +
      "Conclua uma rotina para registrar seu treino.";

    listaHistorico.appendChild(mensagem);
    return;
  }

  sessoes.forEach((sessao) => {
    const card = document.createElement("article");
    card.className = "history-card";

    const cabecalho = document.createElement("div");
    cabecalho.className = "history-card-header";

    const titulo = document.createElement("h3");
    titulo.textContent = sessao.rotina || "Rotina sem nome";

    const status = document.createElement("span");
    status.className = "history-status";
    status.textContent = "CONCLUÍDA";

    cabecalho.append(titulo, status);

    const data = document.createElement("p");
    data.textContent =
      `Data: ${formatarDataHistorico(sessao.data)}`;

    const duracao = document.createElement("p");
    duracao.textContent =
      `Tempo planejado: ${formatarTempo(Number(sessao.duracao))}`;

    const quantidadeExercicios =
      Number(sessao.quantidadeExercicios) || 0;

    const exerciciosHistorico = document.createElement("p");

    exerciciosHistorico.textContent =
      `${quantidadeExercicios} ` +
      `${quantidadeExercicios === 1 ? "exercício" : "exercícios"}`;

    card.append(
      cabecalho,
      data,
      duracao,
      exerciciosHistorico
    );

    listaHistorico.appendChild(card);
  });
}


/*
  Apaga apenas as sessões registradas.
  Não apaga exercícios nem rotinas.
*/

botaoLimparHistorico.addEventListener("click", () => {
  const sessoes = Storage.obter(CHAVE_HISTORICO, []);

  if (!Array.isArray(sessoes) || sessoes.length === 0) {
    alert("O histórico já está vazio.");
    return;
  }

  const confirmou = confirm(
    "Deseja apagar todas as sessões do histórico? " +
    "Essa ação não pode ser desfeita."
  );

  if (!confirmou) return;

  const salvou = Storage.salvar(CHAVE_HISTORICO, []);

  if (!salvou) {
    alert("Não foi possível apagar o histórico.");
    return;
  }

  renderizarHistorico();
  atualizarDashboard();

  alert("Histórico apagado com sucesso.");
});


/* ==================================================
   5. INICIALIZAÇÃO DA APLICAÇÃO
================================================== */

// Atualiza os seletores e desenha os dados salvos.

atualizarSeletorExercicios();
renderizarExercicios();

renderizarItensRotina();
renderizarRotinas();

renderizarHistorico();
atualizarDashboard();
