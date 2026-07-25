// ======================================
// PLANNER FINANCEIRO
// SCRIPT.JS
// PARTE 1/3
// ======================================

const CHAVE_METAS = "planner_metas_v1";

const CHAVE_TEMA = "planner_tema_v1";

const CHAVE_PERIODO = "planner_periodo_v1";

let metas = [];

let metaSelecionada = null;

let modoEdicao = false;

let idEditando = null;

let periodoAtivo = "dia";

let modoTodasMetas = false;

let ultimoCalculoPeriodo = {

    dia:0,

    semana:0,

    mes:0

};

// ===============================
// ELEMENTOS
// ===============================

const btnNovaMeta =
document.getElementById("btnNovaMeta");

const btnTema =
document.getElementById("btnTema");

const btnFechar =
document.getElementById("btnFechar");

const btnSalvar =
document.getElementById("btnSalvar");

const modal =
document.getElementById("modal");

const tituloModal =
document.getElementById("tituloModal");

const nomeMeta =
document.getElementById("nomeMeta");

const valorMeta =
document.getElementById("valorMeta");

const valorAtual =
document.getElementById("valorAtual");

const dataFinal =
document.getElementById("dataFinal");

const selecionarMeta =
document.getElementById("selecionarMeta");

const listaMetas =
document.getElementById("listaMetas");

// Dashboard

const totalMetas =
document.getElementById("totalMetas");

const totalGuardado =
document.getElementById("totalGuardado");

const totalFalta =
document.getElementById("totalFalta");

const totalQuantidade =
document.getElementById("totalQuantidade");

// Meta selecionada

const nomeMetaSelecionada =
document.getElementById(
"nomeMetaSelecionada"
);

const valorMetaSelecionada =
document.getElementById(
"valorMetaSelecionada"
);

const valorAtualSelecionada =
document.getElementById(
"valorAtualSelecionada"
);

const faltaSelecionada =
document.getElementById(
"faltaSelecionada"
);

const diasSelecionada =
document.getElementById(
"diasSelecionada"
);

const progressoSelecionada =
document.getElementById(
"progressoSelecionada"
);

const tituloPeriodo =
document.getElementById(
"tituloPeriodo"
);

const valorPeriodo =
document.getElementById(
"valorPeriodo"
);

const btnPeriodoDia =
document.getElementById(
"btnPeriodoDia"
);

const btnPeriodoSemana =
document.getElementById(
"btnPeriodoSemana"
);

const btnPeriodoMes =
document.getElementById(
"btnPeriodoMes"
);

const percentualSelecionado =
document.getElementById(
"percentualSelecionado"
);

const dataAtual =
document.getElementById(
"dataAtual"
);

const dataVencimento =
document.getElementById(
"dataVencimento"
);

const analiseMeta =
document.getElementById(
"analiseMeta"
);

// ===============================
// INICIALIZAÇÃO
// ===============================

window.addEventListener(
"DOMContentLoaded",
()=>{

    carregarMetas();

    carregarTema();

    carregarPeriodo();

    preencherSelectMetas();

    renderizarListaMetas();

    atualizarDashboard();

    atualizarGraficos();

});

// ===============================
// LOCAL STORAGE
// ===============================

function salvarMetas(){

    localStorage.setItem(

        CHAVE_METAS,

        JSON.stringify(metas)

    );

}

function carregarMetas(){

    const dados =
    localStorage.getItem(
        CHAVE_METAS
    );

    if(dados){

        metas =
        JSON.parse(dados);

    }

}

// ===============================
// ABRIR NOVA META
// ===============================

btnNovaMeta.addEventListener(
"click",
()=>{

    modoEdicao=false;

    idEditando=null;

    tituloModal.textContent =
    "Nova Meta";

    btnSalvar.textContent =
    "Salvar Meta";

    limparFormulario();

    modal.classList.remove(
        "oculto"
    );

});

// ===============================
// FECHAR MODAL
// ===============================

btnFechar.addEventListener(
"click",
()=>{

    modal.classList.add(
        "oculto"
    );

});

modal.addEventListener(
"click",
(evento)=>{

    if(evento.target===modal){

        modal.classList.add(
            "oculto"
        );

    }

});

// ===============================
// SALVAR META
// ===============================

