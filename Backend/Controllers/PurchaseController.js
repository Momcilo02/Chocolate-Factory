const PurchaseDAO = require('../DAO/PurchaseDAO');

class PurchaseController{
    constructor(filepath){
        this.purchaseDAO = new PurchaseDAO(filepath);
    }

    async get(req, res){
        try{
            const pucheses = await this.purchaseDAO.get();
            res.json(pucheses);
        }catch(error){
            res.status(500).send('Greska pri citanju kupovina');
        }
    }
    async getById(req, res){
        try{
            const id = req.params.id;
            const purchase = await this.purchaseDAO.getById(id);
            if(purchase){
                res.json(purchase);
            }else{
                res.status(404).send('kupovina nije pronadjena');
            }
        }catch(error){
            res.status(500).send('Greska pri trazenju kopovine');
        }
    }

    async create(req, res){
        try{
            const puchese = req.body;
            await this.purchaseDAO.create(puchese);
            res.status(201).json(puchese)
        }catch(error){
            res.status(500).send('Greska pri cuvanju kupovina');
        }
    }

    async update(req, res){
        try{
            const id = req.params.id;
            const newData = req.body;
            await this.purchaseDAO.update(id, newData);
            res.status(200).send('Uspesno izmenjena kupovina')
        }catch(error){
            res.status(500).send('Greska pri izmeni kupovina');
        }
    }
    async delete(req, res){
        try{
            const id = req.params.id;
            await this.purchaseDAO.delete(id);
            res.status(200).send('Uspesno izbrisana kupovina')
        }catch(error){
            res.status(500).send('Greska pri brisanju kupovina');
        }
    }

}
module.exports = PurchaseController;