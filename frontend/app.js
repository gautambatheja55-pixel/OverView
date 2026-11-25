async function checkBackend(){
    const response = await fetch("http://127.0.0.1:8000/api/status");
    const data = await response.json();
    console.log(response.status);
    console.log(data);
}

checkBackend();