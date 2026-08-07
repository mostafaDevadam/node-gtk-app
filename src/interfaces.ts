

export interface IService<T> {
    create(data: T): Promise<T | any>
    update(id: string, data: T): void
    getAll(): Promise<T[] | any[]> 
    getById(id: string): T | any
    remove(id: string): void
} 