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

1. Use git to clone this repository
2. Go to the terminal
3. Execute the command written below in the terminal.

```
cd PICode
export PORT=3000
npm i
npm run build
npm run start
```

4. Enter the url set in PICode-Client on web browser and login (See `How to link with PICode-client?`)
5. it's worked!

<br>

---

## How to link with PICode-Client?

1. Use git to clone https://github.com/PICode-Team/PICode-Client
2. Go to the terminal
3. Execute the command written below in the terminal.

```
cd PICode-Client
npm i
echo "
PORT=4000
NODE_ENV=production
NEXT_FE_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=localhost
NEXT_PUBLIC_WS_PORT=9000
" > .env
npm run build
npm run start
```

4. Enter the url set in PICode-Client on web browser and login
5. it's worked!

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
