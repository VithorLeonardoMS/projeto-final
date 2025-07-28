const overlayMenu = document.getElementById("overlay-menu");
const overlayBusca = document.getElementById("overlay-busca");
const configModal = document.getElementById("config-modal");

document.addEventListener("DOMContentLoaded", function () {
  const profileBolinhaElement = document.querySelector(".perfil-bolinha");

  if (!profileBolinhaElement) {
    console.error("No .perfil-bolinha element found on page");
    return;
  }

  try {
    const profileUrl = localStorage.getItem("profileUrl");

    if (profileUrl && profileUrl !== "null" && profileUrl.trim() !== "") {
      const imgElement = document.createElement("img");
      imgElement.classList.add("foto-perfil");

      imgElement.src = profileUrl.startsWith("http")
        ? profileUrl
        : `http://localhost:3000${profileUrl}`;

      imgElement.onerror = () => {
        profileBolinhaElement.innerHTML = '<i class="fas fa-user"></i>';
      };

      profileBolinhaElement.innerHTML = "";
      profileBolinhaElement.appendChild(imgElement);
    } else {
      profileBolinhaElement.innerHTML = '<i class="fas fa-user"></i>';
    }
  } catch (error) {
    console.error("Erro ao configurar imagem de perfil:", error);
    profileBolinhaElement.innerHTML = '<i class="fas fa-user"></i>';
  }
});

// Abrir overlay ao clicar na bolinha
document.querySelector(".perfil-bolinha").addEventListener("click", () => {
  overlayMenu.classList.add("show");
});

// Fechar overlay ao clicar fora do conteúdo do menu
document.addEventListener("click", (e) => {
  const content = document.getElementById("overlay-content-menu");
  if (overlayMenu && !content.contains(e.target) && !e.target.closest(".perfil-bolinha")) {
    overlayMenu.classList.remove("show");
  }
});

// Fechar overlay ao clicar em link do menu
document.querySelectorAll("#overlay-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    overlayMenu.classList.remove("show");
  });
});

// Função para excluir conta
function excluirConta() {
  if (confirm("Tem certeza que deseja excluir sua conta?")) {
    alert("Conta excluída!");
    window.location.href = "cadastro_login.html";
  }
}

// Função para sair
function sair() {
  if (confirm("Tem certeza que deseja sair da sua conta?")) {
    localStorage.removeItem("userId");
    window.location.href = "cadastro_login.html";
  }
}

// === 🔍 Lógica de Busca ===
document.getElementById("form-search").addEventListener("submit", async (e) => {
  e.preventDefault();

  const searchTerm = document.getElementById("search-input").value.trim();
  const resultsContainer = document.getElementById("search-results");

  if (!searchTerm) {
    resultsContainer.innerHTML = "<p>Digite algo para buscar.</p>";
    if (overlayBusca) overlayBusca.classList.add("show");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/cursos?search=${encodeURIComponent(searchTerm)}`);

    if (!response.ok) {
      throw new Error("Erro na resposta do servidor");
    }

    const cursos = await response.json();

    if (!Array.isArray(cursos) || cursos.length === 0) {
      resultsContainer.innerHTML = "<p>Nenhum curso encontrado.</p>";
    } else {
      resultsContainer.innerHTML = cursos
        .map((curso) => `
          <div class="card mb-3" style="max-width: 540px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div class="row g-0 align-items-center">
              <div class="col-auto">
                <img src="${curso.imageUrl}" alt="Imagem do curso" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px 0 0 8px;">
              </div>
              <div class="col">
                <div class="card-body">
                  <h5 class="card-title mb-1">${curso.title}</h5>
                  <p class="card-text small text-muted">${curso.description}</p>
                  <a href="CriarCurso.html?id=${curso.id}" class="btn btn-outline-primary btn-sm mb-2">Ver Curso</a>
                  <div class="d-flex align-items-center gap-3">
                    <div class="like-counter d-flex align-items-center gap-1">
                      <i class="fas fa-thumbs-up like-btn"></i>
                      <span class="like-count">0</span>
                    </div>
                    <div class="dislike-counter d-flex align-items-center gap-1">
                      <i class="fas fa-thumbs-down dislike-btn"></i>
                      <span class="dislike-count">0</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-auto pe-3">
                <a href="editar.html?id=${curso.id}" class="text-black">
                  <i class="fas fa-pen fa-sm"></i>
                </a>
              </div>
            </div>
          </div>
        `)
        .join("");
    }
    if (overlayBusca) overlayBusca.classList.add("show");

  } catch (err) {
    console.error("Erro ao buscar cursos:", err);
    resultsContainer.innerHTML = "<p>Erro ao buscar cursos.</p>";
    if (overlayBusca) overlayBusca.classList.add("show");
  }
});
