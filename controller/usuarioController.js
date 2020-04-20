const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req,res)=>{
    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({
            ok:false,
            error: errores.array()
        })
    }

    //Extraer email y password
    const {email, password} = req.body;
    try {
        let usuario = await Usuario.findOne({email});

        if(usuario){
            return res.status(400).json({
                ok:false,
                msg:'El usuario ya existe!'
            })
        }


        
        //Crea el nuevo usuario
        usuario = new Usuario(req.body);

        //Hashear el password
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);
        //Guardar Usuario
        await usuario.save();

        //Crear y firmar el JWT
        const payload = {
            usuario:{
                id:usuario.id
            }
        };

        //Firmar el JWT
        jwt.sign(payload, process.env.SECRETA,{
            expiresIn: 3600
        }, (error, token)=>{
            if(error) throw error;

            res.status(200).json({
                ok: true,
                msg: "Usuario agregado correctamente",
                token : token
            })
        });

        //Mensaje de confirmación
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            error: 'Se produjo un error al guardar el usuario'

        })
    }
}