// ======================================
// PLANNER FINANCEIRO
// SCRIPT.JS
// PARTE 1/3
// ======================================

const CHAVE_METAS = "planner_metas_v1";

const CHAVE_TEMA = "planner_tema_v1";

let metas = [];

let metaSelecionada = null;

let modoEdicao = false;

let idEditando = null;

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

const valorDia =
document.getElementById(
"valorDia"
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

const quebraPeriodo =
document.getElementById(
"quebraPeriodo"
);

const valorSemana =
document.getElementById(
"valorSemana"
);

const valorMes =
document.getElementById(
"valorMes"
);

// ===============================
// INICIALIZAÇÃO
// ===============================

window.addEventListener(
"DOMContentLoaded",
()=>{

    carregarMetas();

    carregarTema();

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

        limparMetaSelecionada();

        mostrarHistorico();

        atualizarGraficos();

        return;

    }

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

    valorDia.textContent =
    moeda(dia)
    +
    " / dia";

    if(dias>30){

        valorSemana.textContent =
        moeda(dia*7);

        valorMes.textContent =
        moeda(dia*30);

        quebraPeriodo.style.display =
        "flex";

    }
    else{

        quebraPeriodo.style.display =
        "none";

    }

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

    valorDia.textContent =
    "R$ 0,00";

    quebraPeriodo.style.display =
    "none";

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

    const final =
    new Date(data);

    const diferenca =
    final - hoje;

    const dias =
    Math.ceil(
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
// PWA
// ===============================


if(
"serviceWorker" in navigator
){


window.addEventListener(
"load",
()=>{


navigator.serviceWorker.register(
"service-worker.js"
)

.then(()=>{

console.log(
"Aplicativo funcionando offline"
);

})


});


}