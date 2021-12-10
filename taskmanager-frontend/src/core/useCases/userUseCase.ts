import { UserRepositoryProps } from "../entities/repositories";
import { UserProps } from "../entities";

export interface UserService {
    logIn(email: string, password: string): Promise<UserProps>;
    signUp(name: string, email: string, password: string, confirmation_password: string): Promise<UserProps>;
    delete(id: number, password: string): Promise<boolean>;
    getProfile(): Promise<UserProps>;
}

export class UserServiceImpl implements UserService {
    userRepo: UserRepositoryProps;

    constructor(ur: UserRepositoryProps) {
        this.userRepo = ur;
    }
    async getProfile(): Promise<UserProps> {
        return this.userRepo.getProfile().then(r => r.data)
    }
    async logIn(email: string, password: string): Promise<UserProps> {
        return this.userRepo.logIn(email, password).then(r => r.data)
    }
    async signUp(name: string, email: string, password: string, confirmation_password: string): Promise<UserProps> {
        return this.userRepo.signUp(name, email, password, confirmation_password).then(r => r.data);
    }
    async delete(id: number, password: string): Promise<boolean> {
        return this.userRepo.deleteAccount(id, password).then(r => r.data);
    }

}