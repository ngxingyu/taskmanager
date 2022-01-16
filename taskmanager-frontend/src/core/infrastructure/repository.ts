import { RepositoryProps } from "../entities/repositories";
import { AxiosResponse } from "axios";
import { API } from "store";
export class Repository<T> implements RepositoryProps<T> {
  create(route: string, model: T): Promise<AxiosResponse<T>> {
    return API.post<T>(route, model);
  }

  update(route: string, model: T): Promise<AxiosResponse<T>> {
    return API.put<T>(route, model);
  }

  delete(
    route: string,
    id: string,
    data?: any
  ): Promise<AxiosResponse<boolean>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return API.delete(`${route}/${id}`, { data });
  }

  getAll(route: string, params?: any): Promise<AxiosResponse<T[]>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return API.get<T[]>(route, { params: { ...params } });
  }

  getById(route: string, id: string, params?: any): Promise<AxiosResponse<T>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return API.get<T>(`${route}/${id}`, { params: { ...params } });
  }
}
