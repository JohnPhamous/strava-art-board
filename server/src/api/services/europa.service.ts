import { EuropaDictionaryInput } from "../types/europa.type";

export class EuropaService {
  convert(_xml: EuropaDictionaryInput): Promise<any> {
    return Promise.resolve({});
  }
}

export default new EuropaService();
