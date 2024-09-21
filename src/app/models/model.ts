export interface Brand {
    id: number;
    name: string;
  }
  
  export interface Model {
    id: number;
    name: string;
  }
  
  export interface BodyType {
    id: number;
    name: string;
  }
  
  export interface Color {
    id: number;
    name: string;
  }
  
  export interface Car {
    id: number;
    brand: Brand;
    carMmodel: Model;
    bodyType: BodyType;
    carColor: Color;
    amount: number;
    price: number;
  }
  