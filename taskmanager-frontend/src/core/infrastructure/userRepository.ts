import { UserProps } from "../entities";
import { UserRepositoryProps } from "../entities/repositories";
import { AxiosResponse } from "axios";
import { User } from "../entities/models";
import { Repository } from "./repository";
import { API } from "store";

export class UserRepository
  extends Repository<UserProps>
  implements UserRepositoryProps
{
  async logIn(
    email: string,
    password: string
  ): Promise<AxiosResponse<UserProps>> {
    return API.post<User>("/login", new User({ email, password }));
  }

  async signUp(
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ): Promise<AxiosResponse<UserProps>> {
    return UserRepository.prototype.create(
      "/signup",
      new User({ email, name, password, password_confirmation })
    );
  }

  async deleteAccount(
    id: number,
    password: string
  ): Promise<AxiosResponse<boolean>> {
    return UserRepository.prototype.delete(`/api/v1/users`, `${id}`, {
      password,
    });
  }
  async getProfile(): Promise<AxiosResponse<UserProps>> {
    return API.get("/profile");
  }
}
