const scanButton = document.getElementById("scanButton");
const deviceCount = document.getElementById("deviceCount");
const scanStatus = document.getElementById("scanStatus");
const networkMap = document.getElementById("deviceLayer");



let timerInterval;
let startTime;

scanButton.addEventListener("click", async()=>{
    scanButton.textContent = "scanning...";
    scanButton.disabled=true;
    startTime = performance.now();
    timerInterval = setInterval(()=>{
        const elapsed = (performance.now() - startTime)/1000;
        scanStatus.textContent=`Scanning... ${elapsed.toFixed(2)}s`;
    },50);
    scanStatus.textContent="";
    scanButton.style.cursor = "not-allowed";
    try {
        const response = await fetch ("http://127.0.0.1:8000/api/devices");
        if (!response.ok){
            throw new Error("HTTP Error");
        }
        const data = await response.json()
        console.log(data);
        deviceCount.textContent = `${data.count} devices`;
        networkMap.innerHTML="";
        data.devices.forEach((device,index) => {
            const angleDifference = 360/data.count;
            const angleInDegrees = (index * angleDifference);
            const angle = angleInDegrees * (Math.PI /180);
            const minRadius = 130;
            const maxRadius = 230;                                           
            const centerX = 400;
            const centerY = 300;
            const radius= minRadius + Math.random() * (maxRadius-minRadius);
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
           
            const lineToDevice = document.createElementNS("http://www.w3.org/2000/svg","line");
            lineToDevice.setAttribute("x1",centerX);
            lineToDevice.setAttribute("y1",centerY);
            lineToDevice.setAttribute("x2",x);
            lineToDevice.setAttribute("y2",y);
            lineToDevice.setAttribute("stroke","#64748b");
            lineToDevice.setAttribute("stroke-width","2");
            networkMap.appendChild(lineToDevice);
            
            const deviceNode = document.createElementNS("http://www.w3.org/2000/svg","circle")
            deviceNode.setAttribute("cx",x);
            deviceNode.setAttribute("cy",y);
            deviceNode.setAttribute("r",18);
            deviceNode.setAttribute("fill","#7b16a3");
            deviceNode.style.cursor="pointer";
            deviceNode.addEventListener("click", () => {
                showDeviceDetails(device);
            })
            networkMap.append(deviceNode);
          
            const deviceLabel = document.createElementNS("http://www.w3.org/2000/svg","text");
            deviceLabel.setAttribute("x",x);
            deviceLabel.setAttribute("y",y+32);
            deviceLabel.setAttribute("text-anchor","middle");
            deviceLabel.setAttribute("fill","black");
            deviceLabel.setAttribute("font-size","12");
            deviceLabel.textContent=device.ip;
            networkMap.append(deviceLabel);
           
        });
    } catch (error){
        scanStatus.textContent = error.message;
    } finally {
        scanButton.disabled = false;
        scanButton.style.cursor = "pointer";
        scanButton.textContent = "Scan!"
        clearInterval(timerInterval);
        if (startTime !== undefined){
            const elapsed = (performance.now() - startTime)/1000;
            scanStatus.textContent = `Scan completed in ${elapsed.toFixed(2)}s`
        }
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

function showDeviceDetails(device){
    const detailsPanel = document.getElementById("deviceDetails");
    detailsPanel.innerHTML=`
    <h2>Device Details </h2>
    <h3>${device.ip}</h3>
    <p><b>Status: Reachable</b></p>
    <p><b>IPv4: ${device.ip}</b></p>
    <p><b>MAC: ${device.mac || "Unavailable"}</b></p>
    <p><b>Hostname: ${device.hostname || "Unavailable"}</b></p>
    `;
}


checkBackend();
setInterval(checkBackend,5000)