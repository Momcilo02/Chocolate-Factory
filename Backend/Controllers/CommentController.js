const CommentDAO = require('../DAO/CommentDAO');

class CommentController{
    constructor(filepath){
        this.commentDAO = new CommentDAO(filepath);
    }
    async get(req, res){
        try{
            const comments = await this.commentDAO.get();
            res.json(comments);
        }catch(error){
            res.status(500).send('Greska pri citanju komentara');
        }
    }
    async create(req, res){
        try{
            const comment = req.body;
            await this.commentDAO.create(comment);
            res.status(201).json(comment);
        }catch(error){
            res.status(500).send('Greska pri pravljenju komentara');
        }
    }
    async update(req, res){
        try{
            const id = req.params.id;
            const comment = req.body;
            await this.commentDAO.update(id, comment);
            res.status(200).send('Uspesno izmenjen komentar');
        }catch(error){
            res.status(500).send('Greska pri izmeni komentara');
        }
    }

}
module.exports = CommentController;