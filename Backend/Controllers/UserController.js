const UserDAO = require('../DAO/UserDAO');
const User = require('../Model/User');

class UserController{
    constructor(filepath){
        console.log(filepath);
        this.userDAO = new UserDAO(filepath);
    }
    async get(req, res){
        try{
            const users = await this.userDAO.get();
            res.json(users);
        }
        catch(error){
            res.status(500).send('Greska pri citanju korisnika');
        }
    }
    async create(req, res){
        try{
            
            const user = req.body;
            console.log(user.username)
            await this.userDAO.create(user)
            res.status(201).json(user)
        }
        catch(error){
            res.status(500).send('Greska pri dodavanju korisnika');
        }
    }
    
    async update(req, res){
        try{
            const id = req.params.id;
            const newData = req.body;
            await this.userDAO.updateUser(id, newData);
            res.status(200).send('Uspesno updejtovan user');
        }
        catch(error){
            res.status(500).send('Greska pri izmeni korisnika');
        }
    }
    async getUserById(req, res){
        try{
            const id = req.params.id;
            const user = await this.userDAO.getById(id);
            if(user){
                res.json(user)
            }
            else{
                res.status(404).send('Nije nadjen user');
            }
        }
        catch(error){
            res.status(500).send('Greska pri trazenju korisnika');
        }
    }

    async login(req, res){
        try{
            const { username, password } = req.body;
            console.log(username);
            console.log(password);
            //const username = req.params.username;
            //const password = req.params.password;
            const user = await this.userDAO.getById(username);
            if(user.password === password){
                res.json(user)
            }
            else{
                res.status(401).send('Los username i password');
            }
        }
        catch(error){
            res.status(500).send('Greska pri prijavljivanju korisnika');
        }
    }
    async getFreeMenagers(req, res){
        try{
            console.log("trazim menadzere")
            const users = await this.userDAO.get();
            res.json(users);
            
            //const users = await this.userDAO.getFreeMenagers();
            //if(users){
               // res.json(users)
            //}
        }
        catch(error){
            res.status(500).send('Greska pri trazenju menagera');
        }
    }


}

module.exports = UserController;