btnSalvar.addEventListener(
"click",
()=>{

    const nome =
    nomeMeta.value.trim();

    const valor =
    Number(valorMeta.value);

    const atual =
    Number(valorAtual.value);

    const data =
    dataFinal.value;

    if(nome===""){

        alert(
        "Informe o nome da meta"
        );

        return;

    }

    if(valor<=0){

        alert(
        "Informe um valor válido"
        );

        return;

    }

    if(data===""){

        alert(
        "Informe uma data"
        );

        return;

    }

    // EDITAR

    let idSalvo;

    if(modoEdicao){

        const meta =
        metas.find(
            m=>m.id===idEditando
        );

        meta.nome = nome;

        meta.valorMeta = valor;

        meta.valorAtual = atual;

        meta.dataFinal = data;

        idSalvo = idEditando;

    }

    // NOVA META

    else{

        const novaMeta = {

            id:Date.now(),

            nome:nome,

            valorMeta:valor,

            valorAtual:atual,

            dataFinal:data,

            historico:[]

        };

        metas.push(novaMeta);

        idSalvo = novaMeta.id;

    }

    salvarMetas();

    preencherSelectMetas();

    renderizarListaMetas();

    atualizarDashboard();

    // seleciona automaticamente a meta recém criada/editada,
    // assim o botão "Movimentar valor" já funciona de primeira
    selecionarMeta.value = idSalvo;

    metaSelecionada =
    metas.find(
        meta=>meta.id===idSalvo
    );

    mostrarMetaSelecionada();

    mostrarHistorico();

    atualizarGraficos();

    modal.classList.add(
        "oculto"
    );

    limparFormulario();

});

function limparFormulario(){

    nomeMeta.value="";

    valorMeta.value="";

    valorAtual.value="0";

    dataFinal.value="";

}

// ======================================
// SCRIPT.JS
// PARTE 2/3
// META SELECIONADA + APORTES
// ======================================

// ===============================
// PREENCHER SELECT
// ===============================

function preencherSelectMetas(){

    selecionarMeta.innerHTML = `

    <option value="">
        Todas as metas
    </option>

    `;

    metas.forEach(meta=>{

        selecionarMeta.innerHTML += `

        <option value="${meta.id}">
            ${meta.nome}
        </option>

        `;

    });

}

// ===============================
// ALTERAR META SELECIONADA
// ===============================

selecionarMeta.addEventListener(
"change",
()=>{

    const id =
    Number(
        selecionarMeta.value
    );

    if(!id){

        metaSelecionada=null;

        if(metas.length===0){

            modoTodasMetas=false;

            secaoTabelaMetas.classList.add(
                "oculto"
            );

            limparMetaSelecionada();

        }
        else{

            modoTodasMetas=true;

            mostrarTodasAsMetas();

        }

        mostrarHistorico();

        atualizarGraficos();

        return;

    }

    modoTodasMetas=false;

    secaoTabelaMetas.classList.add(
        "oculto"
    );

    metaSelecionada =
    metas.find(
        meta=>meta.id===id
    );

    mostrarMetaSelecionada();

    mostrarHistorico();

    atualizarGraficos();

});

// ===============================
// MOSTRAR META
// ===============================

function mostrarMetaSelecionada(){

    if(!metaSelecionada){

        return;

    }

    modoTodasMetas=false;

    secaoTabelaMetas.classList.add(
        "oculto"
    );

    const progresso =
    calcularProgresso(
        metaSelecionada
    );

    const falta =
    calcularFalta(
        metaSelecionada
    );

    const dias =
    calcularDias(
        metaSelecionada.dataFinal
    );

    const dia =
    calcularValorDia(
        falta,
        dias
    );

    nomeMetaSelecionada.textContent =
    "🎯 " + metaSelecionada.nome;

    valorMetaSelecionada.textContent =
    moeda(
        metaSelecionada.valorMeta
    );

    valorAtualSelecionada.textContent =
    moeda(
        metaSelecionada.valorAtual
    );

    faltaSelecionada.textContent =
    moeda(
        falta
    );

    diasSelecionada.textContent =
    dias + " dias";

    ultimoCalculoPeriodo = {

        dia:dia,

        semana:dia*7,

        mes:dia*30

    };

    renderizarValorPeriodo();

    percentualSelecionado.textContent =
    progresso.toFixed(1)
    +
    "%";

    progressoSelecionada.style.width =
    progresso
    +
    "%";

    dataAtual.textContent =
    formatarDataAtual();

    dataVencimento.textContent =
    formatarData(
        metaSelecionada.dataFinal
    );

    aplicarAnalise(
        progresso,
        dias,
        dia
    );

}

