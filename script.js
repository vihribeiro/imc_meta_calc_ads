let historicoCalculos = JSON.parse(localStorage.getItem('metacalc_historico') || '[]');
let ultimoCalculo = null;

document.addEventListener('DOMContentLoaded', function () {
    carregarHistorico();
    configurarValidacaoTempoReal();
    configurarFormulario();
});

function configurarFormulario() {
    const form = document.getElementById('userForm');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        calcularTMBIMC();
    });
}

function calcularTMBIMC() {
    const nome = document.getElementById('nome').value.trim();
    const idade = parseInt(document.getElementById('idade').value);
    const peso = parseFloat(document.getElementById('peso').value);
    const altura = parseInt(document.getElementById('altura').value);
    const sexoEl = document.querySelector('input[name="sexo"]:checked');
    const atividade = parseFloat(document.getElementById('atividade').value);
    const formula = document.getElementById('formula').value;

    if (!sexoEl) {
        mostrarToast('Campo obrigatório', 'Selecione o sexo biológico.', 'error');
        return;
    }
    if (!atividade) {
        mostrarToast('Campo obrigatório', 'Selecione o nível de atividade.', 'error');
        return;
    }
    if (!formula) {
        mostrarToast('Campo obrigatório', 'Escolha a fórmula para cálculo da TMB.', 'error');
        return;
    }
    if (!validarDados(idade, peso, altura)) return;

    const sexo = sexoEl.value;
    const alturaM = altura / 100;
    const imc = peso / (alturaM * alturaM);
    const classificacaoIMC = classificarIMC(imc);

    let tmb, formulaUsada;
    if (formula === 'mifflin') {
        tmb = calcularMifflinStJeor(peso, altura, idade, sexo);
        formulaUsada = 'Mifflin-St Jeor';
    } else {
        tmb = calcularHarrisBenedict(peso, altura, idade, sexo);
        formulaUsada = 'Harris-Benedict';
    }

    const gastoTotal = tmb * atividade;
    const perdaPeso = gastoTotal - 500;
    const ganhoPeso = gastoTotal + 500;

    exibirResultados(imc, classificacaoIMC, tmb, formulaUsada, gastoTotal, perdaPeso, ganhoPeso);
    gerarRecomendacoes(imc, classificacaoIMC, gastoTotal, nome);

    ultimoCalculo = {
        nome,
        idade,
        peso,
        altura,
        sexo,
        atividade,
        formula: formulaUsada,
        imc: imc.toFixed(1),
        classificacaoIMC,
        tmb: Math.round(tmb),
        gastoTotal: Math.round(gastoTotal),
        data: new Date().toLocaleDateString('pt-BR'),
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now()
    };

    salvarHistoricoAutomatico();
}

function validarDados(idade, peso, altura) {
    if (isNaN(idade) || idade < 15 || idade > 100) {
        mostrarToast('Dados inválidos', 'A idade deve estar entre 15 e 100 anos.', 'error');
        document.getElementById('idade').classList.add('input-error');
        return false;
    }
    if (isNaN(peso) || peso < 30 || peso > 300) {
        mostrarToast('Dados inválidos', 'O peso deve estar entre 30 e 300 kg.', 'error');
        document.getElementById('peso').classList.add('input-error');
        return false;
    }
    if (isNaN(altura) || altura < 100 || altura > 250) {
        mostrarToast('Dados inválidos', 'A altura deve estar entre 100 e 250 cm.', 'error');
        document.getElementById('altura').classList.add('input-error');
        return false;
    }
    return true;
}

function configurarValidacaoTempoReal() {
    const campos = [
        { id: 'peso', min: 30, max: 300 },
        { id: 'altura', min: 100, max: 250 },
        { id: 'idade', min: 15, max: 100 }
    ];

    campos.forEach(({ id, min, max }) => {
        const el = document.getElementById(id);
        el.addEventListener('input', function () {
            const v = parseFloat(this.value);
            this.classList.remove('input-error', 'input-ok');
            if (this.value && (isNaN(v) || v < min || v > max)) {
                this.classList.add('input-error');
            } else if (this.value) {
                this.classList.add('input-ok');
            }
        });
    });
}

function calcularMifflinStJeor(peso, altura, idade, sexo) {
    const base = 10 * peso + 6.25 * altura - 5 * idade;
    return sexo === 'masculino' ? base + 5 : base - 161;
}

