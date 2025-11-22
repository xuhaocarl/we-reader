import handler from './api/index.js';

const req = {
    method: 'POST',
    body: {
        url: 'https://mp.weixin.qq.com/s/qYTdmsRK-SMJ-G27VQ1SHQ'
    }
};

const res = {
    setHeader: (key, value) => console.log(`Header: ${key}=${value}`),
    status: (code) => ({
        json: (data) => console.log(`Status: ${code}`, data),
        end: () => console.log(`Status: ${code} (End)`)
    })
};

console.log('Testing API handler...');
handler(req, res);
