// ================================
// FUNÇÃO PRINCIPAL
// Chamada quando o usuário clica em CALCULAR
// ================================
async function calcular() {

  // 1. Lê o valor digitado no input pelo id="escala"
  const escala = document.getElementById("escala").value;

  // 2. Valida: se estiver vazio ou for zero, avisa e para
  if (!escala || escala <= 0) {
    alert("Por favor, informe uma escala válida (ex: 650)");
    return;
  }

  // 3. Monta a URL da API com o valor digitado
  const url = `http://localhost:3000/trastes?escala=${escala}`;

  // 4. Pega a div de resultado para mostrar mensagem de carregando
  const resultado = document.getElementById("resultado");
  resultado.innerHTML = "<p style='opacity:0.6; padding:8px'>Calculando...</p>";

  // 5. Faz a requisição para a API Clojure
  //    "fetch" = buscar dados de uma URL
  //    "await" = espera a resposta antes de continuar
  try {
    const resposta = await fetch(url);

    // 6. Converte a resposta de texto JSON para objeto JavaScript
    const dados = await resposta.json();

    // 7. Monta a tabela HTML com os dados recebidos
    resultado.innerHTML = montarTabela(dados);

  } catch (erro) {
    // Se a API não estiver rodando, mostra mensagem de erro
    resultado.innerHTML = `
      <p style='color:#c0392b; padding:8px'>
        Não foi possível conectar à API. <br/>
        Verifique se o servidor está rodando com <strong>clj -M:run</strong>
      </p>`;
  }
}

// ================================
// FUNÇÃO AUXILIAR
// Recebe os dados da API e retorna o HTML da tabela
// ================================
function montarTabela(dados) {
  let html = `
    <h2 style="margin-bottom: 16px">
      Resultados — Escala: ${dados.escala} mm
    </h2>
    <table>
      <thead>
        <tr>
          <th>Traste</th>
          <th>Dist. da Pestana (mm)</th>
          <th>Dist. da Ponte (mm)</th>
        </tr>
      </thead>
      <tbody>
  `;

  // Para cada traste no array, adiciona uma linha na tabela
  // toFixed(2) = arredonda para 2 casas decimais
  for (const t of dados.trastes) {
    html += `
      <tr>
        <td>${t.traste}</td>
        <td>${t["distancia-pestana"].toFixed(2)}</td>
        <td>${t["distancia-ponte"].toFixed(2)}</td>
      </tr>
    `;
  }

  html += `</tbody></table>`;
  return html;
}
