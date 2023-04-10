// type="module"
import directory from './directory.json' assert {type: 'json'};


if(storageAvailiable('localStorage')) {

    localStorage.setItem("directory", JSON.stringify(directory));

} else {
    console.log('DOM storage NOT availiable');
}


function storageAvailiable(){
    try {
        var storage = window['localStorage'],
            x = '__storage_test__';
        storage.setItem(x,x);
        storage.removeItem(x);
        return true;
    } catch {
        return e instanceof DOMException && (
            e.code === 22 ||
            e.code === 1014 ||
            e.name === 'QuotaExceededError' ||
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            storage.length !== 0;
    }
}