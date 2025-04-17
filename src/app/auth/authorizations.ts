import { Operator } from "../interfaces/operator";

export interface AuthorizationsInterface {
  [page:string]: {
    [role in Operator['role']]?: {
      create?: boolean;
      read?: boolean;
      update?: boolean;
      delete?: boolean;
      [key: string]: boolean | undefined;
    };
  }
}


export const Authorizations :AuthorizationsInterface ={
  unita_operarive:{
    admin:{ create:true, read:true, update:true, delete:true },
    writer:{ create:true, read:true, update:true },
    user:{ read:true },
  }
}
