const json = require('./city_new')
const fs = require('fs')
const path = require('path')
let a = json.map((pro, i) => {
    let npro = {
        name: pro.name,
        id: pro.code + '0000',
        sub: pro.children.map((city, k) => {
            return {
                name: city.name,
                id: city.code + '00',
                sub: city.children
            }
        })
    }
    // npro.sub = npro.sub.map((city, k) => {
    //     return {
    //         name: city.name,
    //         id: city.code + '00',
    //         sub: city.children
    //     }
    // })
    return npro
})
fs.writeFileSync(path.resolve(__dirname, './city.json'), JSON.stringify(a), 'utf-8', (err) => {})
