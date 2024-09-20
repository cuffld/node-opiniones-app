//something that makes request to verify the users without redirecting
 document.querySelector('form').addEventListener('submit', async (event) => {
   event.preventDefault()
     let verif = {}
     document.querySelectorAll('[type="checkbox"]').forEach(item => {
         if(item.checked){
            verif[item.name] = false
         }else if(!item.checked){
            verif[item.name] = true
         }
     })
     const request = {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(verif),
     };
     await fetch('/api/user/verify', request)
         .then(response => response.json())
         .then(data => console.log(data))
         .catch(err => console.log(err))
   // setTimeout(() =>{
       window.location.reload(true) //not functioning properly idk why
   // }, 1000)
 })
