
function toggleModal(modalName){
    const modal=document.querySelector(`div.modal_container[data-modal='${modalName}']`);
    modal.classList.toggle('show');
}

document.addEventListener('DOMContentLoaded',function(){
    const modalButtons = document.querySelectorAll('button[data-modal]');
    modalButtons.forEach(button=>{
        const modalName= button.dataset.modal;
        button.addEventListener('click',()=>{
            toggleModal(modalName)
        });
    });
});


