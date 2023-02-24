import { Request, Response } from 'express';
import { ThingsFileRepo } from '../repository/things.file.repo';

export class ThingsController {
  // Le agregamos en el constructor la inyección de dependencia del repo:
  constructor(public repo: ThingsFileRepo) {
    this.repo = repo;
  }

  getAll(_req: Request, resp: Response) {
    this.repo.read().then((data) => {
      resp.json(data);
    });
  }

  get(req: Request, resp: Response) {
    resp.send('Thing ' + req.params.id);
  }

  post(_req: Request, _resp: Response) {}

  patch(_req: Request, _resp: Response) {}

  delete(_req: Request, _resp: Response) {}
}
