const overlay = document.getElementById("overlay");
const configModal = document.getElementById("config-modal");

document.addEventListener("DOMContentLoaded", function () {
  const profileBolinhaElement = document.querySelector(".perfil-bolinha");

  // Exit if the element doesn't exist
  if (!profileBolinhaElement) {
    console.error("No .perfil-bolinha element found on page");
    return;
  }

  try {
    // Get user data from localStorage
    const profileUrl = localStorage.getItem("profileUrl");

    // Handle different cases for profile image
    if (profileUrl) {
      // Clear the container first
      profileBolinhaElement.innerHTML = "";

      // Create new image element
      const imgElement = document.createElement("img");

      // Set the correct URL
      if (profileUrl.startsWith("http")) {
        imgElement.src = profileUrl;
      } else {
        imgElement.src = `http://localhost:3000${profileUrl}`;
      }

      // Add the image to the container
      profileBolinhaElement.appendChild(imgElement);
    } else {
      console.log("No profile URL, using default icon");
      profileBolinhaElement.innerHTML = '<i class="fas fa-user"></i>';
    }
  } catch (error) {
    console.error("Error setting up profile image:", error);
    // Fallback to icon
    profileBolinhaElement.innerHTML = '<i class="fas fa-user"></i>';
  }
});

document.querySelector(".perfil-bolinha").addEventListener("click", () => {
  overlay.classList.add("show");
});

document.addEventListener("click", (e) => {
  const content = document.getElementById("overlay-content");
  if (!content.contains(e.target) && !e.target.closest(".perfil-bolinha")) {
    overlay.classList.remove("show");
  }
});

document.querySelectorAll("#overlay a").forEach((link) => {
  link.addEventListener("click", () => {
    overlay.classList.remove("show");
  });
});

function excluirConta() {
  if (confirm("Tem certeza que deseja excluir sua conta?")) {
    alert("Conta excluída!");
    window.location.href = "cadastro_login.html";
  }
}

function sair() {
  if (confirm("Tem certeza que deseja sair da sua conta?")) {
    localStorage.removeItem("userId");
    window.location.href = "cadastro_login.html";
  }
}