function renderizarValorPeriodo(){

    const rotulos = {

        dia:{ titulo:"💰 Guardar por dia", sufixo:" / dia" },

        semana:{ titulo:"💰 Guardar por semana", sufixo:" / semana" },

        mes:{ titulo:"💰 Guardar por mês", sufixo:" / mês" }

    };

    const info = rotulos[periodoAtivo];

    tituloPeriodo.textContent =
    info.titulo;

    valorPeriodo.textContent =
    moeda(
        ultimoCalculoPeriodo[periodoAtivo]
    )
    +
    info.sufixo;

}

function selecionarPeriodo(periodo){

    periodoAtivo = periodo;

    localStorage.setItem(
        CHAVE_PERIODO,
        periodo
    );

    btnPeriodoDia.classList.toggle(
        "ativo",
        periodo==="dia"
    );

    btnPeriodoSemana.classList.toggle(
        "ativo",
        periodo==="semana"
    );

    btnPeriodoMes.classList.toggle(
        "ativo",
        periodo==="mes"
    );

    renderizarValorPeriodo();

}

function carregarPeriodo(){

    const salvo =
    localStorage.getItem(
        CHAVE_PERIODO
    );

    if(
    salvo==="dia" ||
    salvo==="semana" ||
    salvo==="mes"
    ){

        periodoAtivo = salvo;

    }

    selecionarPeriodo(periodoAtivo);

}

btnPeriodoDia.addEventListener(
"click",
()=>selecionarPeriodo("dia")
);

btnPeriodoSemana.addEventListener(
"click",
()=>selecionarPeriodo("semana")
);

btnPeriodoMes.addEventListener(
"click",
()=>selecionarPeriodo("mes")
);

function aplicarAnalise(progresso, dias, valorDia){

    analiseMeta.classList.remove(
        "analise-ok",
        "analise-atencao",
        "analise-risco"
    );

    let texto = "";
    let classe = "analise-ok";

    if(progresso>=100){

        texto = "🎉 Meta concluída! Parabéns.";
        classe = "analise-ok";

    }
    else if(dias<=0){

        texto = "⚠️ Meta vencida. Ajuste a data ou guarde o valor restante o quanto antes.";
        classe = "analise-risco";

    }
    else if(dias<=7){

        texto = "🔥 Reta final! Faltam " + dias + " dias — guarde " + moeda(valorDia) + " por dia.";
        classe = "analise-atencao";

    }
    else{

        texto = "✅ Você está no caminho certo. Guarde " + moeda(valorDia) + " por dia para chegar lá.";
        classe = "analise-ok";

    }

    analiseMeta.textContent = texto;
    analiseMeta.classList.add(classe);

}

function limparMetaSelecionada(){

    nomeMetaSelecionada.textContent =
    "Nenhuma meta selecionada";

    valorMetaSelecionada.textContent =
    "R$ 0,00";

    valorAtualSelecionada.textContent =
    "R$ 0,00";

    faltaSelecionada.textContent =
    "R$ 0,00";

    diasSelecionada.textContent =
    "0";

    ultimoCalculoPeriodo = {

        dia:0,

        semana:0,

        mes:0

    };

    renderizarValorPeriodo();

    percentualSelecionado.textContent =
    "0%";

    progressoSelecionada.style.width =
    "0%";

    dataAtual.textContent =
    formatarDataAtual();

    dataVencimento.textContent =
    "--";

    analiseMeta.textContent =
    "";

    analiseMeta.classList.remove(
        "analise-ok",
        "analise-atencao",
        "analise-risco"
    );

}

// ===============================
// TODAS AS METAS (VISÃO AGREGADA)
// ===============================

