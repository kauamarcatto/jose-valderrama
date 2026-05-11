const API_BASE = 'http://localhost:3000';

async function calcular() {
  const escala    = document.getElementById('escala').value;
  const numTrastes = document.getElementById('num-trastes').value;
  const resultado = document.getElementById('resultado');

  if (!escala || escala <= 0) {
    alert('Por favor, informe uma escala válida (ex: 650)');
    return;
  }

  resultado.innerHTML = '<p class="carregando">Calculando...</p>';

  const url = `${API_BASE}/trastes?escala=${escala}&num-trastes=${numTrastes}`;

  try {
    const resposta = await fetch(url);
    const dados    = await resposta.json();
    resultado.innerHTML = montarTabela(dados);
  } catch {
    resultado.innerHTML = `
      <div class="erro">
        Não foi possível conectar à API.<br/>
        Verifique se o servidor está rodando com <strong>clj -M:run</strong>
      </div>`;
  }
}

function montarTabela(dados) {
  let html = `
    <div class="resultado-header">
      <h2>Resultados</h2>
      <p>Escala: <strong>${dados.escala} mm</strong> &nbsp;·&nbsp; ${dados['num-trastes']} trastes</p>
    </div>
    <div class="resultado-container">
      <table>
        <thead>
          <tr>
            <th>Traste</th>
            <th>Dist. da Pestana (mm)</th>
            <th>Dist. da Ponte (mm)</th>
            <th>Espaço entre Trastes (mm)</th>
          </tr>
        </thead>
        <tbody>
  `;

  let distanciaAnterior = 0;

  for (const t of dados.trastes) {
    const distPestana = t['distancia-pestana'];
    const distPonte   = t['distancia-ponte'];
    const espaco      = distPestana - distanciaAnterior;
    const isOitava    = t.traste === 12;

    html += `
      <tr class="${isOitava ? 'traste-oitava' : ''}">
        <td>${t.traste}</td>
        <td>${distPestana.toFixed(2)}</td>
        <td>${distPonte.toFixed(2)}</td>
        <td>${espaco.toFixed(2)}</td>
      </tr>
    `;

    distanciaAnterior = distPestana;
  }

  html += `</tbody></table></div>`;
  return html;
}
