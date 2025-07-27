const selectCurso = document.getElementById("select-curso");
const selectAula = document.getElementById("select-aula");

const formCurso = document.getElementById("form-curso");
const inputCursoTitulo = document.getElementById("curso-titulo");
const inputCursoDescricao = document.getElementById("curso-descricao");
const inputCursoImagem = document.getElementById("curso-imagem");
const btnExcluirCurso = document.getElementById("btn-excluir-curso");

const formAula = document.getElementById("form-aula");
const inputAulaTitulo = document.getElementById("aula-titulo");
const inputAulaDescricao = document.getElementById("aula-descricao");
const inputAulaUrl = document.getElementById("aula-url");
const btnExcluirAula = document.getElementById("btn-excluir-aula");

// Inicial: desabilita formulários
desabilitarFormularioCurso();
desabilitarFormularioAula();

// Funções para habilitar/desabilitar formulários
function desabilitarFormularioCurso() {
  formCurso
    .querySelectorAll("input, textarea, button")
    .forEach((el) => (el.disabled = true));
}
function habilitarFormularioCurso() {
  formCurso
    .querySelectorAll("input, textarea, button")
    .forEach((el) => (el.disabled = false));
}
function limparFormularioCurso() {
  inputCursoTitulo.value = "";
  inputCursoDescricao.value = "";
  inputCursoImagem.value = "";
}

function desabilitarFormularioAula() {
  formAula
    .querySelectorAll("input, textarea, button")
    .forEach((el) => (el.disabled = true));
}
function habilitarFormularioAula() {
  formAula
    .querySelectorAll("input, textarea, button")
    .forEach((el) => (el.disabled = false));
}
function limparFormularioAula() {
  inputAulaTitulo.value = "";
  inputAulaDescricao.value = "";
  inputAulaUrl.value = "";
}

// Carregar cursos para o select
async function carregarCursos() {
  try {
    const res = await fetch("http://localhost:3000/cursos");
    const cursos = await res.json();

    // Limpa options antes de inserir
    selectCurso.innerHTML =
      '<option value="">-- Selecione um curso --</option>';
    cursos.forEach((curso) => {
      const option = document.createElement("option");
      option.value = curso.id;
      option.textContent = curso.title;
      selectCurso.appendChild(option);
    });
  } catch (error) {
    alert("Erro ao carregar cursos");
    console.error(error);
  }
}

// Ao mudar curso
selectCurso.addEventListener("change", async () => {
  const cursoId = selectCurso.value;
  if (!cursoId) {
    limparFormularioCurso();
    desabilitarFormularioCurso();
    limparFormularioAula();
    desabilitarFormularioAula();
    selectAula.innerHTML = '<option value="">-- Selecione uma aula --</option>';
    selectAula.disabled = true;
    return;
  }
  habilitarFormularioCurso();
  try {
    // Busca curso pelo ID
    const res = await fetch(`http://localhost:3000/cursos/${cursoId}`);
    if (!res.ok) throw new Error("Curso não encontrado");
    const curso = await res.json();

    inputCursoTitulo.value = curso.title || "";
    inputCursoDescricao.value = curso.description || "";
    inputCursoImagem.value = curso.imageUrl || "";

    // Carrega aulas do curso no select (usando "classes")
    if (curso.classes && curso.classes.length) {
      selectAula.disabled = false;
      selectAula.innerHTML =
        '<option value="">-- Selecione uma aula --</option>';
      curso.classes.forEach((aula) => {
        const option = document.createElement("option");
        option.value = aula.id;
        option.textContent = aula.title;
        selectAula.appendChild(option);
      });
    } else {
      selectAula.disabled = true;
      selectAula.innerHTML =
        '<option value="">-- Nenhuma aula cadastrada --</option>';
    }

    limparFormularioAula();
    desabilitarFormularioAula();
  } catch (error) {
    alert("Erro ao carregar curso");
    console.error(error);
  }
});