function mostrarTodasAsMetas(){

    secaoTabelaMetas.classList.remove(
        "oculto"
    );

    const abertas =
    metas.filter(
        m=>calcularProgresso(m)<100
    );

    nomeMetaSelecionada.textContent =
    "📊 Todas as metas";

    const totalMeta =
    metas.reduce(
        (s,m)=>s+m.valorMeta,
        0
    );

    const totalGuardado =
    metas.reduce(
        (s,m)=>s+m.valorAtual,
        0
    );

    const totalFalta =
    Math.max(
        0,
        totalMeta-totalGuardado
    );

    const progresso =
    totalMeta>0
    ?
    (totalGuardado/totalMeta)*100
    :
    0;

    valorMetaSelecionada.textContent =
    moeda(totalMeta);

    valorAtualSelecionada.textContent =
    moeda(totalGuardado);

    faltaSelecionada.textContent =
    moeda(totalFalta);

    percentualSelecionado.textContent =
    progresso.toFixed(1)
    +
    "%";

    progressoSelecionada.style.width =
    Math.min(progresso,100)
    +
    "%";

    dataAtual.textContent =
    formatarDataAtual();

    // meta aberta mais proxima do vencimento, entre todas
    let proxima = null;

    abertas.forEach(m=>{

        if(
        !proxima ||
        calcularDias(m.dataFinal) <
        calcularDias(proxima.dataFinal)
        ){

            proxima = m;

        }

    });

    if(proxima){

        dataVencimento.textContent =
        formatarData(proxima.dataFinal);

        diasSelecionada.textContent =
        calcularDias(proxima.dataFinal)
        +
        " dias";

    }
    else{

        dataVencimento.textContent =
        "--";

        diasSelecionada.textContent =
        "0";

    }

    // soma do valor/dia de cada meta aberta (cada uma com seu proprio prazo)
    let somaDia = 0;

    abertas.forEach(m=>{

        const falta =
        Math.max(
            0,
            m.valorMeta-m.valorAtual
        );

        const dias =
        calcularDias(m.dataFinal);

        somaDia +=
        calcularValorDia(falta,dias);

    });

    ultimoCalculoPeriodo = {

        dia:somaDia,

        semana:somaDia*7,

        mes:somaDia*30

    };

    renderizarValorPeriodo();

    analiseMeta.classList.remove(
        "analise-ok",
        "analise-atencao",
        "analise-risco"
    );

    if(metas.length===0){

        analiseMeta.textContent = "";

    }
    else if(abertas.length===0){

        analiseMeta.textContent =
        "🎉 Todas as suas metas estão concluídas!";

        analiseMeta.classList.add(
            "analise-ok"
        );

    }
    else{

        analiseMeta.textContent =
        `Você tem ${abertas.length} meta${abertas.length>1?"s":""} em aberto. Guarde ${moeda(somaDia)} por dia, no total, pra manter todas em dia — veja o detalhamento de cada uma abaixo.`;

        analiseMeta.classList.add(
            "analise-ok"
        );

    }

    listaHistorico.innerHTML =
    "<p>Selecione uma meta específica para ver o histórico de aportes.</p>";

    renderizarTabelaTodasMetas(abertas);

}

function renderizarTabelaTodasMetas(abertas){

    corpoTabelaMetas.innerHTML = "";

    if(!abertas.length){

        corpoTabelaMetas.innerHTML =
        `<tr><td colspan="6" style="text-align:center;color:var(--secondary);padding:24px;">Nenhuma meta em aberto no momento</td></tr>`;

        return;

    }

    abertas
    .slice()
    .sort(
        (a,b)=>
        calcularDias(a.dataFinal) -
        calcularDias(b.dataFinal)
    )
    .forEach(m=>{

        const falta =
        Math.max(
            0,
            m.valorMeta-m.valorAtual
        );

        const dias =
        calcularDias(m.dataFinal);

        const dia =
        calcularValorDia(falta,dias);

        corpoTabelaMetas.innerHTML += `
        <tr>
            <td>${m.nome}</td>
            <td>${formatarData(m.dataFinal)}</td>
            <td>${dias} dias</td>
            <td>${moeda(dia)}</td>
            <td>${moeda(dia*7)}</td>
            <td>${moeda(dia*30)}</td>
        </tr>
        `;

    });

}

// ===============================
// CÁLCULOS
// ===============================

function calcularFalta(meta){

    const resultado =
    meta.valorMeta -
    meta.valorAtual;

    return resultado > 0
    ?
    resultado
    :
    0;

}

