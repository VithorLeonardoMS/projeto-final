import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn,
    OneToOne
 } from 'typeorm';
import { Postagem } from './Postagem/Postagem';
import { Usuario } from './Usuario';
  
  
  @Entity("comentario")
  export class Comentario {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(()=> Postagem, post => post.comentarios)
    postagem:Postagem;
  
    @ManyToOne(() => Usuario, user => user.comentarios )
    usuario: Usuario;
  
    @Column({type:"varchar", length:255, nullable:false})
    private _texto: string;
  
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    dataCriacao!: Date;

    @Column({ type: "boolean", nullable:false})
    private _editado:boolean;
  
    // Relacionamento com o comentário pai (resposta)
    @ManyToOne(() => Comentario, (comentario) => comentario.respostas, { nullable: true })
    @JoinColumn({ name: 'parent_id' })
    parent!: Comentario;
    // Relacionamento com as respostas (comentários filhos)
    @OneToMany(() => Comentario, (comentario) => comentario.parent)
    respostas: Comentario[];

    constructor(usuario:Usuario, postagem:Postagem, texto:string, parent?: Comentario){
      this.usuario = usuario;
      this.postagem = postagem;
      this._texto = texto;
      if(parent){
        this.parent = parent;
      }
      this.respostas = [];
      this._editado = false
    }


    get editado():boolean{
      return this._editado;
    }

    set texto(texto:string){
      this._texto = texto
      this._editado = true;
    }

    get texto():string{
      return this.texto
    }

  }
  