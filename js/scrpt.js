window.addEventListener("load", (event) => {
    const fileInput = document.getElementById('file');
    const progressValue = document.querySelector('.progress-value');
    const wrapper = document.querySelector('.spinner__wrapper');
    const spinner = document.querySelector('.spinner-fill');

    fileInput.addEventListener('change', startRead);
    document.getElementById('fileUpload').addEventListener('click', () => {
        document.getElementById('file').click();
    });
    document.getElementById('fileDownload').addEventListener('click', download)

    function startRead() {
        let file = document.getElementById('file').files[0];
        if (file) {
            getAsText(file);
        }
    }

    function getAsText(readFile) {
        let reader = new FileReader();
        reader.readAsText(readFile, "UTF-8");
        reader.onprogress = updateProgress;
        reader.onload = loaded;
        reader.onerror = errorHandler;
    }

    function updateProgress(evt) {
        if (evt.lengthComputable) {
            let loaded = (evt.loaded / evt.total);
            const percent = Math.round(loaded * 100);
            wrapper.classList.remove('none');
            progressValue.textContent = `${percent}%`;
            const translateYValue = 64 - (64 * loaded);
            spinner.style.transform = `translateY(${translateYValue}px)`;
        }
    }

    function loaded(evt) {
        var fileString = evt.target.result;
        progressValue.textContent = `100%`;
    }

    function errorHandler(evt) {
        if (evt.target.error.name == "NotReadableError") { }
    }

    function download() {
        let file = document.getElementById('file').files[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            const fileName = file.name;
            let progress = 0;
            wrapper.classList.remove('none');
            const interval = setInterval(() => {
                if (progress < 100) {
                    progress += 5; 
                    downloadProgress(progress);
                } else {
                    clearInterval(interval);
                    completeDownload(fileUrl, fileName);
                }
            }, 100);
        }
    }

    function downloadProgress(percent) {
        progressValue.textContent = `${percent}%`;
        const translateYValue = 64 - (64 * (percent / 100));
        spinner.style.transform = `translateY(${translateYValue}px)`;
    }

    function completeDownload(fileUrl, fileName) {
        const downloadLink = document.createElement('a');
        downloadLink.href = fileUrl;
        downloadLink.download = fileName;
        downloadLink.click();
        progressValue.textContent = `100%`;
        wrapper.classList.add('none');
    }
});
