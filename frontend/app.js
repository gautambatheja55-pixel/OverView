const scanButton = document.getElementById("scanButton");
const deviceCount = document.getElementById("deviceCount");
const deviceList = document.getElementById("deviceList");
const scanStatus = document.getElementById("scanStatus");

scanButton.addEventListener("click", async()=>{
    scanButton.textContent = "scanning...";
    scanButton.disabled=true;
    scanStatus.textContent="";
    scanButton.style.cursor = "not-allowed";
    try {
        const response = await fetch ("http://127.0.0.1:8000/api/devices");
        if (!response.ok){
            throw new Error("HTTP Error");
        }
        const data = await response.json()
        deviceCount.textContent = data.count;
        deviceList.innerHTML = "";

        data.devices.forEach(ip => {
            const item = document.createElement("li");
            item.textContent = ip;
            deviceList.appendChild(item);
        });
    } catch (error){
        scanStatus.textContent = error.message;
    } finally {
        scanButton.disabled = false;
        scanButton.style.cursor = "pointer";
        scanButton.textContent = "Scan!"
    }
});

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