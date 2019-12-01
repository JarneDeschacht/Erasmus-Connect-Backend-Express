

const sqlDateConvert = (jsDate) => {
    return `${jsDate.getFullYear()}-${jsDate.getMonth() + 1}-${jsDate.getDate()} ${jsDate.getHours()}:${jsDate.getMinutes()}:${jsDate.getSeconds()}`
}

module.exports = sqlDateConvert;