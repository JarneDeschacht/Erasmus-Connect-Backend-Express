

const sqlDateConvert = (jsDate) => {
    return `${jsDate.getFullYear()}-${jsDate.getMonth() + 1}-${jsDate.getDate()} ${jsDate.getHours() + 1}:${jsDate.getMinutes()}:${jsDate.getSeconds()}`
}

module.exports = sqlDateConvert;