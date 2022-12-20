import { names } from "../data-access/name-datas";
import { ceps } from "../data-access/cep-datas";

// How to import this file
// Put this import in your file:
// import * as func from '../../../../libs/util/shared/functions/commonFunctions';

// How to use functions
// Use prefix "func"
// Example code:
// func.name_fields();

export function string_fields() {
  var text1 = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzáàâãüç";
  for (var i = 0; i < 10; i++)
    text1 += possible.charAt(Math.floor(Math.random() * possible.length));
  return text1;
}
export function password_fields() {
  var text2 = "";
  var possible = "Aaãâáàäç!@#$%&*?|/()[]{}<>+=-_;:.,";
  for (var i = 0; i < 10; i++)
    text2 += possible.charAt(Math.floor(Math.random() * possible.length));
  return text2;
}
export function phone_fields() {
  var text3 = "";
  var possible = "1234567890";
  for (var i = 0; i < 8; i++)
    text3 += possible.charAt(Math.floor(Math.random() * possible.length));
  return "459" + text3;
}
export function number_fields() {
  var number1 = "";
  var possible = "1234567890";
  for (var i = 0; i < 3; i++)
    number1 += possible.charAt(Math.floor(Math.random() * possible.length));
  return +number1;
}
export function email_fields() {
  var text5 = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzAa";
  for (var i = 0; i < 10; i++)
    text5 += possible.charAt(Math.floor(Math.random() * possible.length));
  return text5 + "@gmail.com";
}
export function name_fields() {
  const name = names[Math.floor(Math.random() * names.length)];
  return name;
}
export function cep_fields() {
  const cep = ceps[Math.floor(Math.random() * ceps.length)];
  return cep.toString();
}
export function cnpj_fields() {
  var cnpj = "";
  var possible = "1234567890";
  for (var i = 0; i < 14; i++)
    cnpj += possible.charAt(Math.floor(Math.random() * possible.length));
  return cnpj;
}
export function sanitizePhone(phone: string) {
  return phone
    .split("(")
    .join("")
    .split(")")
    .join("")
    .split(" ")
    .join("")
    .split("-")
    .join("");
}
export function randMoney() {
  var money = "";
  var possible = "1234567890";
  for (var i = 0; i < 3; i++)
    money += possible.charAt(Math.floor(Math.random() * possible.length));
  return money;
}
export function randTime() {
  var time = "";
  var possible = "1234567890";
  for (var i = 0; i < 3; i++)
    time += possible.charAt(Math.floor(Math.random() * possible.length));
  return time;
}
export function sum(a: number, b: number) {
  let total = a + b;
  return total;
}
//CPF\\
export function geraCpf() {
  const num1 = geraAleatorio();
  const num2 = geraAleatorio();
  const num3 = geraAleatorio();

  const dig1 = dig(num1, num2, num3);
  const dig2 = dig(num1, num2, num3, dig1);

  return `${num1}.${num2}.${num3}-${dig1}${dig2}`;
}
function dig(n1: string, n2: string, n3: string, n4?: string) {
  const nums = n1.split("").concat(n2.split(""), n3.split(""));

  if (n4 !== undefined) {
    nums[9] = n4;
  }

  let x = 0;

  for (let i = n4 !== undefined ? 11 : 10, j = 0; i >= 2; i--, j++) {
    x += parseInt(nums[j]) * i;
  }

  const y = x % 11;
  return String(y < 2 ? 0 : 11 - y);
}
function geraAleatorio() {
  const aleat = Math.floor(Math.random() * 999);
  return ("" + aleat).padStart(3, "0");
}
//CPF\\
export const delay = (milliseconds: number, fn: any) => {
  setTimeout(() => {
    fn();
  }, milliseconds);
};
//DATE NOW\\
const now = new Date();
function padTo2Digits(num: number) {
  return num.toString().padStart(2, "0");
}
function formatDate(date: Date) {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join("-");
}
export const dateNow = formatDate(new Date());
function dateNext(date: Date) {
  return [
    date.getFullYear() + 1,
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join("-");
}
export const dateNextYear = dateNext(new Date());
