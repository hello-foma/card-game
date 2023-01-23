import { HttpProvider } from '@shared/services/http-provider';
type NameApiResponse = {
  success: {
    total: null,
    start: number,
    limit: number
  },
  contents: {
    category: string,
    variation: null,
    names: string[]
  },
  "copyright": string
}
export class NamesApi {
  static async getName(): Promise<string> {
    const res = await HttpProvider.get<NameApiResponse>('https://api.fungenerators.com/name/generate', {
      category: 'car',
      limit: 1
    });

    return res.contents.names[0];
  }
}
