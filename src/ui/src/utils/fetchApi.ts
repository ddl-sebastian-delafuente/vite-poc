export const defaultHeaderConfig = { 'Content-type': 'application/json' } as const;

export enum HttpMethods {
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

export type HttpMethodsType = `${HttpMethods}`;

export type fetchApiInfo<T> = {
  url: string;
  data: T;
  method: HttpMethodsType;
  headers?: HeadersInit;
};

export async function fetchApi<T>({
  url,
  data,
  method,
  headers = defaultHeaderConfig
}: fetchApiInfo<T>) {
  return fetch(url, {
    body: JSON.stringify(data),
    method,
    headers
  }).then(async response => {
    if (response.status < 400) {
      return response;
    } else {
      throw new Error(await response.text());
    }
  });
}

export default fetchApi;
