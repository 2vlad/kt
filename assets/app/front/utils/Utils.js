module.exports = {
    createEmptyPromise: function () {
        return new Promise(function (resolve) {
            resolve();
        });
    }
};
