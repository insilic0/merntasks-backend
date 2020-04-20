const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async(req, res) =>{
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({
            ok:false,
            error: errores.array()
        })
    }
    
    
    try {
        //Crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);
  
        //Guardar el creador via JWT
        proyecto.creador = req.usuario.id;
        
        //Guardar el proyecto
        proyecto.save();
        res.status(200).json({
            ok:true,
            msg:'Proyecto creado correctamente',
            proyecto: proyecto
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error en el servidor'
        });
    }
}

exports.obtenerProyectos = async(req, res)=>{
    try {
        const proyectos = await Proyecto.find({creador: req.usuario.id}).sort({creado:-1});
        res.status(200).json({
            ok:true, 
            proyectos
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg:"Error en el servidor"
        });
    }
}

exports.actualizarProyecto = async(req, res) =>{
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({
            ok:false,
            error: errores.array()
        })
    }

    //Extraer la información del proyecto
    const{nombre} = req.body;

    const nuevoProyecto = {};

    if( nombre ){
        nuevoProyecto.nombre = nombre;
    }

    try {
        //Revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        //Si el proyecto existe
        if(!proyecto){
            return res.status(404).json({
                ok: false,
                msg: 'Proyecto no encontrado'
            });
        }

        //Verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({
                ok: false,
                msg: 'No eres el dueño del proyecto, no puedes editar'
            });
        }

        //Actualizar
        proyecto = await Proyecto.findOneAndUpdate({_id: req.params.id}, {$set : nuevoProyecto}, {new: true});
        res.status(200).json({
            ok:true,
            msg:'Proyecto actualizado correctamente',
            proyectoActualizado: proyecto
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: error
        })
    }
}

exports.eliminarProyecto = async(req, res) =>{
    try {
         //Revisar el ID
         let proyecto = await Proyecto.findById(req.params.id);

         //Si el proyecto existe
         if(!proyecto){
             return res.status(404).json({
                 ok: false,
                 msg: 'Proyecto no encontrado'
             });
         }
 
         //Verificar el creador del proyecto
         if(proyecto.creador.toString() !== req.usuario.id){
             return res.status(401).json({
                 ok: false,
                 msg: 'No eres el dueño del proyecto, no puedes eliminar'
             });
         }

         //Eliminar el proyecto
         await Proyecto.findOneAndRemove({_id: req.params.id});

         res.status(200).json({
             ok: true,
             msg: 'Proyecto eliminado correctamente',
             proyectoEliminado: proyecto
         })
 
    } catch (error) {
        console.log(error),
        res.status(500).json({
            ok: false,
            msg: error
        })
    }
}