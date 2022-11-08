import { Request,Response } from 'express';

class Controller {
    public static ping(req:Request, res: Response){
        res.json({
            status: "success",
            
        })
    }
}

export default Controller;