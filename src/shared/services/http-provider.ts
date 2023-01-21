import axios from 'axios';

export class HttpProvider {
  static async get<T>(url: string, params: object): Promise<T> {
    const response = await axios.get(url, { params });

    return response.data;
  }
}
