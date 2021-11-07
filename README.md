# PICode

### Project-Integrated COllaborative Development Environment

<br>

## PICode-Client

<https://github.com/PICode-Team/PICode-Client>

---

<br>

## What is the PICode?

PIcode is a web page that supports all development environments of the project so that users can collaborate without additional programs.

---

<br>

## How to build PICode?

```
1. Use git to clone this repository
2. Enter `cd PICode` on terminal
3. Enter `export PORT=3000` on terminal (essential). Any PORT number that can be connected is possible.
4. Enter `npm i` on terminal
5. Enter `npm run build` on terminal
6. Enter `npm run start` on terminal
7. Enter the url set in PICode-Client on web browser and login (See `How to link with PICode-client?`)
8. it's worked!
```

<br>

---

## How to link with PICode-Client?

```
1. Use git to clone PICode-Client repository (https://github.com/PICode-Team/PICode-Client)
2. Enter `cd PICode-Client` on terminal
3. Create and Open .env file with any text editor and Write
`
PORT=4000
NODE_ENV=production
NEXT_FE_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=localhost
NEXT_PUBLIC_WS_PORT=9000
`
on .env and Save file (essential).
PORT is the port number to open the web page. Therefore, the same number as the PICode's PORT should not be used.
If node_env is set to `dev`, it may be executed in the developer mode using `npm run dev`.

4. Enter `npm i` on terminal
5. Enter `npm run build` on terminal
6. Enter `npm run start` on terminal
7. Enter the url set in PICode-Client on web browser and login
8. it's worked!

```

---

<br>

## Contribute to PICode

### PICode Server

[Contribute PICode Server](https://github.com/PICode-Team/PICode/blob/develop/contribute.md)

<br>

### PICode Client

[Contribute PICode-Client](https://github.com/PICode-Team/PICode/blob/develop/contribute.md)

---

<br>

## License for PICode

[license](https://github.com/PICode-Team/PICode/blob/develop/license.md)

---

<br>

## Contact us

[Nevation](https://github.com/Nevation) <br>
[EunPyoLee1010](https://github.com/EunPyoLee1010)<br>
[benovice](https://github.com/benovice)<br>
[wlsrn3684](https://github.com/wlsrn3684)<br>

---
