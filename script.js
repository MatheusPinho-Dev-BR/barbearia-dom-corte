/* =========================================================
   SCRIPT DA BARBEARIA - código simples, com var e funções
   ========================================================= */

/* ---------- 1. DADOS DA BARBEARIA (TROQUE AQUI) ---------- */

// Número do WhatsApp com código do Brasil e DDD, só números.
var numeroWhatsApp = "5511912345678";

// Lista de serviços. Para mudar preço, nome ou descrição, edite aqui.
var servicos = [
  {
    nome: "Corte de cabelo",
    descricao: "Corte na tesoura ou máquina, finalizado com pomada.",
    preco: "45,00"
  },
  {
    nome: "Barba",
    descricao: "Toalha quente, navalha e óleo para finalizar.",
    preco: "35,00"
  },
  {
    nome: "Corte + barba",
    descricao: "O combo completo para sair renovado.",
    preco: "70,00"
  },
  {
    nome: "Sobrancelha",
    descricao: "Design com navalha, na medida do seu rosto.",
    preco: "20,00"
  },
  {
    nome: "Pigmentação ou acabamento",
    descricao: "Preenchimento de falhas e contorno do desenho.",
    preco: "40,00"
  }
];

// Horário de funcionamento usado para montar os horários.
// 0 = domingo, 1 = segunda ... 6 = sábado
var horariosFuncionamento = {
  1: { abre: 9, fecha: 19 },
  2: { abre: 9, fecha: 19 },
  3: { abre: 9, fecha: 19 },
  4: { abre: 9, fecha: 19 },
  5: { abre: 9, fecha: 19 },
  6: { abre: 9, fecha: 17 }
  // domingo não aparece aqui, então fica fechado
};

/* ---------- 2. MENU DO CELULAR ---------- */

var botaoMenu = document.getElementById("botaoMenu");
var menuPrincipal = document.getElementById("menuPrincipal");
var iconeMenu = document.getElementById("iconeMenu");

// Abre e fecha o menu quando clica no hambúrguer
botaoMenu.addEventListener("click", function () {
  menuPrincipal.classList.toggle("menu-aberto");

  // Troca o ícone e avisa o leitor de tela
  if (menuPrincipal.classList.contains("menu-aberto")) {
    iconeMenu.className = "fa-solid fa-xmark";
    botaoMenu.setAttribute("aria-expanded", "true");
    botaoMenu.setAttribute("aria-label", "Fechar menu");
  } else {
    iconeMenu.className = "fa-solid fa-bars";
    botaoMenu.setAttribute("aria-expanded", "false");
    botaoMenu.setAttribute("aria-label", "Abrir menu");
  }
});

// Fecha o menu depois de clicar em um link
var linksMenu = menuPrincipal.getElementsByTagName("a");

for (var i = 0; i < linksMenu.length; i++) {
  linksMenu[i].addEventListener("click", function () {
    menuPrincipal.classList.remove("menu-aberto");
    iconeMenu.className = "fa-solid fa-bars";
    botaoMenu.setAttribute("aria-expanded", "false");
  });
}

/* ---------- 3. CARTÕES DE SERVIÇO ---------- */

var listaServicos = document.getElementById("listaServicos");

// Cria um cartão para cada serviço da lista
function montarServicos() {
  var html = "";

  for (var i = 0; i < servicos.length; i++) {
    var servico = servicos[i];

    html += '<article class="cartao-servico">';
    html += '  <h3>' + servico.nome + '</h3>';
    html += '  <p>' + servico.descricao + '</p>';
    html += '  <p class="preco">R$ ' + servico.preco + '</p>';
    html += '  <a href="#agendamento" class="botao botao-contorno">Agendar</a>';
    html += '</article>';
  }

  listaServicos.innerHTML = html;
}

montarServicos();

/* ---------- 4. PREENCHER O SELECT DE SERVIÇOS ---------- */

var selectServico = document.getElementById("servico");

function preencherSelectServicos() {
  var html = '<option value="">Selecione...</option>';

  for (var i = 0; i < servicos.length; i++) {
    html += '<option value="' + servicos[i].nome + '">' + servicos[i].nome + ' - R$ ' + servicos[i].preco + '</option>';
  }

  selectServico.innerHTML = html;
}

preencherSelectServicos();

/* ---------- 5. DATA: BLOQUEAR DATAS PASSADAS ---------- */

var campoData = document.getElementById("data");
var selectHorario = document.getElementById("horario");

// Monta a data de hoje no formato AAAA-MM-DD
function dataDeHoje() {
  var hoje = new Date();
  var ano = hoje.getFullYear();
  var mes = hoje.getMonth() + 1;
  var dia = hoje.getDate();

  if (mes < 10) {
    mes = "0" + mes;
  }
  if (dia < 10) {
    dia = "0" + dia;
  }

  return ano + "-" + mes + "-" + dia;
}

campoData.min = dataDeHoje();

/* ---------- 6. MONTAR OS HORÁRIOS DE MEIA EM MEIA HORA ---------- */

