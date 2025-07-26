import { Comentario } from "./Comentario"
import { Course }
// import { Postagem } from "./Postagem/Postagem"
// import { ReactionPost } from "./Reactions/ReactionPost"
import bcrypt from "bcryptjs"

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn,
    ManyToMany,
    JoinTable,
    AfterLoad,
    BeforeInsert,
    BeforeUpdate
 } from 'typeorm';
  
export class User {

    @PrimaryGeneratedColumn()
    public id!: number

    @Column({type:"varchar", length:200})
    public nome: string

    @Column({type:"varchar", unique:true, length:200})
    public email: string

    @Column({type:"varchar", length:35})
    private _password: string;
    private originalPassword!: string;

    @Column({type:"text", nullable:true})
    public fotoPerfil!:string

    @ManyToMany(() => Curse, (curse) => curse.usersSaves)//Implementar
    @JoinTable({
        name: "Postagens_Salvas", // nome da tabela intermediária
        joinColumn: {
          name: "ID_Usuario",
          referencedColumnName: "id"
        },
        inverseJoinColumn: {
          name: "ID_Postagem",
          referencedColumnName: "id"
        }
    })
    public postsSalvos: Postagem[] = []

    @OneToMany(() => Postagem, (postagem) => postagem.usuario)
    public postsCriados: Postagem[] = []

    @OneToMany(() => Comentario, coment => coment.usuario)
    public comentarios!: Comentario[]

    @OneToMany(() => ReactionPost, (reacao) => reacao.idUsuario)
    public reacaoPost: ReactionPost[]= []

    @ManyToMany(() => Usuario, (user) => user.seguidores)
    @JoinTable({
        name:"User_Follow_User",
        joinColumn: {
            name: "seguidor_id", 
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "seguido_id", // o outro usuário que é seguido
            referencedColumnName: "id"
        }
    })
    public seguidores: Usuario[] = []

    @AfterLoad()
    setOriginalPassword() {
      this.originalPassword = this._password;
    }

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
      if (this._password !== this.originalPassword) {
        const salt = await bcrypt.genSalt(10);
        this._password = await bcrypt.hash(this._password, salt);
      }
    }

    constructor(nome: string, email: string, senha: string) {
        this.nome = nome;
        this.email = email;
        this._password = senha;
        this.originalPassword = ""
    }

    get senha():string{
        return this._password;
    }
}