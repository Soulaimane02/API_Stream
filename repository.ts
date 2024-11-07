export default interface IRepository<T> 
{
    getAll: () => Promise<T[]>;
    getById: (id: string) => Promise<T>;
    add: (item: T) => Promise<T>;
    deleteOne: (id: string) => Promise<void>;
    put: (id: string, item: any) => Promise<T>;
}