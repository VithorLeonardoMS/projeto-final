import { Request, Response } from 'express';
import { AppDataSource } from '../database/connection';
import { Comentario } from '../models/Comentario';
import { Usuario } from '../models/Usuario';

const comentarioRepository = AppDataSource.getRepository(Comentario);
const usuarioRepository = AppDataSource.getRepository(Usuario);

export class ComentarioController {

    // Listar todos os usuários
    async list(req: Request, res: Response) {
        try{
            const comentarios = await comentarioRepository.find({
                relations: ["usuario", "postagem"]
            });
            res.status(200).json(comentarios);
            return;

        } catch(error){
            console.error("Erro ao listar comentarios", error);
            res.status(500).json({ mensagem: "Erro ao listar comentarios", error});
            return;
        }
    }

    // Criar novo usuário
    async create(req: Request, res: Response) {
        const { usuarioId, texto, parent} = req.body;
        const numUserId = Number(usuarioId)
        let comentario;

        if(!usuarioId && !texto && !parent){
            if(parent){
                comentario = comentarioRepository.create({ 
                    usuario: { id: numUserId} as Usuario, //O objeto passa a ser tratado como um Usuario
                    texto,
                    parent
                });
            } else{
                comentario = comentarioRepository.create({ 
                        usuario: { id: numUserId} as Usuario, 
                        texto
                    });
            }
        } else{
            res.status(400).json({mensage: `usuarioId e texto precisam ser fornecidos!`})
            return;
        }

        await comentarioRepository.save(comentario);

        const comentarioCriado = await comentarioRepository.findOne({
            where:{id:comentario.id},
            relations:["usuario","postagem"]//Garante que retorne as instancias completas
        })

        res.status(201).json(comentarioCriado);
        return;
    }

    // Buscar usuário por ID
    async show(req: Request, res: Response) {
        const { id } = req.params;

        const comentario = await comentarioRepository.findOne({
             where:{ id: Number(id)},
             relations: ["usuario", "postagem"]
            });

        if (!comentario) {
            res.status(404).json({ message: 'Usuário não encontrado' });
            return;
        }
        res.json({});
        return;
    }

    // Atualizar usuário
    async update(req: Request, res: Response) {
        const { id } = req.params;
        const { texto, comentarioId} = req.body;
        
        const numUserId = Number(id)
        const numComentarioId = Number(comentarioId)

        try{
            const usuario = await usuarioRepository.findOneBy({ id: numUserId });//Não precisa de relations: ["usuario"] neste caso
    
            if (!usuario) {
                res.status(404).json({ message: 'Usuario não encontrado -> { id } = req.params' });
                return;
            }
    
            if(texto){
                res.status(400).json({mensage: `"texto" precisa ser fornecido!`})
                return;
            }
    
            const comentario = await comentarioRepository.findOne({
                where:{id:numComentarioId},
                relations: ["usuario", "postagem"]
            })
    
            if(!comentario){
                res.status(404).json({mensage:`Usuario não encontrado | comentario.id = ${numComentarioId}`})
                return;
            }
    
            if(comentario.usuario.id == usuario.id){
                comentario.texto = texto;
                await comentarioRepository.save(comentario);
                res.status(200).json(comentario);
            } else{
                res.status(403).json({mensage:`Usuario não tem permisão para editar comentario -> usuario.id = ${numUserId} | comentario.id = ${numComentarioId}`})
                return;
            }

        } catch(error){
            console.error("Erro ao atualizar comentario", error);
            res.status(500).json({ mensagem: "Erro ao atualizar comentario", error });
            return;
        }
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;
        const {comentarioId} = req.body;

        const numUserId = Number(id)
        const numComentarioId = Number(comentarioId)
        
        try{
            const usuario = await usuarioRepository.findOneBy({ id: numUserId });//Não precisa de relations: ["usuario", "postagem"] neste caso
    
            if (!usuario) {
                res.status(404).json({ message: 'Usuario não encontrado -> { id } = req.params' });
                return;
            }
    
            const comentario = await comentarioRepository.findOne({
                where:{id:numComentarioId},
                relations: ["usuario", "postagem"]
            })
    
            if(!comentario){
                res.status(404).json({mensage:`Usuario não encontrado | comentario.id = ${numComentarioId}`})
                return;
            }
    
            if(comentario.usuario.id == usuario.id){
                await comentarioRepository.remove(comentario);
                res.status(204).send();
                return;
            } else{
                res.status(403).json({mensage:`Usuario não tem permisão para deletar comentario -> usuario.id = ${numUserId} | comentario.id = ${numComentarioId}`})
                return;
            }

        } catch(error){
            console.error("Erro ao deletar comentario", error);
            res.status(500).json({ mensagem: "Erro ao deletar comentario", error });
            return;
        }

    }
}