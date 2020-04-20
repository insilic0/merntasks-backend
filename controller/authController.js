const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async(req,res) => {
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({
            ok:false,
            error: errores.array()
        })
    }

   
    //Extraer el email y password
    const {email, password} = req.body;
    try {
        //Revisar que el email exista
        let usuario = await Usuario.findOne({email});
        if(!usuario){
            return res.status(400).json({
                ok:false,
                msg: "El usuario no existe"
            })
        }
         //Revisar el password
         const passCorrecto = await bcrypt.compare(password, usuario.password);
         if(!passCorrecto){
             return res.status(400).json({
                ok:false,
                msg:'Contraseña incorrecta'
            });
        }

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
                    msg: "Login correcto!",
                    token : token
                })
            });
    } catch (error) {
        console.log(error);
    }

}

//Obtiene el usuario autenticado

exports.usuarioAutenticado = async(req, res) =>{
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({
            ok: true,
            msg:'Sesión iniciada con éxito',
            usuario
        })
    } catch (error) {
        console.log(error);
        res.satus(500).json({
            ok:false,
            msg:'Hubo un error'
        });
    }
}