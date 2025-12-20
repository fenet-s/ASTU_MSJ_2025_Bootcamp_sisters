const Status= document.getElementById("status");
const toggleBtn = document.getElementById("Togglebtn")

let isOn =false;

toggleBtn.addEventListener("click", () =>{
    if(isOn){
        Status.textContent = 'OFF';
        isOn =false;
    } else {
        Status.textContent ="ON";
        isOn = true;
    }
});