// Ao mudar aula
selectAula.addEventListener("change", async () => {
  const aulaId = selectAula.value;
  if (!aulaId) {
    limparFormularioAula();
    desabilitarFormularioAula();
    return;
  }
  habilitarFormularioAula();
  try {
    // Busca aula pelo ID
    const res = await fetch(`http://localhost:3000/aulas/${aulaId}`);
    if (!res.ok) throw new Error("Aula não encontrada");
    const aula = await res.json();

    inputAulaTitulo.value = aula.title || "";
    inputAulaDescricao.value = aula.description || "";
    inputAulaUrl.value = aula.url || aula.videoUrl || ""; // tenta os dois nomes possíveis
  } catch (error) {
    alert("Erro ao carregar aula");
    console.error(error);
  }
});

// Salvar curso
formCurso.addEventListener("submit", async (e) => {
  e.preventDefault();
  const cursoId = selectCurso.value;
  if (!cursoId) {
    alert("Selecione um curso para editar");
    return;
  }

  const updatedCurso = {
    title: inputCursoTitulo.value,
    description: inputCursoDescricao.value,
    imageUrl: inputCursoImagem.value,
  };

  try {
    const res = await fetch(`http://localhost:3000/cursos/${cursoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedCurso),
    });
    if (!res.ok) throw new Error("Erro ao atualizar curso");
    alert("Curso atualizado com sucesso");
    await carregarCursos(); // Atualiza lista de cursos
    selectCurso.value = cursoId; // mantém seleção
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
});

// Excluir curso
btnExcluirCurso.addEventListener("click", async () => {
  const cursoId = selectCurso.value;
  if (!cursoId) {
    alert("Selecione um curso para excluir");
    return;
  }
  if (!confirm("Tem certeza que deseja excluir este curso?")) return;

  try {
    const res = await fetch(`http://localhost:3000/cursos/${cursoId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Erro ao excluir curso");
    alert("Curso excluído com sucesso");
    await carregarCursos();
    selectCurso.value = "";
    limparFormularioCurso();
    desabilitarFormularioCurso();

    selectAula.value = "";
    limparFormularioAula();
    desabilitarFormularioAula();
    selectAula.disabled = true;
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
});

// Salvar aula
formAula.addEventListener("submit", async (e) => {
  e.preventDefault();
  const aulaId = selectAula.value;
  if (!aulaId) {
    alert("Selecione uma aula para editar");
    return;
  }

  const courseId = selectCurso.value;
  const updatedAula = {
    title: inputAulaTitulo.value,
    description: inputAulaDescricao.value,
    url: inputAulaUrl.value,
    courseId,
  };

  try {
    const res = await fetch(`http://localhost:3000/aulas/${aulaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedAula),
    });
    if (!res.ok) throw new Error("Erro ao atualizar aula");
    alert("Aula atualizada com sucesso");
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
});

// Excluir aula
btnExcluirAula.addEventListener("click", async () => {
  const aulaId = selectAula.value;
  if (!aulaId) {
    alert("Selecione uma aula para excluir");
    return;
  }
  if (!confirm("Tem certeza que deseja excluir esta aula?")) return;

  try {
    const res = await fetch(`http://localhost:3000/aulas/${aulaId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Erro ao excluir aula");
    alert("Aula excluída com sucesso");

    // Atualiza select de aulas para o curso selecionado
    const cursoId = selectCurso.value;
    if (cursoId) {
      const resCurso = await fetch(`http://localhost:3000/cursos/${cursoId}`);
      const curso = await resCurso.json();

      if (curso.classes && curso.classes.length) {
        selectAula.innerHTML =
          '<option value="">-- Selecione uma aula --</option>';
        curso.classes.forEach((aula) => {
          const option = document.createElement("option");
          option.value = aula.id;
          option.textContent = aula.title;
          selectAula.appendChild(option);
        });
        selectAula.disabled = false;
      } else {
        selectAula.innerHTML =
          '<option value="">-- Nenhuma aula cadastrada --</option>';
        selectAula.disabled = true;
      }
    }

    limparFormularioAula();
    desabilitarFormularioAula();
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
});

// Inicializa carregando cursos no select
carregarCursos();
