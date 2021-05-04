const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");//instala a biblioteca ,faz o require e no começo usa app.use(cors());
const jwt = require("jsonwebtoken");//pra gerar token(chave secreta)

const JWTSecret = "njnumbbygvnftcvesrxrdrhm";

app.use(cors());
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

    function auth(req,res,next){
        const authToken = req.headers['authorization'];

        if(authToken != undefined){

            const bearer = authToken.split(' ');//divide em array de strings // duas partes
            var token = bearer[1];
            jwt.verify(token,JWTSecret,(err,data)=>{
                if(err){
                    res.status(401);
                    res.json({err:"token inválido!"});
                }else{
                    req.token = token;
                    req.loggedUser = {id: data.id,email: data.email};
                    next();
                }
            });

        }else{
            res.status(401);
            res.json({err:"invalid token"});
        }//validar token

        //console.log(authToken);
        
    }//autenticar as rotasas,coloquei na (games)

var DB = {

    games:[
        {
            id:23,
            title: "crash bandicoot",
            year: 1996,
            price: 100 

        },
        {
            id:73,
            title: "call of duty mw",
            year: 2019,
            price: 60 

        },
        {
            id:11,
            title: "minecraft",
            year: 1996,
            price: 1000 

        }
    ],
    users:[
        {
            id:1,
            name:"guilherme",
            email:"gui-dev@gmail.com",
            password:"pythondevgui"

        },
        {
            id:2,
            name:"leo",
            email:"leo-bowbow@gmail.com",
            password:"pangola" 

        },
    ]

}//um banco de dados falso,futuramente implementar o sequelize.

app.get("/games",auth,(req,res)=>{// (/games)= a listagem de jogos citados
    res.statusCode = 200; // 200 = requisição com sucesso,erro é 404/403.
    res.json(DB.games);
});//rota *get*=pega dados e exibe na tela

app.get("/game/:id",auth,(req,res)=>{
    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{
       var id = parseInt(req.params.id);
       var games = DB.games.find(g => g.id == id);
       if(game != undefined){
           res.statusCode = 200;
           res.json(game);
       }else{
           res.sendStatus(404);
       }
    }
});

//cadastra o jogo
app.post("/game",auth,(req,res) => {
    
    var{title,price,year} = req.body;

    DB.games.push({
        id: 2323,
        title,
        price,
        year
    });//adc dados ao array.
    res.sendStatus(200);
     
})

app.delete("/game/:id",auth,(req,res) =>{

    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{
       var id = parseInt(req.params.id);
       var index = DB.games.findIndex(g => g.id == id);

       if(index == -1){
        res.sendStatus(404);
       }else{
           DB.games.splice(index,1);
           res.sendStatus(200);
       }
       
    }

});

app.put("/game/:id",(req,res)=>{
    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{
       var id = parseInt(req.params.id);
       var game = DB.games.find(g => g.id == id);
       if(game != undefined){

        var{title,price,year} = req.body;

        if(title !=undefined){
            game.title = title;

        }
        if(price !=undefined){
            game.price = price;
        }
        if(year !=undefined){
            game.year = year;
        }

        res.sendStatus(200);
           
       }else{
           res.sendStatus(404);
       }
    }
});

    app.post("/auth",(req,res) =>{

        var{email,password} = req.body;
        if(email != undefined){
            var user = DB.users.find(u => u.email == email);
            if(user != undefined){
                if(user.password == password){

                    jwt.sign({id:user.id,email:user.email},JWTSecret,{expiresIn:'48h'},(err,token)=>{
                        if(err){
                            res.status(400);
                            res.json({err:"Internal Failure"});
                        }else{

                            res.status(200);
                            res.json({token: token});

                        }
                    })//info dentro do token
                   }else{
                    res.status(401);
                    res.json({err:"Invalid Credentials."});
                }

            }else{
                res.status(404);
                res.json({err:"Invalid data, does not exist in the database."});
            }

        }else{
            res.status(400);//https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status
            res.json({err:"Invalid data"});
        }

    });//auth = authentication



app.listen(3737,()=>{
    console.log("API RODOU");
});//servidor