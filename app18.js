const Sequelize = require("sequelize");
const express = require("express");
const port = process.env.PORT || 8080;

// определяем объект Sequelize: database, username, password
const sequelize = new Sequelize("j775522", "j775522_SQLLogin_1", "1v5rkqzjmg", {
    dialect: "mssql",
    host: "j775522.mssql.somee.com",
    port: "1433",
    define: { timestamps: false }
});

// опреднляем модель данных
const User = sequelize.define("user", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
    name: { type: Sequelize.STRING, allowNull: false },
    date: { type: Sequelize.STRING, allowNull: false },
    address: { type: Sequelize.STRING, allowNull: false },
    city: { type: Sequelize.STRING, allowNull: false },
    phone: { type: Sequelize.STRING, allowNull: false },
});
sequelize.sync().then(result=>{
    console.log('result1');
}).catch(err=> console.log('err1'));


// создаем парсер для данных в формате json
const app = express();
const jsonParser = express.json();


// удаление данных
app.delete("/users/:id", function(req, res){  
    const id = req.params.id;
    User.destroy({where: {id: id} }).then(() => {
        console.log('res7');
    }).catch(err=>console.log('err'));
});

// обновление данных в БД
app.put("/users/:id", jsonParser, function (req, res) {         
    if(!req.body) return res.sendStatus(400);
    const id = req.params.id;
    User.update(req.body, {where: {id: id} }).then(() => {
        console.log('res8');
    }).catch(err=>console.log('err8'));
});

// получаем отредактированные данные и отправляем их в БД
app.post("/users", jsonParser, function (req, res) {         
    if(!req.body) return res.sendStatus(400);
    User.create(req.body).then(users=>{
        res.json(users);
    }).catch(err=>console.log('err9'));    
});

// Отправка данных на клиент
app.get('/users', function (req, res) {
    User.findAll({raw:true}).then(users=>{
        res.json(users);
    }).catch(err=>console.log('err3'));
});

// выход из админки для владельца
app.use("/quit",function (req, res) { 
    console.log('Application is closing...');
    app.close;
    process.exit(0);
});

// постоянная переадресация
app.use("/:id",function (request, response) {
    const id = request.params.id;
    if (id!='') response.redirect("/");
});

// загрузка фронтенда в браузер
app.get("/", function(request, response){    
    response.sendFile(__dirname + "/index.html");     
});
  
app.listen(port, ()=>{console.log(`Сервер запущен по адресу http://localhost:${port}.`);});