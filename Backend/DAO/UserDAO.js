const {readJsonFile, writeJsonFile} = require('../Utils/jsonHandler');
const User = require('../Model/User');
const fs = require('fs');
const { resolve } = require('path');
const { rejects } = require('assert');
const { v4: uuidv4 } = require('uuid');

class UserDAO{
    constructor(filePath){
        this.filePath = filePath;
    }

    async get(){
        return new Promise((resolve, reject) => {
            fs.readFile(this.filePath, 'utf-8', (err, data) =>{
                if(err){
                    return reject(err);
                }
                resolve(JSON.parse(data));
            }
            );
        });
    }
    async create(newUser){
        return new Promise((resolve, reject) => {
            this.get().then(users =>{
                const i = users.findIndex(u => u.username === newUser.username);
                if(i !==-1){
                   return reject(new Error('username already exists'));
                }
                users.push(newUser);
                fs.writeFile(this.filePath, JSON.stringify(users, null, 2), 'utf-8', (err) =>{
                    if(err){
                        return reject(err);
                    }
                    resolve(newUser);
                });
            }).catch(reject);
        })
    }
    async getById(username){
        return new Promise((resolve, reject) =>{
            this.get().then(users =>{
                const u = users.find(f => f.username === username);
                if(u){
                    resolve(u);
                }else{
                    reject(new Error('No user found'));
                }
            }).catch(reject);
        });
    }
    async updateUser(id, newUser){
        return new Promise((resolve, reject) =>{
            this.get().then(users =>{
                const i = users.findIndex(u => u.username === id);
                if(i!== -1){
                    users[i] = {...users[i], ...newUser};
                    fs.writeFile(this.filePath, JSON.stringify(users, null, 2), 'utf-8', (err) =>{
                        if(err){
                            return reject(err);
                        }
                        resolve(users[i]);
                    });
                }else{
                    reject(new Error('no user fount'));
                }
            }).catch(reject)
        });
    }

    async getFreeMenagers(){
        return new Promise((resolve, reject) =>{
            console.log("trazim menadzere");
            this.get().then(users =>{
                const freeMenagers = users.filter(user => (user.role === 'Menager' && user.factory ===null));
                resolve(users);
                
            }).catch(reject);
        });
    }


}

module.exports = UserDAO;