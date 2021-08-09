const url = 'https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/';
let idMessage;
let idActive;
let user;

let input = document.querySelector('.login');
input.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.querySelector('.enter').click();
    }
  });

const initializer = () => {
    clearInterval(idMessage);
    clearInterval(idActive);
}

const login = user => {
    const promisse = axios.post(url + 'participants', {name:user})
    return promisse
}

const onEnter = () => {
    user = document.querySelector('.login').value;
    const promisse = login(user);
    promisse.then(onSucess)
            .catch(onError);
}

const onSucess = data => {
    document.querySelector('.auth').classList.add('hidden');
    document.querySelector('.chat').classList.remove('hidden');
    idActive = setInterval(stayActive,5000)
    mensagens()
    idMessage = setInterval(mensagens,3000)
}

const onError = err => {
    const element = document.querySelector('.error');
    element.classList.remove('hidden');
    if (err.response.status == 400) {
        element.innerHTML = 'Bad request: Try Again'
    }
}

const mensagens = () => {
    const promisse = axios.get(url + 'messages');
    promisse.then(getMessages)
}

const stayActive = () => {
    const promisse = axios.post(url + 'status', {name:user})
    return promisse
}  

const colorChecker = (type, index) => {
    const message = document.querySelectorAll('.message')[index];
    if (type === 'status') {
        message.classList.add('status');
    } else if(type === 'private_message') {
        message.classList.add('priv');
    } else {
        message.classList.add('every');
    }
}

const getMessages = data => {
    const activity = document.querySelector('.messages');
    activity.innerHTML = '';
    for(let i = 0; i < data.data.length; i++) {
        if (data.data[i].type === 'status') {
            activity.innerHTML += `<div class='message'><span>(${data.data[i].time})</span><strong>${data.data[i].from}</strong><p>${data.data[i].text}</p></div>`
        } else if(data.data[i].type === 'message') {
            activity.innerHTML += `<div class='message'><span>(${data.data[i].time})</span><strong>${data.data[i].from}</strong><p>para</p><strong>${data.data[i].to}</strong>:<p> ${data.data[i].text}</p></div>`
        } else if(data.data[i].type === 'private_message' && data.data[i].to === user) {
            activity.innerHTML += `<div class='message'><span>(${data.data[i].time})</span><strong>${data.data[i].from}</strong><p>reservadamente para</p><strong>${data.data[i].to}</strong>:<p> ${data.data[i].text}</p></div>`
        } else {
            activity.innerHTML += '<div class="message hidden"></div>'
        }
        
        colorChecker(data.data[i].type, i)
    }
    let message = document.querySelectorAll('.message');
    message[message.length -1].scrollIntoView()
}

const sendMessage = () => {
    const message = document.querySelector('#message').value;
    postMessage(user,to='Todos',message,'message')
}

const postMessage = (from, to, text, type) => {
    console.log(from, to, text, type)
    const message = axios.post(url + 'messages',{
        from,
        to,
        text,
        type
    })
    message.then(getMessages)
}

initializer()