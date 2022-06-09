function requestJSON(method, url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onreadystatechange = function () {
			if (xhr.readyState != XMLHttpRequest.DONE) return;
            if (xhr.status >= 200 && xhr.status < 300) {
				try {
                	resolve(JSON.parse(xhr.response));
				}
				catch(e) {
					reject(e);
				}
            } else {
                reject({
                    status: xhr.status, response: xhr.response
                });
            }
        };
        xhr.send();
    });
}


async function fetchProduct(keyword, category, start, size) {
	if(keyword == null) keyword = '';
	
	keyword = encodeURIComponent(keyword);
	
	let url = `/product/search/${start}/${size}/?keyword=${keyword}`;

	if(category != null) {
		category = encodeURIComponent(category);
		url += `&category=${category}`;
	}

	let info = await requestJSON('GET', url);

	console.log(`load from ${start}, count ${size}`);
	console.log(info);
	return info;	
}
