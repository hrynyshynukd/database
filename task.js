const { Client } = require('pg');
const prompt = require('prompt-sync')({ sigint: true });

const client = new Client({
    connectionString: 'postgresql://neondb_owner:npg_b1fZmw7sikQL@ep-misty-voice-a220b7b1-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

async function addStudent() {
    const firstName = prompt('Enter first name: ');
    const lastName = prompt('Enter last name: ');
    const mark = parseFloat(prompt('Enter mark (e.g. 4.5): '));
    const email = prompt('Enter email: ');
    const phoneNumber = prompt('Enter phone number: ');

    const query = `
        INSERT INTO students (first_name, last_name, mark, email, phone_number)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;

    try {
        const res = await client.query(query, [firstName, lastName, mark, email, phoneNumber]);
        console.log('\nStudent added successfully:', res.rows[0]);
    } catch (err) {
        console.error('\nError adding student:', err.message);
    }
}

async function main() {
    await client.connect();

    let answer = prompt('Do you want to add a new student? (y/n): ').toLowerCase();

    while (answer === 'y') {
        await addStudent();
        answer = prompt('\nDo you want to add another student? (y/n): ').toLowerCase();
    }

    console.log('\nExiting. Goodbye!');
    await client.end();
}

main();
