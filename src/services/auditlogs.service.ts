/*
log_id (PK) 
user_id (FK)
action_type
description
timestamp
ip_address
details (JSON)


*/

import { IService } from "../interfaces.js";
import { AUDIT_LOG_TYPE } from "../types.js";
import { StorageService } from "./storage.service.js";
import { v4 as uuidv4 } from 'uuid';

export class AuditLogService implements IService<AUDIT_LOG_TYPE> {

    


    async create(data: AUDIT_LOG_TYPE): Promise<AUDIT_LOG_TYPE | any> {

        if(!data.user_id){
            console.log("cannot create audit-log because no user_id")
            return false
        }

        // check if user is existing



        console.log("[AuditLogService] create data:", data);

        const audit_log: AUDIT_LOG_TYPE = {
            ...data,
            id: uuidv4(),
            created_at: new Date().toISOString(),
        }
        await StorageService.saveInJson("storage", "audit_logs", audit_log)
        return audit_log
    }


    update(id: string, data: AUDIT_LOG_TYPE): void {

    }


    async getAll(): Promise<AUDIT_LOG_TYPE[] | any[]> {
        const list = await StorageService.readFromJson("storage", "audit_logs")!!
        if (typeof (list) == 'undefined' || !list) {
            return []
        }
        return list as AUDIT_LOG_TYPE[]
    }


    async getById(id: string) {
        const all = await this.getAll()
        const one = all.filter((fl) => fl.id === id)[0]
        if (!one) {
            console.log("audit-log by id is not found!")
            return {}
        }
        return one
    }


    remove(id: string): void {

    }




}