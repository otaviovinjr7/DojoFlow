
const CHAVE_SESSOES = "dojoflow_sessoes";

let rotinaEmExecucao = [];
let nomeRotinaEmExecucao = "";
let indiceExercicioAtual = 0;
let tempoRestanteMs = 0;
let prazoFinalMs = 0;
let intervaloCronometro = null;
let cronometroAtivo = false;
let sessaoIniciadaEm = null;

const seletorRotinaTimer = document.querySelector("#rotina-cronometro");
const displayTimer = document.querySelector("#timer-display");
const nomeExercicioTimer = document.querySelector("#timer-exercicio-atual");
const categoriaExercicioTimer = document.querySelector("#timer-categoria-atual");
const progressoTimer = document.querySelector("#timer-progresso");
const proximoTimer = document.querySelector("#timer-proximo");
const mensagemTimer = document.querySelector("#timer-mensagem");

const botaoIniciarTimer = document.querySelector("#btn-timer-iniciar");
const botaoPausarTimer = document.querySelector("#btn-timer-pausar");
const botaoProximoTimer = document.querySelector("#btn-timer-proximo");
const botaoFinalizarTimer = document.querySelector("#btn-timer-finalizar");

function formatarDisplayTimer(milissegundos) {
  const segundosTotais = Math.ceil(Math.max(0, milissegundos) / 1000);
  const minutos = Math.floor(segundosTotais / 60);
  const segundos = segundosTotais % 60;

  return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
}

function atualizarSeletorRotinasTimer() {
  const valorAnterior = seletorRotinaTimer.value;

  seletorRotinaTimer.replaceChildren();

  const opcaoInicial = document.createElement("option");
  opcaoInicial.value = "";
  opcaoInicial.textContent = "Selecione uma rotina salva";
  seletorRotinaTimer.appendChild(opcaoInicial);

  rotinas.forEach((rotina) => {
    const opcao = document.createElement("option");
    opcao.value = String(rotina.id);
    opcao.textContent = rotina.nome;
    seletorRotinaTimer.appendChild(opcao);
  });

  if (rotinas.some((rotina) => String(rotina.id) === valorAnterior)) {
    seletorRotinaTimer.value = valorAnterior;
  }
}

function atualizarTelaTimer() {
  if (rotinaEmExecucao.length === 0) {
    displayTimer.textContent = "00:00";
    nomeExercicioTimer.textContent = "Seu próximo aquecimento começa aqui";
    categoriaExercicioTimer.textContent = "Selecione uma rotina salva para começar.";
    progressoTimer.textContent = "PRONTO PARA COMEÇAR";
    proximoTimer.textContent = "Próximo: —";
    return;
  }

  const exercicio = rotinaEmExecucao[indiceExercicioAtual];

  nomeExercicioTimer.textContent = exercicio.nome;
  categoriaExercicioTimer.textContent = `Categoria: ${exercicio.categoria}`;
  displayTimer.textContent = formatarDisplayTimer(tempoRestanteMs);
  progressoTimer.textContent =
    `EXERCÍCIO ${indiceExercicioAtual + 1} DE ${rotinaEmExecucao.length}`;

  const proximo = rotinaEmExecucao[indiceExercicioAtual + 1];
  proximoTimer.textContent = proximo
    ? `Próximo: ${proximo.nome}`
    : "Este é o último exercício da rotina.";

  botaoIniciarTimer.textContent = cronometroAtivo
    ? "Em andamento"
    : tempoRestanteMs < exercicio.duracao * 1000
      ? "Retomar"
      : "Iniciar";
}

function carregarRotinaTimer() {
  const idSelecionado = Number(seletorRotinaTimer.value);
  const rotina = rotinas.find((item) => item.id === idSelecionado);

  if (!rotina) {
    mensagemTimer.textContent = "Selecione uma rotina válida.";
    return false;
  }

  if (!Array.isArray(rotina.itens) || rotina.itens.length === 0) {
    mensagemTimer.textContent = "Essa rotina não possui exercícios.";
    return false;
  }

  pararIntervaloTimer();

  rotinaEmExecucao = rotina.itens.map((item) => ({ ...item }));
  nomeRotinaEmExecucao = rotina.nome;
  indiceExercicioAtual = 0;
  tempoRestanteMs = rotinaEmExecucao[0].duracao * 1000;
  sessaoIniciadaEm = null;
  cronometroAtivo = false;

  botaoIniciarTimer.disabled = false;
  botaoPausarTimer.disabled = true;
  botaoProximoTimer.disabled = false;
  botaoFinalizarTimer.disabled = false;

  mensagemTimer.textContent = `Rotina "${rotina.nome}" carregada. Pronto para começar!`;
  atualizarTelaTimer();

  return true;
}

function pararIntervaloTimer() {
  if (intervaloCronometro !== null) {
    clearInterval(intervaloCronometro);
    intervaloCronometro = null;
  }
}

