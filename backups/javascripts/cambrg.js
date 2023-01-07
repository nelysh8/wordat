if (typeof Search_cambrg == 'undefined') {
    let Search_cambrg = '';    
}

Search_cambrg = document.querySelector(".navline");
Search_Input_cambrg = Search_cambrg.querySelector(".nav_input");
Search_Input_cambrg.addEventListener("keyup", e => {
    console.log('key detected');
    if (e.key === "Enter" && e.target.value){        
    var url = "https://dictionary.cambridge.org/dictionary/english-korean/" + e.target.value.trim();
    window.open(url, '_blank');
    }
    if (e.keyCode === 61 && e.target.value){        
    var url = "https://dictionary.cambridge.org/dictionary/english-korean/" + e.target.value.trim();
    window.open(url, '_blank');
    }
});