function montarHorarios(dataEscolhida) {
  // Limpa a lista
  selectHorario.innerHTML = "";

  if (dataEscolhida === "") {
    selectHorario.innerHTML = '<option value="">Escolha a data primeiro</option>';
    return;
  }

  // Descobre o dia da semana da data (0 = domingo)
  var partes = dataEscolhida.split("-");
  var data = new Date(partes[0], partes[1] - 1, partes[2]);
  var diaSemana = data.getDay();
  var expediente = horariosFuncionamento[diaSemana];

  // Domingo ou dia sem expediente
  if (!expediente) {
    selectHorario.innerHTML = '<option value="">Fechado neste dia</option>';
    return;
  }

  var html = '<option value="">Selecione...</option>';
  var hora = expediente.abre;

  // Vai de meia em meia hora até o horário de fechar
  while (hora < expediente.fecha) {
    var minutos = 0;

    while (minutos < 60) {
      var valorHora = (hora < 10 ? "0" + hora : hora) + ":" + (minutos === 0 ? "00" : "30");
      var textoHora = valorHora;

      // Se for hoje, esconde horários que já passaram
      if (!horarioJaPassou(dataEscolhida, hora, minutos)) {
        html += '<option value="' + valorHora + '">' + textoHora + '</option>';
      }

      minutos = minutos + 30;
    }

    hora = hora + 1;
  }

  selectHorario.innerHTML = html;
}

// Verifica se o horário já passou (só vale para o dia de hoje)
function horarioJaPassou(dataEscolhida, hora, minutos) {
  if (dataEscolhida !== dataDeHoje()) {
    return false;
  }

  var agora = new Date();
  var horaAgora = agora.getHours();
  var minutoAgora = agora.getMinutes();

  if (hora < horaAgora) {
    return true;
  }
  if (hora === horaAgora && minutos <= minutoAgora) {
    return true;
  }
  return false;
}

// Quando muda a data, monta os horários
campoData.addEventListener("change", function () {
  montarHorarios(campoData.value);
});

/* ---------- 7. VALIDAÇÃO E ENVIO PARA O WHATSAPP ---------- */

var formulario = document.getElementById("formulario");
var campoNome = document.getElementById("nome");
var campoTelefone = document.getElementById("telefone");
var aviso = document.getElementById("aviso");

// Mostra uma mensagem de erro embaixo do campo
function mostrarErro(idErro, mensagem, campo) {
  document.getElementById(idErro).innerText = mensagem;

  if (campo) {
    campo.classList.add("campo-invalido");
  }
}

// Limpa todos os erros
function limparErros() {
  document.getElementById("erroNome").innerText = "";
  document.getElementById("erroTelefone").innerText = "";
  document.getElementById("erroServico").innerText = "";
  document.getElementById("erroData").innerText = "";
  document.getElementById("erroHorario").innerText = "";
  aviso.innerText = "";

  campoNome.classList.remove("campo-invalido");
  campoTelefone.classList.remove("campo-invalido");
  selectServico.classList.remove("campo-invalido");
  campoData.classList.remove("campo-invalido");
  selectHorario.classList.remove("campo-invalido");
}

// Formata a data de AAAA-MM-DD para DD/MM/AAAA
function formatarData(dataEscolhida) {
  var partes = dataEscolhida.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

formulario.addEventListener("submit", function (evento) {
  // Impede o envio normal do formulário
  evento.preventDefault();

  limparErros();

  var temErro = false;

  // Nome
  if (campoNome.value.trim() === "") {
    mostrarErro("erroNome", "Por favor, escreva seu nome.", campoNome);
    temErro = true;
  }

  // Telefone: só conta os números
  var apenasNumeros = campoTelefone.value.replace(/\D/g, "");
  if (campoTelefone.value.trim() === "") {
    mostrarErro("erroTelefone", "Por favor, informe seu telefone.", campoTelefone);
    temErro = true;
  } else if (apenasNumeros.length < 10) {
    mostrarErro("erroTelefone", "Telefone incompleto. Use DDD + número.", campoTelefone);
    temErro = true;
  }

  // Serviço
  if (selectServico.value === "") {
    mostrarErro("erroServico", "Escolha um serviço.", selectServico);
    temErro = true;
  }

  // Data
  if (campoData.value === "") {
    mostrarErro("erroData", "Escolha a data do atendimento.", campoData);
    temErro = true;
  } else if (campoData.value < dataDeHoje()) {
    mostrarErro("erroData", "A data não pode ser no passado.", campoData);
    temErro = true;
  }

  // Horário
  if (selectHorario.value === "") {
    mostrarErro("erroHorario", "Escolha um horário disponível.", selectHorario);
    temErro = true;
  }

  if (temErro) {
    aviso.innerText = "Confira os campos destacados acima.";
    return;
  }

  // Monta a mensagem pronta
  var mensagem = "Olá! Meu nome é " + campoNome.value.trim() +
    " e gostaria de agendar " + selectServico.value +
    " no dia " + formatarData(campoData.value) +
    " às " + selectHorario.value +
    ". Meu telefone é " + campoTelefone.value.trim() + ".";

  // Cria o link do WhatsApp e abre em outra aba
  var link = "https://wa.me/" + numeroWhatsApp + "?text=" + encodeURIComponent(mensagem);
  window.open(link, "_blank");

  aviso.innerText = "Tudo certo! Se o WhatsApp não abrir, verifique o bloqueador de pop-ups.";
});

/* ---------- 8. ANO ATUAL NO RODAPÉ ---------- */

document.getElementById("anoAtual").innerText = new Date().getFullYear();
