import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("products").del();

    // Inserts seed entries
    await knex("products").insert([
        { name: "Batata frita", price: 30.99 },
        { name: "Tomate defumado", price: 11.99 },
        { name: "Whey protein com mingau", price: 22.99 },
        { name: "Tilapia", price: 40.99 },
        { name: "Batata doce assada", price: 20.99 },
        { name: "Ovos fritos", price: 17.99 },
        { name: "Frutas com iorgute", price: 12.99 },
        { name: "Pizza", price: 88.99 },
        { name: "Hamburguer", price: 26.99 },
        { name: "Coca-Cola Zero", price: 10.99 }
    ]);
};