function calcularProgresso(meta){

    let valor =
    (
        meta.valorAtual /
        meta.valorMeta
    )
    *
    100;

    if(valor>100){

        valor=100;

    }

    if(valor<0){

        valor=0;

    }

    return valor;

}

function calcularDias(data){

    const hoje =
    new Date();

    hoje.setHours(0,0,0,0);

    const [ano, mes, dia] =
    data
    .split("-")
    .map(Number);

    const final =
    new Date(ano, mes-1, dia);

    final.setHours(0,0,0,0);

    const diferenca =
    final - hoje;

    const dias =
    Math.round(
    diferenca /
    (1000*60*60*24)
    );

    return dias > 0
    ?
    dias
    :
    0;

}

function calcularValorDia(
falta,
dias
){

    if(dias<=0){

        return falta;

    }

    return falta / dias;

}

// ===============================
// ADICIONAR DINHEIRO
// ===============================

const btnAdicionarValor =
document.getElementById(
"btnAdicionarValor"
);

const modalValor =
document.getElementById(
"modalValor"
);

const btnFecharValor =
document.getElementById(
"btnFecharValor"
);

const btnSalvarValor =
document.getElementById(
"btnSalvarValor"
);

const valorAdicionar =
document.getElementById(
"valorAdicionar"
);

const listaHistorico =
document.getElementById(
"listaHistorico"
);

const secaoTabelaMetas =
document.getElementById(
"secaoTabelaMetas"
);

const corpoTabelaMetas =
document.getElementById(
"corpoTabelaMetas"
);

const btnTipoAporte =
document.getElementById(
"btnTipoAporte"
);

const btnTipoRetirada =
document.getElementById(
"btnTipoRetirada"
);

let tipoMovimentacao = "aporte";

function selecionarTipo(tipo){

    tipoMovimentacao = tipo;

    btnTipoAporte.classList.toggle(
        "ativo",
        tipo==="aporte"
    );

    btnTipoRetirada.classList.toggle(
        "ativo",
        tipo==="retirada"
    );

    btnSalvarValor.textContent =
    tipo==="aporte"
    ? "Confirmar aporte"
    : "Confirmar retirada";

}

btnTipoAporte.addEventListener(
"click",
()=>selecionarTipo("aporte")
);

btnTipoRetirada.addEventListener(
"click",
()=>selecionarTipo("retirada")
);

btnAdicionarValor.addEventListener(
"click",
()=>{

    if(!metaSelecionada){

        alert(
        "Selecione uma meta primeiro"
        );

        return;

    }

    modalValor.classList.remove(
        "oculto"
    );

    selecionarTipo("aporte");

    valorAdicionar.focus();

});

btnFecharValor.addEventListener(
"click",
()=>{

    modalValor.classList.add(
        "oculto"
    );

});

modalValor.addEventListener(
"click",
(evento)=>{

    if(evento.target===modalValor){

        modalValor.classList.add(
            "oculto"
        );

    }

});

document.addEventListener(
"keydown",
(evento)=>{

    if(evento.key!=="Escape"){

        return;

    }

    modal.classList.add("oculto");
    modalValor.classList.add("oculto");

});

btnSalvarValor.addEventListener(
"click",
()=>{

    const valor =
    Number(
        valorAdicionar.value
    );

    if(valor<=0){

        alert(
        "Informe um valor"
        );

        return;

    }

    if(
    tipoMovimentacao==="retirada" &&
    valor>metaSelecionada.valorAtual
    ){

        alert(
        "O valor da retirada não pode ser maior do que o valor já guardado nessa meta."
        );

        return;

    }

    if(tipoMovimentacao==="retirada"){

        metaSelecionada.valorAtual -= valor;

    }
    else{

        metaSelecionada.valorAtual += valor;

    }

    metaSelecionada.historico.push({

        data:
        new Date()
        .toLocaleDateString(
        "pt-BR"
        ),

        valor:valor,

        tipo:tipoMovimentacao

    });

    salvarMetas();

    mostrarMetaSelecionada();

    mostrarHistorico();

    renderizarListaMetas();

    atualizarDashboard();

    atualizarGraficos();

    valorAdicionar.value="";

    modalValor.classList.add(
        "oculto"
    );

});

// ===============================
// HISTÓRICO
// ===============================

