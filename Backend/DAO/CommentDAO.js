const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class CommentDAO{
    constructor(filepath){
        this.filePath = filepath;
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
    async create(newComment){
        return new Promise((resolve, reject) => {
            this.get().then(comments => {
                newComment.id = uuidv4();
                comments.push(newComment);
                fs.writeFile(this.filePath, JSON.stringify(comments, null, 2), 'utf-8', (err)=>{
                    if(err){
                        return reject(err);
                    }
                    resolve(newComment);
                })
            }).catch(reject)
        });
    }
    async update(id, newComment){
        return new Promise((resolve, reject) => {
            this.get().then(comments => {
                const i = comments.findIndex(c => c.id === id);
                if(i !== -1){
                    comments[i] = {...comments[i], ...newComment};
                    fs.writeFile(this.filePath, JSON.stringify(comments, null, 2), 'utf-8', (err)=>{
                        if(err){
                            return reject(err);
                        }
                        resolve(comments[i]);
                    });
                }else{
                    reject(new Error("no comment found"));
                }
            }).catch(reject)
        });
    }
}
module.exports = CommentDAO;