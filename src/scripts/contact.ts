const nameRegex = /^[a-zA-Z ]+$/
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const secretMessageRegex = /^[a-zA-Z ]{10,}$/;
const iqRegex = /^(1[5-9][0-9]|[2-9][0-9]{2,})$/;

const inputName: HTMLInputElement = <HTMLInputElement> document.getElementById("input-name");
const inputEmail: HTMLInputElement = <HTMLInputElement> document.getElementById("input-email");
const inputSecretMessage: HTMLInputElement = <HTMLInputElement> document.getElementById("input-secret");
const inputIQ: HTMLInputElement = <HTMLInputElement> document.getElementById("input-iq");

const warningName: HTMLElement = document.getElementById("warning-name");
const warningEmail: HTMLElement = document.getElementById("warning-email");
const warningSecret: HTMLElement = document.getElementById("warning-secret");
const warningIQ: HTMLElement = document.getElementById("warning-iq");

const sendButton: HTMLElement = document.getElementById("send-button");

function sendMessage() {
    let noWarnings: boolean = true;

    [[ inputName, nameRegex, warningName ], 
     [ inputEmail, emailRegex, warningEmail ], 
     [ inputSecretMessage, secretMessageRegex, warningSecret ],
     [ inputIQ, iqRegex, warningIQ ]].forEach((x: any[]) => {
         let input = x[0];
         let regex = x[1];
         let warning = x[2];

         if (!validateInputBox(input, regex)) {
            addWarning(warning);
            noWarnings = false;
            return 
         } 

         removeWarning(warning);
    });

    if (noWarnings) {
        removeAllWarnings();
        alert("Sending forms to the server!");
    }
}

function validateInputBox(input: HTMLInputElement, regex: RegExp): boolean {
    const value: string = input.value;
    console.log(value);
    return regex.test(value);
}

function addWarning(warning: HTMLElement) {
    warning.classList.remove("warning--closed");
}

function removeWarning(warning: HTMLElement) {
    warning.classList.add("warning--closed");
}

function removeAllWarnings() {
    removeWarning(warningName);
    removeWarning(warningEmail);
    removeWarning(warningSecret);
    removeWarning(warningIQ);
}

sendButton.addEventListener("click", sendMessage);