function mostrarHistorico(){

    if(!metaSelecionada){

        listaHistorico.innerHTML=

        `
        <p>
        Selecione uma meta para ver os aportes.
        </p>
        `;

        return;

    }

    if(
    !metaSelecionada.historico ||
    metaSelecionada.historico.length===0
    ){

        listaHistorico.innerHTML=

        `
        <p>
        Nenhum aporte realizado.
        </p>
        `;

        return;

    }

    listaHistorico.innerHTML="";

    metaSelecionada.historico
    .slice()
    .reverse()
    .forEach(item=>{

        const tipo = item.tipo || "aporte";

        const sinal = tipo==="retirada" ? "−" : "+";

        const rotulo = tipo==="retirada" ? "Retirada" : "Aporte";

        listaHistorico.innerHTML += `

        <div class="historico-item">

        <span>
        ${item.data} · ${rotulo}
        </span>

        <strong class="historico-valor ${tipo}">
        ${sinal} ${moeda(item.valor)}
        </strong>

        </div>

        `;

    });

}

function moeda(valor){

    return Number(valor)
    .toLocaleString(
        "pt-BR",
        {

        style:"currency",

        currency:"BRL"

        }

    );

}
// ======================================
// SCRIPT.JS
// PARTE 3/3
// LISTA + DASHBOARD + GRÁFICOS + TEMA
// ======================================

// ===============================
// LISTAR METAS
// ===============================

function renderizarListaMetas(){

    listaMetas.innerHTML="";

    if(metas.length===0){

        listaMetas.innerHTML=

        `
        <p>
        Nenhuma meta cadastrada.
        </p>
        `;

        return;

    }

    metas.forEach(meta=>{

        const progresso =
        calcularProgresso(meta);

        listaMetas.innerHTML += `

        <div class="meta-card">

            <h3>
            🎯 ${meta.nome}
            </h3>

            <div class="info">

                <span>
                Meta
                </span>

                <strong>
                ${moeda(meta.valorMeta)}
                </strong>

            </div>

            <div class="info">

                <span>
                Guardado
                </span>

                <strong>
                ${moeda(meta.valorAtual)}
                </strong>

            </div>

            <div class="info">

                <span>
                Progresso
                </span>

                <strong>
                ${progresso.toFixed(1)}%
                </strong>

            </div>


            <div class="info">

    <span>
    📆 Hoje
    </span>


    <strong>
    ${formatarDataAtual()}
    </strong>


</div>



<div class="info">

    <span>
    🏁 Vencimento
    </span>


    <strong>
    ${formatarData(meta.dataFinal)}
    </strong>


</div>



<div class="info">

    <span>
    ⏳ Restam
    </span>


    <strong>
    ${calcularDias(meta.dataFinal)} dias
    </strong>


</div>


            <div class="barra">

            <div
                class="progresso"
                style="width:${progresso}%">

                </div>

            </div>

            <button
            class="btn-visualizar"
            onclick="visualizarMeta(${meta.id})">

            👁 Visualizar

            </button>

            <button
            class="btn-editar"
            onclick="editarMeta(${meta.id})">

            ✏ Editar

            </button>

            <button
            class="btn-excluir"
            onclick="excluirMeta(${meta.id})">

            🗑 Excluir

            </button>

        </div>

        `;

    });

}

// ===============================
// VISUALIZAR
// ===============================

function visualizarMeta(id){

    selecionarMeta.value=id;

    metaSelecionada =
    metas.find(
        meta=>meta.id===id
    );

    mostrarMetaSelecionada();

    mostrarHistorico();

    atualizarGraficos();

}

// ===============================
// EDITAR
// ===============================

function editarMeta(id){

    const meta =
    metas.find(
        item=>item.id===id
    );

    if(!meta){

        return;

    }

    modoEdicao=true;

    idEditando=id;

    tituloModal.textContent =
    "Editar Meta";

    btnSalvar.textContent =
    "Atualizar Meta";

    nomeMeta.value =
    meta.nome;

    valorMeta.value =
    meta.valorMeta;

    valorAtual.value =
    meta.valorAtual;

    dataFinal.value =
    meta.dataFinal;

    modal.classList.remove(
        "oculto"
    );

}

// ===============================
// EXCLUIR
// ===============================

