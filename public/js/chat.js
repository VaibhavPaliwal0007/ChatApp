const socket = io()

//elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//queryoptions
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix : true }) //for removing the question mark 

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled from the top
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message)

    const html = Mustache.render(messageTemplate, {
        username : message.username,
        message : message.text,
        createdAt : moment(message.createdAt).format('h:mm a')
    })

    $messages.insertAdjacentHTML('beforeend', html) //bottom of the list
    autoscroll()
 })

 socket.on('locationMessage', (message) => {

     const html = Mustache.render(locationMessageTemplate, {
         username : message.username,
         url : message.url,
         createdAt : moment(message.createdAt).format('h:mm a')
     })

     $messages.insertAdjacentHTML('beforeend', html)
     autoscroll()
 })

 socket.on('roomData', ({ room , users }) => {
     const html = Mustache.render(sidebarTemplate, {
         room,
         users
     })
     document.querySelector('#sidebar').innerHTML = html
 })

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()  //to prevent the default behavipur while refreshing

    $messageFormButton.setAttribute('disabled', 'disabled') //disabling the button for double typos

    const message = e.target.elements.message.value
    //e.target to get the form and .elements to get the value we picked

    socket.emit('sendMessage', message, (error) => {
         $messageFormButton.removeAttribute('disabled')  //enabling
         $messageFormInput.value = ''
         $messageFormInput.focus()


         if(error) return console.log(error)

         console.log('Message delivered successfully!!')
    })
})

$sendLocationButton.addEventListener('click', () => {

    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser!')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')  //taaki kch result milne ke bad hi wapis press kr pae wo 

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!!')
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})
   


