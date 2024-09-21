// src/app/models/CarDTO.ts
import { Brand } from './model';
import { Model } from './model';
import { BodyType } from './model';
import { Color } from './model';

// export interface CarDTO {
//   id: number;
//   brand: Brand;
//   model: Model;
//   bodyType: BodyType;
//   color: Color;
//   amount: number;
//   price: number;
//   city: string;
// }


export interface CarDTO {
  carId: number;
  brand: Brand;
  model: Model; // JSON-i andmete järgi on carModel
  bodyType: BodyType;
  color: Color; // JSON-i andmete järgi on carColor
  year: number; // JSON-is on "year", kuid mitte "city"
  carStateNumberPlate: string; // JSON-is on "carStateNumberPlate"
  mileage: number; // JSON-is on "mileage"
  status: string; // JSON-is on "status"
  imagePath: string; // JSON-is on "imagePath"
  amount: number;
  //price: number; // JSON-is on "amount" ja "price"
  //city: string; // parameter
}


// // src/app/models/car.dto.ts
// export interface CarDTO {
//     id: number;
//     brand: string;
//     model: string;
//     bodyType: string;
//     color: string;
//     amount: number;
//     price: number;
//     city: string;
//   }