function excluirMeta(id){

    const confirmar =
    confirm(
    "Deseja excluir essa meta?"
    );

    if(!confirmar){

        return;

    }

    metas =
    metas.filter(
        meta=>meta.id!==id
    );

    if(
    metaSelecionada &&
    metaSelecionada.id===id
    ){

        metaSelecionada=null;

        limparMetaSelecionada();

    }

    salvarMetas();

    preencherSelectMetas();

    renderizarListaMetas();

    atualizarDashboard();

    atualizarGraficos();

    if(modoTodasMetas){

        mostrarTodasAsMetas();

    }

}

// ===============================
// DASHBOARD
// ===============================

function atualizarDashboard(){

    let total=0;

    let guardado=0;

    let falta=0;

    metas.forEach(meta=>{

        total += meta.valorMeta;

        guardado += meta.valorAtual;

        falta += calcularFalta(meta);

    });

    totalMetas.textContent =
    moeda(total);

    totalGuardado.textContent =
    moeda(guardado);

    totalFalta.textContent =
    moeda(falta);

    totalQuantidade.textContent =
    metas.length;

}

// ===============================
// GRÁFICOS
// ===============================

let graficoPizza;

let graficoLinha;

function atualizarGraficos(){

    let dados;

    if(metaSelecionada){

        dados=[
            metaSelecionada
        ];

    }
    else{

        dados=metas;

    }

    criarGraficoPizza(dados);

    criarGraficoLinha(dados);

}

function criarGraficoPizza(dados){

    const canvas =
    document.getElementById(
    "graficoPizza"
    );

    if(graficoPizza){

        graficoPizza.destroy();

    }

    graficoPizza =
    new Chart(
    canvas,
    {

    type:"doughnut",

    data:{

        labels:
        dados.map(
        item=>item.nome
        ),

        datasets:[{

            data:
            dados.map(
            item=>item.valorMeta
            )

        }]

    },

    options:{

        responsive:true

    }

    });

}

function criarGraficoLinha(dados){

    const canvas =
    document.getElementById(
    "graficoLinha"
    );

    if(graficoLinha){

        graficoLinha.destroy();

    }

    graficoLinha =
    new Chart(
    canvas,
    {

    type:"bar",

    data:{

        labels:
        dados.map(
        item=>item.nome
        ),

        datasets:[{

        label:
        "Valor guardado",

        data:
        dados.map(
        item=>item.valorAtual
        )

        }]

    },

    options:{

        responsive:true

    }

    });

}

// ===============================
// TEMA
// ===============================

btnTema.addEventListener(
"click",
()=>{

    document.body.classList.toggle(
        "dark"
    );

    const tema =
    document.body.classList.contains(
    "dark"
    )
    ?
    "dark"
    :
    "light";

    localStorage.setItem(
        CHAVE_TEMA,
        tema
    );

    btnTema.textContent =
    tema==="dark"
    ?
    "☀️"
    :
    "🌙";

});

function carregarTema(){

    const tema =
    localStorage.getItem(
    CHAVE_TEMA
    );

    if(tema==="dark"){

        document.body.classList.add(
            "dark"
        );

        btnTema.textContent="☀️";

    }

}

function formatarData(data){


    const partes =
    data.split("-");


    return `${partes[2]}/${partes[1]}/${partes[0]}`;


}



function formatarDataAtual(){


    const hoje =
    new Date();



    return hoje.toLocaleDateString(
        "pt-BR"
    );


}

// ===============================
// ATUALIZAÇÃO AUTOMÁTICA POR DIA
// ===============================
// Os valores (falta por dia/semana/mês, dias restantes) dependem da
// data de hoje. Se o app ficar aberto e a data virar (00:00), ou se o
// usuário voltar pra aba depois de um tempo, isso recalcula tudo sem
// precisar dar F5.

let ultimoDiaConhecido =
new Date()
.toDateString();

function verificarMudancaDeDia(){

    const diaAtual =
    new Date()
    .toDateString();

    if(diaAtual===ultimoDiaConhecido){

        return;

    }

    ultimoDiaConhecido = diaAtual;

    renderizarListaMetas();

    atualizarDashboard();

    atualizarGraficos();

    if(metaSelecionada){

        mostrarMetaSelecionada();

        mostrarHistorico();

    }
    else if(modoTodasMetas){

        mostrarTodasAsMetas();

    }

}