function iniciarContagemTimer() {
  if (rotinaEmExecucao.length === 0) {
    if (!carregarRotinaTimer()) return;
  }

  if (cronometroAtivo) return;

  const exercicio = rotinaEmExecucao[indiceExercicioAtual];

  if (tempoRestanteMs <= 0) {
    tempoRestanteMs = exercicio.duracao * 1000;
  }

  if (sessaoIniciadaEm === null) {
    sessaoIniciadaEm = new Date().toISOString();
  }

  cronometroAtivo = true;
  prazoFinalMs = Date.now() + tempoRestanteMs;

  botaoIniciarTimer.disabled = true;
  botaoPausarTimer.disabled = false;
  botaoProximoTimer.disabled = false;
  botaoFinalizarTimer.disabled = false;

  mensagemTimer.textContent = "Aquecimento em andamento. Boa sessão!";
  atualizarTelaTimer();

  intervaloCronometro = setInterval(() => {
    tempoRestanteMs = Math.max(0, prazoFinalMs - Date.now());
    displayTimer.textContent = formatarDisplayTimer(tempoRestanteMs);

    if (tempoRestanteMs <= 0) {
      pararIntervaloTimer();
      cronometroAtivo = false;
      avancarExercicioTimer(true);
    }
  }, 200);
}

function pausarContagemTimer() {
  if (!cronometroAtivo) return;

  tempoRestanteMs = Math.max(0, prazoFinalMs - Date.now());
  pararIntervaloTimer();
  cronometroAtivo = false;

  botaoIniciarTimer.disabled = false;
  botaoPausarTimer.disabled = true;

  mensagemTimer.textContent = "Cronômetro pausado. Você pode retomar quando quiser.";
  atualizarTelaTimer();
}

function avancarExercicioTimer(tempoConcluido = false) {
  pararIntervaloTimer();
  cronometroAtivo = false;

  if (indiceExercicioAtual >= rotinaEmExecucao.length - 1) {
    concluirRotinaTimer();
    return;
  }

  indiceExercicioAtual += 1;
  tempoRestanteMs = rotinaEmExecucao[indiceExercicioAtual].duracao * 1000;

  botaoIniciarTimer.disabled = false;
  botaoPausarTimer.disabled = true;
  botaoProximoTimer.disabled = false;
  botaoFinalizarTimer.disabled = false;

  mensagemTimer.textContent = tempoConcluido
    ? "Tempo concluído! Próximo exercício."
    : "Você avançou para o próximo exercício.";

  atualizarTelaTimer();
}

function concluirRotinaTimer() {
  pararIntervaloTimer();
  cronometroAtivo = false;

  const sessoes = Storage.obter(CHAVE_SESSOES, []);
  const duracaoTotal = rotinaEmExecucao.reduce(
    (total, item) => total + item.duracao,
    0
  );

  const sessao = {
    id: Date.now(),
    rotina: nomeRotinaEmExecucao,
    data: new Date().toISOString(),
    inicio: sessaoIniciadaEm,
    duracao: duracaoTotal,
    quantidadeExercicios: rotinaEmExecucao.length,
    status: "concluida"
  };

  const sessoesAtualizadas = [...sessoes, sessao];

  if (Storage.salvar(CHAVE_SESSOES, sessoesAtualizadas)) {
    const contadorSessoes = document.querySelector("#total-sessoes");
    if (contadorSessoes) {
      contadorSessoes.textContent = String(sessoesAtualizadas.length);
    }
    mensagemTimer.textContent =
      `Parabéns! Você concluiu a rotina "${nomeRotinaEmExecucao}". Sessão registrada.`;
  } else {
    mensagemTimer.textContent =
      "Rotina concluída, mas não foi possível salvar a sessão.";
  }

  rotinaEmExecucao = [];
  tempoRestanteMs = 0;
  indiceExercicioAtual = 0;
  sessaoIniciadaEm = null;

  botaoIniciarTimer.disabled = false;
  botaoPausarTimer.disabled = true;
  botaoProximoTimer.disabled = true;
  botaoFinalizarTimer.disabled = true;

  progressoTimer.textContent = "ROTINA CONCLUÍDA";
  nomeExercicioTimer.textContent = "Aquecimento finalizado!";
  categoriaExercicioTimer.textContent = "Excelente trabalho no tatame.";
  displayTimer.textContent = "00:00";
  proximoTimer.textContent = "Próximo: escolha outra rotina.";
  botaoIniciarTimer.textContent = "Iniciar";
}

function encerrarRotinaTimer() {
  if (rotinaEmExecucao.length === 0) return;

  const confirmou = confirm(
    "Deseja encerrar esta rotina agora? A sessão não será registrada como concluída."
  );

  if (!confirmou) return;

  pararIntervaloTimer();
  cronometroAtivo = false;
  rotinaEmExecucao = [];
  tempoRestanteMs = 0;
  indiceExercicioAtual = 0;
  sessaoIniciadaEm = null;

  botaoIniciarTimer.disabled = false;
  botaoPausarTimer.disabled = true;
  botaoProximoTimer.disabled = true;
  botaoFinalizarTimer.disabled = true;

  mensagemTimer.textContent = "Rotina encerrada. Selecione outra quando quiser.";
  atualizarTelaTimer();
}

seletorRotinaTimer.addEventListener("change", () => {
  if (cronometroAtivo) {
    mensagemTimer.textContent = "Pause ou encerre a rotina antes de trocar.";
    return;
  }

  rotinaEmExecucao = [];
  tempoRestanteMs = 0;
  indiceExercicioAtual = 0;

  botaoIniciarTimer.disabled = false;
  botaoPausarTimer.disabled = true;
  botaoProximoTimer.disabled = true;
  botaoFinalizarTimer.disabled = true;

  carregarRotinaTimer();
});

botaoIniciarTimer.addEventListener("click", iniciarContagemTimer);
botaoPausarTimer.addEventListener("click", pausarContagemTimer);
botaoProximoTimer.addEventListener("click", () => avancarExercicioTimer(false));
botaoFinalizarTimer.addEventListener("click", encerrarRotinaTimer);

atualizarTelaTimer();
