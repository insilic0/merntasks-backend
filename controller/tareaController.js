const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');

//Crea una nueva tarea
exports.crearTarea = async(req, res) =>{
    
    //Revisar que no haya errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({
            ok:false,
            error: errores.array()
        })
    }
    
    try {
        
        //Extraer el proyecto y comprobar si existe
        const {proyecto} = req.body;
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(404).json({
                ok: false,
                msg: 'Proyecto no encontrado'
            });
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        //Verificar el creador del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({
                ok: false,
                msg: 'No eres el dueño del proyecto, no puedes crear la tarea'
            });
        }

        //Crear la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.status(200).json({
            ok:true,
            msg:'Tarea creada con éxito',
            tareaCreada: tarea
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            error: error
        });
    }
}

exports.obtenerTareas = async(req, res) =>{
    try {
        //Extraer el proyecto y comprobar si existe
     const {proyecto} = req.query;
     const existeProyecto = await Proyecto.findById(proyecto);
     
     console.log(existeProyecto);
     
     if(!existeProyecto){
         return res.status(404).json({
             ok: false,
             msg: 'Proyecto no encontrado'
         });
     }

     //Revisar si el proyecto actual pertenece al usuario autenticado
     //Verificar el creador del proyecto
     if(existeProyecto.creador.toString() !== req.usuario.id){
         return res.status(401).json({
             ok: false,
             msg: 'No eres el dueño del proyecto, no puedes obtener esas tareas'
         });
     }

     //Obtener las tareas por proyecto
     const tareas = await Tarea.find({ proyecto });

     res.status(200).json({
         ok:true,
         tareas
     })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            error
        })
    }
}

exports.actualizarTarea = async(req, res) =>{
    //Revisar que no haya errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({
            ok:false,
            error: errores.array()
        })
    }
    
    try {
          
        //Extraer el proyecto y comprobar si existe
        const {proyecto, nombre, estado} = req.body;
        
        //Revisar si la tarea existe
        let tarea = await Tarea.findById(req.params.id);
        
        
        if(!tarea){
            return res.status(404).json({
                ok:false,
                msg: 'No existe esa tarea'
            })
        }
        
        //Revisar si el proyecto actual pertenece al usuario autenticado
        const existeProyecto = await Proyecto.findById(proyecto);
        //Verificar el creador del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({
                ok: false,
                msg: 'No eres el dueño del proyecto, no puedes actualizar esas tareas'
            });
     }
        //Crear objeto con la nueva información
        const nuevaTarea = {};
       
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;
        

        //Actualizar la tarea
        tarea = await Tarea.findOneAndUpdate({_id: req.params.id}, nuevaTarea,{new : true});

        res.status(200).json({
            ok: true,
            msg: 'Tarea actualizada correctamente',
            tarea
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: error
        })
    }
}

exports.eliminarTarea = async(req, res) =>{
    try {
        //Extraer el proyecto y comprobar si existe
        const {proyecto} = req.query;
        
        //Revisar si la tarea existe
        let tarea = await Tarea.findById(req.params.id);
        
        
        if(!tarea){
            return res.status(404).json({
                ok:false,
                msg: 'No existe esa tarea'
            })
        }
        
        //Revisar si el proyecto actual pertenece al usuario autenticado
        const existeProyecto = await Proyecto.findById(proyecto);
        //Verificar el creador del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({
                ok: false,
                msg: 'No eres el dueño del proyecto, no puedes actualizar esas tareas'
            });
     }
     
        //eliminar tarea
        tarea = await Tarea.findOneAndRemove({_id: req.params.id});

        res.status(200).json({
            ok:true,
            msg:'Tarea eliminada con éxito',
            tareaEliminada: tarea
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            error: error
        })
    }
}