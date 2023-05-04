import { Types } from "mongoose";

type TypeAvliableMethods = 'get' | 'post' | 'put' | 'delete' | 'patch';

export type TypeRoutePersmission = {
    route: string;
    method: TypeAvliableMethods;
}


export type TypeMongoId = Types.ObjectId; 