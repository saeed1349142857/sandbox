const fs = require('fs');
const {
    performance,
    PerformanceObserver
} = require('perf_hooks');

const waitAndType = async (page, selector, value) => {
    await page.waitForSelector(selector);
    await page.type(selector, value);
};


const extractDataFromTracing = (path, name) =>
    new Promise(resolve => {
        fs.readFile(path, (err, data) => {
            const tracing = JSON.parse(data);

            const resourceTracings = tracing.traceEvents.filter(
                x =>
                    x.cat === 'devtools.timeline' &&
                    typeof x.args.data !== 'undefined' &&
                    typeof x.args.data.url !== 'undefined' &&
                    x.args.data.url.endsWith(name)
            );
            const resourceTracingSendRequest = resourceTracings.find(
                x => x.name === 'ResourceSendRequest'
            );
            const resourceId = resourceTracingSendRequest.args.data.requestId;
            const resourceTracingEnd = tracing.traceEvents.filter(
                x =>
                    x.cat === 'devtools.timeline' &&
                    typeof x.args.data !== 'undefined' &&
                    typeof x.args.data.requestId !== 'undefined' &&
                    x.args.data.requestId === resourceId
            );
            const resourceTracingStartTime = resourceTracingSendRequest.ts / 1000;
            console.log('ORIG start', resourceTracingSendRequest.ts);
            console.log('ORIG end', resourceTracingEnd.find(x => x.name === 'ResourceFinish').ts);
            const resourceTracingEndTime =
                resourceTracingEnd.find(x => x.name === 'ResourceFinish').ts / 1000;

            //   fs.unlink(path, () => {
            resolve({
                start: resourceTracingStartTime,
                end: resourceTracingEndTime,
            });
            //   });
        });
    });

const sleep = (time) => {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
};

const waitForPageUrlToContain = async (page, search) => {
    await page.waitForRequest(request => {
        return request.url().includes(search);
    });
    await sleep(1000);
};

const beginMark = (name) => {
    performance.mark(`${name}.start`);
};

const endMark = (name) => {
    performance.mark(`${name}.end`);
    performance.measure(name, `${name}.start`, `${name}.end`);
};

const getNetworkRequests = (tracingData) => {
    const resourceTracingsStart = tracingData.traceEvents.filter(
        x =>
            x.cat === 'devtools.timeline' &&
            typeof x.args.data !== 'undefined' &&
            typeof x.args.data.url !== 'undefined' &&
            x.args.data.url.startsWith('http') &&
            x.name === 'ResourceSendRequest'
    );

    const resourceInfo = [];

    resourceTracingsStart.forEach(item => {
        const resourceTracingEnd = tracingData.traceEvents.filter(
            x =>
                x.cat === 'devtools.timeline'&&
                typeof x.args.data !== 'undefined' &&
                typeof x.args.data.requestId !== 'undefined' &&
                x.name === 'ResourceFinish' &&
                x.args.data.requestId === item.args.data.requestId
        );

        if (resourceTracingEnd.length === 1) {
            const resourceItem = {
                url: item.args.data.url,
                startTime:  item.ts / 1000,
                endTime:  resourceTracingEnd[0].ts / 1000,
                diffTime: (resourceTracingEnd[0].ts / 1000) - ( item.ts / 1000)
            };

            resourceInfo.push(resourceItem);
            console.log(resourceItem);
        } else if (resourceTracingEnd.length < 1) {
            console.error('OOPS no ending requests', item.args.data.url);
        } else {
            console.error('OOPS too many ending requests', item.args.data.url);
        }
    });

    return resourceInfo;
}

module.exports = {
    waitAndType: waitAndType,
    extractDataFromTracing: extractDataFromTracing,
    sleep: sleep,
    waitForPageUrlToContain: waitForPageUrlToContain,
    beginMark: beginMark,
    endMark: endMark,
    getNetworkRequests: getNetworkRequests
};