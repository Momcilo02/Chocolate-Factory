const { rejects } = require('assert');
const fs = require('fs');
const { resolve } = require('path');
const { v4: uuidv4 } = require('uuid');

class PurchaseDAO {
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
            });
        });
    }
    async create(newPurchase){
        return new Promise((resolve, reject) => {
            this.get().then(purchases =>{
                newPurchase.id = uuidv4().slice(0,10);
                purchases.push(newPurchase);
                fs.writeFile(this.filePath, JSON.stringify(purchases, null, 2), 'utf-8', (err) =>{
                    if(err){
                        return reject(err);
                    }
                    resolve(newPurchase);
                })
            }).catch(reject);
        });
    }
    async getById(id){
        return new Promise((resolve, reject) => {
            this.get().then(purchases =>{
                const p = purchases.find(pur => pur.id === id);
                if(p){
                    resolve(p);
                }else{
                    reject(new Error("No purchase found"));
                }
            }).catch(reject);
        });
    }

    async update(id, newPurchase){
        return new Promise((resolve, reject) => {
            this.get().then(purchases =>{
                const i = purchases.findIndex(p => p.id === id);
                if(i!== -1){
                    purchases[i] = {...purchases[i], ...newPurchase};
                    fs.writeFile(this.filePath, JSON.stringify(purchases, null, 2), 'utf-8', (err) =>{
                        if(err){
                            return reject(err);
                        }
                        resolve(purchases[i]);
                    });
                }else{
                    reject(new Error("no purches found"));
                }
            }).catch(reject);
        });
    }
    async delete(id){
        return new Promise((resolve, reject) => {
            this.get().then(purchases =>{
                const newPurcheses = purchases.filter(p => p.id !==id)
                fs.writeFile(this.filePath, JSON.stringify(newPurcheses, null, 2), 'utf-8', (err) =>{
                    if(err){
                        return reject(err);
                    }
                    resolve();
                })
            }).catch(reject);
        });
    }
}
module.exports = PurchaseDAO;