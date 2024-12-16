import {test, request, expect} from '@playwright/test';

const validateUser = (user: Array<any>) => {
    expect(user).toMatchObject({
        id: expect.any(Number),
        email: expect.any(String),
        first_name: expect.any(String),
        last_name: expect.any(String),
        avatar: expect.any(String)
    });
}

test.describe("API tests", () => {

    test("Get users", async ({request}) => {
        const response = await request.get("https://reqres.in/api/users?page=2");
        expect(response.status()).toBe(200);
        const responseBody = JSON.parse(await response.text());
        expect(responseBody.page).toBe(2);
        responseBody.data.forEach((user) => validateUser(user));
    });

    test("Get single user", async ({request}) => {
        const response = await request.get("https://reqres.in/api/users/2");
        expect(response.status()).toBe(200);
        const responseBody = JSON.parse(await response.text());
        console.log(responseBody);

        validateUser(responseBody.data);

        expect(responseBody.data.id).toBe(2);
        expect(responseBody.data.first_name).toBe("Janet");
    });

    test("Create user", async ({request}) => {
        const response = await request.post("https://reqres.in/api/users", {
            data: {
                name: "Alina",
                job: "QA"
            }
        });
        expect(response.status()).toBe(201);
        const responseBody = JSON.parse(await response.text());
        console.log(responseBody);
        expect(responseBody.name).toBe("Alina");
        expect(responseBody.job).toBe("QA");
        expect(responseBody.id).toBeTruthy();
        expect(responseBody.createdAt).toBeTruthy();
    });

    test("Update user", async ({request}) => {
        const response = await request.put("https://reqres.in/api/users/2", {
            data: {
                name: "Ivan",
                job: "DevOps"
            }
        });
        expect(response.status()).toBe(200);
        const responseBody = JSON.parse(await response.text());
        console.log(responseBody);
        expect(responseBody.name).toBe("Ivan");
        expect(responseBody.job).toBe("DevOps");
        expect(responseBody.updatedAt).toBeTruthy();
    });


    test("Delete user", async ({request}) => {
        const response = await request.delete("https://reqres.in/api/users/2");
        expect(response.status()).toBe(204);
    });


    test("Login", async ({request}) => {
        const response = await request.post("https://reqres.in/api/login", {
            data: {
                email: "eve.holt@reqres.in",
                password: "cityslicka"
            }
        });
        expect(response.status()).toBe(200);
        const responseBody = JSON.parse(await response.text());
        console.log(responseBody);
        expect(responseBody.token).toBeTruthy();
    });


    test("Register", async ({request}) => {
        const response = await request.post("https://reqres.in/api/register", {
            data: {
                email: "eve.holt@reqres.in",
                password: "pistol"
            }
        });
        expect(response.status()).toBe(200);
        const responseBody = JSON.parse(await response.text());
        console.log(responseBody);
        expect(responseBody.id).toBeTruthy();
        expect(responseBody.token).toBeTruthy();
    });


    test("Register fail", async ({request}) => {
        const response = await request.post("https://reqres.in/api/register", {
            data: {
                email: "sydney@fife"
            }
        });
        expect(response.status()).toBe(400);
        const responseBody = JSON.parse(await response.text());
        console.log(responseBody);
        expect(responseBody.error).toBe("Missing password");
    });


    test("Login fail", async ({request}) => {
        const response = await request.post("https://reqres.in/api/login", {
            data: {
                email: "peter@klaven"
            }
        });
        expect(response.status()).toBe(400);
        const responseBody = JSON.parse(await response.text());
        console.log(responseBody);
        expect(responseBody.error).toBe("Missing password");
    });
});