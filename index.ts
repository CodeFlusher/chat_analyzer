import "dotenv/config";
import {run} from "./ai";
import type {Chat} from "./types";

const file = (await Bun.file("result.json").json()) as Chat;

// const from = new Date();
// from.setHours(from.getHours() - 2);
// console.log(from);

// const messages = file.messages.map((message) => ({
//   ...message,
//   date: new Date(message.date),
// }));

// const b = messages.filter((message) => messag);

const a = file.messages
  .filter((message) => message.from === "sova")
  .map((message) => {
    return {
      name: message.from,
      message: message.text,
    };
  });

const b = a.slice(6000);

console.log(b.length);
run(b);
