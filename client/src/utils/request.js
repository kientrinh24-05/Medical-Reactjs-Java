class Request {
    host = null;
    //isLocal = false;

    constructor() {
        // this.isLocal = location.href.indexOf('localhost') > 0
        //     || location.href.indexOf('127.0.0.1') > 0
        //     || location.href.indexOf('ecrm2018.vn') > 0;

        // this.host = this.isLocal ? 'http://localhost:5000' : location.protocol + '//' + location.host;

        this.host = location.protocol + '//' + location.host;
    }

    url = path => {
        if (path && path.match(/^\s*http/i)) {
            return path;
        }
        if (path && !path.match(/^\s*\//)) {
            path = '/' + path;
        }
        return this.host + (path || "");
    }

    absoluteUrl = path => {
        if (path) {
            return path.replace(new RegExp(this.host, "i"), "");
        }
        return "/";
    }

    decode = path => {
        return decodeURIComponent(path);
    }

    encode = path => {
        return encodeURIComponent(path);
    }
}

export default new Request();