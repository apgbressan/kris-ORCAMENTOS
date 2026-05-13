const secoes = [
  {
    titulo: "Implantes",
    itens: [
      ["GESTRINONA 25 mg", 336],
      ["GESTRINONA 35 mg", 381],
      ["GESTRINONA 40 mg", 448],
      ["GESTRINONA 50 mg", 538],
      ["TESTOSTERONA 50 mg", 123],
      ["TESTOSTERONA 75 mg", 168],
      ["ESTRADIOL 10 mg", 179],
      ["NADH 200 mg", 291],
      ["RESVERATROL 100 mg", 242],
      ["TADALAFILA 50 mg", 269],
      ["ESTRIOL 75 mg", 224],
      ["OXANDROLONA 25 mg", 258],
      ["METFORMINA 50 mg", 143],
      ["OCITOCINA 50 mg", 380],
    ]
  },

  {
    titulo: "Tratamento de injetáveis",
    itens: [
      ["Complexo B com B12", 130],
      ["Vitamina D 300 mil UI", 200],
      ["Vitamina D 600 mil UI", 280],
      ["Soro para reposição de vitaminas", 900],
    ]
  }
];

const container = document.getElementById("procedimentos");
const selecionadosDiv = document.getElementById("selecionados");

let selecionados = [];

secoes.forEach(secao => {

  const details = document.createElement("details");
  details.open = false;

  const summary = document.createElement("summary");
  summary.textContent = secao.titulo;

  details.appendChild(summary);

  secao.itens.forEach(item => {

const linha = document.createElement("div");
linha.classList.add("linha-item");
const checkbox = document.createElement("input");

checkbox.type = "checkbox";

checkbox.dataset.nome = item[0];
checkbox.dataset.valor = item[1];

const quantidade = document.createElement("select");

[1, 2, 3].forEach(num => {

  const option = document.createElement("option");

  option.value = num;
  option.textContent = num + "x";

  quantidade.appendChild(option);

});

checkbox.addEventListener("change", () => {

  const marcados =
    details.querySelectorAll("input:checked").length;

  details.open = marcados > 0;

  atualizarSelecionados();

});

quantidade.addEventListener(
  "change",
  atualizarSelecionados
);

const texto = document.createElement("span");

texto.textContent =
  ` ${item[0]} — R$ ${item[1].toLocaleString("pt-BR")}`;

linha.appendChild(checkbox);

linha.appendChild(quantidade);

linha.appendChild(texto);

details.appendChild(linha);
 });

  container.appendChild(details);

});

function atualizarSelecionados() {

  selecionados = [];

  document
    .querySelectorAll("#procedimentos input:checked")
    .forEach(i => {

const qtd =
  Number(
    i.parentElement.querySelector("select").value
  );

selecionados.push({
  nome: i.dataset.nome,
  valor: Number(i.dataset.valor),
  quantidade: qtd
});

    });

  renderResumo();

}

function renderResumo() {

  let total = 0;

  selecionadosDiv.innerHTML = "";

  selecionados.forEach(item => {

total += item.valor * item.quantidade;
    
    const linha = document.createElement("div");

    linha.textContent =
      `${item.quantidade}x ${item.nome} — ${(item.valor * item.quantidade).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      })}`;

    selecionadosDiv.appendChild(linha);

  });

  // SOMA TAXAS

  const taxa2000 =
    document.getElementById("taxa2000");

  const taxa3000 =
    document.getElementById("taxa3000");

  if (taxa2000.checked) {

    total += 2000;

  }

  if (taxa3000.checked) {

    total += 3000;

  }

  let avista = total * 0.97;

  let parcelamentoTexto = "Somente à vista";

  if (total >= 2000) {

    parcelamentoTexto =
      "6x de " +
      (total / 6).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      });

  } else if (total > 950) {

    parcelamentoTexto =
      "3x de " +
      (total / 3).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      });

  }

  document.getElementById("total").textContent =
    total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });

  document.getElementById("avista").textContent =
    avista.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });

  document.getElementById("parcelado").textContent =
    parcelamentoTexto;

}

document
  .getElementById("taxa2000")
  .addEventListener("change", renderResumo);

document
  .getElementById("taxa3000")
  .addEventListener("change", renderResumo);

document.getElementById("btnApresentacao").onclick = () => {

  document.body.classList.toggle("apresentacao");

};

document.getElementById("btnPDF").onclick = () => {

  document.body.classList.add("apresentacao");
  document.body.classList.add("pdf");

  const element =
    document.getElementById("conteudo");

  const opt = {
    margin: 10,
    filename: "orcamento.pdf",
    image: {
      type: "jpeg",
      quality: 1
    },
    html2canvas: {
      scale: 2,
      scrollY: 0,
      windowHeight: document.body.scrollHeight
    },
    pagebreak: {
      mode: ["css", "legacy"]
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait"
    }
  };

  setTimeout(() => {

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {

        document.body.classList.remove("pdf");
        document.body.classList.remove("apresentacao");

      });

  }, 300);

};

document.body.classList.remove("apresentacao");
document.body.classList.remove("pdf");

renderResumo();
