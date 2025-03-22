import {Mistral} from "@mistralai/mistralai";

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY ?? "",
});

async function run(text: {name: string | null; message: string}[]) {
  const result = await mistral.chat.stream({
    model: "mistral-large-latest",
    temperature: 0.8,
    messages: [
      {
        content: `На основе текстовых сообщений составь анкету о человеке:

I. Характер:

•  5+ черт характера (с примерами из сообщений).
•  Эмоциональность (спокойный, сдержанный, эмоциональный, импульсивный; примеры).
•  Отношение к себе (уверенность, самокритика/ирония/любование; примеры).
•  Ценности (семья, дружба, карьера, справедливость, саморазвитие?).

II. Реальная жизнь:

•  Род деятельности/интересы (кино, IT?).
•  Возраст (диапазон, на основе стиля общения/лексики).
•  Семейное положение (если возможно).
•  Эрудиция (широкий кругозор/узкая специализация?).

III. Отношения:

•  Стиль общения (официальный, неформальный, дружелюбный, директивный; примеры).
•  Роль в общении (лидер, слушатель, советчик, критик; примеры).
•  С кем из чата общается чаще всего, типы взаимоотношений`,
        role: "system",
      },
      {
        content: JSON.stringify(text),
        role: "user",
      },
    ],
  });

  for await (const event of result) {
    // Handle the event
    await Bun.write(
      Bun.stdout,
      event.data.choices.at(0)?.delta.content?.toString()
    );
    //console.log(event.data.choices.at(0)?.delta.content);
  }

  // Handle the result
  // console.log(result);
  // console.log(result.choices?.at(0)?.message.content);
}

export {run};
