var Usuario = require('../models/usuario');

module.exports = {
    //traemos toda la lista de usuarios
    list: function(req, res, next){
        Usuario.find({},(err, usuarios)=>{
            res.render('usuarios/index',{usuarios: usuarios});
        });
    },
    //traemos el usuario por el id
    update_get: function(req, res, next){
        Usuario.findById(req.params.id ,function(err, usuario){
            res.render('usuarios/update',{erros:{}, usuario: usuario}); //rendereamos la vista
        });
    },
    //actualizar usuario
    update: function(req, res, next){
        var update_values = {nombre: req.body.nombre};
        //utilizamos findByIdAndUpdate para que busque y actualice
        Usuario.findByIdAndUpdate(req.params.id , update_values, function(err, usuario){
            
            if (err) {
                console.log(err);
                //inicializamos (new Usuario) para que aparezcan precargados los datos del formulario
                res.render('usuario/update', {errors: err.errors, usuario: new Usuario({nombre: req.body.nombre, email: req.body.email})}) ;
            }else{
                res.redirect('/usuarios');
                return;
            }
        });
    },
    create_get: function (req, res, next){
        res.render('usuarios/create', {errors:{}, usuario: new Usuario ()});
    },
    create: function(req, res, next){
        if (req.body.password != req.body.confirm_password){
            res.render('usuarios/create', {errors: {confirm_password: { message:'No coincide con el password ingresado'}}, usuario: new Usuario({nombre: req.body.nombre, email: req.body.email})}) ;
            return;

        }
        Usuario.create({ nombre: req.body.nombre, email: req.body.email, password: req.body.password}, function (err, nuevoUsuario){
            if (err){
                res.render('usuarios/create', {errors: err.errors, usuario: new Usuario({nombre: req.body.nombre, email: req.body.email})});
            }else{
                nuevoUsuario.enviar_email_bienvenida(); //en caso de que sea exitoso, se envia un email de bienvenida, este metodo está en models> usuario.js
                res.redirect('/usuarios');
            }
        });
    },
    delete: function(req, res, next){
        Usuario.findByIdAndDelete(req.body.id, function(err){
            if (err)
                next(err);
            else
                res.redirect('/usuarios');
        });
    },

}