// checa a cada minuto (troca de dia é detectada em até 1 min de atraso)
setInterval(
verificarMudancaDeDia,
60000
);

// checa também assim que a aba volta a ficar visível
// (ex: celular que ficou em segundo plano ou tela bloqueada durante a noite)
document.addEventListener(
"visibilitychange",
()=>{

    if(document.visibilityState==="visible"){

        verificarMudancaDeDia();

    }

}
);




// ===============================
// PWA — SERVICE WORKER + ATUALIZAÇÃO
// ===============================

const bannerAtualizacao =
document.getElementById(
"bannerAtualizacao"
);

const btnAtualizarAgora =
document.getElementById(
"btnAtualizarAgora"
);

const btnAtualizarDepois =
document.getElementById(
"btnAtualizarDepois"
);

function mostrarBannerAtualizacao(workerEmEspera){

    bannerAtualizacao.classList.remove(
        "oculto"
    );

    btnAtualizarAgora.onclick = ()=>{

        workerEmEspera.postMessage(
            "SKIP_WAITING"
        );

        btnAtualizarAgora.disabled = true;

        btnAtualizarAgora.textContent =
        "Atualizando...";

    };

    btnAtualizarDepois.onclick = ()=>{

        bannerAtualizacao.classList.add(
            "oculto"
        );

    };

}

if(
"serviceWorker" in navigator
){

    window.addEventListener(
    "load",
    ()=>{

        navigator.serviceWorker.register(
        "service-worker.js"
        )
        .then((registro)=>{

            console.log(
            "Aplicativo funcionando offline"
            );

            // ja existe uma atualização baixada e esperando (ex: outra aba)
            if(registro.waiting){

                mostrarBannerAtualizacao(
                    registro.waiting
                );

            }

            // uma nova versão do service-worker.js foi encontrada
            registro.addEventListener(
            "updatefound",
            ()=>{

                const novoWorker =
                registro.installing;

                if(!novoWorker){

                    return;

                }

                novoWorker.addEventListener(
                "statechange",
                ()=>{

                    // "installed" + já existe um controller ativo = é uma
                    // atualização de verdade (não a primeira instalação)
                    if(
                    novoWorker.state==="installed" &&
                    navigator.serviceWorker.controller
                    ){

                        mostrarBannerAtualizacao(
                            novoWorker
                        );

                    }

                }
                );

            }
            );

        })
        .catch((erro)=>{

            console.warn(
            "Falha ao registrar service worker",
            erro
            );

        });

        // quando o novo worker assume, recarrega a página uma única vez
        // pra garantir que o HTML/JS/CSS mais novos sejam usados
        let jaRecarregou = false;

        navigator.serviceWorker.addEventListener(
        "controllerchange",
        ()=>{

            if(jaRecarregou){

                return;

            }

            jaRecarregou = true;

            window.location.reload();

        }
        );

    }
    );

}

// ===============================
// PWA — INSTALAR NO DESKTOP/ANDROID
// ===============================
// No iOS/Safari não existe esse evento (Apple não suporta instalação
// programática) — lá a pessoa instala manualmente por "Adicionar à Tela
// de Início", então o botão simplesmente não aparece.

const btnInstalarApp =
document.getElementById(
"btnInstalarApp"
);

let promptInstalacao = null;

window.addEventListener(
"beforeinstallprompt",
(evento)=>{

    evento.preventDefault();

    promptInstalacao = evento;

    btnInstalarApp.classList.remove(
        "oculto"
    );

}
);

btnInstalarApp.addEventListener(
"click",
async ()=>{

    if(!promptInstalacao){

        return;

    }

    btnInstalarApp.disabled = true;

    promptInstalacao.prompt();

    await promptInstalacao.userChoice;

    promptInstalacao = null;

    btnInstalarApp.classList.add(
        "oculto"
    );

    btnInstalarApp.disabled = false;

}
);

// esconde o botão se o app já foi instalado (ou aberto já instalado)
window.addEventListener(
"appinstalled",
()=>{

    btnInstalarApp.classList.add(
        "oculto"
    );

    promptInstalacao = null;

}
);

if(
window.matchMedia(
"(display-mode: standalone)"
).matches
){

    btnInstalarApp.classList.add(
        "oculto"
    );

}