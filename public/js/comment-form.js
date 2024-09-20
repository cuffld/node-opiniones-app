const form = document.querySelector('form')
form.addEventListener('submit', async (event) =>{
  event.preventDefault()
  const data = document.querySelector('textarea[name="com"]')
  const formData = {
    com: data.value
  }

  const request = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  }

  await fetch('/api/user', request)
    .then(response => response.json())
    .then((data) => console.log(data))
    .catch(error => console.log(error))

  //TODO works but not wipes the text after submiting
  data.value = ''
  const thanks = document.getElementById('thanks')
  thanks.textContent = ''
  thanks.textContent += `Gracias por dejar su opinion`
  setTimeout(()=>{
    thanks.textContent = ''
  }, 10000)
})
