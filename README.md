# PICode

### Project-Integrated COllaborative Development Environment

## What is the PICode?

---

PIcode is a web page that supports all development environments of the project so that users can collaborate without additional programs.

## What's the difference from other IDEs?

---

### Work without any external modules

If you are going to start a project, you need a program for document management function, chat function to communicate with team members, and issue management function in addition to the code editor. However, if you use PICode, you can use all of the above functions on just a single web page.

* code edit function

![module_code](https://user-images.githubusercontent.com/28240077/132558933-19ab1a1d-b240-40b1-bac4-1f18dbdc7f4e.gif)

* chat function

![module_chat](https://user-images.githubusercontent.com/28240077/132558942-65d9b40e-072b-4097-8e30-511b2222bd52.gif)

* note function

![module_note](https://user-images.githubusercontent.com/28240077/132638418-a97da4c3-a315-4681-9679-4e38c5f2efb8.gif)

### Possible collaboration

Through PICode real-time communication, you can see in real time where your team members are working, what they are working on. Therefore, you can work on documents or codes with them, or you can discuss the team's work by chatting in real time.

![collaborate_code](https://user-images.githubusercontent.com/28240077/132559165-3f49e62d-d0f9-4ef7-a25f-c8fee82e3c02.gif)

### Visualization

Through container visualization, you can see all workspace structures and states. In addition, you can simply control network creation, container and network connection, and connection between containers by clicking nodes and buttons.

* visualization view

![visualization_hover](https://user-images.githubusercontent.com/28240077/132559247-3b0667b1-6486-4267-bc90-1913c6a57f69.gif)


* power on the container through visualization view

![visualization_poweron](https://user-images.githubusercontent.com/28240077/132559253-f06e02dd-362b-4a8e-9410-d1b95ed5ab75.gif)

* connect container to network through visualization view

![visualization_connect](https://user-images.githubusercontent.com/28240077/132559258-15ac563e-d60c-41f2-a6d4-ea24dbf0357a.gif)

### Work without changing environment

If you want to work in vscode editor, use the vscode extension supported by PICode.
Connect with PICode server, input ID and password in the vscode extension. Once you login, select workspace then you can get the selected workspace codes and work in the vscode.

![extension_vscode](https://user-images.githubusercontent.com/28240077/132559602-a2a90470-b371-4331-901d-ef9f5300d8ea.gif)

## Development Environment

---

-   Linux or related OS
-   Docker v20.X
-   npm v7.X
-   node v14.X

## How to start PICode?

---

1. Install all of our npm module on terminal ( `npm i` )
2. Create .env file (essential)
3. Enter `PORT=4000 SERVER_API=4000` in the env file (essential)
4. Enter `npm run-script build` on terminal
5. Enter `npm run-script server:build` on terminal
6. Enter `npm run-script start` on terminal
7. Enter the url on web browser and login
8. it's worked!

## Documentation

---

Documentation is on our website.

<https://picode-team.github.io/picode-page/>

## CONTRIBUTE

---

If you want contribute our projcect, please read it
[contribute](https://github.com/PICode-Team/PICode/blob/develop/contribute.md)

## LICENSE

---
[license](https://github.com/PICode-Team/PICode/blob/develop/license.md/)


## Contact us

---

[Nevation](https://github.com/Nevation)
[EunPyoLee1010](https://github.com/EunPyoLee1010)
[benovice](https://github.com/benovice)
[wlsrn3684](https://github.com/wlsrn3684)
