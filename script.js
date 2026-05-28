let umidade = 50; 
let irrigadorAtivo = false;

const txtUmidade = document.getElementById('txtUmidade');
const txtStatusSolo = document.getElementById('txtStatusSolo');
const barraProgresso = document.getElementById('barraUmidadeProgresso');
const btnIrrigar = document.getElementById('btnIrrigar');
const statusIrrigador = document.getElementById('statusIrrigador');

const selectSolo = document.getElementById('tipoSolo');
const selectClima = document.getElementById('clima');
const selectModo = document.getElementById('modoOperacao');

function obterFatores() {
    let perdaPorClima = 0.5; 
    let ganhoPorIrrigacao = 3.0;

    const clima = selectClima.value;
    if (clima === 'sol') perdaPorClima = 1.2;
    if (clima === 'chuva') perdaPorClima = -2.0; // Chuva molha o solo sozinha

    const solo = selectSolo.value;
    if (solo === 'arenoso') {
        perdaPorClima *= 1.4;
        ganhoPorIrrigacao *= 1.2;
    } else if (solo === 'argiloso') {
        perdaPorClima *= 0.6;
        ganhoPorIrrigacao *= 0.7;
    }
    return { perdaPorClima, ganhoPorIrrigacao };
}

function atualizarInterface() {
    umidade = Math.max(0, Math.min(100, umidade));
    txtUmidade.innerText = `${Math.round(umidade)}%`;
    barraProgresso.style.width = `${umidade}%`;

    txtStatusSolo.className = 'status-tag '; 
    
    if (umidade < 50) {
        txtStatusSolo.innerText = 'Crítico / Seco';
        txtStatusSolo.classList.add('seco');
        barraProgresso.style.backgroundColor = '#e74c3c';
    } else if (umidade >= 50 && umidade <= 80) {
        txtStatusSolo.innerText = 'Ideal';
        txtStatusSolo.classList.add('ideal');
        barraProgresso.style.backgroundColor = '#2ecc71';
    } else {
        txtStatusSolo.innerText = 'Encharcado';
        txtStatusSolo.classList.add('encharcado');
        barraProgresso.style.backgroundColor = '#2980b9';
    }

    // Lógica do Modo Automático (Simulação de Sensor IoT)
    if (selectModo.value === 'automatico') {
        btnIrrigar.disabled = true;
        if (umidade < 52 && !irrigadorAtivo) {
            ligarIrrigador();
            statusIrrigador.innerText = 'Automação IoT: Ligando sistema por umidade baixa!';
        } else if (umidade > 78 && irrigadorAtivo) {
            desligarIrrigador();
            statusIrrigador.innerText = 'Automação IoT: Meta atingida. Desligando!';
        }
    } else {
        btnIrrigar.disabled = false;
    }
}

function ligarIrrigador() {
    irrigadorAtivo = true;
    btnIrrigar.innerText = '🛑 Desativar Irrigadores';
    btnIrrigar.style.backgroundColor = '#e74c3c';
    statusIrrigador.innerText = 'Irrigadores gotejando água no solo...';
    statusIrrigador.classList.add('ativo');
}

function desligarIrrigador() {
    irrigadorAtivo = false;
    btnIrrigar.innerText = '💧 Ativar Irrigadores';
    btnIrrigar.style.backgroundColor = '#3498db';
    statusIrrigador.innerText = 'Irrigadores desligados';
    statusIrrigador.classList.remove('ativo');
}

btnIrrigar.addEventListener('click', () => {
    if (!irrigadorAtivo) ligarIrrigador();
    else desligarIrrigador();
});

selectModo.addEventListener('change', () => {
    if (selectModo.value === 'manual') desligarIrrigador();
});

// Executa a física do simulador a cada 1 segundo
setInterval(() => {
    const fatores = obterFatores();
    umidade -= fatores.perdaPorClima;
    if (irrigadorAtivo) umidade += fatores.ganhoPorIrrigacao;
    atualizarInterface();
}, 1000);

atualizarInterface();
