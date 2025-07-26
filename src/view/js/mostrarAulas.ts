import { CursoExterno } from "../../../classes/Postagem/CursoExterno";

/*
    <div class="course-card">
      <img class="thumbnail"></img> //ou <div class="thumbnail"></div>
      <div class="content">
        <h3>Title</h3>
        <p>Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.</p>
        <button>Button</button>
      </div>
    </div>
*/

export function mostrarCursos(cursos:CursoExterno[], elementoPai:HTMLElement):void{
    cursos.forEach(curso => {
        let courseCard = document.createElement("div");
        courseCard.classList.add("course-card");

        let thumbnail
        if(curso.getAnexos()[0]){
            thumbnail = document.createElement("img");
            thumbnail.classList.add("thumbnail");
            thumbnail.src = curso.getAnexos()[0];
        } else{
            thumbnail = document.createElement("div")
            thumbnail.classList.add("thumbnail");
        }

        let content = document.createElement("div");
        content.classList.add("content");

        let h3 = document.createElement("h3");
        h3.textContent = curso.getTitulo();

        let p = document.createElement("p");
        p.textContent = curso.getDescricao();
        
        let button = document.createElement("button");
        button.textContent = "Acessar"

        content.appendChild(h3);
        content.appendChild(p);
        content.appendChild(button);

        courseCard.appendChild(thumbnail);
        courseCard.appendChild(content);

        elementoPai.appendChild(courseCard)
    })
}