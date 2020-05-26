const codeMapFilter = (list) => {
    const codeMap = {}
    list.filter((item, i) => {
        return !!item.valid
    }).forEach((el, k) => {
        codeMap[el.code] = el.name
    })
    return codeMap
}

export default codeMapFilter