function calcularHarrisBenedict(peso, altura, idade, sexo) {
    if (sexo === 'masculino') {
        return 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * idade);
    } else {
        return 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * idade);
    }
}

function classificarIMC(imc) {
    if (imc < 18.5) return { categoria: 'abaixo', texto: 'Abaixo do peso', range: 'abaixo' };
    if (imc < 25) return { categoria: 'normal', texto: 'Peso normal', range: 'normal' };
    if (imc < 30) return { categoria: 'sobrepeso', texto: 'Sobrepeso', range: 'sobrepeso' };
    if (imc < 35) return { categoria: 'obesidade', texto: 'Obesidade grau I', range: 'obesidade1' };
    if (imc < 40) return { categoria: 'obesidade', texto: 'Obesidade grau II', range: 'obesidade2' };
    return { categoria: 'obesidade', texto: 'Obesidade grau III', range: 'obesidade3' };
}

function exibirResultados(imc, classificacaoIMC, tmb, formulaUsada, gastoTotal, perdaPeso, ganhoPeso) {
    const section = document.getElementById('results-section');
    section.classList.remove('hidden');

    document.getElementById('imc-valor').textContent = imc.toFixed(1);
    const classEl = document.getElementById('imc-classificacao');
    classEl.textContent = classificacaoIMC.texto;
    classEl.className = `classification-badge ${classificacaoIMC.categoria}`;

    document.querySelectorAll('.scale-item').forEach(el => el.classList.remove('active'));
    document.querySelector(`[data-range="${classificacaoIMC.range}"]`)?.classList.add('active');

    document.getElementById('tmb-valor').textContent = Math.round(tmb);
    document.getElementById('formula-usada').textContent = `Fórmula: ${formulaUsada}`;
    document.getElementById('gasto-total').textContent = `${Math.round(gastoTotal)} kcal/dia`;
    document.getElementById('perda-peso').textContent = `${Math.round(perdaPeso)} kcal/dia`;
    document.getElementById('ganho-peso').textContent = `${Math.round(ganhoPeso)} kcal/dia`;

    setTimeout(() => {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function gerarRecomendacoes(imc, classificacaoIMC, gastoTotal, nome) {
    const container = document.getElementById('recomendacoes-content');
    const primeiroNome = nome.split(' ')[0] || 'você';
    const recomendacoes = [];

    switch (classificacaoIMC.categoria) {
        case 'abaixo':
            recomendacoes.push({
                tipo: 'Nutrição',
                icone: 'fas fa-utensils',
                texto: `${primeiroNome}, considere aumentar a ingestão calórica com alimentos nutritivos e densos em energia. Consulte um nutricionista para um plano alimentar personalizado.`
            });
            recomendacoes.push({
                tipo: 'Treinamento',
                icone: 'fas fa-dumbbell',
                texto: 'Foque em exercícios de resistência para ganhar massa muscular de forma saudável, combinados com alimentação adequada.'
            });
            break;

        case 'normal':
            recomendacoes.push({
                tipo: 'Parabéns',
                icone: 'fas fa-check-circle',
                texto: `${primeiroNome}, seu IMC está na faixa ideal segundo a OMS. Continue mantendo seus hábitos saudáveis e faça acompanhamento periódico.`
            });
            recomendacoes.push({
                tipo: 'Atividade Física',
                icone: 'fas fa-running',
                texto: 'Mantenha ao menos 150 minutos de atividade aeróbica moderada por semana, combinando exercícios cardiovasculares e de força.'
            });
            break;

        case 'sobrepeso':
        case 'obesidade':
            recomendacoes.push({
                tipo: 'Déficit Calórico',
                icone: 'fas fa-chart-line',
                texto: `Para perda de peso saudável, mantenha um déficit de 300 a 500 kcal/dia em relação ao seu GCT (${Math.round(gastoTotal)} kcal/dia). Evite restrições severas.`
            });
            recomendacoes.push({
                tipo: 'Exercícios',
                icone: 'fas fa-heart',
                texto: 'Combine exercícios cardiovasculares com treinamento de força. Inicie com atividades de baixo impacto e aumente gradualmente.'
            });
            break;
    }

    recomendacoes.push({
        tipo: 'Hidratação',
        icone: 'fas fa-tint',
        texto: 'Consuma ao menos 35 ml de água por kg de peso corporal por dia. A hidratação adequada é fundamental para o metabolismo.'
    });

    recomendacoes.push({
        tipo: 'Acompanhamento Médico',
        icone: 'fas fa-user-md',
        texto: 'Consulte regularmente um médico ou nutricionista. Estes resultados são orientativos — um profissional de saúde é indispensável para um plano personalizado.'
    });

    container.innerHTML = recomendacoes.map(rec => `
        <div class="recommendation-item">
            <h4><i class="${rec.icone}"></i> ${rec.tipo}</h4>
            <p>${rec.texto}</p>
        </div>
    `).join('');
}

function salvarHistoricoAutomatico() {
    if (!ultimoCalculo) return;

    const badge = document.getElementById('autosave-badge');
    badge.className = 'autosave-badge saving';
    badge.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';

    setTimeout(() => {
        const existe = historicoCalculos.some(c => c.timestamp === ultimoCalculo.timestamp);
        if (!existe) {
            historicoCalculos.unshift(ultimoCalculo);
            if (historicoCalculos.length > 15) {
                historicoCalculos = historicoCalculos.slice(0, 15);
            }
            localStorage.setItem('metacalc_historico', JSON.stringify(historicoCalculos));
        }

        carregarHistorico(true);

        badge.className = 'autosave-badge saved';
        badge.innerHTML = '<i class="fas fa-check-circle"></i> Salvo automaticamente';

        mostrarToast(
            'Consulta salva!',
            `O cálculo de ${ultimoCalculo.nome} foi salvo no histórico.`,
            'success'
        );
    }, 700);
}

function carregarHistorico(marcarNovo = false) {
    const container = document.getElementById('historico-lista');
    const countBadge = document.getElementById('history-count-badge');

    if (historicoCalculos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                Nenhum cálculo realizado ainda. Preencha o formulário acima para começar.
            </div>`;
        countBadge.textContent = '0 registros';
        return;
    }

    const total = historicoCalculos.length;
    countBadge.textContent = `${total} ${total === 1 ? 'registro' : 'registros'}`;

    container.innerHTML = historicoCalculos.map((calculo, index) => {
        const iniciais = calculo.nome
            .split(' ')
            .slice(0, 2)
            .map(n => n[0]?.toUpperCase() || '')
            .join('');

        const isNew = marcarNovo && index === 0;

        return `
        <div class="history-item${isNew ? ' new-entry' : ''}">
            <div class="history-avatar">${iniciais}</div>
            <div class="history-info">
                <div class="history-name">${calculo.nome}</div>
                <div class="history-date">
                    <i class="fas fa-clock"></i>
                    ${calculo.data}${calculo.hora ? ' às ' + calculo.hora : ''}
                    · ${calculo.idade} anos · ${calculo.peso} kg · ${calculo.altura} cm
                </div>
                <div class="history-results">
                    <span class="history-pill">IMC ${calculo.imc}</span>
                    <span class="history-pill">${calculo.classificacaoIMC.texto}</span>
                    <span class="history-pill">TMB ${calculo.tmb} kcal</span>
                    <span class="history-pill">GCT ${calculo.gastoTotal} kcal</span>
                </div>
            </div>
            <div class="history-actions">
                <button onclick="removerDoHistorico(${index})" class="btn-icon" title="Remover este registro">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>`;
    }).join('');
}

function removerDoHistorico(index) {
    const nome = historicoCalculos[index]?.nome || 'este registro';
    if (confirm(`Remover o cálculo de "${nome}" do histórico?`)) {
        historicoCalculos.splice(index, 1);
        localStorage.setItem('metacalc_historico', JSON.stringify(historicoCalculos));
        carregarHistorico();
        mostrarToast('Removido', 'O registro foi excluído do histórico.', 'warning');
    }
}

function limparHistorico() {
    if (historicoCalculos.length === 0) {
        mostrarToast('Histórico vazio', 'Não há registros para remover.', 'warning');
        return;
    }
    if (confirm(`Deseja apagar todos os ${historicoCalculos.length} registros do histórico? Esta ação não pode ser desfeita.`)) {
        historicoCalculos = [];
        localStorage.removeItem('metacalc_historico');
        carregarHistorico();
        mostrarToast('Histórico limpo', 'Todos os registros foram removidos.', 'success');
    }
}

function gerarRelatorio() {
    if (!ultimoCalculo) {
        mostrarToast('Sem dados', 'Realize um cálculo antes de gerar o relatório.', 'error');
        return;
    }

    const c = ultimoCalculo;
    const relatorioHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Relatório Meta Calc — ${c.nome}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; padding: 40px; color: #1a2e1a; }
        .header { text-align: center; margin-bottom: 36px; padding-bottom: 20px; border-bottom: 3px solid #16a34a; }
        .logo { font-size: 1.8rem; font-weight: 800; color: #15803d; margin-bottom: 6px; }
        h2 { color: #166534; font-size: 1rem; font-weight: 400; }
        .section { margin: 24px 0; }
        .section h3 { color: #15803d; font-size: 1rem; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #d1fae5; }
        table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
        th, td { padding: 10px 14px; text-align: left; border: 1px solid #d1fae5; }
        th { background: #f0fdf4; color: #15803d; font-weight: 600; }
        .result-highlight { background: #f0fdf4; border: 2px solid #4ade80; border-radius: 8px; padding: 16px; margin: 8px 0; }
        .result-highlight .val { font-size: 2rem; font-weight: 800; color: #15803d; }
        .result-highlight .label { font-size: 0.8rem; color: #4b6e4b; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .disclaimer { background: #fef9c3; border: 1px solid #fde047; border-radius: 6px; padding: 14px; font-size: 0.82rem; color: #713f12; margin-top: 24px; }
        .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #d1fae5; font-size: 0.75rem; color: #6b9c6b; text-align: center; }
        @media print { body { padding: 20px; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">Meta Calc</div>
        <h2>Relatório de Avaliação Metabólica — TMB & IMC</h2>
        <p style="margin-top:8px;font-size:0.8rem;color:#4b6e4b;">Universidade Presbiteriana Mackenzie · Prática Profissional em ADS</p>
    </div>

    <div class="section">
        <h3>Dados Pessoais</h3>
        <table>
            <tr><th>Nome</th><td>${c.nome}</td><th>Data da Avaliação</th><td>${c.data}${c.hora ? ' às ' + c.hora : ''}</td></tr>
            <tr><th>Idade</th><td>${c.idade} anos</td><th>Sexo</th><td style="text-transform:capitalize">${c.sexo}</td></tr>
            <tr><th>Peso</th><td>${c.peso} kg</td><th>Altura</th><td>${c.altura} cm</td></tr>
        </table>
    </div>

    <div class="section">
        <h3>Resultados</h3>
        <div class="grid">
            <div>
                <div class="result-highlight">
                    <div class="label">Índice de Massa Corporal (IMC)</div>
                    <div class="val">${c.imc} <small style="font-size:1rem;font-weight:400">kg/m²</small></div>
                    <div style="margin-top:6px;font-weight:600;color:#15803d">${c.classificacaoIMC.texto}</div>
                </div>
            </div>
            <div>
                <div class="result-highlight">
                    <div class="label">Taxa Metabólica Basal (TMB) · ${c.formula}</div>
                    <div class="val">${c.tmb} <small style="font-size:1rem;font-weight:400">kcal/dia</small></div>
                    <div style="margin-top:6px;font-weight:600;color:#15803d">GCT: ${c.gastoTotal} kcal/dia</div>
                </div>
            </div>
        </div>
        <table style="margin-top:16px">
            <tr><th>Gasto Calórico Total (GCT)</th><td>${c.gastoTotal} kcal/dia</td></tr>
            <tr><th>Para perder 0.5 kg/semana</th><td>${c.gastoTotal - 500} kcal/dia</td></tr>
            <tr><th>Para ganhar 0.5 kg/semana</th><td>${c.gastoTotal + 500} kcal/dia</td></tr>
            <tr><th>Fórmula utilizada</th><td>${c.formula}</td></tr>
        </table>
    </div>

    <div class="section">
        <h3>Tabela IMC — OMS</h3>
        <table>
            <tr><th>Faixa</th><th>Classificação</th></tr>
            <tr ${c.imc < 18.5 ? 'style="background:#dbeafe"' : ''}><td>&lt; 18.5</td><td>Abaixo do peso</td></tr>
            <tr ${c.imc >= 18.5 && c.imc < 25 ? 'style="background:#dcfce7"' : ''}><td>18.5 – 24.9</td><td>Peso normal</td></tr>
            <tr ${c.imc >= 25 && c.imc < 30 ? 'style="background:#fef9c3"' : ''}><td>25.0 – 29.9</td><td>Sobrepeso</td></tr>
            <tr ${c.imc >= 30 && c.imc < 35 ? 'style="background:#fee2e2"' : ''}><td>30.0 – 34.9</td><td>Obesidade grau I</td></tr>
            <tr ${c.imc >= 35 && c.imc < 40 ? 'style="background:#fee2e2"' : ''}><td>35.0 – 39.9</td><td>Obesidade grau II</td></tr>
            <tr ${c.imc >= 40 ? 'style="background:#fee2e2"' : ''}><td>&ge; 40.0</td><td>Obesidade grau III</td></tr>
        </table>
    </div>

    <div class="disclaimer">
        <strong>Aviso:</strong> Este relatório é gerado automaticamente e tem caráter <strong>orientativo</strong>.
        Os valores de IMC e TMB são estimativas baseadas em fórmulas matemáticas. Consulte sempre um médico ou nutricionista
        para avaliação clínica individualizada.
    </div>

    <div class="footer">
        <p>Gerado automaticamente por <strong>Meta Calc</strong> em ${c.data}${c.hora ? ' às ' + c.hora : ''}</p>
        <p>Desenvolvido por: Vinicius Santos Ribeiro · Anny Violeta Rodrigues Freire · Guilherme Henrique Ferraz Contrera · Matheus Neves Cavalcante</p>
        <p>Universidade Presbiteriana Mackenzie · Prática Profissional em ADS · © 2026</p>
    </div>
</body>
</html>`;

    const win = window.open('', '_blank');
    if (!win) {
        mostrarToast('Erro', 'Permita pop-ups para gerar o relatório.', 'error');
        return;
    }
    win.document.write(relatorioHTML);
    win.document.close();
    setTimeout(() => win.print(), 900);
}

function compartilharWhatsApp() {
    if (!ultimoCalculo) {
        mostrarToast('Sem dados', 'Realize um cálculo antes de compartilhar.', 'error');
        return;
    }

    const c = ultimoCalculo;
    const mensagem = `
*Meta Calc — Avaliação Metabólica*

*Dados:*
- Nome: ${c.nome}
- Idade: ${c.idade} anos | Peso: ${c.peso} kg | Altura: ${c.altura} cm
- Sexo: ${c.sexo}

*Resultados:*
- IMC: *${c.imc} kg/m²* — ${c.classificacaoIMC.texto}
- TMB: *${c.tmb} kcal/dia* (${c.formula})
- Gasto Calórico Total: *${c.gastoTotal} kcal/dia*
- Para perder 0.5 kg/sem: ${c.gastoTotal - 500} kcal/dia
- Para ganhar 0.5 kg/sem: ${c.gastoTotal + 500} kcal/dia

Data: ${c.data}${c.hora ? ' às ' + c.hora : ''}
Calculado em: Meta Calc — Calculadora Metabólica
`.trim();

    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

function novoCalculo() {
    document.getElementById('userForm').reset();

    document.querySelectorAll('.input-error, .input-ok').forEach(el => {
        el.classList.remove('input-error', 'input-ok');
    });

    document.getElementById('results-section').classList.add('hidden');
    ultimoCalculo = null;

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => document.getElementById('nome').focus(), 400);
}

function mostrarToast(titulo, mensagem, tipo = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle'
    };

    const toast = document.createElement('div');
    toast.className = `toast${tipo !== 'success' ? ' toast-' + tipo : ''}`;
    toast.innerHTML = `
        <i class="toast-icon ${icons[tipo] || icons.success}"></i>
        <div class="toast-text">
            <div class="toast-title">${titulo}</div>
            ${mensagem ? `<div class="toast-message">${mensagem}</div>` : ''}
        </div>
    `;

    container.appendChild(toast);

    const duration = tipo === 'error' ? 5000 : 3500;
    setTimeout(() => {
        toast.classList.add('toast-leaving');
        setTimeout(() => toast.remove(), 320);
    }, duration);
}

document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        const form = document.getElementById('userForm');
        if (form.checkValidity()) calcularTMBIMC();
        else form.reportValidity();
    }
    if (e.key === 'Escape') {
        const results = document.getElementById('results-section');
        if (!results.classList.contains('hidden')) novoCalculo();
    }
});