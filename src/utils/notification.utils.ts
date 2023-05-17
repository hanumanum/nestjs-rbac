import { TupleErrorOrData } from "../common/interfaces/service.interface"
import { errorLogger } from "./logger.utils"

export const sendEmail = async (email: string, subject: string, message: string, attachments?: any[]): TupleErrorOrData<boolean> => {
    try {
        errorLogger(new Error("Not implemented yet"))
        return [null, true]
    } catch (error) {
        errorLogger(error)
        return [null, false]
    }
}