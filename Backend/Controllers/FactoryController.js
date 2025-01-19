const FactoryDAO = require('../DAO/FactoryDAO');
class FactoryController{
    constructor(filepath){
        this.factoryDAO = new FactoryDAO(filepath)
    }
    async get(req, res){
        try{
            const factories = await this.factoryDAO.get();
            res.json(factories);
        } catch(error){
            res.status(500).send('Greska pri ucitavanju fabrika')
        }
    }
    async add(req, res){
        try{
            const factory = req.body;
            await this.factoryDAO.create(factory);
            res.status(201).json(factory);
        }catch(error){
            res.status(500).send('Greska pri dodavanju fabrike');
        }
    }
    async getFactoryById(req, res){
        try{
            const id = req.params.id;
            const factory = await this.factoryDAO.getFactoryById(id);
            if(factory){
                res.json(factory);
            }else{
                res.status(404).send('Nije nadjena fabrika');
            }
        }catch(error){
            res.status(500).send('Greska pri trazenju fabrike');
        }
    }
    async updateFactory(req, res){
        try{
            const id = req.params.id;
            const newData = req.body;
            await this.factoryDAO.updateFactory(id, newData);
            res.status(200).send('Uspesno updejtovana fabrika');
        }catch(error){
            res.status(500).send('Greska pri trazenju fabrike');
        }
    }
    async deleteFactory(req, res){
        try{
            const id = req.params.id;
            await this.factoryDAO.deleteFactory(id);
            res.status(200).send('Uspesno izbrisana fabrika');
        }catch(error){
            res.status(500).send('Greska pri trazenju fabrike');
        }
    }
}
module.exports = FactoryController;