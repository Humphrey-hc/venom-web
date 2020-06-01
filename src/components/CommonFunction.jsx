import {notification} from 'antd';

function commonMessage(res) {
    let flag = !!res.data.success;
    if (flag) {
        notification.success({message: "操作成功", description: "操作成功"})
    } else {
        notification.error({message: "操作失败", description: `${res.data.msg}`})
    }
    return flag;
}

function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj))
}

function fmoney(v, len, split) {
    split = split || ",", len = Math.abs((+len) % 20 || 2);
    v = parseFloat((v + "").replace(/[^\d\.-]/g, "")).toFixed(len) + "";
    return "¥" + v.replace(/\d+/, function (v) {
            var lit = v.length % 3 == 0;
            var index = lit ? v.length - 3 : -1;
            return v.split('').reverse().join('').replace(/\d{3}/g,
                function (k, l) {
                    return k + ((l == index && lit) ? "" : split);
                }).split('').reverse().join('')
        }
    );
}

function getRanNum() {
    var result = [];
    for (var i = 0; i < 4; i++) {
        var ranNum = Math.ceil(Math.random() * 25); //生成一个0到25的数字
        //大写字母'A'的ASCII是65,A~Z的ASCII码就是65 + 0~25;然后调用String.fromCharCode()传入ASCII值返回相应的字符并push进数组里
        if (ranNum % 2 === 0 ) {
            result.push(String.fromCharCode(65 + ranNum));
        } else {
            result.push(String.fromCharCode(97 + ranNum));
        }
    }
    return result.join('');
}

function exportResourceTemplate(url) {
    let exportForm = document.getElementById('export-form');
    if (exportForm) {
        exportForm.remove();
    }
    exportForm = document.createElement('form');
    exportForm.style.display = 'none';
    exportForm.id = 'export-form';
    exportForm.enctype = 'multipart/form-data';
    exportForm.action = window.SERVER_URL + url;
    exportForm.method = 'POST';
    exportForm.target = '_blank';
    document.body.appendChild(exportForm);
    exportForm.submit();
};

function exportExcel(url) {
    let exportForm = document.getElementById('export-form');
    if (exportForm) {
        exportForm.remove();
    }
    exportForm = document.createElement('form');
    exportForm.style.display = 'none';
    exportForm.id = 'export-form';
    exportForm.enctype = 'multipart/form-data';
    exportForm.action = url;
    exportForm.method = 'GET';
    exportForm.target = '_blank';
    document.body.appendChild(exportForm);
    exportForm.submit();
};

function dateFormat(fmt, date) {
    let ret;
    let opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
};

function getDomain(hostname) {
    let domain = "";
    if (hostname) {
        let hostNameArray = hostname.split(".");
        let isPrepub = hostname.indexOf("prepub");
        if (isPrepub > 0) {
            domain = ".prepub." + hostNameArray[hostNameArray.length -2] + "." + hostNameArray[hostNameArray.length -1];
        } else {
            domain = "." + hostNameArray[hostNameArray.length -2] + "." + hostNameArray[hostNameArray.length -1];
        }
    }
    return domain;
};

export {commonMessage, deepClone, fmoney, getRanNum, exportResourceTemplate, dateFormat, getDomain, exportExcel};
