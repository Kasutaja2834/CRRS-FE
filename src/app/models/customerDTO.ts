export interface CustomerDTO  {
  customerId:number;
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    addressCity: string;
    addressCountry: string;
  //  username: string;
    email: string;
   // password: string;
    licences?: string[]; // Näide, kui on olemas litsentsid
  }