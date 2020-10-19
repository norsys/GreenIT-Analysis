document.querySelectorAll('.displayDetail').forEach(detailBtn => 
    detailBtn.addEventListener("click", () => toggleDetail(detailBtn.getAttribute("data-id")))
);

function toggleDetail(id){
    const box = document.getElementById(`box-${id}`);
    if(box.classList.contains("noDetail")){
        box.classList.remove("noDetail")
        box.classList.add("withDetail")
    }else{
        box.classList.remove("withDetail")
        box.classList.add("noDetail")
    }

}