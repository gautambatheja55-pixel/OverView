async function checkBackend(){
    const statusChecker = document.getElementById("backend-status");
    const messageShower = document.getElementById("backend-message");
    try{
        const response = await fetch("http://127.0.0.1:8000/api/status");
        if (!response.ok){
            throw new Error("HTTP error");
        }
        const data = await response.json();
        statusChecker.textContent="backend Online";
        messageShower.textContent = data.message
    } catch (error){
        statusChecker.textContent = "Backend offline";
        messageShower.textContent= "couldnt connect to backend";
    }
    
}

checkBackend();
setInterval(checkBackend,5000)