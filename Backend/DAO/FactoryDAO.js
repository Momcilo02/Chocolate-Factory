const fs = require('fs')
const Factory = require('../Model/Factory');
const { v4: uuidv4 } = require('uuid');
const { resolve } = require('path');
const { rejects } = require('assert');
class FactoryDAO{
    constructor(filepath){
        this.filepath = filepath;
    }
    async get(){
        return new Promise((resolve, reject) =>
        {
            fs.readFile(this.filepath, 'utf-8', (err, data)=>
            {
                if(err){
                    return reject(err);
                }
                resolve(JSON.parse(data));
            });
        });
    }
    async create(newFactory){
        return new Promise((resolve, reject) =>
        {
            this.get().then(factories =>
            {
                newFactory.id = uuidv4();
                factories.push(newFactory);
                fs.writeFile(this.filepath, JSON.stringify(factories, null, 2), 'utf-8', (err) =>{
                    if(err){
                        return reject(err);
                    }
                    resolve(newFactory);
                });
            }
            ).catch(reject);
        });
    }
    async getFactoryById(id){
        return new Promise((resolve, reject) => {
            this.get().then(factories =>{
                const f = factories.find(f => f.id === id);
                if(f){
                    resolve(f);
                }else{
                    reject(new Error('No factory found'));
                }
            }
            ).catch(reject);
        });
    }

    async updateFactory(id, newFactory){
        return new Promise((resolve, reject) =>{
            this.get().then( factories =>{
                const i = factories.findIndex(f => f.id === id);
                if(i !==-1){
                    factories[i] = {...factories[i], ...newFactory};
                    fs.writeFile(this.filepath, JSON.stringify(factories, null, 2), 'utf-8', (err) =>{
                        if(err){
                            return reject(err);
                        }
                        resolve(factories[i]);
                    });
                }else{
                    reject(new Error('no factory found'));
                }
            }).catch(reject);
        });
    }
    async deleteFactory(id){
        return new Promise((resolve, reject) => {
            this.get().then(factories =>{
                const newFactories = factories.filter(f => f.id !== id);
                fs.writeFile(this.filepath, JSON.stringify(newFactories, null, 2), 'utf-8', (err) =>{
                    if(err){
                        return reject(err);
                    }
                    resolve();
                });
                
            }
            ).catch(reject);
        });
    }
}
module.exports = FactoryDAO;